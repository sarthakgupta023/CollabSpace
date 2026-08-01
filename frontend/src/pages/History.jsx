import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';

export default function History() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.history()
      .then(setSessions)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={styles.container}>
      {/* Background ambient glow orbs */}
      <div style={styles.glowOrange} />
      <div style={styles.glowYellow} />

      {/* Frosted Glass Card */}
      <div style={styles.glassCard}>
        <button style={styles.back} onClick={() => navigate('/')}>
          ← Back to Home
        </button>
        <h2 style={styles.title}>My session history</h2>

        {loading && <p style={styles.infoText}>Loading history…</p>}
        {error && <p style={styles.error}>{error}</p>}

        {!loading && !error && sessions.length === 0 && (
          <div style={styles.emptyState}>
            <p style={styles.infoText}>No active or past sessions found.</p>
          </div>
        )}

        <ul style={styles.list}>
          {sessions.map((s) => (
            <li key={s.id} style={styles.item}>
              <div style={styles.row}>
                <span style={styles.label}>Owner</span>
                <span style={styles.value}>{s.ownerName}</span>
              </div>
              <div style={styles.row}>
                <span style={styles.label}>Joined</span>
                <span style={styles.value}>{new Date(s.joinedAt).toLocaleString()}</span>
              </div>
              <div style={styles.row}>
                <span style={styles.label}>Status / Left</span>
                <span style={s.leftAt ? styles.value : styles.activeBadge}>
                  {s.leftAt ? new Date(s.leftAt).toLocaleString() : 'Still active'}
                </span>
              </div>
            </li>
          ))}
        </ul>
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
    padding: '40px 20px',
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  glowOrange: {
    position: 'absolute',
    top: '15%',
    left: '20%',
    width: 380,
    height: 380,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255, 159, 104, 0.4) 0%, rgba(255, 159, 104, 0) 70%)',
    filter: 'blur(60px)',
    pointerEvents: 'none',
  },
  glowYellow: {
    position: 'absolute',
    bottom: '15%',
    right: '20%',
    width: 400,
    height: 400,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255, 227, 168, 0.6) 0%, rgba(255, 227, 168, 0) 70%)',
    filter: 'blur(70px)',
    pointerEvents: 'none',
  },
  glassCard: {
    position: 'relative',
    width: '100%',
    maxWidth: 580,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    padding: '36px',
    borderRadius: 28,
    border: '1px solid rgba(255, 255, 255, 0.8)',
    boxShadow: '0 20px 50px rgba(217, 119, 54, 0.1), inset 0 1px 2px rgba(255, 255, 255, 0.9)',
    alignSelf: 'flex-start',
    zIndex: 1,
  },
  back: {
    display: 'inline-block',
    background: 'rgba(255, 238, 194, 0.5)',
    border: '1px solid rgba(255, 227, 168, 0.8)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    color: '#7A5230',
    padding: '8px 16px',
    borderRadius: 20,
    cursor: 'pointer',
    marginBottom: 20,
    fontSize: 13,
    fontWeight: 600,
  },
  title: {
    margin: '0 0 24px 0',
    color: '#3D342F',
    fontSize: 26,
    fontWeight: 800,
    letterSpacing: '-0.5px',
  },
  infoText: {
    color: '#8C7A6B',
    fontSize: 14,
    textAlign: 'center',
    margin: '24px 0',
  },
  emptyState: {
    padding: '32px 16px',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 18,
    border: '1px dashed rgba(255, 159, 104, 0.4)',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  item: {
    padding: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    border: '1px solid rgba(255, 227, 168, 0.6)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderRadius: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 14,
  },
  label: {
    color: '#8C7A6B',
  },
  value: {
    color: '#3D342F',
    fontWeight: 600,
  },
  activeBadge: {
    color: '#D97736',
    backgroundColor: 'rgba(255, 240, 224, 0.8)',
    border: '1px solid rgba(255, 159, 104, 0.3)',
    padding: '3px 12px',
    borderRadius: 12,
    fontWeight: 700,
    fontSize: 12,
  },
  error: {
    color: '#C04328',
    backgroundColor: 'rgba(255, 235, 230, 0.7)',
    border: '1px solid rgba(231, 111, 81, 0.3)',
    padding: 12,
    borderRadius: 12,
    fontSize: 14,
  },
};