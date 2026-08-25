package org.example.redisworkshop.service;

import lombok.RequiredArgsConstructor;
import org.example.redisworkshop.model.RedisCommandResult;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ListService {

    private final StringRedisTemplate stringRedisTemplate;

    public RedisCommandResult lpush(String key, String value) {
        long start = System.currentTimeMillis();
        Long size = stringRedisTemplate.opsForList().leftPush(key, value);
        long elapsed = System.currentTimeMillis() - start;
        return new RedisCommandResult(
                "LPUSH " + key + " \"" + value + "\"",
                size,
                "LPUSH komutu: Listenin basina (sol tarafa) '" + value + "' ekler. Liste boyutu (List size): " + size,
                elapsed
        );
    }

    public RedisCommandResult rpush(String key, String value) {
        long start = System.currentTimeMillis();
        Long size = stringRedisTemplate.opsForList().rightPush(key, value);
        long elapsed = System.currentTimeMillis() - start;
        return new RedisCommandResult(
                "RPUSH " + key + " \"" + value + "\"",
                size,
                "RPUSH komutu: Listenin sonuna (sag tarafa) '" + value + "' ekler. Liste boyutu (List size): " + size,
                elapsed
        );
    }

    public RedisCommandResult lpop(String key) {
        long start = System.currentTimeMillis();
        String value = stringRedisTemplate.opsForList().leftPop(key);
        long elapsed = System.currentTimeMillis() - start;
        return new RedisCommandResult(
                "LPOP " + key,
                value,
                "LPOP komutu: Listenin basindan (soldan) bir eleman cikarir. " + (value == null ? "Liste bos (List is empty)." : "Cikan deger (Popped value): " + value),
                elapsed
        );
    }

    public RedisCommandResult rpop(String key) {
        long start = System.currentTimeMillis();
        String value = stringRedisTemplate.opsForList().rightPop(key);
        long elapsed = System.currentTimeMillis() - start;
        return new RedisCommandResult(
                "RPOP " + key,
                value,
                "RPOP komutu: Listenin sonundan (sagdan) bir eleman cikarir. " + (value == null ? "Liste bos (List is empty)." : "Cikan deger (Popped value): " + value),
                elapsed
        );
    }

    public RedisCommandResult range(String key, long start, long end) {
        long startTime = System.currentTimeMillis();
        List<String> values = stringRedisTemplate.opsForList().range(key, start, end);
        long elapsed = System.currentTimeMillis() - startTime;
        return new RedisCommandResult(
                "LRANGE " + key + " " + start + " " + end,
                values,
                "LRANGE komutu: Listeden " + start + " ile " + end + " indeksleri arasindaki elemanlari getirir. Eleman sayisi (Count): " + (values != null ? values.size() : 0),
                elapsed
        );
    }

    public RedisCommandResult length(String key) {
        long start = System.currentTimeMillis();
        Long size = stringRedisTemplate.opsForList().size(key);
        long elapsed = System.currentTimeMillis() - start;
        return new RedisCommandResult(
                "LLEN " + key,
                size,
                "LLEN komutu: '" + key + "' listesinin uzunlugunu dondurur. Uzunluk (Length): " + size,
                elapsed
        );
    }
}
