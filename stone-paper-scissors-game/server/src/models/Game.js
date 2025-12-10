class Game {
    constructor() {
        this.players = {};
        this.scores = {};
        this.currentRound = 0;
        this.maxRounds = 5; // Set the maximum number of rounds
    }

    addPlayer(playerId) {
        if (!this.players[playerId]) {
            this.players[playerId] = null; // Initialize player choice as null
            this.scores[playerId] = 0; // Initialize player score
        }
    }

    makeMove(playerId, choice) {
        if (this.players[playerId] === null) {
            this.players[playerId] = choice;
        }
    }

    determineWinner() {
        const choices = Object.values(this.players);
        if (choices.includes(null)) {
            return null; // Not all players have made their move
        }

        const [player1Choice, player2Choice] = choices;
        if (player1Choice === player2Choice) {
            return 'draw';
        }

        const winningCombinations = {
            rock: 'scissors',
            scissors: 'paper',
            paper: 'rock',
        };

        if (winningCombinations[player1Choice] === player2Choice) {
            return 'player1'; // Player 1 wins
        } else {
            return 'player2'; // Player 2 wins
        }
    }

    updateScores(winner) {
        if (winner === 'player1') {
            this.scores[Object.keys(this.players)[0]] += 1;
        } else if (winner === 'player2') {
            this.scores[Object.keys(this.players)[1]] += 1;
        }
    }

    resetRound() {
        this.players = {};
        this.currentRound += 1;
    }

    isGameOver() {
        return this.currentRound >= this.maxRounds;
    }
}

export default Game;