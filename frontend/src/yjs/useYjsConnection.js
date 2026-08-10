import { useEffect, useRef, useState } from 'react';
import * as Y from 'yjs';
import { getWebSocketUrl } from '../api/client.js';

export function useYjsConnection(workspaceId, userId, displayName, role, onClosed) {
  const ydocRef = useRef();
  const [connected, setConnected] = useState(false);

  if (!ydocRef.current) {
    ydocRef.current = new Y.Doc();
  }

  useEffect(() => {
    if (!workspaceId || !userId) return;

    const ydoc = ydocRef.current;
    const params = new URLSearchParams({ userId, displayName: displayName || '', role: role || 'VIEWER' });
    const socket = new WebSocket(`${getWebSocketUrl(workspaceId)}?${params}`);
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