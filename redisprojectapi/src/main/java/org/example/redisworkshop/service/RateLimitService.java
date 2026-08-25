package org.example.redisworkshop.service;

import lombok.RequiredArgsConstructor;
import org.example.redisworkshop.model.RedisCommandResult;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RateLimitService {

    private final StringRedisTemplate stringRedisTemplate;

    private static final String SLIDING_WINDOW_EXPLANATION =
            "\n\n--- Sliding Window Log Pattern ---\n" +
                    "Bu ornek 'Sliding Window Log' rate limiting pattern'ini kullanir.\n" +
                    "Her istek, timestamp score'u ile Sorted Set'e kaydedilir. " +
                    "Her yeni istekte pencere kaydirilir ve eski kayitlar temizlenir.\n" +
                    "Fixed Window'dan farki: Sabit zaman dilimlerine bolunmez, her an pencere dinamik olarak hesaplanir.\n" +
                    "Avantaji: Tam hassasiyet saglar. Dezavantaji: Her istegi ayri saklar, bellek maliyeti yuksektir.";

    private static final String REDIS_COMMANDS_EXPLANATION =
            "\n--- Kullanilan Redis Komutlari ---\n" +
                    "ZREMRANGEBYSCORE: Sorted Set'ten belirli skor araligindaki elemanlari siler. " +
                    "Burada zaman penceresi disinda kalan eski istekleri temizler.\n" +
                    "ZCARD: Sorted Set'teki toplam eleman sayisini dondurur (O(1)). " +
                    "Pencere icindeki aktif istek sayisini ogrenmek icin kullanilir.";

    public RedisCommandResult handleRequest(String clientId, int windowSeconds, int limit) {
        long start = System.currentTimeMillis();
        String key = "ratelimit:" + clientId;
        long now = System.currentTimeMillis();
        long windowMs = windowSeconds * 1000L;

        ZSetOperations<String, String> zSetOps = stringRedisTemplate.opsForZSet();

        // 1. Remove old entries outside the window
        zSetOps.removeRangeByScore(key, 0, now - windowMs);

        // 2. Count current requests in window
        Long count = zSetOps.zCard(key);
        if (count == null) count = 0L;

        boolean allowed;
        if (count < limit) {
            // 3. Add request
            String member = now + ":" + UUID.randomUUID().toString().substring(0, 8);
            zSetOps.add(key, member, now);
            stringRedisTemplate.expire(key, windowSeconds, TimeUnit.SECONDS);
            allowed = true;
            count++;
        } else {
            allowed = false;
        }

        long elapsed = System.currentTimeMillis() - start;

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("allowed", allowed);
        result.put("currentCount", count);
        result.put("limit", limit);
        result.put("remaining", Math.max(0, limit - count));
        result.put("windowSeconds", windowSeconds);
        result.put("clientId", clientId);

        return new RedisCommandResult(
                "ZREMRANGEBYSCORE " + key + " 0 " + (now - windowMs) + " → ZCARD " + key +
                        (allowed ? " → ZADD " + key + " " + now : " → DENIED"),
                result,
                (allowed
                        ? "Istek kabul edildi. Pencere icinde " + count + "/" + limit + " istek. (Request allowed)"
                        : "Istek reddedildi! Limit asildi: " + count + "/" + limit + ". (Request denied - rate limit exceeded)")
                        + SLIDING_WINDOW_EXPLANATION
                        + REDIS_COMMANDS_EXPLANATION
                        + "\nZADD: Sorted Set'e yeni eleman ekler (score = timestamp). "
                        + "Her yeni istegi zaman damgasiyla birlikte kaydeder.",
                elapsed
        );
    }

    public RedisCommandResult getStatus(String clientId, int windowSeconds, int limit) {
        long start = System.currentTimeMillis();
        String key = "ratelimit:" + clientId;
        long now = System.currentTimeMillis();
        long windowMs = windowSeconds * 1000L;

        ZSetOperations<String, String> zSetOps = stringRedisTemplate.opsForZSet();

        // Clean old entries
        zSetOps.removeRangeByScore(key, 0, now - windowMs);

        Long count = zSetOps.zCard(key);
        if (count == null) count = 0L;

        long elapsed = System.currentTimeMillis() - start;

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("currentCount", count);
        result.put("limit", limit);
        result.put("remaining", Math.max(0, limit - count));
        result.put("windowSeconds", windowSeconds);
        result.put("clientId", clientId);

        return new RedisCommandResult(
                "ZREMRANGEBYSCORE " + key + " 0 " + (now - windowMs) + " → ZCARD " + key,
                result,
                "Rate limit durumu: " + count + "/" + limit + " istek kullanildi. Kalan: " + Math.max(0, limit - count)
                        + SLIDING_WINDOW_EXPLANATION + REDIS_COMMANDS_EXPLANATION,
                elapsed
        );
    }

    public RedisCommandResult reset(String clientId) {
        long start = System.currentTimeMillis();
        String key = "ratelimit:" + clientId;
        Boolean deleted = stringRedisTemplate.delete(key);
        long elapsed = System.currentTimeMillis() - start;

        return new RedisCommandResult(
                "DEL " + key,
                Boolean.TRUE.equals(deleted),
                "Rate limit verisi sifirlandi. (Rate limit data reset for " + clientId + ")" +
                        "\n\n--- Kullanilan Redis Komutu ---\n" +
                        "DEL: Belirtilen anahtari ve tum verisini Redis'ten siler. " +
                        "Burada rate limit sayacini sifirlamak icin kullanilir.",
                elapsed
        );
    }
}
