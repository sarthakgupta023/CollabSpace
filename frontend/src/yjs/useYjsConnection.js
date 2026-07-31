import { useEffect, useRef, useState } from 'react';
import * as Y from 'yjs';

/**
 * Connects a Y.Doc to the backend's binary WebSocket relay.
 *
 * Protocol (deliberately simple - see DocumentWebSocketHandler.java):
 *   - On connect, the server sends every stored update as its own binary
 *     frame, in order. We apply each with origin 'remote' as it arrives.
 *   - After that, any local edit fires the Y.Doc 'update' event; we send
 *     that update's bytes straight over the socket.
 *   - Any binary frame we receive after the initial replay is a peer's
 *     live edit - apply it the same way.
 *   - A text frame starting with "WORKSPACE_CLOSED:" means the workspace
 *     ended or expired; the caller gets notified via onClosed.
 */
export function useYjsConnection(workspaceId, userId, displayName, role, onClosed) {
  const ydocRef = useRef();
  const [connected, setConnected] = useState(false);

  if (!ydocRef.current) {
    ydocRef.current = new Y.Doc();
  }

  useEffect(() => {
    if (!workspaceId || !userId) return;

    const ydoc = ydocRef.current;
    const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const params = new URLSearchParams({ userId, displayName: displayName || '', role: role || 'VIEWER' });
    const socket = new WebSocket(`${wsProtocol}://${window.location.host}/ws/workspace/${workspaceId}?${params}`);
    socket.binaryType = 'arraybuffer';

    socket.onopen = () => setConnected(true);

    socket.onmessage = (event) => {
      if (typeof event.data === 'string') {
        if (event.data.startsWith('WORKSPACE_CLOSED:')) {
          onClosed?.(event.data.split(':')[1]);
        }
        return;
      }
      const update = new Uint8Array(event.data);
      Y.applyUpdate(ydoc, update, 'remote');
    };

    socket.onclose = () => setConnected(false);

    const onLocalUpdate = (update, origin) => {
      if (origin === 'remote') return; // don't echo back what we just received
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(update);
      }
    };
    ydoc.on('update', onLocalUpdate);

    return () => {
      ydoc.off('update', onLocalUpdate);
      socket.close();
    };
  }, [workspaceId, userId]);

  return { ydoc: ydocRef.current, connected };
}
