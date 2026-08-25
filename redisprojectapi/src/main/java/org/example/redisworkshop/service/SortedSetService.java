package org.example.redisworkshop.service;

import lombok.RequiredArgsConstructor;
import org.example.redisworkshop.model.RedisCommandResult;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class SortedSetService {

    private final StringRedisTemplate stringRedisTemplate;

    public RedisCommandResult add(String key, String value, double score) {
        long start = System.currentTimeMillis();
        Boolean added = stringRedisTemplate.opsForZSet().add(key, value, score);
        long elapsed = System.currentTimeMillis() - start;
        return new RedisCommandResult(
                "ZADD " + key + " " + score + " \"" + value + "\"",
                added,
                "ZADD komutu: '" + key + "' sorted set'ine '" + value + "' elemanini " + score + " skoru ile ekler. " + (Boolean.TRUE.equals(added) ? "Yeni eleman eklendi (New member added)." : "Mevcut elemanin skoru guncellendi (Existing member score updated)."),
                elapsed
        );
    }

    public RedisCommandResult range(String key, long start, long end) {
        long startTime = System.currentTimeMillis();
        Set<ZSetOperations.TypedTuple<String>> results = stringRedisTemplate.opsForZSet().rangeWithScores(key, start, end);
        long elapsed = System.currentTimeMillis() - startTime;
        List<Map<String, Object>> items = tuplesToList(results);
        return new RedisCommandResult(
                "ZRANGE " + key + " " + start + " " + end + " WITHSCORES",
                items,
                "ZRANGE komutu: '" + key + "' sorted set'inden " + start + " ile " + end + " siralamasi arasindaki elemanlari skor ile birlikte getirir. Eleman sayisi (Count): " + items.size(),
                elapsed
        );
    }

    public RedisCommandResult rank(String key, String member) {
        long start = System.currentTimeMillis();
        Long rank = stringRedisTemplate.opsForZSet().rank(key, member);
        long elapsed = System.currentTimeMillis() - start;
        return new RedisCommandResult(
                "ZRANK " + key + " \"" + member + "\"",
                rank,
                "ZRANK komutu: '" + member + "' elemaninin '" + key + "' sorted set'indeki sirasini (0-based) dondurur. " + (rank == null ? "Eleman bulunamadi (Member not found)." : "Sira (Rank): " + rank),
                elapsed
        );
    }

    public RedisCommandResult score(String key, String member) {
        long start = System.currentTimeMillis();
        Double score = stringRedisTemplate.opsForZSet().score(key, member);
        long elapsed = System.currentTimeMillis() - start;
        return new RedisCommandResult(
                "ZSCORE " + key + " \"" + member + "\"",
                score,
                "ZSCORE komutu: '" + member + "' elemaninin '" + key + "' sorted set'indeki skorunu dondurur. " + (score == null ? "Eleman bulunamadi (Member not found)." : "Skor (Score): " + score),
                elapsed
        );
    }

    private List<Map<String, Object>> tuplesToList(Set<ZSetOperations.TypedTuple<String>> tuples) {
        if (tuples == null) return List.of();
        return tuples.stream().map(t -> {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("value", t.getValue());
            map.put("score", t.getScore());
            return map;
        }).toList();
    }

    public RedisCommandResult remove(String key, String member) {
        long start = System.currentTimeMillis();
        Long removed = stringRedisTemplate.opsForZSet().remove(key, member);
        long elapsed = System.currentTimeMillis() - start;
        return new RedisCommandResult(
                "ZREM " + key + " \"" + member + "\"",
                removed,
                "ZREM komutu: '" + member + "' elemanini '" + key + "' sorted set'inden siler. " + (removed != null && removed > 0 ? "Basariyla silindi (Removed successfully)." : "Eleman bulunamadi (Member not found)."),
                elapsed
        );
    }
}
