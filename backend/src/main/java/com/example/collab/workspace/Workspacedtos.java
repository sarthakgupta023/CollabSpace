package com.example.collab.workspace;

import java.time.Instant;

public class WorkspaceDtos {

    public record CreateRequest(@NotBlank String ownerName) {
    }

    public record JoinRequest(@NotBlank String displayName) {
    }

    public record WorkspaceResponse(
            String workspaceId,
            String shareLink,
            String role,
            WorkspaceStatus status,
            Instant expiresAt) {
    }

    public record StatusResponse(WorkspaceStatus status, Instant expiresAt) {
    }
}