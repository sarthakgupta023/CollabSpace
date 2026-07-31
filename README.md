# CollabSpace

CollabSpace is a real-time collaborative document editor. It allows multiple people to edit the same document simultaneously without overwriting each other's work. 

Each workspace is temporary and automatically expires after 3 hours to optimize server storage and resources.

---

## What It Does

* **Real-time editing:** Multiple users can type in the same document at the same time.
* **Shareable links:** Generate a temporary workspace link and share it with anyone.
* **Role-based access:** Assign roles to users (Owner, Editor, or Viewer).
* **Automatic saving:** Document changes are continuously saved to the database in the background.
* **Auto-expiry:** Workspaces automatically close after 3 hours.
* **PDF export:** The document owner can download the finished document as a PDF file.
* **Scalable backend:** Built to handle multiple server nodes without losing real-time updates.

---

## How It Works

### 1. Creating a Workspace
When you click "New Workspace", the backend creates a record in the database with a 3-hour timer. It returns a unique link you can send to other users.

### 2. Live Collaboration
When you type, your browser sends small updates over a WebSocket connection using Yjs (a collaboration library). These updates merge automatically, so no text gets lost even if two people type at the exact same millisecond.

### 3. Syncing Across Multiple Servers
If User A connects to Server 1 and User B connects to Server 2, Redis bridges the gap. Server 1 sends edits to Redis, and Redis relays them to Server 2 instantly.

### 4. Background Auto-Saving
To prevent hitting the database on every single keystroke, the backend buffers changes in memory and flushes a snapshot to the database every few seconds.

### 5. Access Control
The server enforces user permissions directly:
* **Owner:** Full control over the document, roles, and PDF export.
* **Editor:** Can read and edit the document.
* **Viewer:** Can read the document. The server automatically blocks any edit messages sent by a Viewer.

### 6. Workspace Expiry
A background worker runs continuously to check workspace timers. Once a workspace passes the 3-hour mark, the server closes active connections and sets the document to read-only. Old data is later deleted to free up database storage.

### 7. Exporting to PDF
When requested, the backend converts the saved document state into a clean PDF format and provides a direct download link.

---

## Tech Stack

### Backend
* **Language & Framework:** Java 17, Spring Boot 3
* **Relational Database:** PostgreSQL (stores users, workspaces, and permissions)
* **Document Database:** MongoDB (stores document text and history snapshots)
* **Message Broker:** Redis (handles real-time communication between servers)

### Frontend
* **Framework:** React + TypeScript + Vite
* **Text Editor:** Tiptap Editor
* **Collaboration Engine:** Yjs + `y-websocket`

