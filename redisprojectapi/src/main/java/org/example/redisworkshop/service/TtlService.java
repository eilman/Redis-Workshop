package org.example.redisworkshop.service;

import lombok.RequiredArgsConstructor;
import org.example.redisworkshop.model.RedisCommandResult;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class TtlService {

    private final StringRedisTemplate stringRedisTemplate;

    public RedisCommandResult setWithTtl(String key, String value, long ttlSeconds) {
        long start = System.currentTimeMillis();
        stringRedisTemplate.opsForValue().set(key, value, ttlSeconds, TimeUnit.SECONDS);
        long elapsed = System.currentTimeMillis() - start;
        return new RedisCommandResult(
                "SET " + key + " \"" + value + "\" EX " + ttlSeconds,
                "OK",
                "SET ... EX komutu: '" + key + "' anahtarina '" + value + "' degerini " + ttlSeconds + " saniye TTL ile atar. Suresi dolunca otomatik silinir (Auto-deleted after expiry).",
                elapsed
        );
    }

    public RedisCommandResult getRemainingTtl(String key) {
        long start = System.currentTimeMillis();
        Long ttl = stringRedisTemplate.getExpire(key, TimeUnit.SECONDS);
        long elapsed = System.currentTimeMillis() - start;
        String explanation;
        if (ttl == null || ttl == -2) {
            explanation = "Anahtar bulunamadi (Key does not exist).";
        } else if (ttl == -1) {
            explanation = "Anahtar mevcut ama TTL atanmamis (Key exists but no TTL set). Kalici olarak saklanir (Persisted indefinitely).";
        } else {
            explanation = "Kalan sure (Remaining TTL): " + ttl + " saniye (seconds). Suresi dolunca anahtar otomatik silinecek.";
        }
        return new RedisCommandResult(
                "TTL " + key,
                ttl,
                "TTL komutu: '" + key + "' anahtarinin kalan yasam suresini saniye cinsinden dondurur. " + explanation,
                elapsed
        );
    }

    public RedisCommandResult expire(String key, long ttlSeconds) {
        long start = System.currentTimeMillis();
        Boolean result = stringRedisTemplate.expire(key, ttlSeconds, TimeUnit.SECONDS);
        long elapsed = System.currentTimeMillis() - start;
        return new RedisCommandResult(
                "EXPIRE " + key + " " + ttlSeconds,
                result,
                "EXPIRE komutu: '" + key + "' anahtarina " + ttlSeconds + " saniye TTL atar. " + (Boolean.TRUE.equals(result) ? "Basariyla ayarlandi (Set successfully)." : "Anahtar bulunamadi (Key not found)."),
                elapsed
        );
    }

    public RedisCommandResult persist(String key) {
        long start = System.currentTimeMillis();
        Boolean result = stringRedisTemplate.persist(key);
        long elapsed = System.currentTimeMillis() - start;
        return new RedisCommandResult(
                "PERSIST " + key,
                result,
                "PERSIST komutu: '" + key + "' anahtarindan TTL'yi kaldirir ve kalici yapar. " + (Boolean.TRUE.equals(result) ? "TTL basariyla kaldirildi (TTL removed successfully)." : "Anahtar bulunamadi veya zaten TTL yok (Key not found or no TTL)."),
                elapsed
        );
    }
}
