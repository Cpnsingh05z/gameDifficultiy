import React, { useState, useEffect } from 'react';
import { PLAYER_SKINS, THEMES, POWER_UPS_SHOP } from '../data/gameData';

const Shop = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('skins');
  const [coins, setCoins] = useState(parseInt(localStorage.getItem('totalCoins')) || 0);
  const [ownedSkins, setOwnedSkins] = useState(JSON.parse(localStorage.getItem('ownedSkins')) || ['runner']);
  const [ownedThemes, setOwnedThemes] = useState(JSON.parse(localStorage.getItem('ownedThemes')) || ['city']);
  const [selectedSkin, setSelectedSkin] = useState(localStorage.getItem('selectedSkin') || 'runner');
  const [selectedTheme, setSelectedTheme] = useState(localStorage.getItem('selectedTheme') || 'city');
  const [message, setMessage] = useState('');

  const buyItem = (item, type) => {
    if (coins < item.price) {
      setMessage('❌ Not enough coins!');
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    const newCoins = coins - item.price;
    setCoins(newCoins);
    localStorage.setItem('totalCoins', newCoins);

    if (type === 'skin') {
      const newSkins = [...ownedSkins, item.id];
      setOwnedSkins(newSkins);
      localStorage.setItem('ownedSkins', JSON.stringify(newSkins));
      setMessage(`✅ ${item.name} purchased!`);
    } else if (type === 'theme') {
      const newThemes = [...ownedThemes, item.id];
      setOwnedThemes(newThemes);
      localStorage.setItem('ownedThemes', JSON.stringify(newThemes));
      setMessage(`✅ ${item.name} theme purchased!`);
    }

    setTimeout(() => setMessage(''), 2000);
  };

  const selectItem = (itemId, type) => {
    if (type === 'skin') {
      setSelectedSkin(itemId);
      localStorage.setItem('selectedSkin', itemId);
      setMessage('✅ Skin equipped!');
    } else if (type === 'theme') {
      setSelectedTheme(itemId);
      localStorage.setItem('selectedTheme', itemId);
      setMessage('✅ Theme equipped!');
    }
    setTimeout(() => setMessage(''), 2000);
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
        <div style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>
          🪙 {coins} Coins
        </div>
      </div>

      {/* Shop Container */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '20px',
        padding: '30px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>🛒</div>
          <h2 style={{ color: 'white', margin: 0, fontSize: '28px' }}>Game Shop</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', margin: '10px 0 0 0' }}>
            Customize your gaming experience
          </p>
        </div>

        {/* Message */}
        {message && (
          <div style={{
            background: message.includes('❌') ? '#f44336' : '#4CAF50',
            color: 'white',
            padding: '15px',
            borderRadius: '10px',
            marginBottom: '20px',
            textAlign: 'center',
            fontWeight: 'bold'
          }}>
            {message}
          </div>
        )}

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '30px',
          background: 'rgba(0,0,0,0.2)',
          borderRadius: '15px',
          padding: '5px'
        }}>
          {[
            { id: 'skins', name: 'Player Skins', icon: '🏃' },
            { id: 'themes', name: 'Themes', icon: '🎨' },
            { id: 'powerups', name: 'Power-ups', icon: '⚡' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '15px',
                background: activeTab === tab.id ? 'rgba(255,255,255,0.2)' : 'transparent',
                border: 'none',
                borderRadius: '10px',
                color: 'white',
                fontSize: '16px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              {tab.icon} {tab.name}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          {/* Skins Tab */}
          {activeTab === 'skins' && PLAYER_SKINS.map(skin => {
            const owned = ownedSkins.includes(skin.id);
            const selected = selectedSkin === skin.id;
            return (
              <div
                key={skin.id}
                style={{
                  background: selected ? 'rgba(76,175,80,0.3)' : 'rgba(255,255,255,0.1)',
                  border: selected ? '2px solid #4CAF50' : '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '15px',
                  padding: '20px',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '64px', marginBottom: '10px' }}>{skin.emoji}</div>
                <div style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>
                  {skin.name}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginBottom: '15px' }}>
                  {skin.price === 0 ? 'Free' : `🪙 ${skin.price}`}
                </div>
                {owned ? (
                  <button
                    onClick={() => selectItem(skin.id, 'skin')}
                    disabled={selected}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: selected ? '#4CAF50' : 'linear-gradient(45deg, #2196F3, #1976D2)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: selected ? 'default' : 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}
                  >
                    {selected ? '✅ Equipped' : 'Equip'}
                  </button>
                ) : (
                  <button
                    onClick={() => buyItem(skin, 'skin')}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'linear-gradient(45deg, #FF9800, #F57C00)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}
                  >
                    Buy Now
                  </button>
                )}
              </div>
            );
          })}

          {/* Themes Tab */}
          {activeTab === 'themes' && THEMES.map(theme => {
            const owned = ownedThemes.includes(theme.id);
            const selected = selectedTheme === theme.id;
            return (
              <div
                key={theme.id}
                style={{
                  background: selected ? 'rgba(76,175,80,0.3)' : 'rgba(255,255,255,0.1)',
                  border: selected ? '2px solid #4CAF50' : '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '15px',
                  padding: '20px',
                  textAlign: 'center'
                }}
              >
                <div style={{
                  height: '100px',
                  background: theme.background,
                  borderRadius: '10px',
                  marginBottom: '15px',
                  border: '2px solid rgba(255,255,255,0.3)'
                }} />
                <div style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>
                  {theme.name}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginBottom: '15px' }}>
                  {theme.price === 0 ? 'Free' : `🪙 ${theme.price}`}
                </div>
                {owned ? (
                  <button
                    onClick={() => selectItem(theme.id, 'theme')}
                    disabled={selected}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: selected ? '#4CAF50' : 'linear-gradient(45deg, #2196F3, #1976D2)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: selected ? 'default' : 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}
                  >
                    {selected ? '✅ Active' : 'Activate'}
                  </button>
                ) : (
                  <button
                    onClick={() => buyItem(theme, 'theme')}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'linear-gradient(45deg, #FF9800, #F57C00)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}
                  >
                    Buy Now
                  </button>
                )}
              </div>
            );
          })}

          {/* Power-ups Tab */}
          {activeTab === 'powerups' && POWER_UPS_SHOP.map(powerup => (
            <div
              key={powerup.id}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '15px',
                padding: '20px',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '64px', marginBottom: '10px' }}>{powerup.icon}</div>
              <div style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>
                {powerup.name}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', marginBottom: '10px' }}>
                {powerup.description}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginBottom: '15px' }}>
                🪙 {powerup.price}
              </div>
              <button
                style={{
                  width: '100%',
                  padding: '10px',
                  background: 'linear-gradient(45deg, #9C27B0, #7B1FA2)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                Coming Soon
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shop;
