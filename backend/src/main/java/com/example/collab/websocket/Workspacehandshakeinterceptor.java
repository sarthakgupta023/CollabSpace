package com.example.collab.websocket;

import java.util.Map;

import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

/**
 * Runs before the WebSocket upgrade completes. Pulls the workspaceId out of
 * the path and userId/displayName/role out of the query string, so the
 * handler can read them from session attributes without re-parsing the URL.
 *
 * TODO: this trusts client-supplied query params. Replace with a validated
 * JWT (or a short-lived join token issued by /api/workspaces/{id}/join)
 * before this goes anywhere near production.
 */
@Component
public class WorkspaceHandshakeInterceptor implements HandshakeInterceptor {

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
            WebSocketHandler wsHandler, Map<String, Object> attributes) {
        String path = request.getURI().getPath(); // e.g. /ws/workspace/abc123
        String[] segments = path.split("/");
        String workspaceId = segments[segments.length - 1];

        var query = UriComponentsBuilder.fromUri(request.getURI()).build().getQueryParams();
        String userId = firstOrNull(query.get("userId"));
        String displayName = firstOrNull(query.get("displayName"));
        String role = firstOrNull(query.get("role"));

        if (workspaceId == null || workspaceId.isBlank() || userId == null) {
            return false; // reject the handshake
        }

        attributes.put("workspaceId", workspaceId);
        attributes.put("userId", userId);
        attributes.put("displayName", displayName != null ? displayName : "Anonymous");
        attributes.put("role", role != null ? role : "VIEWER");
        return true;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
            WebSocketHandler wsHandler, Exception exception) {
        // no-op
    }

    private String firstOrNull(java.util.List<String> values) {
        return (values == null || values.isEmpty()) ? null : values.get(0);
    }
}