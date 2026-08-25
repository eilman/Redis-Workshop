package org.example.redisworkshop.controller;

import lombok.RequiredArgsConstructor;
import org.example.redisworkshop.model.RedisCommandResult;
import org.example.redisworkshop.service.PipelineService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/pipeline")
@RequiredArgsConstructor
public class PipelineController {

    private final PipelineService pipelineService;

    @PostMapping("/benchmark")
    public RedisCommandResult benchmark(@RequestBody Map<String, Integer> body) {
        int count = body.getOrDefault("count", 100);
        return pipelineService.benchmark(count);
    }
}
