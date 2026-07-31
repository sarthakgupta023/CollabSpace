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
    <div style={styles.page}>
      <button style={styles.back} onClick={() => navigate('/')}>← Back</button>
      <h2>My session history</h2>

      {loading && <p>Loading…</p>}
      {error && <p style={{ color: 'crimson' }}>{error}</p>}

      {!loading && !error && sessions.length === 0 && <p>No sessions yet.</p>}

      <ul style={styles.list}>
        {sessions.map((s) => (
          <li key={s.id} style={styles.item}>
            <div><strong>Owner:</strong> {s.ownerName}</div>
            <div><strong>Joined:</strong> {new Date(s.joinedAt).toLocaleString()}</div>
            <div><strong>Left:</strong> {s.leftAt ? new Date(s.leftAt).toLocaleString() : 'Still active'}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  page: { maxWidth: 600, margin: '60px auto', fontFamily: 'sans-serif' },
  back: { background: 'none', border: 'none', cursor: 'pointer', marginBottom: 16, fontSize: 14 },
  list: { listStyle: 'none', padding: 0 },
  item: { padding: 16, border: '1px solid #ddd', borderRadius: 8, marginBottom: 12 },
};
