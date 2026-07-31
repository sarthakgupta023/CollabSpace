package com.example.collab.workspace;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WorkspaceMemberRepository extends JpaRepository<WorkspaceMember, String> {
    Optional<WorkspaceMember> findByWorkspaceIdAndUserId(String workspaceId, String userId);
}
