// Game Configuration Data

export const PLAYER_SKINS = [
  { id: 'runner', emoji: '🏃♂️', name: 'Runner', price: 0, unlocked: true },
  { id: 'ninja', emoji: '🥷', name: 'Ninja', price: 500, unlocked: false },
  { id: 'robot', emoji: '🤖', name: 'Robot', price: 1000, unlocked: false },
  { id: 'superhero', emoji: '🦸', name: 'Superhero', price: 1500, unlocked: false },
  { id: 'alien', emoji: '👽', name: 'Alien', price: 2000, unlocked: false },
  { id: 'wizard', emoji: '🧙', name: 'Wizard', price: 2500, unlocked: false }
];

export const THEMES = [
  { 
    id: 'city', 
    name: 'City Night', 
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    road: '#2c2c2c',
    price: 0,
    unlocked: true
  },
  { 
    id: 'desert', 
    name: 'Desert', 
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    road: '#d4a574',
    price: 800,
    unlocked: false
  },
  { 
    id: 'snow', 
    name: 'Snow', 
    background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    road: '#e8f4f8',
    price: 1200,
    unlocked: false
  },
  { 
    id: 'space', 
    name: 'Space', 
    background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    road: '#1a1a2e',
    price: 1500,
    unlocked: false
  }
];

export const GAME_MODES = [
  {
    id: 'endless',
    name: 'Endless Mode',
    icon: '♾️',
    description: 'Play until you make 3 mistakes',
    unlocked: true
  },
  {
    id: 'timeattack',
    name: 'Time Attack',
    icon: '⏱️',
    description: 'Score maximum in 60 seconds',
    unlocked: true
  },
  {
    id: 'survival',
    name: 'Survival',
    icon: '💀',
    description: 'Extreme difficulty from start',
    unlocked: false,
    requirement: 'Score 1000+ in Endless'
  },
  {
    id: 'challenge',
    name: 'Daily Challenge',
    icon: '🎯',
    description: 'Complete daily missions',
    unlocked: true
  }
];

export const DAILY_CHALLENGES = [
  { id: 1, task: 'Collect 50 coins', reward: 100, icon: '🪙', target: 50, type: 'coins' },
  { id: 2, task: 'Reach 500 score', reward: 150, icon: '🎯', target: 500, type: 'score' },
  { id: 3, task: 'Get 10x combo', reward: 200, icon: '🔥', target: 10, type: 'combo' },
  { id: 4, task: 'Travel 1000m', reward: 250, icon: '🏃', target: 1000, type: 'distance' },
  { id: 5, task: 'Play 3 games', reward: 100, icon: '🎮', target: 3, type: 'games' }
];

export const POWER_UPS_SHOP = [
  { id: 'shield', name: 'Shield', icon: '🛡️', price: 50, description: 'Absorb one hit' },
  { id: 'magnet', name: 'Magnet', icon: '🧲', price: 75, description: 'Attract nearby coins' },
  { id: 'multiplier', name: 'Multiplier', icon: '⭐', price: 100, description: '+100 instant points' },
  { id: 'invincible', name: 'Invincible', icon: '✨', price: 150, description: '3s immunity' },
  { id: 'slowmo', name: 'Slow Motion', icon: '⏰', price: 200, description: 'Slow time for 5s' },
  { id: 'doublejump', name: 'Double Jump', icon: '🦘', price: 250, description: 'Jump twice in air' }
];

export const OBSTACLE_TYPES = [
  { type: 'train', emoji: '🚆', name: 'Oncoming Train' },
  { type: 'barricade', emoji: '🚧', name: 'Barricade' },
  { type: 'sign', emoji: '🪧', name: 'Low Hanging Sign' },
  { type: 'gate', emoji: '🚪', name: 'Closing Gate' },
  { type: 'fan', emoji: '💨', name: 'Rotating Fan' },
  { type: 'barrier', emoji: '⚠️', name: 'Pop-up Barrier' }
];

export const ACHIEVEMENTS_EXTENDED = [
  { id: 'first_game', name: 'First Steps', icon: '👶', description: 'Play your first game', requirement: 1, type: 'games' },
  { id: 'score_100', name: 'Century', icon: '💯', description: 'Score 100 points', requirement: 100, type: 'score' },
  { id: 'score_500', name: 'High Roller', icon: '🎰', description: 'Score 500 points', requirement: 500, type: 'score' },
  { id: 'score_1000', name: 'Master', icon: '🏆', description: 'Score 1000 points', requirement: 1000, type: 'score' },
  { id: 'combo_10', name: 'Combo King', icon: '🔥', description: 'Get 10x combo', requirement: 10, type: 'combo' },
  { id: 'combo_20', name: 'Combo God', icon: '⚡', description: 'Get 20x combo', requirement: 20, type: 'combo' },
  { id: 'distance_500', name: 'Marathon', icon: '🏃', description: 'Travel 500m', requirement: 500, type: 'distance' },
  { id: 'distance_1000', name: 'Ultra Marathon', icon: '🚀', description: 'Travel 1000m', requirement: 1000, type: 'distance' },
  { id: 'coins_100', name: 'Coin Collector', icon: '🪙', description: 'Collect 100 coins total', requirement: 100, type: 'totalCoins' },
  { id: 'coins_500', name: 'Treasure Hunter', icon: '💰', description: 'Collect 500 coins total', requirement: 500, type: 'totalCoins' },
  { id: 'games_10', name: 'Dedicated', icon: '🎮', description: 'Play 10 games', requirement: 10, type: 'totalGames' },
  { id: 'games_50', name: 'Veteran', icon: '🎖️', description: 'Play 50 games', requirement: 50, type: 'totalGames' },
  { id: 'perfect_game', name: 'Perfect Run', icon: '✨', description: 'Score 300+ with 0 mistakes', requirement: 300, type: 'perfect' },
  { id: 'speed_demon', name: 'Speed Demon', icon: '💨', description: 'Reach 3x speed', requirement: 3, type: 'speed' }
];

export const LEVEL_SYSTEM = {
  getLevel: (xp) => Math.floor(Math.sqrt(xp / 100)) + 1,
  getXPForLevel: (level) => Math.pow(level - 1, 2) * 100,
  getXPForNextLevel: (level) => Math.pow(level, 2) * 100,
  calculateXP: (score, distance, combo) => {
    return Math.floor(score * 0.5 + distance * 0.1 + combo * 5);
  }
};

export const SOUND_EFFECTS = {
  move: { frequency: 200, duration: 0.1, type: 'sine' },
  jump: { frequency: 350, duration: 0.15, type: 'square' },
  coin: { frequency: 400, duration: 0.15, type: 'sine' },
  powerup: { frequency: 500, duration: 0.3, type: 'square' },
  mistake: { frequency: 100, duration: 0.5, type: 'sawtooth' },
  gameover: { frequency: 150, duration: 1.5, type: 'sawtooth' },
  levelup: { frequency: 800, duration: 1, type: 'sine' }
};
