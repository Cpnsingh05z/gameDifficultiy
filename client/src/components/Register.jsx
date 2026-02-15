import React, { useState } from 'react';
import { authService } from '../services/authService';

const Register = ({ onRegister, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
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

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 1) {
      setError('Password is required');
      setLoading(false);
      return;
    }

    try {
      const response = await authService.register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      onRegister(response.user);
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
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
        <div style={{ fontSize: '48px', marginBottom: '10px' }}>🎮</div>
        <h2 style={{ color: 'white', margin: 0, fontSize: '28px' }}>Join the Game</h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', margin: '10px 0 0 0' }}>Create your account to start playing</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            minLength="3"
            maxLength="20"
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
            placeholder="Password (any length)"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="1"
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
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
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
            background: loading ? '#666' : 'linear-gradient(45deg, #2196F3, #1976D2)',
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
          {loading ? '🔄 Creating Account...' : '🎯 Create Account'}
        </button>
      </form>

      <div style={{ textAlign: 'center' }}>
        <span style={{ color: 'rgba(255,255,255,0.8)' }}>Already have an account? </span>
        <button
          onClick={onSwitchToLogin}
          style={{
            background: 'none',
            border: 'none',
            color: '#2196F3',
            cursor: 'pointer',
            textDecoration: 'underline',
            fontSize: '16px'
          }}
        >
          Login here
        </button>
      </div>
    </div>
  );
};

export default Register;