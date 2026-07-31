package com.example.collab.workspace;

import java.time.Instant;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import static com.example.collab.config.RedisConfig.CHANNEL_NAME;
import com.example.collab.websocket.WorkspaceUpdateEnvelope;

import tools.jackson.databind.ObjectMapper;

@Service
public class WorkspaceService {

    private final WorkspaceRepository workspaceRepository;
    private final WorkspaceMemberRepository memberRepository;
    private final RedisTemplate<String, String> redisTemplate;
    private final ObjectMapper objectMapper;

    @Value("${workspace.expiry-hours}")
    private long expiryHours;

    public WorkspaceService(WorkspaceRepository workspaceRepository,
            WorkspaceMemberRepository memberRepository,
            RedisTemplate<String, String> redisTemplate,
            ObjectMapper objectMapper) {
        this.workspaceRepository = workspaceRepository;
        this.memberRepository = memberRepository;
        this.redisTemplate = redisTemplate;
        this.objectMapper = objectMapper;
    }

    public Workspace createWorkspace(String ownerUserId, String ownerName) {
        Workspace workspace = Workspace.create(ownerUserId, ownerName, expiryHours);
        workspaceRepository.save(workspace);

        WorkspaceMember owner = WorkspaceMember.create(workspace.getId(), ownerUserId, ownerName, Role.OWNER);
        memberRepository.save(owner);

        return workspace;
    }

    public WorkspaceMember join(String workspaceId, String userId, String displayName) {
        Workspace workspace = getActiveOrThrow(workspaceId);

        return memberRepository.findByWorkspaceIdAndUserId(workspaceId, userId)
                .orElseGet(() -> {
                    // default role is VIEWER - the owner can promote to EDITOR from inside the
                    // workspace.
                    // TODO: honor an optional ?role=editor invite link here if you add that
                    // feature.
                    WorkspaceMember member = WorkspaceMember.create(workspaceId, userId, displayName, Role.VIEWER);
                    return memberRepository.save(member);
                });
    }

    public Workspace getActiveOrThrow(String workspaceId) {
        Workspace workspace = getOrThrow(workspaceId);
        if (workspace.getStatus() != WorkspaceStatus.ACTIVE || workspace.getExpiresAt().isBefore(Instant.now())) {
            throw new ResponseStatusException(HttpStatus.GONE, "Workspace has expired or ended");
        }
        return workspace;
    }

    /**
     * Use this where an expired/ended workspace is a valid, non-error state to
     * report (e.g. a status check).
     */
    public Workspace getOrThrow(String workspaceId) {
        return workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Workspace not found"));
    }

    /**
     * Owner-only. Ends the workspace and force-closes every connected client across
     * all instances.
     */
    public void end(String workspaceId, String requestingUserId) {
        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Workspace not found"));

        if (!workspace.getOwnerUserId().equals(requestingUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only the owner can end a workspace");
        }

        workspace.setStatus(WorkspaceStatus.ENDED);
        workspaceRepository.save(workspace);
        broadcastClose(workspaceId);
    }

    public void broadcastClose(String workspaceId) {
        WorkspaceUpdateEnvelope envelope = WorkspaceUpdateEnvelope.close(workspaceId);
        try {
            redisTemplate.convertAndSend(CHANNEL_NAME, objectMapper.writeValueAsString(envelope));
        } catch (Exception e) {
            throw new RuntimeException("Failed to broadcast workspace close", e);
        }
    }
}