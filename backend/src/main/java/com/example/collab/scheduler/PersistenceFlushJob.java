package com.example.collab.scheduler;

import com.example.collab.document.DocumentSnapshot;
import com.example.collab.document.DocumentSnapshotRepository;
import com.example.collab.document.UpdateBufferService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;
import java.util.Set;

/**
 * Flushes whatever this instance has buffered since the last run into
 * MongoDB. Debouncing writes like this (instead of writing on every
 * keystroke) is what keeps autosave cheap under load - see
 * workspace.persistence-flush-interval-ms in application.yml.
 */
@Component
public class PersistenceFlushJob {

    private final UpdateBufferService bufferService;
    private final DocumentSnapshotRepository snapshotRepository;

    public PersistenceFlushJob(UpdateBufferService bufferService, DocumentSnapshotRepository snapshotRepository) {
        this.bufferService = bufferService;
        this.snapshotRepository = snapshotRepository;
    }

    @Scheduled(fixedRateString = "${workspace.persistence-flush-interval-ms}")
    public void flush() {
        Set<String> workspaceIds = Set.copyOf(bufferService.workspacesWithPendingUpdates());

        for (String workspaceId : workspaceIds) {
            List<byte[]> pending = bufferService.drain(workspaceId);
            if (pending.isEmpty()) continue;

            DocumentSnapshot snapshot = snapshotRepository.findById(workspaceId)
                    .orElseGet(() -> new DocumentSnapshot(workspaceId));

            snapshot.getUpdates().addAll(pending);
            snapshot.setUpdatedAt(Instant.now());
            snapshotRepository.save(snapshot);
        }
    }
}
