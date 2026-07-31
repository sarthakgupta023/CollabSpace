package com.example.collab.history;

import java.time.Instant;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.collab.workspace.Workspace;

@Service
public class SessionHistoryService {

    private final SessionHistoryRepository historyRepository;
    private final WorkspaceRepository workspaceRepository;

    public SessionHistoryService(SessionHistoryRepository historyRepository,
            WorkspaceRepository workspaceRepository) {
        this.historyRepository = historyRepository;
        this.workspaceRepository = workspaceRepository;
    }

    public void recordJoin(String userId, String workspaceId) {
        String ownerName = workspaceRepository.findById(workspaceId)
                .map(Workspace::getOwnerDisplayName)
                .orElse("Unknown");

        SessionHistory record = new SessionHistory(
                UUID.randomUUID().toString(),
                userId,
                workspaceId,
                ownerName,
                Instant.now(),
                null);
        historyRepository.save(record);
    }

    public void recordLeave(String userId, String workspaceId) {
        historyRepository.findFirstByUserIdAndWorkspaceIdAndLeftAtIsNull(userId, workspaceId)
                .ifPresent(record -> {
                    record.setLeftAt(Instant.now());
                    historyRepository.save(record);
                });
    }
}