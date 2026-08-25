package org.example.redisworkshop.controller;

import lombok.RequiredArgsConstructor;
import org.example.redisworkshop.model.RedisCommandResult;
import org.example.redisworkshop.service.SessionService;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import java.util.Map;

@RestController
@RequestMapping("/api/session")
@RequiredArgsConstructor
public class SessionController {

    private final SessionService sessionService;

    @PostMapping("/login")
    public RedisCommandResult login(HttpSession session, @RequestBody Map<String, String> body) {
        return sessionService.login(session, body.get("username"));
    }

    @GetMapping("/current")
    public RedisCommandResult getCurrentSession(HttpSession session) {
        return sessionService.getCurrentSession(session);
    }

    @PostMapping("/logout")
    public RedisCommandResult logout(HttpSession session) {
        return sessionService.logout(session);
    }

    @PostMapping("/attribute")
    public RedisCommandResult setAttribute(HttpSession session, @RequestBody Map<String, String> body) {
        return sessionService.setAttribute(session, body.get("key"), body.get("value"));
    }

    @GetMapping("/keys")
    public RedisCommandResult inspectSessionKeys() {
        return sessionService.inspectSessionKeys();
    }
}
