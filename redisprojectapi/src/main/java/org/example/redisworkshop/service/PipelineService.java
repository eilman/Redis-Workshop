package org.example.redisworkshop.service;

import lombok.RequiredArgsConstructor;
import org.example.redisworkshop.model.RedisCommandResult;
import org.springframework.dao.DataAccessException;
import org.springframework.data.redis.core.RedisOperations;
import org.springframework.data.redis.core.SessionCallback;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PipelineService {

    private final StringRedisTemplate stringRedisTemplate;

    public RedisCommandResult benchmark(int count) {
        // Clean up previous benchmark keys
        for (int i = 0; i < count; i++) {
            stringRedisTemplate.delete("bench:normal:" + i);
            stringRedisTemplate.delete("bench:pipeline:" + i);
        }

        // 1. Non-pipelined: N individual SET + GET operations
        long normalStart = System.currentTimeMillis();
        for (int i = 0; i < count; i++) {
            stringRedisTemplate.opsForValue().set("bench:normal:" + i, "value-" + i);
            stringRedisTemplate.opsForValue().get("bench:normal:" + i);
        }
        long normalElapsed = System.currentTimeMillis() - normalStart;

        // 2. Pipelined: N SET + GET operations in a single pipeline
        long pipelineStart = System.currentTimeMillis();
        stringRedisTemplate.executePipelined(new SessionCallback<>() {
            @Override
            public Object execute(RedisOperations operations) throws DataAccessException {
                for (int i = 0; i < count; i++) {
                    operations.opsForValue().set("bench:pipeline:" + i, "value-" + i);
                    operations.opsForValue().get("bench:pipeline:" + i);
                }
                return null;
            }
        });
        long pipelineElapsed = System.currentTimeMillis() - pipelineStart;

        // Cleanup
        for (int i = 0; i < count; i++) {
            stringRedisTemplate.delete("bench:normal:" + i);
            stringRedisTemplate.delete("bench:pipeline:" + i);
        }

        long totalElapsed = normalElapsed + pipelineElapsed;

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("count", count);
        result.put("normalMs", normalElapsed);
        result.put("pipelineMs", pipelineElapsed);
        result.put("speedup", normalElapsed > 0 ? String.format("%.1fx", (double) normalElapsed / Math.max(1, pipelineElapsed)) : "N/A");
        result.put("operationsPerBatch", count * 2);

        return new RedisCommandResult(
                count + "x (SET + GET) — Normal vs Pipeline",
                result,
                "Normal: " + normalElapsed + "ms (" + count + " round-trip), Pipeline: " + pipelineElapsed + "ms (1 round-trip). " +
                        "Pipeline " + result.get("speedup") + " daha hizli.",
                totalElapsed
        );
    }
}
