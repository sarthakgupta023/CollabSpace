package com.example.collab.history;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/history")
public class HistoryController {

    private final SessionHistoryRepository historyRepository;

    public HistoryController(SessionHistoryRepository historyRepository) {
        this.historyRepository = historyRepository;
    }

    @GetMapping
    public List<SessionHistory> myHistory(@RequestHeader("X-User-Id") String userId) {
        return historyRepository.findByUserIdOrderByJoinedAtDesc(userId);
    }
}
