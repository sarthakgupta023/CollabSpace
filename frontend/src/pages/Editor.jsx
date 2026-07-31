import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api, getStoredUser } from '../api/client.js';
import { useYjsConnection } from '../yjs/useYjsConnection.js';

const DOC_KEY = 'content';

export default function Editor() {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const { userId } = getStoredUser();

  const displayName = sessionStorage.getItem(`displayName:${workspaceId}`) || 'Anonymous';
  const role = sessionStorage.getItem(`role:${workspaceId}`) || 'VIEWER';
  const isOwner = role === 'OWNER';
  const canEdit = role === 'OWNER' || role === 'EDITOR';

  const [text, setText] = useState('');
  const [closedReason, setClosedReason] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleClosed = useCallback((reason) => setClosedReason(reason), []);
  const { ydoc, connected } = useYjsConnection(workspaceId, userId, displayName, role, handleClosed);

  // Bind the textarea to the shared Y.Text.
  useEffect(() => {
    const ytext = ydoc.getText(DOC_KEY);
    setText(ytext.toString());

    const observer = () => setText(ytext.toString());
    ytext.observe(observer);
    return () => ytext.unobserve(observer);
  }, [ydoc]);

  // NOTE: this is a deliberately simple binding for the scaffold - it replaces
  // the whole Y.Text on every keystroke, which works but causes cursor jumps
  // with multiple simultaneous typists and isn't bandwidth-efficient. Replace
  // this with a proper text-editor binding (e.g. y-codemirror.next, or
  // y-prosemirror if you want rich text) before shipping this for real.
  function handleChange(e) {
    if (!canEdit) return;
    const newValue = e.target.value;
    const ytext = ydoc.getText(DOC_KEY);
    ydoc.transact(() => {
      ytext.delete(0, ytext.length);
      ytext.insert(0, newValue);
    });
    setText(newValue);
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function handleEnd() {
    if (!window.confirm('End this workspace for everyone? This cannot be undone.')) return;
    await api.endWorkspace(workspaceId);
    navigate('/');
  }

  if (closedReason) {
    return (
      <div style={styles.page}>
        <h2>This workspace has {closedReason === 'expired_or_ended' ? 'ended' : closedReason}</h2>
        <p>The 3-hour session limit was reached, or the owner ended it.</p>
        {/* TODO: wire this to the real /export endpoint once PDF rendering is implemented */}
        <button style={styles.button} onClick={() => navigate('/')}>Back to home</button>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <strong>Workspace</strong> · {connected ? 'Connected' : 'Connecting…'} · Role: {role}
        </div>
        <div style={styles.headerActions}>
          <button style={styles.smallButton} onClick={handleCopyLink}>
            {copied ? 'Copied!' : 'Share link'}
          </button>
          {isOwner && (
            <button style={{ ...styles.smallButton, color: 'crimson' }} onClick={handleEnd}>
              End workspace
            </button>
          )}
        </div>
      </header>

      <textarea
        style={styles.textarea}
        value={text}
        onChange={handleChange}
        readOnly={!canEdit}
        placeholder={canEdit ? 'Start typing…' : 'You have view-only access'}
      />
    </div>
  );
}

const styles = {
  page: { maxWidth: 800, margin: '40px auto', fontFamily: 'sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  headerActions: { display: 'flex', gap: 8 },
  smallButton: { padding: '6px 12px', cursor: 'pointer' },
  button: { padding: '10px 16px', fontSize: 16, cursor: 'pointer' },
  textarea: { width: '100%', height: 500, fontSize: 16, padding: 16, boxSizing: 'border-box' },
};
