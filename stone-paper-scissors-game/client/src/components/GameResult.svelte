<script>
  export let result;

  const getChoiceEmoji = (choice) => {
    const choices = {
      'rock': '🗿',
      'paper': '📄',
      'scissors': '✂️'
    };
    return choices[choice] || '❓';
  };

  const getResultMessage = (roundWinner) => {
    switch(roundWinner) {
      case 'player1':
        return '🎉 Player 1 wins this round!';
      case 'player2':
        return '🎉 Player 2 wins this round!';
      case 'tie':
        return '🤝 It\'s a tie!';
      default:
        return '';
    }
  };

  $: gameState = result?.gameState;
  $: roundWinner = result?.roundWinner;
</script>

{#if result && gameState}
  <div class="game-result">
    <h2>Round {gameState.round} Result</h2>
    
    <div class="choices-comparison">
      <div class="player-result">
        <h3>{gameState.player1.name}</h3>
        <div class="choice-display">
          <span class="choice-emoji">{getChoiceEmoji(gameState.player1.choice)}</span>
          <span class="choice-name">{gameState.player1.choice}</span>
        </div>
      </div>
      
      <div class="vs-separator">
        VS
      </div>
      
      <div class="player-result">
        <h3>{gameState.player2.name}</h3>
        <div class="choice-display">
          <span class="choice-emoji">{getChoiceEmoji(gameState.player2.choice)}</span>
          <span class="choice-name">{gameState.player2.choice}</span>
        </div>
      </div>
    </div>
    
    <div class="result-message">
      <p class="result-text">{getResultMessage(roundWinner)}</p>
    </div>
    
    <div class="current-scores">
      <h3>Current Scores:</h3>
      <div class="scores">
        <div class="score">
          <span class="player-name">{gameState.player1.name}</span>
          <span class="score-value">{gameState.player1.score}</span>
        </div>
        <div class="score">
          <span class="player-name">{gameState.player2.name}</span>
          <span class="score-value">{gameState.player2.score}</span>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .game-result {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 20px;
    padding: 2rem;
    margin: 1rem 0;
    text-align: center;
    animation: slideIn 0.5s ease-out;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .game-result h2 {
    margin: 0 0 1.5rem 0;
    font-size: 1.5rem;
  }

  .choices-comparison {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    margin-bottom: 1.5rem;
  }

  .player-result {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    flex: 1;
    max-width: 200px;
  }

  .player-result h3 {
    margin: 0;
    font-size: 1.1rem;
    opacity: 0.9;
  }

  .choice-display {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 15px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    backdrop-filter: blur(10px);
  }

  .choice-emoji {
    font-size: 3rem;
  }

  .choice-name {
    font-size: 1rem;
    font-weight: 500;
    text-transform: capitalize;
  }

  .vs-separator {
    font-size: 1.5rem;
    font-weight: bold;
    opacity: 0.8;
    padding: 1rem;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .result-message {
    margin: 1.5rem 0;
  }

  .result-text {
    font-size: 1.3rem;
    font-weight: bold;
    margin: 0;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  }

  .current-scores {
    margin-top: 1.5rem;
  }

  .current-scores h3 {
    margin: 0 0 1rem 0;
    font-size: 1.1rem;
    opacity: 0.9;
  }

  .scores {
    display: flex;
    justify-content: center;
    gap: 3rem;
  }

  .score {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
  }

  .player-name {
    font-size: 0.9rem;
    opacity: 0.8;
  }

  .score-value {
    font-size: 2rem;
    font-weight: bold;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 768px) {
    .game-result {
      padding: 1.5rem;
      margin: 1rem;
    }

    .choices-comparison {
      flex-direction: column;
      gap: 1rem;
    }

    .vs-separator {
      transform: rotate(90deg);
      margin: 0.5rem 0;
    }

    .choice-emoji {
      font-size: 2.5rem;
    }

    .scores {
      gap: 2rem;
    }
  }
</style>