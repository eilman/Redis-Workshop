package org.example.redisworkshop.controller;

import lombok.RequiredArgsConstructor;
import org.example.redisworkshop.model.RedisCommandResult;
import org.example.redisworkshop.service.LockService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/lock")
@RequiredArgsConstructor
public class LockController {

    private final LockService lockService;

    @PostMapping("/acquire")
    public RedisCommandResult acquire(@RequestBody Map<String, String> body) {
        return lockService.acquire(
                body.get("lockKey"),
                body.get("owner"),
                Integer.parseInt(body.getOrDefault("timeoutSeconds", "30"))
        );
    }

    @PostMapping("/release")
    public RedisCommandResult release(@RequestBody Map<String, String> body) {
        return lockService.release(body.get("lockKey"), body.get("owner"));
    }

    @GetMapping("/status/{lockKey}")
    public RedisCommandResult status(@PathVariable String lockKey) {
        return lockService.status(lockKey);
    }
}
