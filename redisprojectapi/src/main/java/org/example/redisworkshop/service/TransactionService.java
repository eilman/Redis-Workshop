package org.example.redisworkshop.service;

import lombok.RequiredArgsConstructor;
import org.example.redisworkshop.model.RedisCommandResult;
import org.springframework.dao.DataAccessException;
import org.springframework.data.redis.core.RedisOperations;
import org.springframework.data.redis.core.SessionCallback;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final StringRedisTemplate stringRedisTemplate;

    public RedisCommandResult transfer(String from, String to, long amount) {
        long start = System.currentTimeMillis();

        // Ensure keys exist with default values
        if (stringRedisTemplate.opsForValue().get(from) == null) {
            stringRedisTemplate.opsForValue().set(from, "100");
        }
        if (stringRedisTemplate.opsForValue().get(to) == null) {
            stringRedisTemplate.opsForValue().set(to, "100");
        }

        List<Object> txResults = stringRedisTemplate.execute(new SessionCallback<>() {
            @Override
            public List<Object> execute(RedisOperations operations) throws DataAccessException {
                operations.multi();
                operations.opsForValue().increment(from, -amount);
                operations.opsForValue().increment(to, amount);
                return operations.exec();
            }
        });

        String fromVal = stringRedisTemplate.opsForValue().get(from);
        String toVal = stringRedisTemplate.opsForValue().get(to);

        long elapsed = System.currentTimeMillis() - start;

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("from", Map.of("key", from, "balance", fromVal));
        result.put("to", Map.of("key", to, "balance", toVal));
        result.put("amount", amount);
        result.put("txResults", txResults != null ? txResults.toString() : "null");

        return new RedisCommandResult(
                "MULTI → INCRBY " + from + " -" + amount + " → INCRBY " + to + " " + amount + " → EXEC",
                result,
                "MULTI/EXEC ile atomik transfer yapildi. " + from + " -> " + to + " arasinda " + amount + " birim transfer edildi.",
                elapsed
        );
    }

    public RedisCommandResult multiExec(List<Map<String, String>> commands) {
        long start = System.currentTimeMillis();

        List<Object> txResults = stringRedisTemplate.execute(new SessionCallback<>() {
            @Override
            public List<Object> execute(RedisOperations operations) throws DataAccessException {
                operations.multi();
                for (Map<String, String> cmd : commands) {
                    operations.opsForValue().set(cmd.get("key"), cmd.get("value"));
                }
                return operations.exec();
            }
        });

        long elapsed = System.currentTimeMillis() - start;

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("commandCount", commands.size());
        result.put("txResults", txResults != null ? txResults.toString() : "null");
        result.put("commands", commands);

        StringBuilder cmdStr = new StringBuilder("MULTI");
        for (Map<String, String> cmd : commands) {
            cmdStr.append(" → SET ").append(cmd.get("key")).append(" ").append(cmd.get("value"));
        }
        cmdStr.append(" → EXEC");

        return new RedisCommandResult(
                cmdStr.toString(),
                result,
                "MULTI/EXEC ile " + commands.size() + " adet SET komutu atomik olarak calistirildi.",
                elapsed
        );
    }

    public RedisCommandResult watchDemo(String key) {
        long start = System.currentTimeMillis();

        // Set initial value
        stringRedisTemplate.opsForValue().set(key, "initial-value");

        // Try WATCH + MULTI/EXEC with interference
        List<Object> txResults = stringRedisTemplate.execute(new SessionCallback<>() {
            @Override
            public List<Object> execute(RedisOperations operations) throws DataAccessException {
                operations.watch(key);

                // Read current value
                operations.opsForValue().get(key);

                // Simulate another client modifying the key between WATCH and EXEC
                // We use a separate thread to modify the key
                CompletableFuture<Void> interference = CompletableFuture.runAsync(() -> {
                    stringRedisTemplate.opsForValue().set(key, "modified-by-another-client");
                });

                try {
                    interference.get(2, TimeUnit.SECONDS);
                } catch (Exception e) {
                    // ignore
                }

                operations.multi();
                operations.opsForValue().set(key, "transaction-value");
                return operations.exec();
            }
        });

        String finalValue = stringRedisTemplate.opsForValue().get(key);
        boolean transactionFailed = txResults == null || txResults.isEmpty();

        long elapsed = System.currentTimeMillis() - start;

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("watchedKey", key);
        result.put("transactionSuccess", !transactionFailed);
        result.put("finalValue", finalValue);
        result.put("explanation", transactionFailed
                ? "Transaction BASARISIZ! WATCH edilen key baska bir client tarafindan degistirildi, EXEC null dondu."
                : "Transaction BASARILI. WATCH edilen key degismedi, EXEC basariyla calisti.");

        return new RedisCommandResult(
                "WATCH " + key + " → MULTI → SET " + key + " → EXEC",
                result,
                transactionFailed
                        ? "WATCH ile optimistic locking: Key baska client tarafindan degistirildi, transaction iptal edildi (EXEC null)."
                        : "WATCH ile optimistic locking: Key degismedi, transaction basariyla tamamlandi.",
                elapsed
        );
    }
}
