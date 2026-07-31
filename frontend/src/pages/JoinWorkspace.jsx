import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';

// Accepts either a full link (https://app.com/w/{id}) or a bare workspace id.
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
      // Common case: 410 Gone means the workspace expired or was ended.
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <h2>Join an existing workspace</h2>
      <form onSubmit={handleJoin} style={styles.form}>
        <input
          style={styles.input}
          placeholder="Paste the workspace link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          autoFocus
        />
        <input
          style={styles.input}
          placeholder="Your name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
        <button style={styles.button} disabled={loading} type="submit">
          {loading ? 'Joining…' : 'Join workspace'}
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
