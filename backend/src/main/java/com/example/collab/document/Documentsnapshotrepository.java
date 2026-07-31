package com.example.collab.document;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface DocumentSnapshotRepository extends MongoRepository<DocumentSnapshot, String> {
}