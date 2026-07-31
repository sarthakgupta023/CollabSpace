package com.example.collab.workspace;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;

public interface WorkspaceRepository extends JpaRepository<Workspace, String> {
    List<Workspace> findByStatusAndExpiresAtBefore(WorkspaceStatus status, Instant cutoff);
}
