package com.example.collab.export;

import com.example.collab.document.DocumentSnapshot;
import com.example.collab.document.DocumentSnapshotRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/**
 * TODO: this is a stub. To finish it:
 *   1. Reconstruct the document's plain text/HTML from the stored Yjs
 *      updates. Easiest path: do this on the CLIENT (it already has Yjs
 *      loaded) and POST the rendered HTML here instead of trying to decode
 *      Yjs binary updates in Java (there's no mature Yjs library for the JVM).
 *   2. Render that HTML to PDF - either call a headless Chromium instance
 *      (Playwright/Puppeteer, e.g. via a small Node sidecar) or use a pure-Java
 *      HTML-to-PDF library such as OpenHTMLtoPDF for simpler formatting needs.
 *   3. Upload the PDF bytes to S3/MinIO and return a signed URL instead of
 *      streaming bytes directly from this endpoint.
 *
 * Wiring it this way keeps the export path owner-gated and workspace-scoped,
 * which is the part that actually matters for correctness - the rendering
 * engine is a swappable implementation detail.
 */
@RestController
@RequestMapping("/api/workspaces")
public class ExportController {

    private final DocumentSnapshotRepository snapshotRepository;

    public ExportController(DocumentSnapshotRepository snapshotRepository) {
        this.snapshotRepository = snapshotRepository;
    }

    @GetMapping("/{workspaceId}/export")
    public String export(@PathVariable String workspaceId) {
        DocumentSnapshot snapshot = snapshotRepository.findById(workspaceId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No document found for this workspace"));

        throw new ResponseStatusException(HttpStatus.NOT_IMPLEMENTED,
                "PDF export not wired up yet - " + snapshot.getUpdates().size()
                        + " updates are stored and ready to render. See ExportController TODO.");
    }
}
