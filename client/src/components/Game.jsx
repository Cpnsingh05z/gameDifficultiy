import React, { useState, useEffect, useRef } from 'react';
import { updatePlayerStats } from '../services/api';
import { authService } from '../services/authService';

const Game = ({ user, onNavigate }) => {
  // Enhanced Game State for real gaming experience
  const [gameState, setGameState] = useState({
    isPlaying: false,
    isPaused: false,
    score: 0,
    speed: 1,
    playerPosition: 1,
    obstacles: [],
    coins: [],
    powerUps: [],
    distance: 0,
    difficulty: 'EASY',
    reactionTime: 0,
    mistakes: 0,
    lastMoveTime: Date.now(),
    combo: 0,
    maxCombo: localStorage.getItem('maxCombo') || 0,
    highScore: localStorage.getItem('highScore') || 0,
    isInvulnerable: false,
    shieldActive: false,
    magnetActive: false,
    jumpHeight: 0,
    jumpVelocity: 0,
    isJumping: false,
    playerStartY: 0,
    gravity: 0.8,
    jumpPower: 18
  });

  const [message, setMessage] = useState('');
  const [showFloatingText, setShowFloatingText] = useState([]);
  const [gameStats, setGameStats] = useState({
    totalGames: localStorage.getItem('totalGames') || 0,
    totalCoins: localStorage.getItem('totalCoins') || 0,
    bestDistance: localStorage.getItem('bestDistance') || 0,
    totalPlayTime: localStorage.getItem('totalPlayTime') || 0
  });
  
  const gameStartTime = useRef(null);
  const audioContext = useRef(null);
  const bgMusicRef = useRef(null);

  // Initialize Web Audio API for sound effects and background music
  useEffect(() => {
    try {
      audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.log('Web Audio API not supported');
    }
  }, []);

  // Background music loop - Subway Surfers style upbeat music
  const playBackgroundMusic = () => {
    if (!audioContext.current) return;
    
    const playMusicLoop = () => {
      // Subway Surfers inspired melody - upbeat and energetic
      const melody = [
        [659, 0.15], [659, 0.15], [784, 0.15], [880, 0.15],
        [784, 0.15], [659, 0.15], [523, 0.3],
        [587, 0.15], [587, 0.15], [659, 0.15], [784, 0.15],
        [659, 0.15], [587, 0.15], [523, 0.3],
        [659, 0.15], [784, 0.15], [880, 0.15], [988, 0.3],
        [880, 0.15], [784, 0.15], [659, 0.3]
      ];
      
      // Funky bass line
      const bass = [
        [165, 0.2], [165, 0.1], [196, 0.2], [165, 0.1],
        [147, 0.2], [147, 0.1], [165, 0.2], [196, 0.1],
        [165, 0.2], [196, 0.1], [220, 0.2], [196, 0.1],
        [165, 0.4]
      ];
      
      // Hi-hat rhythm for groove
      const hihat = [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1];
      
      let time = audioContext.current.currentTime;
      
      // Play melody (lead synth)
      melody.forEach(([freq, duration]) => {
        const osc = audioContext.current.createOscillator();
        const gain = audioContext.current.createGain();
        
        osc.connect(gain);
        gain.connect(audioContext.current.destination);
        
        osc.frequency.value = freq;
        osc.type = 'sawtooth';
        gain.gain.setValueAtTime(0.06, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + duration);
        
        osc.start(time);
        osc.stop(time + duration);
        time += duration;
      });
      
      // Play bass line
      let bassTime = audioContext.current.currentTime;
      bass.forEach(([freq, duration]) => {
        const osc = audioContext.current.createOscillator();
        const gain = audioContext.current.createGain();
        
        osc.connect(gain);
        gain.connect(audioContext.current.destination);
        
        osc.frequency.value = freq;
        osc.type = 'triangle';
        gain.gain.value = 0.04;
        
        osc.start(bassTime);
        osc.stop(bassTime + duration);
        bassTime += duration;
      });
      
      // Play hi-hat rhythm
      let hihatTime = audioContext.current.currentTime;
      hihat.forEach((duration) => {
        const osc = audioContext.current.createOscillator();
        const gain = audioContext.current.createGain();
        
        osc.connect(gain);
        gain.connect(audioContext.current.destination);
        
        osc.frequency.value = 8000;
        osc.type = 'square';
        gain.gain.setValueAtTime(0.015, hihatTime);
        gain.gain.exponentialRampToValueAtTime(0.001, hihatTime + duration);
        
        osc.start(hihatTime);
        osc.stop(hihatTime + duration);
        hihatTime += duration * 2;
      });
    };
    
    playMusicLoop();
    bgMusicRef.current = setInterval(playMusicLoop, 3200);
  };

  const stopBackgroundMusic = () => {
    if (bgMusicRef.current) {
      clearInterval(bgMusicRef.current);
      bgMusicRef.current = null;
    }
  };

  // Control background music based on game state
  useEffect(() => {
    if (gameState.isPlaying && !gameState.isPaused) {
      playBackgroundMusic();
    } else {
      stopBackgroundMusic();
    }
    
    return () => stopBackgroundMusic();
  }, [gameState.isPlaying, gameState.isPaused]);

  // Play sound effect
  const playSound = (frequency, duration, type = 'sine') => {
    if (!audioContext.current) return;
    
    const oscillator = audioContext.current.createOscillator();
    const gainNode = audioContext.current.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.current.destination);
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.current.currentTime);
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0.1, audioContext.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.current.currentTime + duration);
    
    oscillator.start(audioContext.current.currentTime);
    oscillator.stop(audioContext.current.currentTime + duration);
  };

  // Add floating text effect
  const addFloatingText = (text, color = '#00ff00') => {
    const id = Date.now() + Math.random();
    setShowFloatingText(prev => [...prev, { id, text, color }]);
    setTimeout(() => {
      setShowFloatingText(prev => prev.filter(item => item.id !== id));
    }, 2000);
  };

  // Game loop - 60 FPS for smooth gameplay
  useEffect(() => {
    let gameLoop;
    if (gameState.isPlaying && !gameState.isPaused) {
      gameLoop = setInterval(() => {
        updateGame();
      }, 16); // 60 FPS
    }
    return () => clearInterval(gameLoop);
  }, [gameState.isPlaying, gameState.isPaused, gameState.speed]);

  // AI stats update every 5 seconds (as per requirements)
  useEffect(() => {
    let aiInterval;
    if (gameState.isPlaying && gameState.score > 0) {
      aiInterval = setInterval(() => {
        sendStatsToAI();
      }, 5000);
    }
    return () => clearInterval(aiInterval);
  }, [gameState.isPlaying, gameState.score]);

  // Enhanced keyboard controls with real-time reaction tracking
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!gameState.isPlaying || gameState.isPaused) return;
      
      const currentTime = Date.now();
      const reactionTime = currentTime - gameState.lastMoveTime;
      let newPosition = gameState.playerPosition;
      let actionTaken = false;
      
      switch(e.key.toLowerCase()) {
        case 'arrowleft':
        case 'a':
          if (gameState.playerPosition > 0) {
            newPosition = gameState.playerPosition - 1;
            actionTaken = true;
            playSound(200, 0.1);
          }
          break;
        case 'arrowright':
        case 'd':
          if (gameState.playerPosition < 2) {
            newPosition = gameState.playerPosition + 1;
            actionTaken = true;
            playSound(200, 0.1);
          }
          break;
        case ' ':
        case 'arrowup':
        case 'w':
          e.preventDefault();
          if (!gameState.isJumping && gameState.jumpHeight <= 0) {
            setGameState(prev => ({ 
              ...prev, 
              isJumping: true, 
              jumpVelocity: prev.jumpPower,
              jumpHeight: 1
            }));
            playSound(350, 0.15, 'square');
          }
          break;
        case 'p':
        case 'escape':
          togglePause();
          break;
      }
      
      if (actionTaken && newPosition !== gameState.playerPosition) {
        setGameState(prev => ({
          ...prev,
          playerPosition: newPosition,
          reactionTime: reactionTime,
          lastMoveTime: currentTime
        }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.isPlaying, gameState.isPaused, gameState.playerPosition, gameState.lastMoveTime, gameState.isJumping]);

  // Local difficulty calculation as fallback
  const calculateLocalDifficulty = () => {
    const { score } = gameState;
    
    // Simple score-based difficulty (50 = MEDIUM, 100 = HARD)
    if (score >= 100) {
      return 'HARD';
    } else if (score >= 50) {
      return 'MEDIUM';
    } else {
      return 'EASY';
    }
  };

  // Toggle pause function
  const togglePause = () => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
    setMessage(gameState.isPaused ? '▶️ Game Resumed' : '⏸️ Game Paused - Press P to resume');
  };

  // Enhanced game update function
  const updateGame = () => {
    setGameState(prev => {
      const newState = { ...prev };
      
      // Physics-based jumping
      if (newState.isJumping || newState.jumpHeight > 0) {
        newState.jumpHeight += newState.jumpVelocity;
        newState.jumpVelocity -= newState.gravity;
        
        // Land when hitting ground
        if (newState.jumpHeight <= 0) {
          newState.jumpHeight = 0;
          newState.jumpVelocity = 0;
          newState.isJumping = false;
          // Landing sound effect
          if (prev.jumpHeight > 0) {
            setTimeout(() => playSound(200, 0.1, 'sawtooth'), 10);
          }
        }
      }
      
      // Move all objects down
      newState.obstacles = prev.obstacles
        .map(obs => ({ ...obs, y: obs.y + prev.speed * 4 }))
        .filter(obs => obs.y < 700);
      
      newState.coins = prev.coins
        .map(coin => ({ 
          ...coin, 
          y: coin.y + prev.speed * 4,
          x: prev.magnetActive && Math.abs(coin.x - prev.playerPosition) <= 1 ? prev.playerPosition : coin.x
        }))
        .filter(coin => coin.y < 700);
        
      newState.powerUps = prev.powerUps
        .map(power => ({ ...power, y: power.y + prev.speed * 4 }))
        .filter(power => power.y < 700);

      // Generate obstacles with intelligent spacing
      if (Math.random() < 0.012 + (prev.speed * 0.003)) {
        const availableLanes = [0, 1, 2].filter(lane => 
          !prev.obstacles.some(obs => obs.x === lane && obs.y > -200 && obs.y < 100)
        );
        
        if (availableLanes.length > 0) {
          const randomLane = availableLanes[Math.floor(Math.random() * availableLanes.length)];
          const obstacleTypes = [
            { type: 'train', emoji: '🚆' },
            { type: 'barrier', emoji: '⚠️' },
            { type: 'truck', emoji: '🚛' },
            { type: 'cone', emoji: '🚧' },
            { type: 'car', emoji: '🚗' },
            { type: 'beam', emoji: '🏗️' }
          ];
          const selectedObstacle = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
          
          newState.obstacles.push({
            id: Date.now() + Math.random(),
            x: randomLane,
            y: -100,
            type: selectedObstacle.type,
            emoji: selectedObstacle.emoji
          });
        }
      }

      // Generate coins with patterns
      if (Math.random() < 0.006) {
        const patterns = [
          [1], // Single coin
          [0, 1, 2], // Triple line
          [0, 2], // Side coins
        ];
        
        const pattern = patterns[Math.floor(Math.random() * patterns.length)];
        pattern.forEach((lane, index) => {
          if (!prev.coins.some(coin => coin.x === lane && coin.y > -150 && coin.y < 50)) {
            newState.coins.push({
              id: Date.now() + Math.random() + index,
              x: lane,
              y: -80 - (index * 50),
              value: prev.combo > 10 ? 25 : prev.combo > 5 ? 15 : 10,
              type: prev.combo > 15 ? 'diamond' : prev.combo > 10 ? 'golden' : 'normal'
            });
          }
        });
      }

      // Generate power-ups
      if (Math.random() < 0.001 && prev.score > 50) {
        const powerTypes = ['shield', 'magnet', 'multiplier', 'invincible'];
        const selectedPower = powerTypes[Math.floor(Math.random() * powerTypes.length)];
        
        const randomLane = Math.floor(Math.random() * 3);
        newState.powerUps.push({
          id: Date.now() + Math.random(),
          x: randomLane,
          y: -80,
          type: selectedPower
        });
      }

      // Enhanced collision detection with realistic jump mechanics
      const playerCollision = newState.obstacles.find(
        obs => obs.x === prev.playerPosition && 
               obs.y > 450 && obs.y < 580 && 
               prev.jumpHeight < 60  // More realistic jump clearance
      );

      if (playerCollision && !prev.shieldActive) {
        newState.obstacles = newState.obstacles.filter(obs => obs.id !== playerCollision.id);
        
        // Count mistake only if not invulnerable
        if (!prev.isInvulnerable) {
          newState.mistakes += 1;
          newState.combo = 0;
          newState.isInvulnerable = true;
          
          // Enhanced mistake feedback
          playSound(100, 0.5, 'sawtooth');
          addFloatingText(`MISTAKE ${newState.mistakes}/3`, '#ff0000');
          
          // Screen shake effect for mistake
          document.body.style.animation = 'shake 0.5s';
          setTimeout(() => {
            document.body.style.animation = '';
          }, 500);
          
          setTimeout(() => {
            setGameState(prev => ({ ...prev, isInvulnerable: false }));
          }, 2000);
          
          if (newState.mistakes >= 3) {
            newState.isPlaying = false;
            updateHighScore(newState.score);
            playSound(150, 1.5, 'sawtooth');
            addFloatingText('GAME OVER!', '#ff0000');
            setMessage('💀 Game Over! 3 Mistakes Made - Press Start to play again');
          } else {
            const remainingMistakes = 3 - newState.mistakes;
            setMessage(`💥 Mistake ${newState.mistakes}! ${remainingMistakes} chance${remainingMistakes > 1 ? 's' : ''} left | Invulnerable for 2s`);
          }
        } else {
          // Already invulnerable - just remove obstacle without counting mistake
          playSound(200, 0.2);
          addFloatingText('INVULNERABLE!', '#00ffff');
        }
      } else if (playerCollision && prev.shieldActive) {
        newState.obstacles = newState.obstacles.filter(obs => obs.id !== playerCollision.id);
        newState.shieldActive = false;
        playSound(400, 0.2);
        addFloatingText('SHIELD ABSORBED!', '#00ffff');
        setMessage('🛡️ Shield absorbed the hit!');
      }

      // Enhanced coin collection
      const coinCollected = newState.coins.find(
        coin => coin.x === prev.playerPosition && coin.y > 450 && coin.y < 580
      );

      if (coinCollected) {
        newState.coins = newState.coins.filter(coin => coin.id !== coinCollected.id);
        newState.combo += 1;
        
        let baseScore = coinCollected.value;
        let comboMultiplier = Math.floor(newState.combo / 5) + 1;
        let totalScore = baseScore * comboMultiplier;
        
        newState.score += totalScore;
        
        if (newState.combo > newState.maxCombo) {
          newState.maxCombo = newState.combo;
          localStorage.setItem('maxCombo', newState.maxCombo);
        }
        
        playSound(400 + (newState.combo * 20), 0.15);
        
        const coinEmoji = coinCollected.type === 'diamond' ? '💎' : 
                         coinCollected.type === 'golden' ? '🥇' : '🪙';
        addFloatingText(`${coinEmoji} +${totalScore}`, coinCollected.type === 'diamond' ? '#ff00ff' : '#ffd700');
        
        if (comboMultiplier > 1) {
          setMessage(`${coinEmoji} +${totalScore} | Combo x${newState.combo} (${comboMultiplier}x multiplier!)`);
        } else {
          setMessage(`${coinEmoji} Coin collected! +${totalScore}`);
        }
      }

      // Power-up collection
      const powerUpCollected = newState.powerUps.find(
        power => power.x === prev.playerPosition && power.y > 450 && power.y < 580
      );

      if (powerUpCollected) {
        newState.powerUps = newState.powerUps.filter(power => power.id !== powerUpCollected.id);
        
        playSound(500, 0.3, 'square');
        
        switch (powerUpCollected.type) {
          case 'shield':
            newState.shieldActive = true;
            addFloatingText('🛡️ SHIELD ACTIVE!', '#00ffff');
            setMessage('🛡️ Shield activated! Next hit will be absorbed');
            break;
          case 'magnet':
            newState.magnetActive = true;
            addFloatingText('🧲 MAGNET ACTIVE!', '#ff00ff');
            setMessage('🧲 Magnet activated! Coins will be attracted');
            setTimeout(() => {
              setGameState(prev => ({ ...prev, magnetActive: false }));
            }, 5000);
            break;
          case 'multiplier':
            newState.score += 100;
            addFloatingText('⭐ +100 BONUS!', '#ffff00');
            setMessage('⭐ Score multiplier! +100 points');
            break;
          case 'invincible':
            newState.isInvulnerable = true;
            addFloatingText('✨ INVINCIBLE!', '#ff69b4');
            setMessage('✨ Invincible mode! 3 seconds of immunity');
            setTimeout(() => {
              setGameState(prev => ({ ...prev, isInvulnerable: false }));
            }, 3000);
            break;
        }
      }

      // Update distance and AI-based speed progression with automatic difficulty
      newState.distance += prev.speed * 1.5;
      
      // Automatic difficulty progression based on performance
      const currentDifficulty = calculateLocalDifficulty();
      if (currentDifficulty !== prev.difficulty) {
        newState.difficulty = currentDifficulty;
        // Visual feedback for difficulty change
        setTimeout(() => {
          addFloatingText(`DIFFICULTY: ${currentDifficulty}`, 
            currentDifficulty === 'HARD' ? '#ff0000' : 
            currentDifficulty === 'MEDIUM' ? '#ff8800' : '#00ff00'
          );
          playSound(600, 0.5);
        }, 100);
      }
      
      const speedMultiplier = {
        'EASY': 0.0003,
        'MEDIUM': 0.0006,
        'HARD': 0.001
      };
      
      const maxSpeed = {
        'EASY': 2.0,
        'MEDIUM': 3.0,
        'HARD': 4.0
      };
      
      newState.speed = Math.min(
        1 + (newState.distance * speedMultiplier[newState.difficulty]),
        maxSpeed[newState.difficulty]
      );

      return newState;
    });
  };

  // Send stats to AI engine (every 5 seconds as per requirements)
  const sendStatsToAI = async () => {
    try {
      // Better performance calculation
      const avgReactionTime = gameState.reactionTime || 800; // Default better reaction time
      const currentPerformance = {
        score: gameState.score,
        reactionTime: avgReactionTime,
        mistakes: gameState.mistakes,
        speed: gameState.speed,
        distance: Math.floor(gameState.distance),
        combo: gameState.combo
      };
      
      console.log('Sending to AI:', currentPerformance); // Debug log
      
      const response = await updatePlayerStats(currentPerformance);

      const oldDifficulty = gameState.difficulty;
      const newDifficulty = response.difficulty;
      
      setGameState(prev => ({
        ...prev,
        difficulty: newDifficulty,
        lives: Math.max(prev.lives, Math.min(response.settings.lives, 5))
      }));

      if (oldDifficulty !== newDifficulty) {
        playSound(600, 0.5);
        addFloatingText(`DIFFICULTY: ${newDifficulty}`, 
          newDifficulty === 'HARD' ? '#ff0000' : 
          newDifficulty === 'MEDIUM' ? '#ff8800' : '#00ff00'
        );
      }

      setMessage(`🤖 AI: ${newDifficulty} | Score: ${gameState.score} | ${response.settings.description}`);
      
    } catch (error) {
      console.error('AI Error:', error);
      // Fallback: Local difficulty adjustment when AI fails
      const localDifficulty = calculateLocalDifficulty();
      if (localDifficulty !== gameState.difficulty) {
        setGameState(prev => ({ ...prev, difficulty: localDifficulty }));
        addFloatingText(`DIFFICULTY: ${localDifficulty}`, 
          localDifficulty === 'HARD' ? '#ff0000' : 
          localDifficulty === 'MEDIUM' ? '#ff8800' : '#00ff00'
        );
      }
      setMessage('⚠️ AI engine offline - using local difficulty adjustment');
    }
  };

  // Update high score and statistics
  const updateHighScore = async (score) => {
    const playTime = gameStartTime.current ? Date.now() - gameStartTime.current : 0;
    
    if (score > gameState.highScore) {
      localStorage.setItem('highScore', score);
      setGameState(prev => ({ ...prev, highScore: score }));
      playSound(800, 1);
      addFloatingText('🏆 NEW HIGH SCORE!', '#ffd700');
      setMessage('🏆 NEW HIGH SCORE! You\'re on fire!');
    }
    
    const newTotalGames = parseInt(gameStats.totalGames) + 1;
    const newTotalCoins = parseInt(gameStats.totalCoins) + gameState.score;
    const newBestDistance = Math.max(parseInt(gameStats.bestDistance), Math.floor(gameState.distance));
    const newTotalPlayTime = parseInt(gameStats.totalPlayTime) + Math.floor(playTime / 1000);
    
    localStorage.setItem('totalGames', newTotalGames);
    localStorage.setItem('totalCoins', newTotalCoins);
    localStorage.setItem('bestDistance', newBestDistance);
    localStorage.setItem('totalPlayTime', newTotalPlayTime);
    
    setGameStats({
      totalGames: newTotalGames,
      totalCoins: newTotalCoins,
      bestDistance: newBestDistance,
      totalPlayTime: newTotalPlayTime
    });

    // Update user stats in backend
    try {
      await authService.updateGameStats({
        gamesPlayed: newTotalGames,
        highScore: Math.max(score, gameState.highScore),
        totalCoins: newTotalCoins,
        bestDistance: newBestDistance,
        totalPlayTime: newTotalPlayTime,
        lastGameScore: score,
        lastGameDistance: Math.floor(gameState.distance),
        lastGameMistakes: gameState.mistakes,
        maxCombo: Math.max(gameState.combo, gameState.maxCombo)
      });
      console.log('✅ User stats updated successfully');
    } catch (error) {
      console.error('❌ Failed to update user stats:', error);
    }
  };

  // Start game with countdown
  const startGame = () => {
    let countdown = 3;
    setMessage(`🚀 Starting in ${countdown}...`);
    
    const countdownInterval = setInterval(() => {
      countdown--;
      if (countdown > 0) {
        setMessage(`🚀 Starting in ${countdown}...`);
        playSound(400, 0.1);
      } else {
        clearInterval(countdownInterval);
        
        gameStartTime.current = Date.now();
        setGameState({
          isPlaying: true,
          isPaused: false,
          score: 0,
          lives: 3,
          speed: 1,
          playerPosition: 1,
          obstacles: [],
          coins: [],
          powerUps: [],
          distance: 0,
          difficulty: 'EASY',
          reactionTime: 0,
          mistakes: 0,
          lastMoveTime: Date.now(),
          combo: 0,
          maxCombo: gameState.maxCombo,
          highScore: gameState.highScore,
          isInvulnerable: false,
          shieldActive: false,
          magnetActive: false,
          jumpHeight: 0,
          jumpVelocity: 0,
          isJumping: false,
          gravity: 0.8,
          jumpPower: 18,
          playerStartY: window.innerHeight // Start player from bottom of screen
        });
        
        playSound(600, 0.3);
        setMessage('');
        
        // Animate player running up from bottom
        setTimeout(() => {
          setGameState(prev => ({ ...prev, playerStartY: 0 }));
        }, 100);
      }
    }, 1000);
  };

  // Stop game
  const stopGame = async () => {
    stopBackgroundMusic();
    if (gameState.score > 0) {
      await updateHighScore(gameState.score);
    }
    setGameState(prev => ({ ...prev, isPlaying: false, isPaused: false }));
    setMessage('⏹️ Game stopped! Thanks for playing!');
  };

  // Get difficulty class
  const getDifficultyClass = () => {
    switch (gameState.difficulty) {
      case 'EASY': return 'difficulty-easy';
      case 'MEDIUM': return 'difficulty-medium';
      case 'HARD': return 'difficulty-hard';
      default: return 'difficulty-easy';
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      display: 'flex',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Left Sidebar - Game Stats */}
      <div style={{
        width: gameState.isPlaying ? '0px' : '300px',
        height: '100vh',
        background: 'linear-gradient(180deg, rgba(15,52,96,0.95) 0%, rgba(22,33,62,0.95) 100%)',
        backdropFilter: 'blur(15px)',
        border: 'none',
        borderRight: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '4px 0 20px rgba(0,0,0,0.3)',
        padding: gameState.isPlaying ? '0px' : '20px',
        paddingTop: gameState.isPlaying ? '0px' : '70px',
        overflowY: 'auto',
        transition: 'all 0.5s ease-in-out',
        opacity: gameState.isPlaying ? 0 : 1,
        pointerEvents: gameState.isPlaying ? 'none' : 'auto',
        position: 'relative',
        zIndex: 1
      }}>
        {/* High Score */}
        <div style={{
          background: 'linear-gradient(45deg, #FFD700, #FFA500)',
          padding: '15px',
          borderRadius: '12px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <h3 style={{ color: 'white', margin: 0, fontSize: '18px' }}>
            🏆 High Score: {gameState.highScore}
          </h3>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>
            Max Combo: {gameState.maxCombo}
          </div>
        </div>

        {/* Current Game Stats */}
        <div className="stats-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '10px',
          marginBottom: '20px'
        }}>
          <div className="stat-card" style={{
            background: '#f8f9fa',
            padding: '10px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{gameState.score}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>Score</div>
          </div>
          <div className="stat-card" style={{
            background: '#f8f9fa',
            padding: '10px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '16px' }}>
              {gameState.shieldActive && '🛡️'}
              {gameState.magnetActive && '🧲'}
              {gameState.isInvulnerable && '✨'}
              {!gameState.shieldActive && !gameState.magnetActive && !gameState.isInvulnerable && '🏃♂️'}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>Status</div>
          </div>
          <div className="stat-card" style={{
            background: '#f8f9fa',
            padding: '10px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: gameState.mistakes >= 2 ? '#ff4444' : '#333' }}>{gameState.mistakes}/3</div>
            <div style={{ fontSize: '12px', color: '#666' }}>Mistakes</div>
          </div>
          <div className="stat-card" style={{
            background: '#f8f9fa',
            padding: '10px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{gameState.speed.toFixed(1)}x</div>
            <div style={{ fontSize: '12px', color: '#666' }}>Speed</div>
          </div>
          <div className="stat-card" style={{
            background: '#f8f9fa',
            padding: '10px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{gameState.combo}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>Combo</div>
          </div>
        </div>

        {/* AI Status */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '15px',
          borderRadius: '10px',
          marginBottom: '20px'
        }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>🤖 AI Engine</h4>
          <div>
            <span className={`difficulty-badge ${getDifficultyClass()}`} style={{
              padding: '4px 12px',
              borderRadius: '15px',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              {gameState.difficulty}
            </span>
          </div>
          <div style={{ fontSize: '12px', marginTop: '8px', opacity: 0.9 }}>
            Mistakes: {gameState.mistakes} | Reaction: {gameState.reactionTime}ms
          </div>
        </div>

        {/* Controls */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            background: '#e3f2fd',
            padding: '15px',
            borderRadius: '8px',
            fontSize: '12px'
          }}>
            <h5 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>🎮 How to Play</h5>
            <div><strong>Move:</strong> ← → or A/D</div>
            <div><strong>Jump:</strong> SPACE or W</div>
            <div><strong>Pause:</strong> P or ESC</div>
            <div style={{ marginTop: '10px' }}>
              <strong>Power-ups:</strong><br/>
              🛡️ Shield | 🧲 Magnet<br/>
              ⭐ Multiplier | ✨ Invincible
            </div>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div style={{
        flex: 1,
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: gameState.isPlaying ? 'fixed' : 'relative',
        top: gameState.isPlaying ? 0 : 'auto',
        left: gameState.isPlaying ? 0 : 'auto',
        width: gameState.isPlaying ? '100vw' : 'auto',
        zIndex: gameState.isPlaying ? 1000 : 'auto'
      }}>
        {/* Game Canvas */}
        <div style={{
          width: gameState.isPlaying ? '100vw' : '600px',
          height: gameState.isPlaying ? '100vh' : '90vh',
          background: `
            radial-gradient(ellipse at top, #1e3c72 0%, #2a5298 50%, #1e3c72 100%),
            linear-gradient(135deg, #667eea 0%, #764ba2 100%)
          `,
          borderRadius: gameState.isPlaying ? '0px' : '15px',
          border: gameState.isInvulnerable ? '3px solid #00ff88' : (gameState.isPlaying ? 'none' : '3px solid #333'),
          boxShadow: gameState.isInvulnerable ? 
            '0 0 40px #00ff88, 0 0 80px rgba(0,255,136,0.3), inset 0 0 30px rgba(255,255,255,0.1)' : 
            (gameState.isPlaying ? 'none' : '0 25px 80px rgba(0,0,0,0.6), 0 10px 30px rgba(0,0,0,0.4), inset 0 0 30px rgba(255,255,255,0.05)'),
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.5s ease-in-out'
        }}>
          {/* Game Stats Overlay - Only visible during gameplay */}
          {gameState.isPlaying && (
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              background: 'rgba(0,0,0,0.7)',
              color: 'white',
              padding: '15px 20px',
              borderRadius: '15px',
              zIndex: 25,
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <div style={{ display: 'flex', gap: '20px', fontSize: '14px', fontWeight: 'bold' }}>
                <div>Score: {gameState.score}</div>
                <div>Mistakes: {gameState.mistakes}/3</div>
                <div>Speed: {gameState.speed.toFixed(1)}x</div>
                <div>Combo: {gameState.combo}</div>
                <div style={{
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  background: gameState.difficulty === 'HARD' ? '#ff4444' : 
                             gameState.difficulty === 'MEDIUM' ? '#ff8800' : '#44ff44'
                }}>
                  {gameState.difficulty}
                </div>
              </div>
            </div>
          )}

          {/* Pause Menu Overlay */}
          {gameState.isPlaying && gameState.isPaused && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'rgba(0,0,0,0.9)',
              color: 'white',
              padding: '40px',
              borderRadius: '20px',
              textAlign: 'center',
              zIndex: 35,
              backdropFilter: 'blur(20px)',
              border: '2px solid rgba(255,255,255,0.3)'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏸️</div>
              <div style={{ fontSize: '24px', marginBottom: '20px' }}>GAME PAUSED</div>
              <div style={{ fontSize: '16px', opacity: 0.8, marginBottom: '30px' }}>Press P to Resume or ESC to Exit</div>
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                <button 
                  onClick={togglePause}
                  style={{
                    padding: '12px 24px',
                    background: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  ▶️ Resume
                </button>
                <button 
                  onClick={stopGame}
                  style={{
                    padding: '12px 24px',
                    background: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  🏠 Exit
                </button>
              </div>
            </div>
          )}

          {/* City Background */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '40%',
            background: `
              linear-gradient(to bottom, 
                rgba(30,60,114,0.9) 0%, 
                rgba(42,82,152,0.7) 50%, 
                rgba(30,60,114,0.3) 100%
              )
            `,
            zIndex: 1
          }}>
            {/* City Skyline */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              height: '120px',
              backgroundColor: 'rgba(0,0,0,0.6)',
              clipPath: 'polygon(0% 100%, 8% 60%, 15% 100%, 25% 40%, 35% 100%, 45% 70%, 55% 100%, 65% 50%, 75% 100%, 85% 80%, 95% 100%, 100% 100%)',
              animation: gameState.isPlaying && !gameState.isPaused ? 'cityMove 8s linear infinite' : 'none'
            }} />
          </div>

          {/* Animated Road */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            height: '100%',
            background: `
              repeating-linear-gradient(
                to bottom,
                #2c2c2c 0px, #2c2c2c 80px,
                #1a1a1a 80px, #1a1a1a 100px,
                #2c2c2c 100px, #2c2c2c 180px,
                #1a1a1a 180px, #1a1a1a 200px
              )
            `,
            animation: gameState.isPlaying && !gameState.isPaused ? 
              `roadMove ${2.2 - gameState.speed * 0.3}s linear infinite` : 'none',
            zIndex: 2,
            boxShadow: 'inset 0 20px 40px rgba(0,0,0,0.4), 0 0 50px rgba(0,0,0,0.3)'
          }}>
            {/* Player Character */}
            <div style={{
              position: 'absolute',
              left: `${gameState.playerPosition * 33.33 + 16.66}%`,
              bottom: `${10 + gameState.jumpHeight + (gameState.playerStartY || 0)}px`,
              fontSize: '80px',
              transition: gameState.playerStartY > 0 ? 'bottom 2s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'left 0.12s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              zIndex: 15,
              animation: gameState.isPlaying && !gameState.isPaused ? 
                `playerRun 0.3s infinite alternate, playerGlow 2s infinite alternate${gameState.isJumping ? ', playerJump 0.1s ease-out' : ''}` : 'none',
              filter: `drop-shadow(6px 10px 15px rgba(0,0,0,0.8)) drop-shadow(0 0 25px rgba(255,255,255,0.4)) ${
                gameState.isInvulnerable ? 'drop-shadow(0 0 35px #00ff88) brightness(1.4) saturate(1.6)' : ''
              } ${gameState.shieldActive ? 'drop-shadow(0 0 30px #00ffff)' : ''}`,
              transform: `translateX(-50%) scale(1.2) ${gameState.isJumping ? 'rotate(-12deg)' : 'rotate(0deg)'}`,
              textShadow: gameState.isJumping ? '0 0 20px rgba(255,255,255,0.9)' : 
                         gameState.isInvulnerable ? '0 0 15px #00ff88' : 
                         gameState.shieldActive ? '0 0 15px #00ffff' : '0 0 10px rgba(255,255,255,0.5)',
              background: 'transparent'
            }}>
              🏃‍♂️
            </div>

            {/* Enhanced Obstacles */}
            {gameState.obstacles.map(obstacle => (
              <div
                key={obstacle.id}
                style={{
                  position: 'absolute',
                  left: `${obstacle.x * 33.33 + 16.66}%`,
                  top: `${obstacle.y}px`,
                  fontSize: '60px',
                  zIndex: 12,
                  animation: 'obstacleGlow 0.8s infinite alternate, obstacleShake 3s infinite',
                  filter: 'drop-shadow(0 0 25px rgba(255,50,50,0.9)) drop-shadow(4px 8px 15px rgba(0,0,0,0.8))',
                  transform: 'translateX(-50%) scale(1.05)',
                  textShadow: '0 0 20px rgba(255,0,0,0.8)'
                }}
              >
                {obstacle.emoji || '🚧'}
              </div>
            ))}

            {/* Enhanced Coins */}
            {gameState.coins.map(coin => (
              <div
                key={coin.id}
                style={{
                  position: 'absolute',
                  left: `${coin.x * 33.33 + 16.66}%`,
                  top: `${coin.y}px`,
                  fontSize: coin.type === 'diamond' ? '50px' : 
                           coin.type === 'golden' ? '45px' : '40px',
                  zIndex: 13,
                  animation: 'coinSpin 0.8s infinite linear, coinFloat 2s infinite ease-in-out, coinGlow 1.5s infinite alternate',
                  filter: coin.type === 'diamond' ? 'drop-shadow(0 0 30px #ff00ff) drop-shadow(0 0 15px #fff)' :
                          coin.type === 'golden' ? 'drop-shadow(0 0 25px #ffd700) drop-shadow(0 0 10px #fff)' : 
                          'drop-shadow(0 0 15px #ffeb3b) drop-shadow(2px 4px 8px rgba(0,0,0,0.6))',
                  transform: 'translateX(-50%) scale(1.1)',
                  textShadow: coin.type === 'diamond' ? '0 0 15px #ff00ff' :
                             coin.type === 'golden' ? '0 0 12px #ffd700' : '0 0 8px #ffeb3b'
                }}
              >
                {coin.type === 'diamond' ? '💎' : 
                 coin.type === 'golden' ? '🥇' : '🪙'}
              </div>
            ))}

            {/* Enhanced Power-ups */}
            {gameState.powerUps.map(power => (
              <div
                key={power.id}
                style={{
                  position: 'absolute',
                  left: `${power.x * 33.33 + 16.66}%`,
                  top: `${power.y}px`,
                  fontSize: '50px',
                  zIndex: 14,
                  animation: 'powerUpPulse 1.2s infinite, powerUpFloat 3s infinite ease-in-out, powerUpGlow 2s infinite alternate',
                  filter: power.type === 'shield' ? 'drop-shadow(0 0 25px #00ff88) drop-shadow(0 0 15px #fff)' :
                          power.type === 'magnet' ? 'drop-shadow(0 0 25px #ff6b6b) drop-shadow(0 0 15px #fff)' :
                          power.type === 'multiplier' ? 'drop-shadow(0 0 25px #ffd93d) drop-shadow(0 0 15px #fff)' :
                          'drop-shadow(0 0 25px #00bfff) drop-shadow(0 0 15px #fff)',
                  transform: 'translateX(-50%) scale(1.15)',
                  textShadow: power.type === 'shield' ? '0 0 20px #00ff88' :
                             power.type === 'magnet' ? '0 0 20px #ff6b6b' :
                             power.type === 'multiplier' ? '0 0 20px #ffd93d' : '0 0 20px #00bfff'
                }}
              >
                {power.type === 'shield' ? '🛡️' : 
                 power.type === 'magnet' ? '🧲' :
                 power.type === 'multiplier' ? '⭐' : '✨'}
              </div>
            ))}

            {/* Floating Text Effects */}
            {showFloatingText.map(text => (
              <div
                key={text.id}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '25%',
                  transform: 'translateX(-50%)',
                  color: text.color,
                  fontSize: '32px',
                  fontWeight: 'bold',
                  zIndex: 20,
                  animation: 'floatUp 2s ease-out forwards',
                  textShadow: '3px 3px 6px rgba(0,0,0,0.8)'
                }}
              >
                {text.text}
              </div>
            ))}

            {/* Lane Dividers */}
            {[33.33, 66.66].map((left, index) => (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  left: `${left}%`,
                  width: '3px',
                  height: '100%',
                  background: 'repeating-linear-gradient(to bottom, rgba(255,255,255,0.3) 0px, rgba(255,255,255,0.3) 40px, transparent 40px, transparent 80px)',
                  animation: gameState.isPlaying && !gameState.isPaused ? 
                    'dividerMove 1s linear infinite' : 'none',
                  opacity: 0.5,
                  boxShadow: '0 0 5px rgba(255,255,255,0.2)',
                  borderRadius: '2px'
                }}
              />
            ))}
          </div>
        </div>

        {/* Game Start Overlay */}
        {!gameState.isPlaying && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 30
          }}>
            <div style={{
              textAlign: 'center',
              color: 'white'
            }}>
              <div style={{ fontSize: '72px', marginBottom: '20px' }}>🎮</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '15px' }}>AI Game Engine</div>
              <div style={{ fontSize: '18px', marginBottom: '30px', opacity: 0.8 }}>Ready to start your adventure?</div>
              <button 
                onClick={startGame}
                style={{
                  padding: '15px 40px',
                  fontSize: '20px',
                  background: 'linear-gradient(45deg, #4CAF50, #45a049)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  boxShadow: '0 8px 25px rgba(76, 175, 80, 0.4)',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 12px 35px rgba(76, 175, 80, 0.6)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(76, 175, 80, 0.4)';
                }}
              >
                🚀 START GAME
              </button>
            </div>
          </div>
        )}

        {/* Countdown Message */}
        {message && message.includes('Starting') && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(0,0,0,0.9)',
            color: 'white',
            padding: '30px 50px',
            borderRadius: '25px',
            fontSize: '36px',
            fontWeight: 'bold',
            textAlign: 'center',
            zIndex: 35,
            border: '2px solid rgba(255,255,255,0.3)'
          }}>
            {message}
          </div>
        )}

        {/* Status Message Overlay - Remove blue message */}
      </div>

      {/* Game Navigation Bar */}
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
        <div style={{ color: 'white', fontSize: '14px' }}>
          👋 {user?.username}
        </div>
      </div>

      {/* Enhanced Game Animations */}
      <style>{`
        @keyframes roadMove {
          0% { background-position: 0 0; }
          100% { background-position: 0 200px; }
        }
        @keyframes cityMove {
          0% { transform: translateX(0px); }
          100% { transform: translateX(-100px); }
        }
        @keyframes playerRun {
          0% { transform: translateY(0px) rotate(-3deg) translateX(-50%) scale(1.2); }
          100% { transform: translateY(-10px) rotate(3deg) translateX(-50%) scale(1.25); }
        }
        @keyframes playerJump {
          0% { transform: translateX(-50%) scale(1.2) rotate(0deg); }
          50% { transform: translateX(-50%) scale(1.3) rotate(-18deg); }
          100% { transform: translateX(-50%) scale(1.2) rotate(-12deg); }
        }
        @keyframes playerGlow {
          0% { filter: drop-shadow(6px 10px 15px rgba(0,0,0,0.8)) drop-shadow(0 0 20px rgba(255,255,255,0.3)); }
          100% { filter: drop-shadow(6px 10px 15px rgba(0,0,0,0.8)) drop-shadow(0 0 30px rgba(255,255,255,0.6)); }
        }
        @keyframes playerGlow {
          0% { filter: drop-shadow(4px 8px 12px rgba(0,0,0,0.7)) drop-shadow(0 0 15px rgba(255,255,255,0.2)); }
          100% { filter: drop-shadow(4px 8px 12px rgba(0,0,0,0.7)) drop-shadow(0 0 25px rgba(255,255,255,0.4)); }
        }
        @keyframes coinSpin {
          0% { transform: rotateY(0deg) translateX(-50%) scale(1.1); }
          100% { transform: rotateY(360deg) translateX(-50%) scale(1.1); }
        }
        @keyframes coinFloat {
          0%, 100% { transform: translateY(0px) translateX(-50%) scale(1.1); }
          50% { transform: translateY(-8px) translateX(-50%) scale(1.15); }
        }
        @keyframes coinGlow {
          0% { filter: brightness(1) saturate(1); }
          100% { filter: brightness(1.3) saturate(1.5); }
        }
        @keyframes obstacleGlow {
          0% { filter: drop-shadow(0 0 15px rgba(255,50,50,0.6)) drop-shadow(4px 8px 15px rgba(0,0,0,0.8)) brightness(1); }
          100% { filter: drop-shadow(0 0 35px rgba(255,50,50,1)) drop-shadow(4px 8px 15px rgba(0,0,0,0.8)) brightness(1.2); }
        }
        @keyframes obstacleShake {
          0%, 100% { transform: translateX(-50%) scale(1.05) rotate(0deg); }
          25% { transform: translateX(-50%) scale(1.05) rotate(0.5deg); }
          75% { transform: translateX(-50%) scale(1.05) rotate(-0.5deg); }
        }
        @keyframes powerUpPulse {
          0%, 100% { transform: translateX(-50%) scale(1.15); }
          50% { transform: translateX(-50%) scale(1.25); }
        }
        @keyframes powerUpFloat {
          0%, 100% { transform: translateY(0px) translateX(-50%) scale(1.15); }
          50% { transform: translateY(-10px) translateX(-50%) scale(1.2); }
        }
        @keyframes powerUpGlow {
          0% { filter: brightness(1) saturate(1.2); }
          100% { filter: brightness(1.4) saturate(1.8); }
        }
        @keyframes dividerMove {
          0% { background-position: 0 0; }
          100% { background-position: 0 80px; }
        }
        @keyframes floatUp {
          0% { 
            opacity: 1; 
            transform: translateX(-50%) translateY(0px) scale(1); 
          }
          100% { 
            opacity: 0; 
            transform: translateX(-50%) translateY(-140px) scale(1.4); 
          }
        }
        @keyframes slideInUp {
          0% { 
            opacity: 0;
            transform: translateX(-50%) translateY(60px) scale(0.9);
          }
          100% { 
            opacity: 1;
            transform: translateX(-50%) translateY(0px) scale(1);
          }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
};

export default Game;