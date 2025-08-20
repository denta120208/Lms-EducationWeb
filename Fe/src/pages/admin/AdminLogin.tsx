import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authAPI.adminLogin({ username, password });
      localStorage.setItem('admin_token', res.token);
      localStorage.setItem('admin_user', JSON.stringify(res.admin));
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(typeof err === 'string' ? err : (err?.message || 'Login gagal'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <main style={{ width: '100%', maxWidth: 420 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#035757', textAlign: 'center', marginBottom: 16 }}>Admin Login</h1>
        <form onSubmit={handleSubmit} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16, boxShadow: '0 6px 16px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>Username</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 8 }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
            <label style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 8 }} />
          </div>
          {error && <div style={{ color: '#b91c1c', fontSize: 13, marginTop: 10 }}>{error}</div>}
          <button type="submit" disabled={loading} style={{ marginTop: 16, width: '100%', padding: '10px 12px', background: '#035757', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>
            {loading ? 'Masuk...' : 'Masuk'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default AdminLogin;


