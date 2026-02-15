import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';

const Dashboard = () => {
  const [userStats, setUserStats] = useState(null);
  const [localStats, setLocalStats] = useState({
    totalGames: localStorage.getItem('totalGames') || 0,
    totalCoins: localStorage.getItem('totalCoins') || 0,
    bestDistance: localStorage.getItem('bestDistance') || 0,
    totalPlayTime: localStorage.getItem('totalPlayTime') || 0,
    highScore: localStorage.getItem('highScore') || 0,
    maxCombo: localStorage.getItem('maxCombo') || 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const user = authService.getCurrentUser();
      if (user) {
        const profile = await authService.getProfile();
        setUserStats(profile.user.gameStats);
      }
      setLoading(false);
    } catch (error) {
      console.error('Dashboard Error:', error);
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ color: 'white', fontSize: '24px' }}>Loading Dashboard...</div>
      </div>
    );
  }

  const stats = userStats || localStats;

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ 
          textAlign: 'center', 
          color: 'white', 
          marginBottom: '40px',
          fontSize: '48px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          📊 Game Dashboard
        </h1>

        {/* Stats Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '30px',
          marginBottom: '40px'
        }}>
          {/* High Score */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '30px',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white'
          }}>
            <div style={{ fontSize: '60px', marginBottom: '15px' }}>🏆</div>
            <h3 style={{ fontSize: '24px', marginBottom: '10px' }}>High Score</h3>
            <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#FFD700' }}>
              {stats.highScore || 0}
            </p>
          </div>

          {/* Total Games */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '30px',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white'
          }}>
            <div style={{ fontSize: '60px', marginBottom: '15px' }}>🎮</div>
            <h3 style={{ fontSize: '24px', marginBottom: '10px' }}>Games Played</h3>
            <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#4CAF50' }}>
              {stats.totalGames || 0}
            </p>
          </div>

          {/* Total Coins */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '30px',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white'
          }}>
            <div style={{ fontSize: '60px', marginBottom: '15px' }}>🪙</div>
            <h3 style={{ fontSize: '24px', marginBottom: '10px' }}>Total Coins</h3>
            <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#FF9800' }}>
              {stats.totalCoins || 0}
            </p>
          </div>

          {/* Best Distance */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '30px',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white'
          }}>
            <div style={{ fontSize: '60px', marginBottom: '15px' }}>🏃</div>
            <h3 style={{ fontSize: '24px', marginBottom: '10px' }}>Best Distance</h3>
            <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#2196F3' }}>
              {stats.bestDistance || 0}m
            </p>
          </div>

          {/* Play Time */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '30px',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white'
          }}>
            <div style={{ fontSize: '60px', marginBottom: '15px' }}>⏱️</div>
            <h3 style={{ fontSize: '24px', marginBottom: '10px' }}>Play Time</h3>
            <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#9C27B0' }}>
              {formatTime(stats.totalPlayTime || 0)}
            </p>
          </div>

          {/* Max Combo */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '30px',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white'
          }}>
            <div style={{ fontSize: '60px', marginBottom: '15px' }}>🔥</div>
            <h3 style={{ fontSize: '24px', marginBottom: '10px' }}>Max Combo</h3>
            <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#FF5722' }}>
              {stats.maxCombo || localStats.maxCombo || 0}
            </p>
          </div>
        </div>

        {/* Performance Summary */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '40px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: 'white',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '32px', marginBottom: '20px' }}>🎯 Performance Summary</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div>
              <h4 style={{ fontSize: '18px', marginBottom: '10px' }}>Average Score</h4>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {stats.totalGames > 0 ? Math.round((stats.totalCoins || 0) / stats.totalGames) : 0}
              </p>
            </div>
            <div>
              <h4 style={{ fontSize: '18px', marginBottom: '10px' }}>Games per Hour</h4>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {stats.totalPlayTime > 0 ? Math.round((stats.totalGames || 0) / (stats.totalPlayTime / 3600)) : 0}
              </p>
            </div>
            <div>
              <h4 style={{ fontSize: '18px', marginBottom: '10px' }}>Coins per Game</h4>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {stats.totalGames > 0 ? Math.round((stats.totalCoins || 0) / stats.totalGames) : 0}
              </p>
            </div>
          </div>
        </div>

        {/* Refresh Button */}
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button
            onClick={fetchUserData}
            style={{
              padding: '15px 40px',
              fontSize: '18px',
              background: 'linear-gradient(45deg, #4CAF50, #45a049)',
              color: 'white',
              border: 'none',
              borderRadius: '30px',
              cursor: 'pointer',
              fontWeight: 'bold',
              boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px) scale(1.05)';
              e.target.style.boxShadow = '0 8px 25px rgba(76, 175, 80, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0px) scale(1)';
              e.target.style.boxShadow = '0 6px 20px rgba(76, 175, 80, 0.4)';
            }}
          >
            🔄 Refresh Stats
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;