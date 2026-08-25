package org.example.redisworkshop.service;

import lombok.RequiredArgsConstructor;
import org.example.redisworkshop.model.RedisCommandResult;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class LockService {

    private final StringRedisTemplate stringRedisTemplate;

    private static final String RELEASE_LUA_SCRIPT =
            "if redis.call('get', KEYS[1]) == ARGV[1] then " +
                    "return redis.call('del', KEYS[1]) " +
                    "else " +
                    "return 0 " +
                    "end";

    private static final DefaultRedisScript<Long> RELEASE_SCRIPT = new DefaultRedisScript<>(RELEASE_LUA_SCRIPT, Long.class);

    public RedisCommandResult acquire(String lockKey, String owner, int timeoutSeconds) {
        long start = System.currentTimeMillis();

        // SET lockKey owner NX EX timeout
        Boolean acquired = stringRedisTemplate.opsForValue()
                .setIfAbsent(lockKey, owner, Duration.ofSeconds(timeoutSeconds));

        long elapsed = System.currentTimeMillis() - start;

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("acquired", Boolean.TRUE.equals(acquired));
        result.put("lockKey", lockKey);
        result.put("owner", owner);
        result.put("timeoutSeconds", timeoutSeconds);

        if (!Boolean.TRUE.equals(acquired)) {
            String currentOwner = stringRedisTemplate.opsForValue().get(lockKey);
            result.put("currentOwner", currentOwner);
        }

        return new RedisCommandResult(
                "SET " + lockKey + " " + owner + " NX EX " + timeoutSeconds,
                result,
                Boolean.TRUE.equals(acquired)
                        ? "Lock basariyla alindi. Owner: " + owner + ", Timeout: " + timeoutSeconds + "s. (Lock acquired successfully)"
                        : "Lock alinamadi! Baska bir owner tarafindan tutuluyor. (Lock already held by another owner)",
                elapsed
        );
    }

    public RedisCommandResult release(String lockKey, String owner) {
        long start = System.currentTimeMillis();

        Long result = stringRedisTemplate.execute(RELEASE_SCRIPT, Collections.singletonList(lockKey), owner);
        boolean released = result != null && result == 1L;

        long elapsed = System.currentTimeMillis() - start;

        Map<String, Object> resultMap = new LinkedHashMap<>();
        resultMap.put("released", released);
        resultMap.put("lockKey", lockKey);
        resultMap.put("owner", owner);
        if (!released) {
            String currentOwner = stringRedisTemplate.opsForValue().get(lockKey);
            if (currentOwner != null) {
                resultMap.put("currentOwner", currentOwner);
                resultMap.put("reason", "Owner eslesmedi. Lock baska birine ait. (Owner mismatch)");
            } else {
                resultMap.put("reason", "Lock zaten mevcut degil. (Lock does not exist)");
            }
        }

        return new RedisCommandResult(
                "EVAL \"if get(key)==owner then del(key)\" " + lockKey + " " + owner,
                resultMap,
                released
                        ? "Lock basariyla serbest birakildi. Lua script ile atomik islem. (Lock released atomically by " + owner + ")"
                        : "Lock serbest birakilamadi. " + (resultMap.containsKey("currentOwner") ? "Owner eslesmedi: " + resultMap.get("currentOwner") : "Lock mevcut degil."),
                elapsed
        );
    }

    public RedisCommandResult status(String lockKey) {
        long start = System.currentTimeMillis();

        String owner = stringRedisTemplate.opsForValue().get(lockKey);
        Long ttl = stringRedisTemplate.getExpire(lockKey, TimeUnit.SECONDS);

        long elapsed = System.currentTimeMillis() - start;

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("lockKey", lockKey);
        result.put("locked", owner != null);
        result.put("owner", owner);
        result.put("remainingTtlSeconds", ttl != null && ttl >= 0 ? ttl : null);

        return new RedisCommandResult(
                "GET " + lockKey + " → TTL " + lockKey,
                result,
                owner != null
                        ? "Lock aktif. Owner: " + owner + ", Kalan TTL: " + ttl + "s. (Lock is held)"
                        : "Lock serbest. Kimse tutmuyor. (Lock is free)",
                elapsed
        );
    }
}
