package org.example.redisworkshop.controller;

import lombok.RequiredArgsConstructor;
import org.example.redisworkshop.model.RedisCommandResult;
import org.example.redisworkshop.service.TransactionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping("/transfer")
    public RedisCommandResult transfer(@RequestBody Map<String, String> body) {
        return transactionService.transfer(
                body.get("from"),
                body.get("to"),
                Long.parseLong(body.get("amount"))
        );
    }

    @PostMapping("/multi-exec")
    public RedisCommandResult multiExec(@RequestBody Map<String, Object> body) {
        @SuppressWarnings("unchecked")
        List<Map<String, String>> commands = (List<Map<String, String>>) body.get("commands");
        return transactionService.multiExec(commands);
    }

    @PostMapping("/watch-demo")
    public RedisCommandResult watchDemo(@RequestBody Map<String, String> body) {
        return transactionService.watchDemo(body.get("key"));
    }
}
