import React, { useState, useEffect, useRef } from 'react';
import Game from './components/Game';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import Leaderboard from './components/Leaderboard';
import Achievements from './components/Achievements';
import Home from './components/Home';
import Shop from './components/Shop';
import GameModes from './components/GameModes';
import { authService } from './services/authService';

function App() {
  const [currentView, setCurrentView] = useState('auth');
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [user, setUser] = useState(null);
  const [gameMode, setGameMode] = useState('endless');

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = authService.getCurrentUser();
    if (currentUser && authService.isAuthenticated()) {
      setUser(currentUser);
      setCurrentView('home');
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentView('home');
  };

  const handleRegister = (userData) => {
    setUser(userData);
    setCurrentView('home');
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setCurrentView('auth');
    setAuthMode('login');
  };

  const renderAuthView = () => {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        {authMode === 'login' ? (
          <Login 
            onLogin={handleLogin}
            onSwitchToRegister={() => setAuthMode('register')}
          />
        ) : (
          <Register 
            onRegister={handleRegister}
            onSwitchToLogin={() => setAuthMode('login')}
          />
        )}
      </div>
    );
  };

  const renderMainView = () => {
    return (
      <div style={{ minHeight: '100vh' }}>
        {/* Navigation Bar */}
        {currentView !== 'game' && (
          <nav style={{
            background: 'rgba(0,0,0,0.8)',
            padding: '15px 30px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ display: 'flex', gap: '20px' }}>
              <button
                onClick={() => setCurrentView('home')}
                style={{
                  padding: '10px 20px',
                  background: currentView === 'home' ? '#4CAF50' : 'transparent',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                🏠 Home
              </button>
              <button
                onClick={() => setCurrentView('game')}
                style={{
                  padding: '10px 20px',
                  background: currentView === 'game' ? '#4CAF50' : 'transparent',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                🎮 Game
              </button>
              <button
                onClick={() => setCurrentView('gamemodes')}
                style={{
                  padding: '10px 20px',
                  background: currentView === 'gamemodes' ? '#4CAF50' : 'transparent',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                🕹️ Modes
              </button>
              <button
                onClick={() => setCurrentView('shop')}
                style={{
                  padding: '10px 20px',
                  background: currentView === 'shop' ? '#4CAF50' : 'transparent',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                🛒 Shop
              </button>
              <button
                onClick={() => setCurrentView('dashboard')}
                style={{
                  padding: '10px 20px',
                  background: currentView === 'dashboard' ? '#4CAF50' : 'transparent',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                📊 Dashboard
              </button>
              <button
                onClick={() => setCurrentView('leaderboard')}
                style={{
                  padding: '10px 20px',
                  background: currentView === 'leaderboard' ? '#4CAF50' : 'transparent',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                🏆 Leaderboard
              </button>
              <button
                onClick={() => setCurrentView('achievements')}
                style={{
                  padding: '10px 20px',
                  background: currentView === 'achievements' ? '#4CAF50' : 'transparent',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                🏅 Achievements
              </button>
            </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ color: 'white', fontSize: '14px' }}>
              👋 Welcome, {user?.username}!
            </span>
            <button
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                background: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              🚪 Logout
            </button>
            </div>
          </nav>
        )}

        {/* Main Content */}
        <div style={{ paddingTop: currentView === 'game' ? '0' : (currentView === 'home' ? '0' : '80px') }}>
          {currentView === 'home' && <Home user={user} onNavigate={setCurrentView} />}
          {currentView === 'game' && <Game user={user} onNavigate={setCurrentView} gameMode={gameMode} />}
          {currentView === 'gamemodes' && <GameModes onNavigate={setCurrentView} onSelectMode={setGameMode} />}
          {currentView === 'shop' && <Shop onNavigate={setCurrentView} />}
          {currentView === 'dashboard' && <Dashboard />}
          {currentView === 'leaderboard' && (
            <div style={{
              minHeight: '100vh',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}>
              <Leaderboard />
            </div>
          )}
          {currentView === 'achievements' && (
            <div style={{
              minHeight: '100vh',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}>
              <Achievements />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="App">
      {user ? renderMainView() : renderAuthView()}
    </div>
  );
}

export default App;