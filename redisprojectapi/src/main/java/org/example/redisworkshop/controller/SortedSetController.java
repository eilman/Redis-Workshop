package org.example.redisworkshop.controller;

import lombok.RequiredArgsConstructor;
import org.example.redisworkshop.model.RedisCommandResult;
import org.example.redisworkshop.service.SortedSetService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/sortedsets")
@RequiredArgsConstructor
public class SortedSetController {

    private final SortedSetService sortedSetService;

    @PostMapping("/{key}/add")
    public RedisCommandResult add(@PathVariable String key, @RequestBody Map<String, Object> body) {
        String value = (String) body.get("value");
        double score = ((Number) body.get("score")).doubleValue();
        return sortedSetService.add(key, value, score);
    }

    @GetMapping("/{key}/range")
    public RedisCommandResult range(
            @PathVariable String key,
            @RequestParam(defaultValue = "0") long start,
            @RequestParam(defaultValue = "-1") long end) {
        return sortedSetService.range(key, start, end);
    }

    @GetMapping("/{key}/rank/{member}")
    public RedisCommandResult rank(@PathVariable String key, @PathVariable String member) {
        return sortedSetService.rank(key, member);
    }

    @GetMapping("/{key}/score/{member}")
    public RedisCommandResult score(@PathVariable String key, @PathVariable String member) {
        return sortedSetService.score(key, member);
    }

    @DeleteMapping("/{key}/{member}")
    public RedisCommandResult remove(@PathVariable String key, @PathVariable String member) {
        return sortedSetService.remove(key, member);
    }
}
