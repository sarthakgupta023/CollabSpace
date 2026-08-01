import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, getStoredUser } from '../api/client.js';

export default function Home() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const stored = getStoredUser();

  useEffect(() => {
    if (!stored.userId) {
      navigate('/login');
    } else {
      setUsername(stored.username);
    }
  }, [navigate, stored.userId, stored.username]);

  return (
    <div style={styles.container}>
      {/* Background ambient glow orbs to produce the glass blur effect */}
      <div style={styles.glowOrange} />
      <div style={styles.glowYellow} />

      {/* Main Glassmorphic Card */}
      <div style={styles.glassCard}>
        <div style={styles.badge}>Collaborative Workspace</div>
        <h1 style={styles.title}>CollabSpace</h1>
        {username && (
          <p style={styles.subtitle}>
            Signed in as <span style={styles.username}>{username}</span>
          </p>
        )}

        {/* 3 Glass Buttons */}
        <div style={styles.actions}>
          <button style={styles.btnCreate} onClick={() => navigate('/create')}>
            <span style={styles.btnIcon}>✨</span>
            <div style={styles.btnContent}>
              <span style={styles.btnTitle}>Create a Workspace</span>
              <span style={styles.btnSub}>Start a new collaborative document</span>
            </div>
            <span style={styles.arrow}>→</span>
          </button>

          <button style={styles.btnJoin} onClick={() => navigate('/join')}>
            <span style={styles.btnIcon}>🔗</span>
            <div style={styles.btnContent}>
              <span style={styles.btnTitle}>Join a Workspace</span>
              <span style={styles.btnSub}>Connect using an invite link or ID</span>
            </div>
            <span style={styles.arrow}>→</span>
          </button>

          <button style={styles.btnHistory} onClick={() => navigate('/history')}>
            <span style={styles.btnIcon}>📜</span>
            <div style={styles.btnContent}>
              <span style={styles.btnTitle}>View Session History</span>
              <span style={styles.btnSub}>Check your past workspace activity</span>
            </div>
            <span style={styles.arrow}>→</span>
          </button>
        </div>
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
    backgroundColor: '#FAF5ED', // Warm base background
    backgroundImage: 'url("/mainbg.png")',
    fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
    padding: '20px',
    boxSizing: 'border-box',
    overflow: 'hidden',
  },

  // Glowing ambient backdrops for the frosted glass effect
  glowOrange: {
    position: 'absolute',
    top: '20%',
    left: '25%',
    width: 320,
    height: 320,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255, 159, 104, 0.45) 0%, rgba(255, 159, 104, 0) 70%)',
    filter: 'blur(50px)',
    pointerEvents: 'none',
  },
  glowYellow: {
    position: 'absolute',
    bottom: '20%',
    right: '25%',
    width: 360,
    height: 360,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255, 227, 168, 0.65) 0%, rgba(255, 227, 168, 0) 70%)',
    filter: 'blur(60px)',
    pointerEvents: 'none',
  },

  // Glass Card Container
  glassCard: {
    position: 'relative',
    width: '100%',
    maxWidth: 460,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    padding: '44px 36px',
    borderRadius: 28,
    border: '1px solid rgba(255, 255, 255, 0.8)',
    boxShadow: '0 20px 50px rgba(217, 119, 54, 0.1), inset 0 1px 2px rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    zIndex: 1,
  },

  badge: {
    display: 'inline-block',
    padding: '6px 14px',
    backgroundColor: 'rgba(255, 240, 224, 0.7)',
    border: '1px solid rgba(255, 159, 104, 0.3)',
    color: '#D97736',
    fontSize: 12,
    fontWeight: 700,
    borderRadius: 20,
    marginBottom: 16,
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
  title: {
    margin: '0 0 6px 0',
    color: '#3D342F',
    fontSize: 32,
    fontWeight: 800,
    letterSpacing: '-0.5px',
  },
  subtitle: {
    color: '#8C7A6B',
    fontSize: 14,
    marginTop: 0,
    marginBottom: 28,
  },
  username: {
    color: '#D97736',
    fontWeight: 700,
  },

  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },

  // Base shared styles for the 3 Glass Buttons
  btnContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    flex: 1,
  },
  btnTitle: {
    fontSize: 15,
    fontWeight: 700,
    lineHeight: '1.2',
  },
  btnSub: {
    fontSize: 12,
    opacity: 0.75,
    marginTop: 3,
    fontWeight: 500,
  },
  btnIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  arrow: {
    fontSize: 16,
    opacity: 0.6,
    transition: 'transform 0.2s ease',
  },

  // Button 1: Warm Pastel Orange Glass
  btnCreate: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px 20px',
    borderRadius: 16,
    border: '1px solid rgba(255, 159, 104, 0.4)',
    backgroundColor: 'rgba(255, 159, 104, 0.25)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    color: '#6E3411',
    cursor: 'pointer',
    textAlign: 'left',
    boxShadow: '0 4px 16px rgba(255, 159, 104, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.6)',
    transition: 'all 0.2s ease',
  },

  // Button 2: Soft Pastel Yellow Glass
  btnJoin: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px 20px',
    borderRadius: 16,
    border: '1px solid rgba(255, 227, 168, 0.6)',
    backgroundColor: 'rgba(255, 238, 194, 0.35)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    color: '#61431A',
    cursor: 'pointer',
    textAlign: 'left',
    boxShadow: '0 4px 16px rgba(255, 227, 168, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.8)',
    transition: 'all 0.2s ease',
  },

  // Button 3: Neutral Frosted Glass
  btnHistory: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px 20px',
    borderRadius: 16,
    border: '1px solid rgba(255, 255, 255, 0.8)',
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    color: '#524339',
    cursor: 'pointer',
    textAlign: 'left',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03), inset 0 1px 1px rgba(255, 255, 255, 0.9)',
    transition: 'all 0.2s ease',
  },
};