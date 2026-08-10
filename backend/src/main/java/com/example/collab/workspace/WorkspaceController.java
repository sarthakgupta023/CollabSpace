package com.example.collab.workspace;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import static com.example.collab.workspace.WorkspaceDtos.*;

@RestController
@RequestMapping("/api/workspaces")
public class WorkspaceController {

    private final WorkspaceService workspaceService;

    @Value("${app.frontend-base-url}")
    private String frontendBaseUrl;

    public WorkspaceController(WorkspaceService workspaceService) {
        this.workspaceService = workspaceService;
    }

    // TODO: replace this header-based "auth" with a real Spring Security
    // JWT filter. For now, the frontend just sends whatever userId it got
    // back from /api/auth/signup.
    @PostMapping
    public WorkspaceResponse create(@RequestHeader("X-User-Id") String userId,
                                     @Valid @RequestBody CreateRequest request) {
        Workspace workspace = workspaceService.createWorkspace(userId, request.ownerName());
        return toResponse(workspace, "OWNER");
    }

    @PostMapping("/{workspaceId}/join")
    public WorkspaceResponse join(@PathVariable String workspaceId,
                                   @RequestHeader("X-User-Id") String userId,
                                   @Valid @RequestBody JoinRequest request) {
        WorkspaceMember member = workspaceService.join(workspaceId, userId, request.displayName());
        Workspace workspace = workspaceService.getActiveOrThrow(workspaceId);
        return toResponse(workspace, member.getRole().name());
    }

    @GetMapping("/{workspaceId}/status")
    public StatusResponse status(@PathVariable String workspaceId) {
        Workspace workspace = workspaceService.getOrThrow(workspaceId);
        return new StatusResponse(workspace.getStatus(), workspace.getExpiresAt());
    }

    @PostMapping("/{workspaceId}/end")
    public void end(@PathVariable String workspaceId, @RequestHeader("X-User-Id") String userId) {
        workspaceService.end(workspaceId, userId);
    }

    private WorkspaceResponse toResponse(Workspace workspace, String role) {
        return new WorkspaceResponse(
                workspace.getId(),
                frontendBaseUrl + "/w/" + workspace.getId(),
                role,
                workspace.getStatus(),
                workspace.getExpiresAt()
        );
    }
}
