package com.example.collab.websocket;

import java.io.IOException;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.BinaryMessage;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

/**
 * Holds only THIS instance's local sessions, keyed by workspaceId.
 * Cross-instance fan-out happens through Redis (see RedisRoomSubscriber) -
 * this class never needs to know about other instances.
 */
@Component
public class WorkspaceSessionRegistry {

    private final Map<String, Set<WebSocketSession>> rooms = new ConcurrentHashMap<>();

    public void add(String workspaceId, WebSocketSession session) {
        rooms.computeIfAbsent(workspaceId, id -> ConcurrentHashMap.newKeySet()).add(session);
    }

    public void remove(String workspaceId, WebSocketSession session) {
        Set<WebSocketSession> room = rooms.get(workspaceId);
        if (room != null) {
            room.remove(session);
            if (room.isEmpty()) {
                rooms.remove(workspaceId);
            }
        }
    }

    public int localSize(String workspaceId) {
        Set<WebSocketSession> room = rooms.get(workspaceId);
        return room == null ? 0 : room.size();
    }

    /**
     * Send binary data to every local session in the room except the one matching
     * excludeSessionId.
     */
    public void broadcastBinaryExcept(String workspaceId, String excludeSessionId, byte[] data) {
        Set<WebSocketSession> room = rooms.get(workspaceId);
        if (room == null)
            return;
        BinaryMessage message = new BinaryMessage(data);
        for (WebSocketSession session : room) {
            if (session.getId().equals(excludeSessionId))
                continue;
            sendQuietly(session, message);
        }
    }

    /**
     * Force-close every local session in the room, e.g. when a workspace expires or
     * is ended.
     */
    public void closeRoom(String workspaceId, String reason) {
        Set<WebSocketSession> room = rooms.get(workspaceId);
        if (room == null)
            return;
        for (WebSocketSession session : room) {
            try {
                session.sendMessage(new TextMessage("WORKSPACE_CLOSED:" + reason));
                session.close(CloseStatus.NORMAL);
            } catch (IOException ignored) {
                // session already gone - nothing to do
            }
        }
        rooms.remove(workspaceId);
    }

    private void sendQuietly(WebSocketSession session, BinaryMessage message) {
        try {
            if (session.isOpen()) {
                session.sendMessage(message);
            }
        } catch (IOException ignored) {
            // a single dead session shouldn't break the broadcast to everyone else
        }
    }
}
