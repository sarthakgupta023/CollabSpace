# CollabSpace

> A production-ready, distributed, real-time collaborative document editor engineered for high concurrency, eventual consistency, and ephemeral document lifecycle management.

CollabSpace enables multiple users to co-edit rich text documents in real time without version conflicts or manual locking. Built on **CRDTs (Conflict-free Replicated Data Types)**, **WebSockets**, **Redis Pub/Sub**, and a multi-tiered persistence layer, CollabSpace guarantees smooth real-time collaboration with automatic document expiry, role-based security, and PDF exports.

---

## Objectives & Highlights

* **Real-Time Concurrent Editing:** Instant, multi-user document collaboration with zero lock contention using Yjs CRDTs.
* **Ephemeral Workspaces:** Instant workspace generation with short nanoid/UUID shareable links expiring automatically after 3 hours.
* **Horizontal Scalability:** Distributed WebSocket state synchronization using Redis Pub/Sub across multiple backend instances.
* **Smart Persistence:** Debounced in-memory binary buffering with periodic state compaction to PostgreSQL/MongoDB to prevent database write throttling.
* **Strict Server-Side RBAC:** Enforces Owner, Editor, and Viewer privileges directly at the WebSocket layer.
* **Dual-Layer Auto-Expiry:** Background workers for soft disconnection/read-only states and hard database cleanup jobs.
* **Export Engine:** Server-side document rendering to download formatted PDFs at any point before or after workspace expiration.

---

## System Architecture

```text
                               ┌───────────────────────────────────┐
                               │       Client Load Balancer        │
                               └─────────────────┬─────────────────┘
                                                 │ (Sticky Sessions Not Required)
                                ┌────────────────┴────────────────┐
                                ▼                                 ▼
                     ┌────────────────────┐            ┌────────────────────┐
                     │ Spring Boot Node 1 │            │ Spring Boot Node 2 │
                     └─────────┬──────────┘            └─────────┬──────────┘
                               │                                 │
                               │     Redis Pub/Sub Channel       │
                               │  ("workspace-updates" Fan-out)  │
                               ├─────────────────────────────────┤
                               │                                 │
                               ▼                                 ▼
                    ┌─────────────────────┐           ┌─────────────────────┐
                    │  Redis Instance /   │           │    PostgreSQL DB    │
                    │   Ephemeral Cache   │           │ (Workspaces & RBAC) │
                    └─────────────────────┘           └──────────┬──────────┘
                                                                 │
                                                      ┌──────────┴──────────┐
                                                      ▼                     ▼
                                           ┌────────────────────┐ ┌───────────────────┐
                                           │ MongoDB / Storage  │ │ PDF Export Engine │
                                           │ (Yjs Binary Blobs) │ │    (Puppeteer)    │
                                           └────────────────────┘ └───────────────────┘