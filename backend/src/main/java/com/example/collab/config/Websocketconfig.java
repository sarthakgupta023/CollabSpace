package com.example.collab.config;

import com.example.collab.websocket.DocumentWebSocketHandler;
import com.example.collab.websocket.WorkspaceHandshakeInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final DocumentWebSocketHandler documentWebSocketHandler;
    private final WorkspaceHandshakeInterceptor handshakeInterceptor;

    public WebSocketConfig(DocumentWebSocketHandler documentWebSocketHandler,
                            WorkspaceHandshakeInterceptor handshakeInterceptor) {
        this.documentWebSocketHandler = documentWebSocketHandler;
        this.handshakeInterceptor = handshakeInterceptor;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        // Client connects to: ws://host:8080/ws/workspace/{workspaceId}?userId=...&role=...
        // TODO: replace the userId/role query params with a validated JWT once real auth is added.
        registry.addHandler(documentWebSocketHandler, "/ws/workspace/*")
                .addInterceptors(handshakeInterceptor)
                .setAllowedOrigins("*"); // TODO: restrict to your frontend origin in production
    }
}
