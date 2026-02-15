import React, { useState } from 'react';
import { GAME_MODES, DAILY_CHALLENGES } from '../data/gameData';

const GameModes = ({ onNavigate, onSelectMode }) => {
  const [selectedMode, setSelectedMode] = useState('endless');
  const highScore = parseInt(localStorage.getItem('highScore')) || 0;

  const handleModeSelect = (modeId) => {
    setSelectedMode(modeId);
    const mode = GAME_MODES.find(m => m.id === modeId);
    
    if (!mode.unlocked) {
      alert(`🔒 ${mode.requirement}`);
      return;
    }

    onSelectMode(modeId);
    onNavigate('game');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '80px 20px 20px 20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Navigation Bar */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: 'rgba(0,0,0,0.8)',
        padding: '10px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 100,
        backdropFilter: 'blur(10px)'
      }}>
        <button
          onClick={() => onNavigate('home')}
          style={{
            padding: '8px 16px',
            background: 'linear-gradient(45deg, #2196F3, #1976D2)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          🏠 Home
        </button>
      </div>

      {/* Container */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '64px', marginBottom: '10px' }}>🎮</div>
          <h1 style={{ color: 'white', margin: 0, fontSize: '36px' }}>Game Modes</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', margin: '10px 0 0 0', fontSize: '18px' }}>
            Choose your challenge
          </p>
        </div>

        {/* Game Modes Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          {GAME_MODES.map(mode => {
            const isUnlocked = mode.unlocked || (mode.id === 'survival' && highScore >= 1000);
            return (
              <div
                key={mode.id}
                onClick={() => isUnlocked && handleModeSelect(mode.id)}
                style={{
                  background: isUnlocked ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.3)',
                  backdropFilter: 'blur(10px)',
                  border: selectedMode === mode.id ? '3px solid #4CAF50' : '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '20px',
                  padding: '30px',
                  textAlign: 'center',
                  cursor: isUnlocked ? 'pointer' : 'not-allowed',
                  transition: 'all 0.3s ease',
                  opacity: isUnlocked ? 1 : 0.5,
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  if (isUnlocked) {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (isUnlocked) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                {!isUnlocked && (
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    fontSize: '24px'
                  }}>
                    🔒
                  </div>
                )}
                <div style={{ fontSize: '64px', marginBottom: '15px' }}>{mode.icon}</div>
                <h3 style={{ color: 'white', margin: '0 0 10px 0', fontSize: '24px' }}>
                  {mode.name}
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: '14px' }}>
                  {mode.description}
                </p>
                {!isUnlocked && mode.requirement && (
                  <div style={{
                    marginTop: '15px',
                    padding: '8px 12px',
                    background: 'rgba(255,152,0,0.2)',
                    borderRadius: '8px',
                    color: '#FF9800',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    🔒 {mode.requirement}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Daily Challenges */}
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '20px',
          padding: '30px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '25px' }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>🎯</div>
            <h2 style={{ color: 'white', margin: 0, fontSize: '28px' }}>Daily Challenges</h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', margin: '10px 0 0 0' }}>
              Complete challenges to earn bonus coins
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '15px'
          }}>
            {DAILY_CHALLENGES.map(challenge => {
              const progress = parseInt(localStorage.getItem(`challenge_${challenge.id}`)) || 0;
              const completed = progress >= challenge.target;
              const percentage = Math.min((progress / challenge.target) * 100, 100);

              return (
                <div
                  key={challenge.id}
                  style={{
                    background: completed ? 'rgba(76,175,80,0.2)' : 'rgba(255,255,255,0.05)',
                    border: completed ? '2px solid #4CAF50' : '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    padding: '15px',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>{challenge.icon}</div>
                  <div style={{ color: 'white', fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>
                    {challenge.task}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginBottom: '10px' }}>
                    {progress}/{challenge.target}
                  </div>
                  
                  {/* Progress Bar */}
                  <div style={{
                    background: 'rgba(0,0,0,0.3)',
                    borderRadius: '10px',
                    height: '8px',
                    marginBottom: '10px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      background: completed ? '#4CAF50' : 'linear-gradient(45deg, #FF9800, #F57C00)',
                      height: '100%',
                      width: `${percentage}%`,
                      transition: 'width 0.3s ease'
                    }} />
                  </div>

                  <div style={{
                    color: completed ? '#4CAF50' : '#FFD700',
                    fontSize: '13px',
                    fontWeight: 'bold'
                  }}>
                    {completed ? '✅ Completed' : `🪙 ${challenge.reward} reward`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameModes;
