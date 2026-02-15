/**
 * AI Difficulty Adjustment Engine
 * Rule-based algorithm to dynamically adjust game difficulty
 */

class DifficultyEngine {
  
  /**
   * Calculate difficulty based on player performance metrics
   * @param {Object} playerData - Player performance data
   * @returns {String} - Difficulty level (EASY, MEDIUM, HARD)
   */
  static calculateDifficulty(playerData) {
    const { score, reactionTime, mistakes, speed } = playerData;
    
    // More achievable thresholds for difficulty progression
    const scoreRatio = Math.min(score / 300, 1); // Reduced from 1000 to 300
    const reactionRatio = Math.max(0, 1 - (reactionTime / 1500)); // Reduced from 2000 to 1500
    const mistakeRatio = Math.max(0, 1 - (mistakes / 5)); // Reduced from 10 to 5
    
    // Calculate performance score (weighted average)
    const performanceScore = (
      scoreRatio * 0.5 +           // 50% weight on score (increased)
      reactionRatio * 0.25 +       // 25% weight on reaction time
      mistakeRatio * 0.25          // 25% weight on mistake count
    );
    
    // Easier progression thresholds
    if (performanceScore < 0.25) {  // Reduced from 0.3
      return 'EASY';
    } else if (performanceScore < 0.55) {  // Reduced from 0.7
      return 'MEDIUM';
    } else {
      return 'HARD';
    }
  }
  
  /**
   * Get difficulty settings for game mechanics
   * @param {String} difficulty - Current difficulty level
   * @returns {Object} - Game settings
   */
  static getDifficultySettings(difficulty) {
    const settings = {
      EASY: {
        gameSpeed: 0.5,
        lives: 5,
        timeBonus: 2,
        description: 'Relaxed pace, more lives'
      },
      MEDIUM: {
        gameSpeed: 1.0,
        lives: 3,
        timeBonus: 1,
        description: 'Normal pace, standard lives'
      },
      HARD: {
        gameSpeed: 1.5,
        lives: 1,
        timeBonus: 0.5,
        description: 'Fast pace, minimal lives'
      }
    };
    
    return settings[difficulty] || settings.EASY;
  }
  
  /**
   * Analyze player trends for future ML implementation
   * @param {Array} playerHistory - Array of player performance data
   * @returns {Object} - Analysis results
   */
  static analyzePlayerTrends(playerHistory) {
    if (!playerHistory || playerHistory.length === 0) {
      return { trend: 'STABLE', confidence: 0 };
    }
    
    const recent = playerHistory.slice(-5); // Last 5 games
    const avgScore = recent.reduce((sum, game) => sum + game.score, 0) / recent.length;
    const avgReaction = recent.reduce((sum, game) => sum + game.reactionTime, 0) / recent.length;
    
    // Simple trend analysis
    if (avgScore > 500 && avgReaction < 800) {
      return { trend: 'IMPROVING', confidence: 0.8 };
    } else if (avgScore < 200 || avgReaction > 1500) {
      return { trend: 'STRUGGLING', confidence: 0.7 };
    }
    
    return { trend: 'STABLE', confidence: 0.6 };
  }
}

module.exports = DifficultyEngine;