package org.example.redisworkshop.controller;

import lombok.RequiredArgsConstructor;
import org.example.redisworkshop.model.RedisCommandResult;
import org.example.redisworkshop.service.ListService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/lists")
@RequiredArgsConstructor
public class ListController {

    private final ListService listService;

    @PostMapping("/{key}/lpush")
    public RedisCommandResult lpush(@PathVariable String key, @RequestBody Map<String, String> body) {
        return listService.lpush(key, body.get("value"));
    }

    @PostMapping("/{key}/rpush")
    public RedisCommandResult rpush(@PathVariable String key, @RequestBody Map<String, String> body) {
        return listService.rpush(key, body.get("value"));
    }

    @PostMapping("/{key}/lpop")
    public RedisCommandResult lpop(@PathVariable String key) {
        return listService.lpop(key);
    }

    @PostMapping("/{key}/rpop")
    public RedisCommandResult rpop(@PathVariable String key) {
        return listService.rpop(key);
    }

    @GetMapping("/{key}/range")
    public RedisCommandResult range(
            @PathVariable String key,
            @RequestParam(defaultValue = "0") long start,
            @RequestParam(defaultValue = "-1") long end) {
        return listService.range(key, start, end);
    }

    @GetMapping("/{key}/length")
    public RedisCommandResult length(@PathVariable String key) {
        return listService.length(key);
    }
}
