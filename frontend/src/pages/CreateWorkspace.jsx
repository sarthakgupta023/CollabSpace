import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';

export default function CreateWorkspace() {
  const [ownerName, setOwnerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleCreate(e) {
    e.preventDefault();
    if (!ownerName.trim()) return;
    setLoading(true);
    setError('');
    try {
      const workspace = await api.createWorkspace(ownerName.trim());
      // role is OWNER for whoever creates it - stash it so the editor page
      // can open the WebSocket with the right role without an extra round trip.
      sessionStorage.setItem(`role:${workspace.workspaceId}`, workspace.role);
      sessionStorage.setItem(`displayName:${workspace.workspaceId}`, ownerName.trim());
      navigate(`/w/${workspace.workspaceId}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <h2>Create a new workspace</h2>
      <form onSubmit={handleCreate} style={styles.form}>
        <input
          style={styles.input}
          placeholder="Your name"
          value={ownerName}
          onChange={(e) => setOwnerName(e.target.value)}
          autoFocus
        />
        <button style={styles.button} disabled={loading} type="submit">
          {loading ? 'Creating…' : 'Create workspace'}
        </button>
      </form>
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
}

const styles = {
  page: { maxWidth: 420, margin: '80px auto', fontFamily: 'sans-serif' },
  form: { display: 'flex', flexDirection: 'column', gap: 12 },
  input: { padding: 10, fontSize: 16 },
  button: { padding: '10px 16px', fontSize: 16, cursor: 'pointer' },
  error: { color: 'crimson', marginTop: 12 },
};
