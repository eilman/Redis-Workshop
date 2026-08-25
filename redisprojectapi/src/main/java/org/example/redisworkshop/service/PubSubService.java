package org.example.redisworkshop.service;

import lombok.RequiredArgsConstructor;
import org.example.redisworkshop.listener.RedisMessageSubscriber;
import org.example.redisworkshop.model.RedisCommandResult;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class PubSubService {

    private final StringRedisTemplate stringRedisTemplate;
    private final RedisMessageListenerContainer listenerContainer;
    private final RedisMessageSubscriber messageSubscriber;

    private final Map<String, ChannelTopic> activeSubscriptions = new ConcurrentHashMap<>();

    public RedisCommandResult publish(String channel, String message) {
        long start = System.currentTimeMillis();
        stringRedisTemplate.convertAndSend(channel, message);
        long elapsed = System.currentTimeMillis() - start;
        return new RedisCommandResult(
                "PUBLISH " + channel + " \"" + message + "\"",
                "OK",
                "PUBLISH komutu: '" + channel + "' kanalina '" + message + "' mesajini gonderir. " +
                        "Kanala abone olan tum istemciler bu mesaji alir (All subscribers to the channel receive this message). " +
                        "Redis Pub/Sub fire-and-forget yapisindadir, mesajlar saklanmaz (Messages are not persisted).",
                elapsed
        );
    }

    public RedisCommandResult subscribe(String channel) {
        long start = System.currentTimeMillis();
        if (activeSubscriptions.containsKey(channel)) {
            long elapsed = System.currentTimeMillis() - start;
            return new RedisCommandResult(
                    "SUBSCRIBE " + channel,
                    "ALREADY_SUBSCRIBED",
                    "Zaten '" + channel + "' kanalina abone olunmus (Already subscribed to channel). Tekrar abone olmaya gerek yok.",
                    elapsed
            );
        }

        ChannelTopic topic = new ChannelTopic(channel);
        listenerContainer.addMessageListener(messageSubscriber, topic);
        activeSubscriptions.put(channel, topic);
        long elapsed = System.currentTimeMillis() - start;

        return new RedisCommandResult(
                "SUBSCRIBE " + channel,
                "OK",
                "SUBSCRIBE komutu: '" + channel + "' kanalina abone olundu (Subscribed to channel). " +
                        "Bu kanalda yayinlanan mesajlar WebSocket uzerinden /topic/pubsub/" + channel + " adresine iletilecek. " +
                        "Aktif abonelik sayisi (Active subscriptions): " + activeSubscriptions.size(),
                elapsed
        );
    }

    public RedisCommandResult unsubscribe(String channel) {
        long start = System.currentTimeMillis();
        ChannelTopic topic = activeSubscriptions.remove(channel);
        if (topic == null) {
            long elapsed = System.currentTimeMillis() - start;
            return new RedisCommandResult(
                    "UNSUBSCRIBE " + channel,
                    "NOT_SUBSCRIBED",
                    "'" + channel + "' kanalina zaten abone olunmamis (Not subscribed to this channel). Abonelik iptal edilemedi.",
                    elapsed
            );
        }

        listenerContainer.removeMessageListener(messageSubscriber, topic);
        long elapsed = System.currentTimeMillis() - start;

        return new RedisCommandResult(
                "UNSUBSCRIBE " + channel,
                "OK",
                "UNSUBSCRIBE komutu: '" + channel + "' kanalindan abonelik iptal edildi (Unsubscribed from channel). " +
                        "Artik bu kanaldan mesaj alinmayacak. Kalan abonelik sayisi (Remaining subscriptions): " + activeSubscriptions.size(),
                elapsed
        );
    }

    public Set<String> getActiveChannels() {
        return activeSubscriptions.keySet();
    }

    public RedisCommandResult getActiveChannelsResult() {
        long start = System.currentTimeMillis();
        Set<String> channels = activeSubscriptions.keySet();
        long elapsed = System.currentTimeMillis() - start;

        return new RedisCommandResult(
                "PUBSUB CHANNELS",
                channels,
                "Aktif abonelik sayisi (Active subscriptions): " + channels.size() +
                        (channels.isEmpty()
                                ? ". Henuz hicbir kanala abone olunmamis (No active subscriptions)."
                                : ". Kanallar (Channels): " + channels),
                elapsed
        );
    }
}
