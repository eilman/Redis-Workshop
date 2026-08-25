package org.example.redisworkshop.service;

import lombok.RequiredArgsConstructor;
import org.example.redisworkshop.model.RedisCommandResult;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class SetService {

    private final StringRedisTemplate stringRedisTemplate;

    public RedisCommandResult add(String key, String value) {
        long start = System.currentTimeMillis();
        Long added = stringRedisTemplate.opsForSet().add(key, value);
        long elapsed = System.currentTimeMillis() - start;
        return new RedisCommandResult(
                "SADD " + key + " \"" + value + "\"",
                added,
                "SADD komutu: '" + key + "' setine '" + value + "' ekler. " + (added != null && added > 0 ? "Basariyla eklendi (Added successfully)." : "Zaten mevcut (Already exists)."),
                elapsed
        );
    }

    public RedisCommandResult remove(String key, String value) {
        long start = System.currentTimeMillis();
        Long removed = stringRedisTemplate.opsForSet().remove(key, value);
        long elapsed = System.currentTimeMillis() - start;
        return new RedisCommandResult(
                "SREM " + key + " \"" + value + "\"",
                removed,
                "SREM komutu: '" + key + "' setinden '" + value + "' siler. " + (removed != null && removed > 0 ? "Basariyla silindi (Removed successfully)." : "Eleman bulunamadi (Member not found)."),
                elapsed
        );
    }

    public RedisCommandResult members(String key) {
        long start = System.currentTimeMillis();
        Set<String> members = stringRedisTemplate.opsForSet().members(key);
        long elapsed = System.currentTimeMillis() - start;
        return new RedisCommandResult(
                "SMEMBERS " + key,
                members,
                "SMEMBERS komutu: '" + key + "' setinin tum elemanlarini getirir. Eleman sayisi (Count): " + (members != null ? members.size() : 0),
                elapsed
        );
    }

    public RedisCommandResult isMember(String key, String value) {
        long start = System.currentTimeMillis();
        Boolean isMember = stringRedisTemplate.opsForSet().isMember(key, value);
        long elapsed = System.currentTimeMillis() - start;
        return new RedisCommandResult(
                "SISMEMBER " + key + " \"" + value + "\"",
                isMember,
                "SISMEMBER komutu: '" + value + "' degerinin '" + key + "' setinde olup olmadigini kontrol eder. Sonuc (Result): " + (Boolean.TRUE.equals(isMember) ? "Evet, mevcut (Yes, exists)" : "Hayir, mevcut degil (No, does not exist)"),
                elapsed
        );
    }

}
