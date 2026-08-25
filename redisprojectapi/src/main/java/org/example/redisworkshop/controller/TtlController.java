package org.example.redisworkshop.controller;

import lombok.RequiredArgsConstructor;
import org.example.redisworkshop.model.RedisCommandResult;
import org.example.redisworkshop.service.TtlService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ttl")
@RequiredArgsConstructor
public class TtlController {

    private final TtlService ttlService;

    @PostMapping
    public RedisCommandResult setWithTtl(@RequestBody Map<String, Object> body) {
        String key = (String) body.get("key");
        String value = (String) body.get("value");
        long ttlSeconds = ((Number) body.get("ttlSeconds")).longValue();
        return ttlService.setWithTtl(key, value, ttlSeconds);
    }

    @GetMapping("/{key}")
    public RedisCommandResult getRemainingTtl(@PathVariable String key) {
        return ttlService.getRemainingTtl(key);
    }

    @PostMapping("/{key}/expire")
    public RedisCommandResult expire(@PathVariable String key, @RequestBody Map<String, Long> body) {
        return ttlService.expire(key, body.get("ttlSeconds"));
    }

    @PostMapping("/{key}/persist")
    public RedisCommandResult persist(@PathVariable String key) {
        return ttlService.persist(key);
    }
}
