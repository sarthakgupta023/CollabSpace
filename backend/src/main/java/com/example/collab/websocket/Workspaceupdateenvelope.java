package com.example.collab.websocket;

/**
 * type = "UPDATE" -> dataBase64 holds a raw Yjs update, relay to peers.
 * type = "CLOSE"  -> workspace ended/expired, close every local session in the room.
 */
public record WorkspaceUpdateEnvelope(
        String type,
        String workspaceId,
        String senderSessionId,
        String dataBase64
) {
    public static WorkspaceUpdateEnvelope update(String workspaceId, String senderSessionId, byte[] data) {
        return new WorkspaceUpdateEnvelope("UPDATE", workspaceId, senderSessionId,
                java.util.Base64.getEncoder().encodeToString(data));
    }

    public static WorkspaceUpdateEnvelope close(String workspaceId) {
        return new WorkspaceUpdateEnvelope("CLOSE", workspaceId, null, null);
    }

    public byte[] decodedData() {
        return dataBase64 == null ? new byte[0] : java.util.Base64.getDecoder().decode(dataBase64);
    }
}
