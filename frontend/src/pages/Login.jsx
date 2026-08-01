import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';

export default function Login() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.requestOtp(name, email);
      alert(`Your OTP is: ${res.otp}\n\nFor security purposes, the OTP is not sent to your email.`);
      setStep(2);
    } catch (err) {
      setError(err.message || 'Failed to request OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.verifyOtp(email, otp);
      
      localStorage.setItem('userId', res.userId);
      localStorage.setItem('username', res.username);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Dim overlay for better text readability */}
      <div style={styles.overlay} />

      <div style={styles.contentWrapper}>
        <div style={styles.leftPanel}>
          <h1 style={styles.heroTitle}>CollabSpace</h1>
          <h2 style={styles.heroSubtitle}>Teamwork like a pro</h2>
        </div>

        <div style={styles.rightPanel}>
          <div style={styles.glassCard}>
            <h2 style={styles.cardTitle}>{step === 1 ? 'Welcome' : 'Enter OTP'}</h2>
            <p style={styles.cardSubtitle}>
              {step === 1
                ? 'Sign in or create an account to continue'
                : `We've generated an OTP for ${email}`}
            </p>

            {error && <div style={styles.errorBox}>{error}</div>}

            {step === 1 ? (
              <form onSubmit={handleRequestOtp} style={styles.form}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Name</label>
                  <input
                    type="text"
                    required
                    style={styles.input}
                    value={name}
                    onChange={(e) => setName(e.target.value)}

                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Email</label>
                  <input
                    type="email"
                    required
                    style={styles.input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}

                  />
                </div>
                <button type="submit" style={styles.button} disabled={loading}>
                  {loading ? 'Sending...' : 'Request OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} style={styles.form}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>OTP</label>
                  <input
                    type="text"
                    required
                    style={{ ...styles.input, textAlign: 'center', letterSpacing: '8px', fontSize: '24px' }}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="000000"
                    maxLength={6}
                  />
                </div>
                <button type="submit" style={styles.button} disabled={loading}>
                  {loading ? 'Verifying...' : 'Verify & Login'}
                </button>
                <button
                  type="button"
                  style={styles.textButton}
                  onClick={() => setStep(1)}
                  disabled={loading}
                >
                  Back
                </button>
              </form>
            )}
          </div>
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
    backgroundImage: 'url("/mainbg.png")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
    overflow: 'hidden',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // slight dim to make the crystal pop but keep text legible
    backdropFilter: 'blur(3px)',
    zIndex: 1,
  },
  contentWrapper: {
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    maxWidth: '1000px',
    padding: '40px',
    gap: '60px',
    alignItems: 'center',
  },
  leftPanel: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '20px',
  },
  heroTitle: {
    fontSize: '64px',
    fontWeight: 800,
    color: '#ffffff',
    margin: '0 0 10px 0',
    textShadow: '0 4px 20px rgba(0,0,0,0.3)',
    letterSpacing: '-1px',
  },
  heroSubtitle: {
    fontSize: '32px',
    fontWeight: 300,
    color: 'rgba(255, 255, 255, 0.75)',
    margin: 0,
    textShadow: '0 2px 10px rgba(0,0,0,0.2)',
  },
  rightPanel: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  glassCard: {
    width: '100%',
    maxWidth: '400px',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(25px)',
    WebkitBackdropFilter: 'blur(25px)',
    padding: '40px',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    boxShadow: '0 30px 60px rgba(0, 0, 0, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.8)',
    display: 'flex',
    flexDirection: 'column',
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: '28px',
    fontWeight: 700,
    margin: '0 0 8px 0',
    textShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  cardSubtitle: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: '14px',
    margin: '0 0 24px 0',
  },
  errorBox: {
    backgroundColor: 'rgba(255, 80, 80, 0.2)',
    border: '1px solid rgba(255, 80, 80, 0.5)',
    color: '#ffcccc',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '14px',
    fontWeight: 500,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '12px',
    padding: '14px 16px',
    fontSize: '16px',
    color: '#ffffff',
    outline: 'none',
    transition: 'all 0.2s ease',
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    borderRadius: '12px',
    padding: '14px',
    fontSize: '16px',
    fontWeight: 600,
    color: '#ffffff',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  },
  textButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: 'rgba(255, 255, 255, 0.7)',
    cursor: 'pointer',
    fontSize: '14px',
    marginTop: '10px',
    textDecoration: 'underline',
  }
};
