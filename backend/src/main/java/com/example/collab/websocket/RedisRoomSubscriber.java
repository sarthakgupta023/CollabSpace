package com.example.collab.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.stereotype.Component;

/**
 * Fired for EVERY message published on the "workspace-updates" Redis channel,
 * on EVERY instance (including the one that published it). We only ever
 * broadcast to sessions living on this instance, filtered by workspaceId and
 * excluding the original sender - so nobody gets an echo of their own edit.
 */
@Component
public class RedisRoomSubscriber implements MessageListener {

    private static final Logger log = LoggerFactory.getLogger(RedisRoomSubscriber.class);

    private final WorkspaceSessionRegistry registry;
    private final ObjectMapper objectMapper;

    public RedisRoomSubscriber(WorkspaceSessionRegistry registry, ObjectMapper objectMapper) {
        this.registry = registry;
        this.objectMapper = objectMapper;
    }

    @Override
    public void onMessage(Message message, byte[] pattern) {
        try {
            String body = new String(message.getBody());
            WorkspaceUpdateEnvelope envelope = objectMapper.readValue(body, WorkspaceUpdateEnvelope.class);
            switch (envelope.type()) {
                case "UPDATE" -> registry.broadcastBinaryExcept(
                        envelope.workspaceId(), envelope.senderSessionId(), envelope.decodedData());
                case "CLOSE" -> registry.closeRoom(envelope.workspaceId(), "expired_or_ended");
                default -> log.warn("Unknown envelope type: {}", envelope.type());
            }
        } catch (Exception e) {
            log.error("Failed to process Redis workspace-updates message", e);
        }
    }
}
