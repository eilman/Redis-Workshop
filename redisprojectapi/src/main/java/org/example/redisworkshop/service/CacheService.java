package org.example.redisworkshop.service;

import lombok.RequiredArgsConstructor;
import org.example.redisworkshop.model.CacheStats;
import org.example.redisworkshop.model.RedisCommandResult;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

@Service
@RequiredArgsConstructor
public class CacheService {

    private final StringRedisTemplate stringRedisTemplate;

    private final AtomicInteger hits = new AtomicInteger(0);
    private final AtomicInteger misses = new AtomicInteger(0);

    public RedisCommandResult getUser(String userId) {
        long start = System.currentTimeMillis();
        String cacheKey = "cache:user:" + userId;
        String cached = stringRedisTemplate.opsForValue().get(cacheKey);

        if (cached != null) {
            hits.incrementAndGet();
            long elapsed = System.currentTimeMillis() - start;
            return new RedisCommandResult(
                    "GET " + cacheKey,
                    cached,
                    "CACHE HIT! Veri Redis cache'den getirildi (Data fetched from Redis cache). Veritabani sorgusuna gerek kalmadi (No DB query needed). Hizli erisim saglandi!",
                    elapsed
            );
        }

        // Cache miss - simulate slow database query
        misses.incrementAndGet();
        try {
            Thread.sleep(500); // Simulate slow DB query
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        String dbResult = "{\"id\":\"" + userId + "\",\"name\":\"User " + userId + "\",\"email\":\"user" + userId + "@example.com\"}";
        stringRedisTemplate.opsForValue().set(cacheKey, dbResult, 60, TimeUnit.SECONDS);
        long elapsed = System.currentTimeMillis() - start;

        return new RedisCommandResult(
                "GET " + cacheKey + " -> MISS -> SET " + cacheKey + " EX 60",
                dbResult,
                "CACHE MISS! Veri cache'de bulunamadi, veritabanindan cekildi (Data not in cache, fetched from DB ~500ms). Sonuc 60 saniye TTL ile cache'e yazildi (Result cached with 60s TTL). Bir sonraki istek hizli gelecek!",
                elapsed
        );
    }

    public RedisCommandResult invalidate(String userId) {
        long start = System.currentTimeMillis();
        String cacheKey = "cache:user:" + userId;
        Boolean deleted = stringRedisTemplate.delete(cacheKey);
        long elapsed = System.currentTimeMillis() - start;
        return new RedisCommandResult(
                "DEL " + cacheKey,
                deleted,
                "Cache invalidation: '" + cacheKey + "' cache'den silindi (Removed from cache). " + (Boolean.TRUE.equals(deleted) ? "Basariyla silindi. Bir sonraki istekte veritabanindan tekrar cekilecek (Will be fetched from DB on next request)." : "Zaten cache'de yoktu (Was not in cache)."),
                elapsed
        );
    }

    public RedisCommandResult getStats() {
        int h = hits.get();
        int m = misses.get();
        int total = h + m;
        CacheStats stats = new CacheStats(h, m, total);
        double hitRate = total > 0 ? (double) h / total * 100 : 0;
        return new RedisCommandResult(
                "CACHE STATS",
                stats,
                "Cache istatistikleri (Cache statistics): Hit: " + h + ", Miss: " + m + ", Toplam (Total): " + total + ", Hit orani (Hit rate): %" + String.format("%.1f", hitRate) + ". Yuksek hit orani iyi performans demektir (High hit rate means good performance)!",
                0
        );
    }

    public RedisCommandResult reset() {
        hits.set(0);
        misses.set(0);
        return new RedisCommandResult(
                "CACHE RESET",
                "OK",
                "Cache istatistikleri sifirlandi (Cache statistics reset). Hit ve miss sayaclari 0'a donduruldu (Counters set to 0).",
                0
        );
    }
}
