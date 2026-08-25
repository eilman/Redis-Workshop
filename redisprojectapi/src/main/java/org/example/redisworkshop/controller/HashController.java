package org.example.redisworkshop.controller;

import lombok.RequiredArgsConstructor;
import org.example.redisworkshop.model.RedisCommandResult;
import org.example.redisworkshop.service.HashService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/hashes")
@RequiredArgsConstructor
public class HashController {

    private final HashService hashService;

    @PostMapping("/{key}")
    public RedisCommandResult set(@PathVariable String key, @RequestBody Map<String, String> body) {
        return hashService.set(key, body.get("field"), body.get("value"));
    }

    @GetMapping("/{key}/{field}")
    public RedisCommandResult get(@PathVariable String key, @PathVariable String field) {
        return hashService.get(key, field);
    }

    @GetMapping("/{key}")
    public RedisCommandResult getAll(@PathVariable String key) {
        return hashService.getAll(key);
    }

    @DeleteMapping("/{key}/{field}")
    public RedisCommandResult delete(@PathVariable String key, @PathVariable String field) {
        return hashService.delete(key, field);
    }

    @PostMapping("/{key}/{field}/increment")
    public RedisCommandResult increment(
            @PathVariable String key,
            @PathVariable String field,
            @RequestBody Map<String, Long> body) {
        return hashService.increment(key, field, body.getOrDefault("delta", 1L));
    }
}
