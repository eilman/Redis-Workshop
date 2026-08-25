package org.example.redisworkshop.controller;

import lombok.RequiredArgsConstructor;
import org.example.redisworkshop.model.RedisCommandResult;
import org.example.redisworkshop.service.RateLimitService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ratelimit")
@RequiredArgsConstructor
public class RateLimitController {

    private final RateLimitService rateLimitService;

    @PostMapping("/request/{clientId}")
    public RedisCommandResult request(
            @PathVariable String clientId,
            @RequestParam(defaultValue = "60") int window,
            @RequestParam(defaultValue = "10") int limit) {
        return rateLimitService.handleRequest(clientId, window, limit);
    }

    @GetMapping("/status/{clientId}")
    public RedisCommandResult status(
            @PathVariable String clientId,
            @RequestParam(defaultValue = "60") int window,
            @RequestParam(defaultValue = "10") int limit) {
        return rateLimitService.getStatus(clientId, window, limit);
    }

    @PostMapping("/reset/{clientId}")
    public RedisCommandResult reset(@PathVariable String clientId) {
        return rateLimitService.reset(clientId);
    }
}
