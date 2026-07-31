package com.example.collab.workspace;

import java.time.Instant;
import java.util.List;

public interface WorkspaceRepository extends JpaRepository<Workspace, String> {
    List<Workspace> findByStatusAndExpiresAtBefore(WorkspaceStatus status, Instant cutoff);
}