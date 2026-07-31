package com.example.collab.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * A single Redis channel ("workspace-updates") carries JSON envelopes for
 * ALL workspaces. Every Spring Boot instance subscribes to it and filters
 * by workspaceId in {@link RedisRoomSubscriber}. This keeps the setup
 * simple - no need to dynamically subscribe/unsubscribe per workspace.
 */
@Configuration
public class RedisConfig {

    public static final String CHANNEL_NAME = "workspace-updates";

    @Bean
    public ChannelTopic workspaceUpdatesTopic() {
        return new ChannelTopic(CHANNEL_NAME);
    }

    @Bean
    public RedisTemplate<String, String> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, String> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(new StringRedisSerializer());
        return template;
    }

    @Bean
    public RedisMessageListenerContainer redisMessageListenerContainer(
            RedisConnectionFactory connectionFactory,
            RedisRoomSubscriber subscriber,
            ChannelTopic topic) {
        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);
        container.addMessageListener(new MessageListenerAdapter(subscriber, "onMessage"), topic);
        return container;
    }
}