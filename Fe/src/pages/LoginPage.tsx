import React from 'react';

const LoginPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 100 }}>
      <h2>Login</h2>
      <form style={{ display: 'flex', flexDirection: 'column', width: 300 }}>
        <input type="email" placeholder="Email" style={{ marginBottom: 10 }} />
        <input type="password" placeholder="Password" style={{ marginBottom: 10 }} />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage; 