package org.example.redisworkshop.controller;

import lombok.RequiredArgsConstructor;
import org.example.redisworkshop.model.KeyValuePair;
import org.example.redisworkshop.model.RedisCommandResult;
import org.example.redisworkshop.service.StringService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/strings")
@RequiredArgsConstructor
public class StringController {

    private final StringService stringService;

    @PostMapping
    public RedisCommandResult set(@RequestBody KeyValuePair keyValuePair) {
        return stringService.set(keyValuePair.key(), keyValuePair.value());
    }

    @GetMapping("/{key}")
    public RedisCommandResult get(@PathVariable String key) {
        return stringService.get(key);
    }

    @DeleteMapping("/{key}")
    public RedisCommandResult delete(@PathVariable String key) {
        return stringService.delete(key);
    }

    @PostMapping("/{key}/increment")
    public RedisCommandResult increment(@PathVariable String key) {
        return stringService.increment(key);
    }

    @PostMapping("/{key}/append")
    public RedisCommandResult append(@PathVariable String key, @RequestBody Map<String, String> body) {
        return stringService.append(key, body.get("value"));
    }
}
