package com.example.collab.workspace;

import java.time.Instant;
import java.util.UUID;

import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "workspace_members", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "workspace_id", "user_id" })
})
@Data
@NoArgsConstructor
public class WorkspaceMember {

    @Id
    private String id;

    @Column(name = "workspace_id", nullable = false)
    private String workspaceId;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(nullable = false)
    private String displayName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(nullable = false)
    private Instant joinedAt;

    public static WorkspaceMember create(String workspaceId, String userId, String displayName, Role role) {
        WorkspaceMember m = new WorkspaceMember();
        m.setId(UUID.randomUUID().toString());
        m.setWorkspaceId(workspaceId);
        m.setUserId(userId);
        m.setDisplayName(displayName);
        m.setRole(role);
        m.setJoinedAt(Instant.now());
        return m;
    }
}