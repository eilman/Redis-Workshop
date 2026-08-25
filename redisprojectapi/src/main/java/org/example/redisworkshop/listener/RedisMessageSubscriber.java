package org.example.redisworkshop.listener;

import lombok.RequiredArgsConstructor;
import org.example.redisworkshop.model.PubSubMessage;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Component
@RequiredArgsConstructor
public class RedisMessageSubscriber implements MessageListener {

    private final SimpMessagingTemplate messagingTemplate;

    @Override
    public void onMessage(Message message, byte[] pattern) {
        String channel = new String(message.getChannel());
        String body = new String(message.getBody());
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);

        PubSubMessage pubSubMessage = new PubSubMessage(channel, body, timestamp);

        messagingTemplate.convertAndSend("/topic/pubsub/" + channel, pubSubMessage);
    }
}
