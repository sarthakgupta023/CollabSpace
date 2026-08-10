package com.example.collab.websocket;

import java.io.IOException;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.BinaryMessage;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.BinaryWebSocketHandler;

import static com.example.collab.config.RedisConfig.CHANNEL_NAME;
import com.example.collab.document.DocumentSnapshot;
import com.example.collab.document.DocumentSnapshotRepository;
import com.example.collab.document.UpdateBufferService;
import com.example.collab.history.SessionHistoryService;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Yjs updates are opaque binary blobs to this handler - it never decodes
 * them. It only needs to: relay to peers (via Redis), buffer for later
 * persistence, and send a new joiner everything stored so far so their
 * client can rebuild the document locally.
 */
@Component
public class DocumentWebSocketHandler extends BinaryWebSocketHandler {

    private final WorkspaceSessionRegistry registry;
    private final RedisTemplate<String, String> redisTemplate;
    private final ObjectMapper objectMapper;
    private final DocumentSnapshotRepository snapshotRepository;
    private final UpdateBufferService bufferService;
    private final SessionHistoryService sessionHistoryService;

    public DocumentWebSocketHandler(WorkspaceSessionRegistry registry,
            RedisTemplate<String, String> redisTemplate,
            ObjectMapper objectMapper,
            DocumentSnapshotRepository snapshotRepository,
            UpdateBufferService bufferService,
            SessionHistoryService sessionHistoryService) {
        this.registry = registry;
        this.redisTemplate = redisTemplate;
        this.objectMapper = objectMapper;
        this.snapshotRepository = snapshotRepository;
        this.bufferService = bufferService;
        this.sessionHistoryService = sessionHistoryService;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws IOException {
        String workspaceId = workspaceId(session);
        String userId = (String) session.getAttributes().get("userId");

        registry.add(workspaceId, session);
        sessionHistoryService.recordJoin(userId, workspaceId);

        // Hydrate the new client: replay every stored update in order so their
        // Y.Doc reaches the same state everyone else already has.
        DocumentSnapshot snapshot = snapshotRepository.findById(workspaceId).orElse(null);
        if (snapshot != null) {
            for (byte[] update : snapshot.getUpdates()) {
                if (session.isOpen()) {
                    session.sendMessage(new BinaryMessage(update));
                }
            }
        }
    }

    @Override
    protected void handleBinaryMessage(WebSocketSession session, BinaryMessage message) throws IOException {
        String workspaceId = workspaceId(session);
        java.nio.ByteBuffer payload = message.getPayload();
        byte[] update = new byte[payload.remaining()];
        payload.get(update);

        // 1. Buffer for the next scheduled MongoDB flush.
        bufferService.buffer(workspaceId, update);

        // 2. Publish to Redis so every instance (including this one) relays it
        // to its local peers, excluding the original sender.
        WorkspaceUpdateEnvelope envelope = WorkspaceUpdateEnvelope.update(workspaceId, session.getId(), update);
        redisTemplate.convertAndSend(CHANNEL_NAME, toJson(envelope));
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        String workspaceId = workspaceId(session);
        String userId = (String) session.getAttributes().get("userId");
        registry.remove(workspaceId, session);
        sessionHistoryService.recordLeave(userId, workspaceId);
    }

    private String workspaceId(WebSocketSession session) {
        return (String) session.getAttributes().get("workspaceId");
    }

    private String toJson(WorkspaceUpdateEnvelope envelope) {
        try {
            return objectMapper.writeValueAsString(envelope);
        } catch (Exception e) {
            throw new RuntimeException("Failed to serialize workspace update envelope", e);
        }
    }
}
