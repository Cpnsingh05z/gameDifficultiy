import React, { useState, useEffect, useRef } from 'react';
import { authService } from '../services/authService';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const intervalRef = useRef(null);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    fetchLeaderboard();
    
    intervalRef.current = setInterval(() => {
      fetchLeaderboard(true);
    }, 30000);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Refresh when tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchLeaderboard(true);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const fetchLeaderboard = async (silent = false) => {
    if (!silent) setLoading(true);
    setError('');
    try {
      const response = await authService.getLeaderboard('highScore', 10);
      setLeaderboard(response.leaderboard);
      setLastUpdated(new Date());
    } catch (error) {
      setError('Failed to load leaderboard');
      console.error('Leaderboard error:', error);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const getTimeAgo = (date) => {
    if (!date) return '';
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return '#FFD700';
      case 2: return '#C0C0C0';
      case 3: return '#CD7F32';
      default: return '#fff';
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  return (
    <div style={{
      background: 'rgba(255,255,255,0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.2)',
      borderRadius: '20px',
      padding: '30px',
      width: '900px',
      maxHeight: '80vh',
      overflow: 'hidden',
      boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div style={{ fontSize: '48px', marginBottom: '10px' }}>🏆</div>
        <h2 style={{ color: 'white', margin: 0, fontSize: '28px' }}>Global Leaderboard</h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', margin: '10px 0 0 0' }}>Top 10 Players Worldwide</p>
        {lastUpdated && (
          <div style={{ 
            color: 'rgba(255,255,255,0.6)', 
            fontSize: '12px', 
            marginTop: '5px'
          }}>
            <span>Updated {getTimeAgo(lastUpdated)}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: 'white', padding: '40px' }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>🔄</div>
            Loading leaderboard...
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', color: '#ff4444', padding: '40px' }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>❌</div>
            {error}
          </div>
        ) : leaderboard.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.8)', padding: '40px' }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>📊</div>
            No data available
          </div>
        ) : (
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            color: 'white'
          }}>
            <thead>
              <tr style={{
                background: 'rgba(255,255,255,0.1)',
                borderBottom: '2px solid rgba(255,255,255,0.2)'
              }}>
                <th style={{ padding: '15px 10px', textAlign: 'center', fontSize: '14px' }}>Rank</th>
                <th style={{ padding: '15px 10px', textAlign: 'left', fontSize: '14px' }}>Player</th>
                <th style={{ padding: '15px 10px', textAlign: 'center', fontSize: '14px' }}>🏆 Score</th>
                <th style={{ padding: '15px 10px', textAlign: 'center', fontSize: '14px' }}>🎮 Games</th>
                <th style={{ padding: '15px 10px', textAlign: 'center', fontSize: '14px' }}>🏃 Distance</th>
                <th style={{ padding: '15px 10px', textAlign: 'center', fontSize: '14px' }}>🪙 Coins</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((player, index) => (
                <tr
                  key={index}
                  style={{
                    background: player.rank <= 3 ? 'rgba(255,215,0,0.1)' : 'rgba(255,255,255,0.05)',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                  onMouseOut={(e) => e.currentTarget.style.background = player.rank <= 3 ? 'rgba(255,215,0,0.1)' : 'rgba(255,255,255,0.05)'}
                >
                  {/* Rank */}
                  <td style={{
                    padding: '15px 10px',
                    textAlign: 'center',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: getRankColor(player.rank)
                  }}>
                    {getRankIcon(player.rank)}
                  </td>

                  {/* Player Name */}
                  <td style={{
                    padding: '15px 10px',
                    textAlign: 'left'
                  }}>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: 'bold',
                      marginBottom: '3px'
                    }}>
                      {player.username}
                    </div>
                    <div style={{
                      fontSize: '11px',
                      color: 'rgba(255,255,255,0.6)'
                    }}>
                      Joined: {new Date(player.joinedAt).toLocaleDateString()}
                    </div>
                  </td>

                  {/* High Score */}
                  <td style={{
                    padding: '15px 10px',
                    textAlign: 'center',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}>
                    {player.gameStats.highScore?.toLocaleString() || 0}
                  </td>

                  {/* Total Games */}
                  <td style={{
                    padding: '15px 10px',
                    textAlign: 'center',
                    fontSize: '16px'
                  }}>
                    {player.gameStats.totalGames || 0}
                  </td>

                  {/* Best Distance */}
                  <td style={{
                    padding: '15px 10px',
                    textAlign: 'center',
                    fontSize: '16px'
                  }}>
                    {player.gameStats.bestDistance?.toLocaleString() || 0}m
                  </td>

                  {/* Total Coins */}
                  <td style={{
                    padding: '15px 10px',
                    textAlign: 'center',
                    fontSize: '16px'
                  }}>
                    {player.gameStats.totalCoins?.toLocaleString() || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
