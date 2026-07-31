import { useNavigate } from 'react-router-dom';
import { getStoredUser } from '../api/client.js';
import { useEffect, useState } from 'react';
import { api } from '../api/client.js';

export default function Home() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const stored = getStoredUser();

  useEffect(() => {
    // TODO: replace with a real login screen once auth is added.
    // For now, first visit prompts for a name and "signs up" silently.
    if (!stored.userId) {
      const name = window.prompt('Enter your name to continue:');
      if (name) {
        api.signup(name).then((res) => {
          localStorage.setItem('userId', res.userId);
          localStorage.setItem('username', res.username);
          setUsername(res.username);
        });
      }
    } else {
      setUsername(stored.username);
    }
  }, []);

  return (
    <div style={styles.page}>
      <h1>Collab Editor</h1>
      {username && <p>Signed in as {username}</p>}

      <div style={styles.actions}>
        <button style={styles.button} onClick={() => navigate('/create')}>
          Create a new workspace
        </button>
        <button style={styles.button} onClick={() => navigate('/join')}>
          Join an existing workspace
        </button>
      </div>

      <button style={styles.link} onClick={() => navigate('/history')}>
        View my session history
      </button>
    </div>
  );
}

const styles = {
  page: { maxWidth: 480, margin: '80px auto', textAlign: 'center', fontFamily: 'sans-serif' },
  actions: { display: 'flex', flexDirection: 'column', gap: 12, marginTop: 32 },
  button: { padding: '12px 20px', fontSize: 16, cursor: 'pointer' },
  link: { marginTop: 24, background: 'none', border: 'none', color: '#3B6D11', cursor: 'pointer' },
};
