package org.example.redisworkshop.controller;

import lombok.RequiredArgsConstructor;
import org.example.redisworkshop.model.RedisCommandResult;
import org.example.redisworkshop.service.PubSubService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/pubsub")
@RequiredArgsConstructor
public class PubSubController {

    private final PubSubService pubSubService;

    @PostMapping("/publish")
    public RedisCommandResult publish(@RequestBody Map<String, String> body) {
        return pubSubService.publish(body.get("channel"), body.get("message"));
    }

    @PostMapping("/subscribe")
    public RedisCommandResult subscribe(@RequestBody Map<String, String> body) {
        return pubSubService.subscribe(body.get("channel"));
    }

    @PostMapping("/unsubscribe")
    public RedisCommandResult unsubscribe(@RequestBody Map<String, String> body) {
        return pubSubService.unsubscribe(body.get("channel"));
    }

    @GetMapping("/channels")
    public RedisCommandResult getActiveChannels() {
        return pubSubService.getActiveChannelsResult();
    }
}
