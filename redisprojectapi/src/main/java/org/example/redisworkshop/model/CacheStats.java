package org.example.redisworkshop.model;

public record CacheStats(
        int hits,
        int misses,
        int totalRequests
) {
}
