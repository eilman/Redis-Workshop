package org.example.redisworkshop.service;

import lombok.RequiredArgsConstructor;
import org.example.redisworkshop.model.RedisCommandResult;
import org.springframework.data.redis.core.Cursor;
import org.springframework.data.redis.core.ScanOptions;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpSession;
import java.util.*;

@Service
@RequiredArgsConstructor
public class SessionService {

    private final StringRedisTemplate stringRedisTemplate;

    public RedisCommandResult login(HttpSession session, String username) {
        long start = System.currentTimeMillis();
        session.setAttribute("username", username);
        session.setAttribute("loginTime", System.currentTimeMillis());
        session.setAttribute("role", "user");
        long elapsed = System.currentTimeMillis() - start;

        Map<String, Object> sessionInfo = new HashMap<>();
        sessionInfo.put("sessionId", session.getId());
        sessionInfo.put("username", username);
        sessionInfo.put("loginTime", session.getAttribute("loginTime"));

        return new RedisCommandResult(
                "SESSION SET username=" + username,
                sessionInfo,
                "Login basarili (Login successful)! Session Redis'e kaydedildi (Session stored in Redis). " +
                        "Session ID: " + session.getId() + ". Spring Session, HttpSession'i otomatik olarak Redis'e yazar " +
                        "(Spring Session automatically persists HttpSession to Redis). Anahtar formati: spring:session:sessions:<sessionId>",
                elapsed
        );
    }

    public RedisCommandResult getCurrentSession(HttpSession session) {
        long start = System.currentTimeMillis();
        String username = (String) session.getAttribute("username");

        Map<String, Object> sessionData = new LinkedHashMap<>();
        sessionData.put("sessionId", session.getId());
        sessionData.put("username", username);
        sessionData.put("loginTime", session.getAttribute("loginTime"));
        sessionData.put("role", session.getAttribute("role"));
        sessionData.put("creationTime", new Date(session.getCreationTime()));
        sessionData.put("lastAccessedTime", new Date(session.getLastAccessedTime()));
        sessionData.put("maxInactiveInterval", session.getMaxInactiveInterval());

        // Custom attribute'ları da ekle
        Enumeration<String> attrNames = session.getAttributeNames();
        while (attrNames.hasMoreElements()) {
            String name = attrNames.nextElement();
            if (!sessionData.containsKey(name)) {
                sessionData.put(name, session.getAttribute(name));
            }
        }

        long elapsed = System.currentTimeMillis() - start;

        return new RedisCommandResult(
                "SESSION GET *",
                sessionData,
                username != null
                        ? "Mevcut oturum bilgileri (Current session info): Kullanici (User): " + username + ". Session Redis'te saklanmaktadir (Session is stored in Redis). Farkli sunuculara gidseniz bile ayni session'a erisebilirsiniz (You can access the same session even across different servers)."
                        : "Aktif oturum yok (No active session). Lutfen once login yapin (Please login first).",
                elapsed
        );
    }

    public RedisCommandResult logout(HttpSession session) {
        long start = System.currentTimeMillis();
        String username = (String) session.getAttribute("username");
        String sessionId = session.getId();
        session.invalidate();
        long elapsed = System.currentTimeMillis() - start;

        return new RedisCommandResult(
                "SESSION INVALIDATE",
                "OK",
                "Oturum sonlandirildi (Session invalidated). Kullanici (User): " + (username != null ? username : "unknown") +
                        ", Session ID: " + sessionId + ". Redis'teki session verisi de silinecek (Session data in Redis will also be deleted).",
                elapsed
        );
    }

    public RedisCommandResult setAttribute(HttpSession session, String key, String value) {
        long start = System.currentTimeMillis();
        session.setAttribute(key, value);
        long elapsed = System.currentTimeMillis() - start;

        return new RedisCommandResult(
                "SESSION SET " + key + "=" + value,
                "OK",
                "Session attribute eklendi (Session attribute added): '" + key + "' = '" + value + "'. " +
                        "Bu deger Redis'teki session hash'ine yazildi (This value is written to the session hash in Redis). " +
                        "Session ID: " + session.getId(),
                elapsed
        );
    }

    public RedisCommandResult inspectSessionKeys() {
        long start = System.currentTimeMillis();
        List<Map<String, Object>> sessionInfos = new ArrayList<>();

        ScanOptions options = ScanOptions.scanOptions().match("spring:session:*").count(100).build();
        try (Cursor<String> cursor = stringRedisTemplate.scan(options)) {
            while (cursor.hasNext()) {
                String key = cursor.next();
                Map<String, Object> info = new HashMap<>();
                info.put("key", key);
                info.put("type", stringRedisTemplate.type(key).code());
                info.put("ttl", stringRedisTemplate.getExpire(key));
                sessionInfos.add(info);
                if (sessionInfos.size() >= 100) break;
            }
        }

        long elapsed = System.currentTimeMillis() - start;

        return new RedisCommandResult(
                "SCAN 0 MATCH spring:session:* COUNT 100",
                sessionInfos,
                "Redis'teki session anahtarlari (Session keys in Redis). Toplam anahtar sayisi (Total keys): " + sessionInfos.size() +
                        ". Spring Session, her oturum icin birden fazla anahtar olusturur (creates multiple keys per session): " +
                        "sessions:<id> (hash), sessions:expires:<id> (string), expirations:<time> (set).",
                elapsed
        );
    }
}
