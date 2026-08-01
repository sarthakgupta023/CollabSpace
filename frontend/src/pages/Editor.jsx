import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
      <div style={styles.container}>
        <div style={styles.glowOrange} />
        <div style={styles.glowYellow} />
        <div style={{ ...styles.glassCard, textAlign: 'center', maxWidth: 460 }}>
          <h2 style={{ ...styles.title, color: '#C04328' }}>
            Workspace {closedReason === 'expired_or_ended' ? 'Ended' : closedReason}
          </h2>
          <p style={styles.subtext}>The 3-hour session limit was reached, or the owner ended it.</p>
          <button style={styles.primaryButton} onClick={() => navigate('/')}>Back to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Ambient background glow orbs */}
      <div style={styles.glowOrange} />
      <div style={styles.glowYellow} />

      <div style={styles.editorWrapper}>
        {/* Glass Header Bar */}
        <header style={styles.header}>
          <div style={styles.metaGroup}>
            <span style={styles.workspaceLabel}>Workspace</span>
            <span style={connected ? styles.statusConnected : styles.statusConnecting}>
              {connected ? '● Connected' : '○ Connecting…'}
            </span>
            <span style={styles.roleBadge}>{role}</span>
          </div>

          <div style={styles.headerActions}>
            <button style={styles.secondaryButton} onClick={handleCopyLink}>
              {copied ? '✓ Copied!' : 'Share link'}
            </button>
            {isOwner && (
              <button style={styles.dangerButton} onClick={handleEnd}>
                End workspace
              </button>
            )}
          </div>
        </header>

        {/* Glass Text Area */}
        <textarea
          style={styles.textarea}
          value={text}
          onChange={handleChange}
          readOnly={!canEdit}
          placeholder={canEdit ? 'Start typing your collaborative notes here…' : 'You have view-only access'}
        />
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: 'relative',
    minHeight: '100vh',
    backgroundColor: '#FAF5ED',
    backgroundImage: 'url("/mainbg.png")',
    fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
    padding: '24px 20px',
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  glowOrange: {
    position: 'absolute',
    top: '10%',
    left: '25%',
    width: 450,
    height: 450,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255, 159, 104, 0.35) 0%, rgba(255, 159, 104, 0) 70%)',
    filter: 'blur(70px)',
    pointerEvents: 'none',
  },
  glowYellow: {
    position: 'absolute',
    bottom: '10%',
    right: '25%',
    width: 500,
    height: 500,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255, 227, 168, 0.5) 0%, rgba(255, 227, 168, 0) 70%)',
    filter: 'blur(80px)',
    pointerEvents: 'none',
  },
  editorWrapper: {
    position: 'relative',
    width: '100%',
    maxWidth: 900,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    zIndex: 1,
  },
  glassCard: {
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    padding: '36px',
    borderRadius: 28,
    border: '1px solid rgba(255, 255, 255, 0.8)',
    boxShadow: '0 20px 50px rgba(217, 119, 54, 0.1)',
    margin: 'auto',
    zIndex: 1,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    padding: '14px 20px',
    borderRadius: 20,
    border: '1px solid rgba(255, 255, 255, 0.8)',
    boxShadow: '0 8px 24px rgba(217, 119, 54, 0.05)',
    flexWrap: 'wrap',
    gap: 12,
  },
  metaGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  workspaceLabel: {
    fontWeight: 800,
    color: '#3D342F',
    fontSize: 16,
  },
  statusConnected: {
    fontSize: 12,
    color: '#1B7065',
    backgroundColor: 'rgba(232, 246, 244, 0.8)',
    border: '1px solid rgba(42, 157, 143, 0.3)',
    padding: '4px 10px',
    borderRadius: 12,
    fontWeight: 700,
  },
  statusConnecting: {
    fontSize: 12,
    color: '#D97736',
    backgroundColor: 'rgba(255, 240, 224, 0.8)',
    border: '1px solid rgba(255, 159, 104, 0.3)',
    padding: '4px 10px',
    borderRadius: 12,
    fontWeight: 700,
  },
  roleBadge: {
    fontSize: 11,
    fontWeight: 800,
    color: '#7A5230',
    backgroundColor: 'rgba(255, 243, 209, 0.8)',
    border: '1px solid rgba(255, 227, 168, 0.6)',
    padding: '4px 10px',
    borderRadius: 12,
    textTransform: 'uppercase',
  },
  headerActions: {
    display: 'flex',
    gap: 10,
  },
  secondaryButton: {
    padding: '8px 16px',
    fontSize: 13,
    fontWeight: 700,
    color: '#7A5230',
    backgroundColor: 'rgba(255, 238, 194, 0.5)',
    border: '1px solid rgba(255, 227, 168, 0.8)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderRadius: 12,
    cursor: 'pointer',
  },
  dangerButton: {
    padding: '8px 16px',
    fontSize: 13,
    fontWeight: 700,
    color: '#C04328',
    backgroundColor: 'rgba(255, 235, 230, 0.6)',
    border: '1px solid rgba(231, 111, 81, 0.3)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderRadius: 12,
    cursor: 'pointer',
  },
  primaryButton: {
    padding: '14px 22px',
    fontSize: 15,
    fontWeight: 700,
    color: '#FFFFFF',
    backgroundColor: 'rgba(255, 159, 104, 0.9)',
    border: '1px solid rgba(255, 255, 255, 0.6)',
    borderRadius: 14,
    cursor: 'pointer',
    marginTop: 16,
  },
  textarea: {
    width: '100%',
    height: 'calc(100vh - 160px)',
    minHeight: 500,
    fontSize: 16,
    lineHeight: '1.6',
    padding: 28,
    boxSizing: 'border-box',
    borderRadius: 24,
    border: '1px solid rgba(255, 255, 255, 0.8)',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    color: '#3D342F',
    outline: 'none',
    resize: 'none',
    boxShadow: '0 20px 50px rgba(217, 119, 54, 0.06), inset 0 1px 2px rgba(255, 255, 255, 0.9)',
    fontFamily: 'inherit',
  },
  title: {
    margin: '0 0 12px 0',
    fontSize: 24,
    fontWeight: 800,
  },
  subtext: {
    color: '#8C7A6B',
    fontSize: 14,
  },
};