package com.example.collab.history;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface SessionHistoryRepository extends MongoRepository<SessionHistory, String> {
    List<SessionHistory> findByUserIdOrderByJoinedAtDesc(String userId);

    // used to find the still-open session to stamp with leftAt on disconnect
    Optional<SessionHistory> findFirstByUserIdAndWorkspaceIdAndLeftAtIsNull(String userId, String workspaceId);
}
