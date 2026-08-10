package com.example.collab.workspace;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkspaceMemberRepository extends JpaRepository<WorkspaceMember, String> {
    Optional<WorkspaceMember> findByWorkspaceIdAndUserId(String workspaceId, String userId);
}
