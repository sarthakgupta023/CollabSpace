package com.example.collab.workspace;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "workspaces")
@NoArgsConstructor
public class Workspace {

    @Id
    private String id;

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

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getOwnerUserId() {
        return ownerUserId;
    }

    public void setOwnerUserId(String ownerUserId) {
        this.ownerUserId = ownerUserId;
    }

    public String getOwnerDisplayName() {
        return ownerDisplayName;
    }

    public void setOwnerDisplayName(String ownerDisplayName) {
        this.ownerDisplayName = ownerDisplayName;
    }

    public WorkspaceStatus getStatus() {
        return status;
    }

    public void setStatus(WorkspaceStatus status) {
        this.status = status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(Instant expiresAt) {
        this.expiresAt = expiresAt;
    }
}