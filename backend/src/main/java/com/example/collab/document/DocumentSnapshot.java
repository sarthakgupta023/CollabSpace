package com.example.collab.document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/**
 * One document per workspace. `updates` is an ordered list of raw Yjs
 * update payloads - reconstructing the document is just:
 *   for (update in updates) Y.applyUpdate(ydoc, update)
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
