package com.example.collab.history;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface SessionHistoryRepository extends MongoRepository<SessionHistory, String> {
    List<SessionHistory> findByUserIdOrderByJoinedAtDesc(String userId);

    // used to find the still-open session to stamp with leftAt on disconnect
    Optional<SessionHistory> findFirstByUserIdAndWorkspaceIdAndLeftAtIsNull(String userId, String workspaceId);
}
