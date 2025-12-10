class Game {
  constructor(id, player1Id, player1Name) {
    this.id = id;
    this.player1 = {
      id: player1Id,
      name: player1Name,
      choice: null,
      score: 0
    };
    this.player2 = null;
    this.status = 'waiting'; // waiting, playing, finished
    this.round = 1;
    this.maxRounds = 3;
    this.winner = null;
    this.roundWinner = null;
    this.createdAt = new Date();
  }

  addPlayer2(player2Id, player2Name) {
    if (this.player2) {
      throw new Error('Game is already full');
    }
    
    this.player2 = {
      id: player2Id,
      name: player2Name,
      choice: null,
      score: 0
    };
    this.status = 'playing';
  }

  makeMove(playerId, choice) {
    if (this.status !== 'playing') {
      throw new Error('Game is not in playing state');
    }

    const validChoices = ['rock', 'paper', 'scissors'];
    if (!validChoices.includes(choice)) {
      throw new Error('Invalid choice');
    }

    if (this.player1.id === playerId) {
      this.player1.choice = choice;
    } else if (this.player2.id === playerId) {
      this.player2.choice = choice;
    } else {
      throw new Error('Player not in this game');
    }

    // Check if both players have made their moves
    if (this.player1.choice && this.player2.choice) {
      this.determineRoundWinner();
    }
  }

  determineRoundWinner() {
    const p1Choice = this.player1.choice;
    const p2Choice = this.player2.choice;

    if (p1Choice === p2Choice) {
      this.roundWinner = 'tie';
    } else if (
      (p1Choice === 'rock' && p2Choice === 'scissors') ||
      (p1Choice === 'paper' && p2Choice === 'rock') ||
      (p1Choice === 'scissors' && p2Choice === 'paper')
    ) {
      this.roundWinner = 'player1';
      this.player1.score++;
    } else {
      this.roundWinner = 'player2';
      this.player2.score++;
    }

    // Check if game is over
    if (this.round >= this.maxRounds || this.player1.score > this.maxRounds / 2 || this.player2.score > this.maxRounds / 2) {
      this.determineGameWinner();
    } else {
      // Prepare for next round
      setTimeout(() => {
        this.nextRound();
      }, 3000); // 3 second delay before next round
    }
  }

  determineGameWinner() {
    if (this.player1.score > this.player2.score) {
      this.winner = 'player1';
    } else if (this.player2.score > this.player1.score) {
      this.winner = 'player2';
    } else {
      this.winner = 'tie';
    }
    this.status = 'finished';
  }

  nextRound() {
    this.round++;
    this.player1.choice = null;
    this.player2.choice = null;
    this.roundWinner = null;
  }

  reset() {
    this.player1.choice = null;
    this.player1.score = 0;
    this.player2.choice = null;
    this.player2.score = 0;
    this.round = 1;
    this.winner = null;
    this.roundWinner = null;
    this.status = 'playing';
  }

  getGameState() {
    return {
      id: this.id,
      player1: {
        id: this.player1.id,
        name: this.player1.name,
        choice: this.player1.choice,
        score: this.player1.score
      },
      player2: this.player2 ? {
        id: this.player2.id,
        name: this.player2.name,
        choice: this.player2.choice,
        score: this.player2.score
      } : null,
      status: this.status,
      round: this.round,
      maxRounds: this.maxRounds,
      winner: this.winner,
      roundWinner: this.roundWinner
    };
  }

  getPlayerState(playerId) {
    const gameState = this.getGameState();
    
    // Hide opponent's choice until both players have made their moves
    if (this.status === 'playing' && (!this.player1.choice || !this.player2.choice)) {
      if (this.player1.id === playerId && this.player2) {
        gameState.player2.choice = null;
      } else if (this.player2 && this.player2.id === playerId) {
        gameState.player1.choice = null;
      }
    }
    
    return gameState;
  }
}

module.exports = Game;