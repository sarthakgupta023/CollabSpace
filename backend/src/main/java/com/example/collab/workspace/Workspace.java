package com.example.collab.workspace;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "workspaces")
@Data
@NoArgsConstructor
public class Workspace {

    @Id
    private String id; // shareable link uses this directly: /w/{id}

    @Column(nullable = false)
    private String ownerUserId;

    @Column(nullable = false)
    private String ownerDisplayName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private WorkspaceStatus status = WorkspaceStatus.ACTIVE;

    @Column(nullable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant expiresAt;

    public static Workspace create(String ownerUserId, String ownerDisplayName, long expiryHours) {
        Workspace w = new Workspace();
        w.setId(UUID.randomUUID().toString());
        w.setOwnerUserId(ownerUserId);
        w.setOwnerDisplayName(ownerDisplayName);
        w.setStatus(WorkspaceStatus.ACTIVE);
        w.setCreatedAt(Instant.now());
        w.setExpiresAt(Instant.now().plusSeconds(expiryHours * 3600));
        return w;
    }
}
