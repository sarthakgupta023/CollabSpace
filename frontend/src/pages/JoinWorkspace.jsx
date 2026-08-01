import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';

function extractWorkspaceId(input) {
  const trimmed = input.trim();
  const match = trimmed.match(/\/w\/([^/?#]+)/);
  return match ? match[1] : trimmed;
}

export default function JoinWorkspace() {
  const [link, setLink] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleJoin(e) {
    e.preventDefault();
    if (!link.trim() || !displayName.trim()) return;
    setLoading(true);
    setError('');
    try {
      const workspaceId = extractWorkspaceId(link);
      const workspace = await api.joinWorkspace(workspaceId, displayName.trim());
      sessionStorage.setItem(`role:${workspaceId}`, workspace.role);
      sessionStorage.setItem(`displayName:${workspaceId}`, displayName.trim());
      navigate(`/w/${workspaceId}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      {/* Ambient background glow orbs */}
      <div style={styles.glowOrange} />
      <div style={styles.glowYellow} />

      {/* Frosted Glass Card */}
      <div style={styles.glassCard}>
        <button style={styles.back} onClick={() => navigate('/')}>
          ← Cancel
        </button>

        <h2 style={styles.title}>Join a workspace</h2>
        <p style={styles.subtitle}>Paste the invite link or workspace ID to enter.</p>

        <form onSubmit={handleJoin} style={styles.form}>
          <input
            style={styles.input}
            placeholder="Workspace link or ID"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            autoFocus
          />
          <input
            style={styles.input}
            placeholder="Your display name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <button style={styles.button} disabled={loading} type="submit">
            {loading ? 'Joining session…' : 'Join workspace →'}
          </button>
        </form>

        {error && <p style={styles.error}>{error}</p>}
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAF5ED',
    backgroundImage: 'url("/mainbg.png")',
    fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
    padding: '20px',
    boxSizing: 'border-box',
    overflow: 'hidden',
  },
  glowOrange: {
    position: 'absolute',
    top: '25%',
    left: '30%',
    width: 320,
    height: 320,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255, 159, 104, 0.45) 0%, rgba(255, 159, 104, 0) 70%)',
    filter: 'blur(50px)',
    pointerEvents: 'none',
  },
  glowYellow: {
    position: 'absolute',
    bottom: '25%',
    right: '30%',
    width: 360,
    height: 360,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255, 227, 168, 0.65) 0%, rgba(255, 227, 168, 0) 70%)',
    filter: 'blur(60px)',
    pointerEvents: 'none',
  },
  glassCard: {
    position: 'relative',
    width: '100%',
    maxWidth: 420,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    padding: '40px 32px',
    borderRadius: 28,
    border: '1px solid rgba(255, 255, 255, 0.8)',
    boxShadow: '0 20px 50px rgba(217, 119, 54, 0.1), inset 0 1px 2px rgba(255, 255, 255, 0.9)',
    zIndex: 1,
  },
  back: {
    display: 'inline-block',
    background: 'rgba(255, 255, 255, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    color: '#C86D3B',
    padding: '6px 14px',
    borderRadius: 20,
    cursor: 'pointer',
    marginBottom: 20,
    fontSize: 13,
    fontWeight: 600,
  },
  title: {
    margin: '0 0 6px 0',
    color: '#3D342F',
    fontSize: 26,
    fontWeight: 800,
    letterSpacing: '-0.5px',
  },
  subtitle: {
    margin: '0 0 24px 0',
    color: '#8C7A6B',
    fontSize: 14,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  input: {
    padding: '14px 18px',
    fontSize: 15,
    borderRadius: 14,
    border: '1.5px solid rgba(255, 159, 104, 0.35)',
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    color: '#3D342F',
    outline: 'none',
    boxSizing: 'border-box',
    boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.02)',
    fontFamily: 'inherit',
  },
  button: {
    padding: '16px 20px',
    fontSize: 15,
    fontWeight: 700,
    color: '#FFFFFF',
    backgroundColor: 'rgba(255, 159, 104, 0.9)',
    border: '1px solid rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderRadius: 14,
    cursor: 'pointer',
    boxShadow: '0 6px 20px rgba(255, 159, 104, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.5)',
    marginTop: 6,
  },
  error: {
    color: '#C04328',
    backgroundColor: 'rgba(255, 235, 230, 0.7)',
    border: '1px solid rgba(231, 111, 81, 0.3)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    padding: '12px 16px',
    borderRadius: 12,
    fontSize: 13,
    marginTop: 18,
    marginBottom: 0,
    fontWeight: 500,
  },
};