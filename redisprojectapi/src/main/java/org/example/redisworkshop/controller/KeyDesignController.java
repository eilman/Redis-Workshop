package org.example.redisworkshop.controller;

import lombok.RequiredArgsConstructor;
import org.example.redisworkshop.model.RedisCommandResult;
import org.example.redisworkshop.service.KeyDesignService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/keys")
@RequiredArgsConstructor
public class KeyDesignController {

    private final KeyDesignService keyDesignService;

    @PostMapping("/good")
    public RedisCommandResult createGoodKey(@RequestBody Map<String, String> body) {
        return keyDesignService.createGoodKey(
                body.get("entity"),
                body.get("id"),
                body.get("field")
        );
    }

    @PostMapping("/bad")
    public RedisCommandResult createBadKey(@RequestBody Map<String, String> body) {
        return keyDesignService.createBadKey(body.get("name"));
    }

    @GetMapping("/scan")
    public RedisCommandResult scan(@RequestParam(defaultValue = "*") String pattern) {
        return keyDesignService.scan(pattern);
    }

    @GetMapping("/{key}/info")
    public RedisCommandResult getKeyInfo(@PathVariable String key) {
        return keyDesignService.getKeyInfo(key);
    }
}
