package com.example.collab.document;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

import org.springframework.stereotype.Service;

/**
 * Updates that arrived on THIS instance since the last flush. Each instance
 * flushes only what it personally received - that's fine, MongoDB just
 * accumulates an ordered log of updates per workspace regardless of which
 * instance appended them (Yjs updates are commutative, order doesn't matter
 * for correctness).
 */
@Service
public class UpdateBufferService {

    private final Map<String, List<byte[]>> pending = new ConcurrentHashMap<>();

    public void buffer(String workspaceId, byte[] update) {
        pending.computeIfAbsent(workspaceId, id -> new CopyOnWriteArrayList<>()).add(update);
    }

    /**
     * Atomically takes and clears everything buffered for a workspace. Empty if
     * nothing pending.
     */
    public List<byte[]> drain(String workspaceId) {
        List<byte[]> updates = pending.remove(workspaceId);
        return updates == null ? List.of() : updates;
    }

    public java.util.Set<String> workspacesWithPendingUpdates() {
        return pending.keySet();
    }
}