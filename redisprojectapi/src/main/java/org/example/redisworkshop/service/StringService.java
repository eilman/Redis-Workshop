package org.example.redisworkshop.service;

import lombok.RequiredArgsConstructor;
import org.example.redisworkshop.model.RedisCommandResult;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StringService {

    private final StringRedisTemplate stringRedisTemplate;

    public RedisCommandResult set(String key, String value) {
        long start = System.currentTimeMillis();
        stringRedisTemplate.opsForValue().set(key, value);
        long elapsed = System.currentTimeMillis() - start;
        return new RedisCommandResult(
                "SET " + key + " \"" + value + "\"",
                "OK",
                "SET komutu: '" + key + "' anahtarina '" + value + "' degerini atar. (Sets the string value of a key)",
                elapsed
        );
    }

    public RedisCommandResult get(String key) {
        long start = System.currentTimeMillis();
        String value = stringRedisTemplate.opsForValue().get(key);
        long elapsed = System.currentTimeMillis() - start;
        return new RedisCommandResult(
                "GET " + key,
                value,
                "GET komutu: '" + key + "' anahtarinin degerini getirir. " + (value == null ? "Anahtar bulunamadi (Key not found)." : "Deger: " + value),
                elapsed
        );
    }

    public RedisCommandResult delete(String key) {
        long start = System.currentTimeMillis();
        Boolean deleted = stringRedisTemplate.delete(key);
        long elapsed = System.currentTimeMillis() - start;
        return new RedisCommandResult(
                "DEL " + key,
                deleted != null && deleted ? 1 : 0,
                "DEL komutu: '" + key + "' anahtarini siler. " + (Boolean.TRUE.equals(deleted) ? "Basariyla silindi (Deleted successfully)." : "Anahtar bulunamadi (Key not found)."),
                elapsed
        );
    }

    public RedisCommandResult increment(String key) {
        long start = System.currentTimeMillis();
        Long newValue = stringRedisTemplate.opsForValue().increment(key);
        long elapsed = System.currentTimeMillis() - start;
        return new RedisCommandResult(
                "INCR " + key,
                newValue,
                "INCR komutu: '" + key + "' anahtarinin degerini 1 arttirir. Yeni deger (New value): " + newValue,
                elapsed
        );
    }

    public RedisCommandResult append(String key, String value) {
        long start = System.currentTimeMillis();
        Integer newLength = stringRedisTemplate.opsForValue().append(key, value);
        long elapsed = System.currentTimeMillis() - start;
        String currentValue = stringRedisTemplate.opsForValue().get(key);
        return new RedisCommandResult(
                "APPEND " + key + " \"" + value + "\"",
                currentValue,
                "APPEND komutu: '" + key + "' anahtarinin sonuna '" + value + "' ekler. Yeni uzunluk (New length): " + newLength,
                elapsed
        );
    }
}
