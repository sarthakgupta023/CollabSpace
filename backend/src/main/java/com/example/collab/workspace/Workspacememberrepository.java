package com.example.collab.workspace;

import java.util.Optional;

public interface WorkspaceMemberRepository extends JpaRepository<WorkspaceMember, String> {
    Optional<WorkspaceMember> findByWorkspaceIdAndUserId(String workspaceId, String userId);
}