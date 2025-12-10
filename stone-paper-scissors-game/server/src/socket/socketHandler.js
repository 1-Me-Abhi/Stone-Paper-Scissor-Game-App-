const GameController = require('../controllers/gameController');

class SocketHandler {
  constructor(io) {
    this.io = io;
    this.gameController = new GameController();
    this.setupSocketHandlers();
    
    // Cleanup finished games every 5 minutes
    setInterval(() => {
      this.gameController.cleanupFinishedGames();
    }, 5 * 60 * 1000);
  }

  setupSocketHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`Player ${socket.id} connected`);

      // Player joins the lobby
      socket.on('join-lobby', (playerName) => {
        socket.playerName = playerName;
        socket.emit('joined-lobby', {
          playerId: socket.id,
          playerName: playerName
        });
        
        // Send available games list
        const gamesList = this.gameController.getGamesList();
        socket.emit('games-list', gamesList);
      });

      // Create a new game
      socket.on('create-game', (data) => {
        try {
          const playerName = data.playerName || socket.playerName || 'Player';
          const game = this.gameController.createGame(socket.id, playerName);
          
          socket.join(game.id);
          socket.gameId = game.id;
          
          socket.emit('game-created', {
            gameId: game.id,
            gameState: game.getPlayerState(socket.id)
          });
          
          // Broadcast updated games list to all players in lobby
          this.io.emit('games-list', this.gameController.getGamesList());
          
        } catch (error) {
          socket.emit('error', { message: error.message });
        }
      });

      // Join an existing game
      socket.on('join-game', (data) => {
        try {
          const { gameId } = data;
          const playerName = data.playerName || socket.playerName || 'Player';
          const game = this.gameController.joinGame(gameId, socket.id, playerName);
          
          socket.join(gameId);
          socket.gameId = gameId;
          
          // Notify both players that the game has started
          this.io.to(gameId).emit('game-started', {
            gameState: game.getGameState()
          });
          
          // Update games list for lobby
          this.io.emit('games-list', this.gameController.getGamesList());
          
        } catch (error) {
          socket.emit('error', { message: error.message });
        }
      });

      // Quick join - find any available game or create a new one
      socket.on('quick-join', (data) => {
        try {
          const playerName = data.playerName || socket.playerName || 'Player';
          let game = this.gameController.findAvailableGame();
          
          if (game) {
            // Join existing game
            this.gameController.joinGame(game.id, socket.id, playerName);
            socket.join(game.id);
            socket.gameId = game.id;
            
            // Notify both players that the game has started
            this.io.to(game.id).emit('game-started', {
              gameState: game.getGameState()
            });
          } else {
            // Create new game
            game = this.gameController.createGame(socket.id, playerName);
            socket.join(game.id);
            socket.gameId = game.id;
            
            socket.emit('game-created', {
              gameId: game.id,
              gameState: game.getPlayerState(socket.id)
            });
          }
          
          // Update games list for lobby
          this.io.emit('games-list', this.gameController.getGamesList());
          
        } catch (error) {
          socket.emit('error', { message: error.message });
        }
      });

      // Make a move
      socket.on('make-move', (data) => {
        try {
          const { choice } = data;
          const game = this.gameController.makeMove(socket.id, choice);
          
          // Send updated game state to both players
          if (game.player1) {
            this.io.to(game.player1.id).emit('game-update', {
              gameState: game.getPlayerState(game.player1.id)
            });
          }
          if (game.player2) {
            this.io.to(game.player2.id).emit('game-update', {
              gameState: game.getPlayerState(game.player2.id)
            });
          }
          
          // If both players have made their moves, send round result
          if (game.player1.choice && game.player2.choice) {
            setTimeout(() => {
              this.io.to(game.id).emit('round-result', {
                gameState: game.getGameState(),
                roundWinner: game.roundWinner
              });
              
              // If game is finished, send final result
              if (game.status === 'finished') {
                setTimeout(() => {
                  this.io.to(game.id).emit('game-finished', {
                    gameState: game.getGameState(),
                    winner: game.winner
                  });
                }, 2000);
              }
            }, 1000);
          }
          
        } catch (error) {
          socket.emit('error', { message: error.message });
        }
      });

      // Reset game
      socket.on('reset-game', () => {
        try {
          const game = this.gameController.getPlayerGame(socket.id);
          if (game) {
            this.gameController.resetGame(game.id);
            this.io.to(game.id).emit('game-reset', {
              gameState: game.getGameState()
            });
          }
        } catch (error) {
          socket.emit('error', { message: error.message });
        }
      });

      // Leave game
      socket.on('leave-game', () => {
        this.handlePlayerLeave(socket);
      });

      // Handle disconnect
      socket.on('disconnect', () => {
        console.log(`Player ${socket.id} disconnected`);
        this.handlePlayerLeave(socket);
      });
    });
  }

  handlePlayerLeave(socket) {
    if (socket.gameId) {
      const game = this.gameController.getGame(socket.gameId);
      if (game) {
        // Notify the other player
        socket.to(socket.gameId).emit('player-disconnected', {
          message: 'Your opponent has left the game'
        });
      }
      
      socket.leave(socket.gameId);
      this.gameController.removePlayerFromGame(socket.id);
      
      // Update games list for lobby
      this.io.emit('games-list', this.gameController.getGamesList());
    }
  }
}

module.exports = SocketHandler;