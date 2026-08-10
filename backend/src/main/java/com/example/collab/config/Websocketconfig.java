package com.example.collab.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

import com.example.collab.websocket.DocumentWebSocketHandler;
import com.example.collab.websocket.WorkspaceHandshakeInterceptor;

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
        registry.addHandler(documentWebSocketHandler, "/ws/workspace/*")
                .addInterceptors(handshakeInterceptor)
                .setAllowedOriginPatterns("*");
    }
}