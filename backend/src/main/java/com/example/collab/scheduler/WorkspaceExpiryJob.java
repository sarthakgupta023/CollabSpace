package com.example.collab.scheduler;

import java.time.Instant;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.example.collab.workspace.Workspace;
import com.example.collab.workspace.WorkspaceRepository;
import com.example.collab.workspace.WorkspaceService;
import com.example.collab.workspace.WorkspaceStatus;

/**
 * Runs on every instance. In a multi-instance deployment this means the
 * query below fires redundantly on each node - harmless here since marking
 * an already-expired workspace as expired again is a no-op, but if you want
 * to avoid the duplicate DB hits at scale, wrap this method with ShedLock
 * (https://github.com/lukas-krecan/ShedLock) so only one instance runs it.
 */
@Component
public class WorkspaceExpiryJob {

    private static final Logger log = LoggerFactory.getLogger(WorkspaceExpiryJob.class);

    private final WorkspaceRepository workspaceRepository;
    private final WorkspaceService workspaceService;

    public WorkspaceExpiryJob(WorkspaceRepository workspaceRepository, WorkspaceService workspaceService) {
        this.workspaceRepository = workspaceRepository;
        this.workspaceService = workspaceService;
    }

    @Scheduled(fixedRateString = "${workspace.expiry-check-interval-ms}")
    public void expireOldWorkspaces() {
        List<Workspace> expired = workspaceRepository.findByStatusAndExpiresAtBefore(
                WorkspaceStatus.ACTIVE, Instant.now());

        for (Workspace workspace : expired) {
            workspace.setStatus(WorkspaceStatus.EXPIRED);
            workspaceRepository.save(workspace);
            workspaceService.broadcastClose(workspace.getId());
            log.info("Expired workspace {}", workspace.getId());
        }
    }
}
