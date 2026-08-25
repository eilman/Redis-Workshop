package org.example.redisworkshop.service;

import lombok.RequiredArgsConstructor;
import org.example.redisworkshop.model.RedisCommandResult;
import org.springframework.data.redis.connection.DataType;
import org.springframework.data.redis.core.Cursor;
import org.springframework.data.redis.core.ScanOptions;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class KeyDesignService {

    private final StringRedisTemplate stringRedisTemplate;

    public RedisCommandResult createGoodKey(String entity, String id, String field) {
        long start = System.currentTimeMillis();

        Map<String, String> fields = new LinkedHashMap<>();
        fields.put("name", "Ahmet Yilmaz");
        fields.put("email", "ahmet@example.com");
        fields.put("age", "28");
        fields.put("city", "Istanbul");

        List<String> createdKeys = new ArrayList<>();
        StringBuilder commandStr = new StringBuilder();

        for (Map.Entry<String, String> entry : fields.entrySet()) {
            String key = entity + ":" + id + ":" + entry.getKey();
            stringRedisTemplate.opsForValue().set(key, entry.getValue());
            createdKeys.add(key);
            if (!commandStr.isEmpty()) commandStr.append("\n");
            commandStr.append("SET ").append(key).append(" \"").append(entry.getValue()).append("\"");
        }

        long elapsed = System.currentTimeMillis() - start;

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("createdKeys", createdKeys);
        result.put("scanPattern", entity + ":" + id + ":*");
        result.put("scanHint", "SCAN ile '" + entity + ":" + id + ":*' pattern'ini deneyin — tum alanlari bulabilirsiniz.");

        return new RedisCommandResult(
                commandStr.toString(),
                result,
                "Iyi anahtar tasarimi: " + createdKeys.size() + " key olusturuldu. " +
                        "Hepsi '" + entity + ":" + id + ":*' pattern'i ile bulunabilir. " +
                        "Key'ler okunabilir, organize ve SCAN ile taranabilir.",
                elapsed
        );
    }

    public RedisCommandResult createBadKey(String name) {
        long start = System.currentTimeMillis();

        Map<String, String> badKeys = new LinkedHashMap<>();
        badKeys.put(name, "Ahmet Yilmaz");
        badKeys.put(name + "2", "ahmet@example.com");
        badKeys.put(name + "_mail", "ahmet@example.com");
        badKeys.put("data_" + name, "28");

        List<String> createdKeys = new ArrayList<>();
        StringBuilder commandStr = new StringBuilder();

        for (Map.Entry<String, String> entry : badKeys.entrySet()) {
            stringRedisTemplate.opsForValue().set(entry.getKey(), entry.getValue());
            createdKeys.add(entry.getKey());
            if (!commandStr.isEmpty()) commandStr.append("\n");
            commandStr.append("SET ").append(entry.getKey()).append(" \"").append(entry.getValue()).append("\"");
        }

        long elapsed = System.currentTimeMillis() - start;

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("createdKeys", createdKeys);
        result.put("problem", "Bu key'lerin hepsi ayni kisiye ait ama tutarsiz isimlendirme yuzunden SCAN ile hepsini birden bulamazsiniz.");

        return new RedisCommandResult(
                commandStr.toString(),
                result,
                "Kotu anahtar tasarimi: " + createdKeys.size() + " key olusturuldu. " +
                        "'" + name + "', '" + name + "2', '" + name + "_mail', 'data_" + name + "' — tutarsiz, yapisisiz. " +
                        "Hangi pattern ile SCAN yapacaksiniz?",
                elapsed
        );
    }

    public RedisCommandResult scan(String pattern) {
        long start = System.currentTimeMillis();
        List<String> keys = new ArrayList<>();
        ScanOptions options = ScanOptions.scanOptions().match(pattern).count(100).build();
        try (Cursor<String> cursor = stringRedisTemplate.scan(options)) {
            while (cursor.hasNext()) {
                keys.add(cursor.next());
                if (keys.size() >= 100) break; // Safety limit
            }
        }
        long elapsed = System.currentTimeMillis() - start;
        return new RedisCommandResult(
                "SCAN 0 MATCH " + pattern + " COUNT 100",
                keys,
                "SCAN komutu: '" + pattern + "' desenine uyan anahtarlari tarar. KEYS komutundan farkli olarak sunucuyu bloklamaz (Unlike KEYS, does not block the server). " +
                        "Bulunan anahtar sayisi (Keys found): " + keys.size() + ". Production'da her zaman SCAN kullanin, KEYS kullanmayin!",
                elapsed
        );
    }

    public RedisCommandResult getKeyInfo(String key) {
        long start = System.currentTimeMillis();
        DataType type = stringRedisTemplate.type(key);
        Long ttl = stringRedisTemplate.getExpire(key, TimeUnit.SECONDS);
        Map<String, Object> info = new LinkedHashMap<>();
        info.put("key", key);
        info.put("type", type != null ? type.code() : "none");
        info.put("ttl", ttl);
        info.put("exists", type != null && !"none".equals(type.code()));

        long elapsed = System.currentTimeMillis() - start;

        String typeDesc;
        if (type == null || "none".equals(type.code())) {
            typeDesc = "Anahtar bulunamadi (Key not found).";
        } else {
            typeDesc = "Tip (Type): " + type.code() + ", TTL: " + (ttl == -1 ? "yok (no expiry)" : ttl + " saniye (seconds)");
        }

        return new RedisCommandResult(
                "TYPE " + key + " | TTL " + key,
                info,
                "Anahtar bilgisi (Key info): " + typeDesc + ". TYPE komutu anahtarin veri yapisini, TTL komutu kalan yasam suresini dondurur.",
                elapsed
        );
    }
}
