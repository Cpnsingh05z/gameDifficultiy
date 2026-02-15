import React, { useState } from 'react';
import { authService } from '../services/authService';

const Login = ({ onLogin, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login(formData);
      onLogin(response.user);
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: 'rgba(255,255,255,0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.2)',
      borderRadius: '20px',
      padding: '40px',
      width: '400px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div style={{ fontSize: '48px', marginBottom: '10px' }}>🔐</div>
        <h2 style={{ color: 'white', margin: 0, fontSize: '28px' }}>Welcome Back</h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', margin: '10px 0 0 0' }}>Login to continue your adventure</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '15px',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              fontSize: '16px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '15px',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              fontSize: '16px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {error && (
          <div style={{
            color: '#ff4444',
            textAlign: 'center',
            marginBottom: '20px',
            padding: '10px',
            background: 'rgba(255,68,68,0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(255,68,68,0.3)'
          }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '15px',
            background: loading ? '#666' : 'linear-gradient(45deg, #4CAF50, #45a049)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            marginBottom: '20px'
          }}
        >
          {loading ? '🔄 Logging in...' : '🚀 Login'}
        </button>
      </form>

      <div style={{ textAlign: 'center' }}>
        <span style={{ color: 'rgba(255,255,255,0.8)' }}>Don't have an account? </span>
        <button
          onClick={onSwitchToRegister}
          style={{
            background: 'none',
            border: 'none',
            color: '#4CAF50',
            cursor: 'pointer',
            textDecoration: 'underline',
            fontSize: '16px'
          }}
        >
          Register here
        </button>
      </div>
    </div>
  );
};

export default Login;