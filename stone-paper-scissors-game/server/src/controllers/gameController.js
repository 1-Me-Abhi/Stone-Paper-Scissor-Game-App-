const Game = require('../models/Game');

class GameController {
  constructor() {
    this.games = new Map();
    this.players = new Map(); // playerId -> gameId mapping
  }

  createGame(playerId, playerName) {
    const gameId = this.generateGameId();
    const game = new Game(gameId, playerId, playerName);
    this.games.set(gameId, game);
    this.players.set(playerId, gameId);
    
    return game;
  }

  joinGame(gameId, playerId, playerName) {
    const game = this.games.get(gameId);
    if (!game) {
      throw new Error('Game not found');
    }
    
    if (game.status !== 'waiting') {
      throw new Error('Game is not available for joining');
    }
    
    game.addPlayer2(playerId, playerName);
    this.players.set(playerId, gameId);
    
    return game;
  }

  findAvailableGame() {
    for (const [gameId, game] of this.games) {
      if (game.status === 'waiting') {
        return game;
      }
    }
    return null;
  }

  makeMove(playerId, choice) {
    const gameId = this.players.get(playerId);
    if (!gameId) {
      throw new Error('Player not in any game');
    }
    
    const game = this.games.get(gameId);
    if (!game) {
      throw new Error('Game not found');
    }
    
    game.makeMove(playerId, choice);
    return game;
  }

  getGame(gameId) {
    return this.games.get(gameId);
  }

  getPlayerGame(playerId) {
    const gameId = this.players.get(playerId);
    if (!gameId) {
      return null;
    }
    return this.games.get(gameId);
  }

  removePlayerFromGame(playerId) {
    const gameId = this.players.get(playerId);
    if (gameId) {
      this.players.delete(playerId);
      const game = this.games.get(gameId);
      if (game) {
        // If it's a waiting game, remove it entirely
        if (game.status === 'waiting') {
          this.games.delete(gameId);
        } else {
          // Mark the game as abandoned or handle disconnection
          game.status = 'abandoned';
        }
      }
    }
  }

  resetGame(gameId) {
    const game = this.games.get(gameId);
    if (game) {
      game.reset();
      return game;
    }
    throw new Error('Game not found');
  }

  generateGameId() {
    return Math.random().toString(36).substr(2, 9);
  }

  getGamesList() {
    const gamesList = [];
    for (const [gameId, game] of this.games) {
      gamesList.push({
        id: gameId,
        status: game.status,
        playersCount: game.player2 ? 2 : 1,
        round: game.round,
        createdAt: game.createdAt
      });
    }
    return gamesList;
  }

  cleanupFinishedGames() {
    const now = new Date();
    const maxAge = 30 * 60 * 1000; // 30 minutes
    
    for (const [gameId, game] of this.games) {
      if (game.status === 'finished' || game.status === 'abandoned') {
        if (now - game.createdAt > maxAge) {
          this.games.delete(gameId);
          // Remove players from this game
          if (game.player1) this.players.delete(game.player1.id);
          if (game.player2) this.players.delete(game.player2.id);
        }
      }
    }
  }
}

module.exports = GameController;