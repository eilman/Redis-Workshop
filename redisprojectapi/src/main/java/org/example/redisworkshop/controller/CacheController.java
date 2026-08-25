package org.example.redisworkshop.controller;

import lombok.RequiredArgsConstructor;
import org.example.redisworkshop.model.RedisCommandResult;
import org.example.redisworkshop.service.CacheService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cache")
@RequiredArgsConstructor
public class CacheController {

    private final CacheService cacheService;

    @GetMapping("/user/{userId}")
    public RedisCommandResult getUser(@PathVariable String userId) {
        return cacheService.getUser(userId);
    }

    @DeleteMapping("/user/{userId}")
    public RedisCommandResult invalidate(@PathVariable String userId) {
        return cacheService.invalidate(userId);
    }

    @GetMapping("/stats")
    public RedisCommandResult getStats() {
        return cacheService.getStats();
    }

    @PostMapping("/reset")
    public RedisCommandResult reset() {
        return cacheService.reset();
    }
}
