package org.example.redisworkshop.model;

public record PubSubMessage(
        String channel,
        String message,
        String timestamp
) {
}
