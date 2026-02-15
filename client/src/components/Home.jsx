import React from 'react';

const Home = ({ user, onNavigate }) => {
  const navigationCards = [
    {
      id: 'game',
      title: 'Play Game',
      icon: '🎮',
      description: 'Start your AI-powered endless runner adventure',
      color: 'linear-gradient(135deg, #4CAF50, #45a049)',
      shadow: 'rgba(76, 175, 80, 0.4)'
    },
    {
      id: 'gamemodes',
      title: 'Game Modes',
      icon: '🕹️',
      description: 'Choose from multiple game modes and challenges',
      color: 'linear-gradient(135deg, #E91E63, #C2185B)',
      shadow: 'rgba(233, 30, 99, 0.4)'
    },
    {
      id: 'shop',
      title: 'Shop',
      icon: '🛒',
      description: 'Buy skins, themes, and power-ups',
      color: 'linear-gradient(135deg, #00BCD4, #0097A7)',
      shadow: 'rgba(0, 188, 212, 0.4)'
    },
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: '📊',
      description: 'View your gaming statistics and performance',
      color: 'linear-gradient(135deg, #2196F3, #1976D2)',
      shadow: 'rgba(33, 150, 243, 0.4)'
    },
    {
      id: 'leaderboard',
      title: 'Leaderboard',
      icon: '🏆',
      description: 'Compete with players worldwide',
      color: 'linear-gradient(135deg, #FF9800, #F57C00)',
      shadow: 'rgba(255, 152, 0, 0.4)'
    },
    {
      id: 'achievements',
      title: 'Achievements',
      icon: '🏅',
      description: 'Unlock badges and track your progress',
      color: 'linear-gradient(135deg, #9C27B0, #7B1FA2)',
      shadow: 'rgba(156, 39, 176, 0.4)'
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {/* Welcome Section */}
      <div style={{
        textAlign: 'center',
        marginBottom: '50px',
        color: 'white'
      }}>
        <div style={{ fontSize: '80px', marginBottom: '20px' }}>🎮</div>
        <h1 style={{
          fontSize: '48px',
          fontWeight: 'bold',
          margin: '0 0 15px 0',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          AI Game Engine
        </h1>
        <p style={{
          fontSize: '20px',
          opacity: 0.9,
          margin: '0 0 10px 0'
        }}>
          Welcome back, {user?.username}! 👋
        </p>
        <p style={{
          fontSize: '16px',
          opacity: 0.7,
          maxWidth: '600px',
          lineHeight: '1.5'
        }}>
          Experience the future of gaming with our AI-powered difficulty adjustment system. 
          Challenge yourself, compete with others, and unlock amazing achievements!
        </p>
      </div>

      {/* Navigation Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '30px',
        maxWidth: '1200px',
        width: '100%'
      }}>
        {navigationCards.map((card) => (
          <div
            key={card.id}
            onClick={() => onNavigate(card.id)}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '40px 30px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-10px) scale(1.02)';
              e.target.style.boxShadow = `0 20px 40px ${card.shadow}`;
              e.target.style.background = 'rgba(255, 255, 255, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0px) scale(1)';
              e.target.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            {/* Card Icon */}
            <div style={{
              fontSize: '60px',
              marginBottom: '20px',
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
            }}>
              {card.icon}
            </div>

            {/* Card Title */}
            <h3 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              margin: '0 0 15px 0',
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
            }}>
              {card.title}
            </h3>

            {/* Card Description */}
            <p style={{
              fontSize: '16px',
              opacity: 0.8,
              lineHeight: '1.4',
              margin: '0 0 25px 0'
            }}>
              {card.description}
            </p>

            {/* Action Button */}
            <button
              style={{
                background: card.color,
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                padding: '12px 30px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: `0 4px 15px ${card.shadow}`
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = `0 6px 20px ${card.shadow}`;
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = `0 4px 15px ${card.shadow}`;
              }}
            >
              Open {card.title}
            </button>

            {/* Decorative Elements */}
            <div style={{
              position: 'absolute',
              top: '-50%',
              right: '-50%',
              width: '100%',
              height: '100%',
              background: card.color,
              opacity: 0.1,
              borderRadius: '50%',
              pointerEvents: 'none'
            }} />
          </div>
        ))}
      </div>

      {/* Quick Stats Section */}
      <div style={{
        marginTop: '60px',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '15px',
        padding: '30px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        color: 'white',
        textAlign: 'center',
        maxWidth: '800px',
        width: '100%'
      }}>
        <h3 style={{
          fontSize: '24px',
          marginBottom: '20px',
          textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
        }}>
          🚀 Ready to Play?
        </h3>
        <p style={{
          fontSize: '16px',
          opacity: 0.8,
          marginBottom: '25px',
          lineHeight: '1.5'
        }}>
          Jump into the action with our AI-powered endless runner game!
        </p>
        <button
          onClick={() => onNavigate('game')}
          style={{
            background: 'linear-gradient(45deg, #4CAF50, #45a049)',
            color: 'white',
            border: 'none',
            borderRadius: '30px',
            padding: '15px 40px',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)'
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
          🎮 Start Playing Now!
        </button>
      </div>
    </div>
  );
};

export default Home;