package com.example.collab.workspace;

public enum WorkspaceStatus {
    ACTIVE,
    EXPIRED, // hit the 3-hour TTL automatically
    ENDED // owner ended it manually
}
