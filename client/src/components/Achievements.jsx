import React, { useState, useEffect, useRef } from 'react';
import { authService } from '../services/authService';

const Achievements = () => {
  const [achievements, setAchievements] = useState({ unlocked: [], locked: [], total: 0, unlockedCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [newUnlocks, setNewUnlocks] = useState([]);
  const intervalRef = useRef(null);
  const previousUnlockedRef = useRef([]);

  // Auto-refresh every 15 seconds for achievements
  useEffect(() => {
    fetchAchievements();
    
    if (isAutoRefresh) {
      intervalRef.current = setInterval(() => {
        fetchAchievements(true); // Silent refresh
      }, 15000);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoRefresh]);

  // Refresh when tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isAutoRefresh) {
        fetchAchievements(true);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isAutoRefresh]);

  const fetchAchievements = async (silent = false) => {
    if (!silent) setLoading(true);
    setError('');
    try {
      const response = await authService.getUserAchievements();
      
      // Check for new unlocks
      if (previousUnlockedRef.current.length > 0 && response.achievements.unlocked.length > previousUnlockedRef.current.length) {
        const newAchievements = response.achievements.unlocked.filter(
          achievement => !previousUnlockedRef.current.some(prev => prev.name === achievement.name)
        );
        setNewUnlocks(newAchievements);
        
        // Clear new unlocks after 5 seconds
        setTimeout(() => setNewUnlocks([]), 5000);
      }
      
      previousUnlockedRef.current = response.achievements.unlocked;
      setAchievements(response.achievements);
      setLastUpdated(new Date());
    } catch (error) {
      setError('Failed to load achievements');
      console.error('Achievements error:', error);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const toggleAutoRefresh = () => {
    setIsAutoRefresh(!isAutoRefresh);
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

  const getProgressPercentage = () => {
    return achievements.total > 0 ? (achievements.unlockedCount / achievements.total) * 100 : 0;
  };

  return (
    <div style={{
      background: 'rgba(255,255,255,0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.2)',
      borderRadius: '20px',
      padding: '30px',
      width: '600px',
      maxHeight: '80vh',
      overflow: 'hidden',
      boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div style={{ fontSize: '48px', marginBottom: '10px' }}>🏅</div>
        <h2 style={{ color: 'white', margin: 0, fontSize: '28px' }}>Achievements</h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', margin: '10px 0 0 0' }}>
          {achievements.unlockedCount} of {achievements.total} unlocked
        </p>
        {lastUpdated && (
          <div style={{ 
            color: 'rgba(255,255,255,0.6)', 
            fontSize: '12px', 
            marginTop: '5px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}>
            <span>Updated {getTimeAgo(lastUpdated)}</span>
            <button
              onClick={toggleAutoRefresh}
              style={{
                background: 'none',
                border: 'none',
                color: isAutoRefresh ? '#4CAF50' : 'rgba(255,255,255,0.6)',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              {isAutoRefresh ? '🔄 Auto' : '⏸️ Manual'}
            </button>
          </div>
        )}
        {newUnlocks.length > 0 && (
          <div style={{
            background: 'linear-gradient(45deg, #4CAF50, #45a049)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '20px',
            marginTop: '10px',
            fontSize: '14px',
            fontWeight: 'bold',
            animation: 'pulse 2s infinite'
          }}>
            🎉 New Achievement{newUnlocks.length > 1 ? 's' : ''} Unlocked!
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div style={{
        background: 'rgba(0,0,0,0.3)',
        borderRadius: '10px',
        padding: '3px',
        marginBottom: '30px'
      }}>
        <div style={{
          background: 'linear-gradient(45deg, #4CAF50, #45a049)',
          height: '20px',
          borderRadius: '8px',
          width: `${getProgressPercentage()}%`,
          transition: 'width 0.5s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          {Math.round(getProgressPercentage())}%
        </div>
      </div>

      {/* Content */}
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: 'white', padding: '40px' }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>🔄</div>
            Loading achievements...
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', color: '#ff4444', padding: '40px' }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>❌</div>
            {error}
          </div>
        ) : (
          <div>
            {/* Unlocked Achievements */}
            {achievements.unlocked.length > 0 && (
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ color: '#4CAF50', fontSize: '18px', marginBottom: '15px' }}>
                  🎉 Unlocked ({achievements.unlocked.length})
                </h3>
                {achievements.unlocked.map((achievement, index) => {
                  const isNew = newUnlocks.some(newAch => newAch.name === achievement.name);
                  return (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '15px',
                        marginBottom: '10px',
                        background: isNew ? 'rgba(76,175,80,0.3)' : 'rgba(76,175,80,0.1)',
                        borderRadius: '12px',
                        border: isNew ? '2px solid #4CAF50' : '1px solid rgba(76,175,80,0.3)',
                        transform: isNew ? 'scale(1.02)' : 'scale(1)',
                        transition: 'all 0.3s ease',
                        position: 'relative'
                      }}
                    >
                      {isNew && (
                        <div style={{
                          position: 'absolute',
                          top: '-5px',
                          right: '-5px',
                          background: '#FF9800',
                          color: 'white',
                          borderRadius: '50%',
                          width: '20px',
                          height: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '10px',
                          fontWeight: 'bold'
                        }}>
                          NEW
                        </div>
                      )}
                      <div style={{
                        fontSize: '32px',
                        marginRight: '15px'
                      }}>
                        {achievement.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          color: 'white',
                          fontSize: '16px',
                          fontWeight: 'bold',
                          marginBottom: '5px'
                        }}>
                          {achievement.name}
                        </div>
                        <div style={{
                          color: 'rgba(255,255,255,0.8)',
                          fontSize: '14px'
                        }}>
                          {achievement.description}
                        </div>
                      </div>
                      <div style={{
                        color: '#4CAF50',
                        fontSize: '20px'
                      }}>
                        ✅
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Locked Achievements */}
            {achievements.locked.length > 0 && (
              <div>
                <h3 style={{ color: 'rgba(255,255,255,0.6)', fontSize: '18px', marginBottom: '15px' }}>
                  🔒 Locked ({achievements.locked.length})
                </h3>
                {achievements.locked.map((achievement, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '15px',
                      marginBottom: '10px',
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      opacity: 0.6
                    }}
                  >
                    <div style={{
                      fontSize: '32px',
                      marginRight: '15px',
                      filter: 'grayscale(100%)'
                    }}>
                      {achievement.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        color: 'rgba(255,255,255,0.8)',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        marginBottom: '5px'
                      }}>
                        {achievement.name}
                      </div>
                      <div style={{
                        color: 'rgba(255,255,255,0.6)',
                        fontSize: '14px'
                      }}>
                        {achievement.description}
                      </div>
                    </div>
                    <div style={{
                      color: 'rgba(255,255,255,0.4)',
                      fontSize: '20px'
                    }}>
                      🔒
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '10px', 
        marginTop: '20px' 
      }}>
        <button
          onClick={() => fetchAchievements()}
          disabled={loading}
          style={{
            padding: '10px 20px',
            background: 'linear-gradient(45deg, #4CAF50, #45a049)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '14px'
          }}
        >
          🔄 Refresh Now
        </button>
        <button
          onClick={toggleAutoRefresh}
          style={{
            padding: '10px 20px',
            background: isAutoRefresh ? 'linear-gradient(45deg, #FF9800, #F57C00)' : 'rgba(255,255,255,0.1)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          {isAutoRefresh ? '⏸️ Stop Auto' : '▶️ Start Auto'}
        </button>
      </div>
    </div>
  );
};

export default Achievements;