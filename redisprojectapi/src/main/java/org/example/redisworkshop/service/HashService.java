package org.example.redisworkshop.service;

import lombok.RequiredArgsConstructor;
import org.example.redisworkshop.model.RedisCommandResult;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class HashService {

    private final StringRedisTemplate stringRedisTemplate;

    public RedisCommandResult set(String key, String field, String value) {
        long start = System.currentTimeMillis();
        stringRedisTemplate.opsForHash().put(key, field, value);
        long elapsed = System.currentTimeMillis() - start;
        return new RedisCommandResult(
                "HSET " + key + " " + field + " \"" + value + "\"",
                "OK",
                "HSET komutu: '" + key + "' hash'inde '" + field + "' alanina '" + value + "' degerini atar. (Sets field in hash)",
                elapsed
        );
    }

    public RedisCommandResult get(String key, String field) {
        long start = System.currentTimeMillis();
        Object value = stringRedisTemplate.opsForHash().get(key, field);
        long elapsed = System.currentTimeMillis() - start;
        return new RedisCommandResult(
                "HGET " + key + " " + field,
                value,
                "HGET komutu: '" + key + "' hash'inden '" + field + "' alaninin degerini getirir. " + (value == null ? "Alan bulunamadi (Field not found)." : "Deger (Value): " + value),
                elapsed
        );
    }

    public RedisCommandResult getAll(String key) {
        long start = System.currentTimeMillis();
        Map<Object, Object> entries = stringRedisTemplate.opsForHash().entries(key);
        long elapsed = System.currentTimeMillis() - start;
        return new RedisCommandResult(
                "HGETALL " + key,
                entries,
                "HGETALL komutu: '" + key + "' hash'indeki tum alan-deger ciftlerini getirir. Alan sayisi (Field count): " + entries.size(),
                elapsed
        );
    }

    public RedisCommandResult delete(String key, String field) {
        long start = System.currentTimeMillis();
        Long deleted = stringRedisTemplate.opsForHash().delete(key, field);
        long elapsed = System.currentTimeMillis() - start;
        return new RedisCommandResult(
                "HDEL " + key + " " + field,
                deleted,
                "HDEL komutu: '" + key + "' hash'inden '" + field + "' alanini siler. " + (deleted > 0 ? "Basariyla silindi (Deleted successfully)." : "Alan bulunamadi (Field not found)."),
                elapsed
        );
    }

    public RedisCommandResult increment(String key, String field, long delta) {
        long start = System.currentTimeMillis();
        Long newValue = stringRedisTemplate.opsForHash().increment(key, field, delta);
        long elapsed = System.currentTimeMillis() - start;
        return new RedisCommandResult(
                "HINCRBY " + key + " " + field + " " + delta,
                newValue,
                "HINCRBY komutu: '" + key + "' hash'indeki '" + field + "' alanini " + delta + " arttirir. Yeni deger (New value): " + newValue,
                elapsed
        );
    }
}
