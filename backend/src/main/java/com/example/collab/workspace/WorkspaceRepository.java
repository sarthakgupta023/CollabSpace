package com.example.collab.workspace;

import java.time.Instant;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkspaceRepository extends JpaRepository<Workspace, String> {
    List<Workspace> findByStatusAndExpiresAtBefore(WorkspaceStatus status, Instant cutoff);
}
