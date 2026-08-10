package com.example.collab.history;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "session_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SessionHistory {

    @Id
    private String id;

    private String userId;
    private String workspaceId;
    private String ownerName; // denormalized so it survives the workspace row being deleted later

    private Instant joinedAt;
    private Instant leftAt; // null while the session is still active
}
