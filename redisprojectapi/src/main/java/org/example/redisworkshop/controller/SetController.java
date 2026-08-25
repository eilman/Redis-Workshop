package org.example.redisworkshop.controller;

import lombok.RequiredArgsConstructor;
import org.example.redisworkshop.model.RedisCommandResult;
import org.example.redisworkshop.service.SetService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/sets")
@RequiredArgsConstructor
public class SetController {

    private final SetService setService;

    @PostMapping("/{key}/add")
    public RedisCommandResult add(@PathVariable String key, @RequestBody Map<String, String> body) {
        return setService.add(key, body.get("value"));
    }

    @PostMapping("/{key}/remove")
    public RedisCommandResult remove(@PathVariable String key, @RequestBody Map<String, String> body) {
        return setService.remove(key, body.get("value"));
    }

    @GetMapping("/{key}/members")
    public RedisCommandResult members(@PathVariable String key) {
        return setService.members(key);
    }

    @GetMapping("/{key}/ismember")
    public RedisCommandResult isMember(@PathVariable String key, @RequestParam String value) {
        return setService.isMember(key, value);
    }

}
