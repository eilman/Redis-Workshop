package org.example.redisworkshop.model;

public record RedisCommandResult(
        String command,
        Object result,
        String explanation,
        long executionTimeMs
) {
}
