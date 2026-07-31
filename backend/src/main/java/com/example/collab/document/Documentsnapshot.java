package com.example.collab.document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * One document per workspace. `updates` is an ordered list of raw Yjs
 * update payloads - reconstructing the document is just:
 * for (update in updates) Y.applyUpdate(ydoc, update)
 * No server-side merging or Yjs-awareness needed.
 */
@Document(collection = "document_snapshots")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DocumentSnapshot {

    @Id
    private String workspaceId;

    private List<byte[]> updates = new ArrayList<>();

    private Instant updatedAt;

    public DocumentSnapshot(String workspaceId) {
        this.workspaceId = workspaceId;
        this.updatedAt = Instant.now();
    }
}