<script>
  import { gameState, gameActions, myPlayer, opponent, canMakeMove, gameStore, roundResult, gameFinished } from '../stores/gameStore.js';
  import PlayerCard from './PlayerCard.svelte';
  import GameResult from './GameResult.svelte';

  const choices = [
    { value: 'rock', emoji: '🗿', name: 'Rock' },
    { value: 'paper', emoji: '📄', name: 'Paper' },
    { value: 'scissors', emoji: '✂️', name: 'Scissors' }
  ];

  function makeMove(choice) {
    gameActions.makeMove(choice);
  }

  function handleLeaveGame() {
    gameActions.leaveGame();
  }

  function handleResetGame() {
    gameActions.resetGame();
  }

  $: game = $gameState;
  $: me = $myPlayer;
  $: opp = $opponent;
  $: canMove = $canMakeMove;
  $: currentStore = $gameStore;
</script>

<div class="game-board">
  {#if game}
    <div class="game-header">
      <div class="game-info">
        <h2>Round {game.round} of {game.maxRounds}</h2>
        <div class="game-status">
          {#if game.status === 'waiting'}
            <span class="status waiting">⏳ Waiting for opponent...</span>
          {:else if game.status === 'playing'}
            {#if canMove}
              <span class="status your-turn">🎯 Your turn! Choose your move</span>
            {:else if currentStore.hasSubmittedChoice}
              <span class="status waiting">⏳ Waiting for opponent...</span>
            {:else}
              <span class="status waiting">⏳ Waiting...</span>
            {/if}
          {:else if game.status === 'finished'}
            <span class="status finished">🎉 Game finished!</span>
          {/if}
        </div>
      </div>
      <button class="leave-btn" on:click={handleLeaveGame}>Leave Game</button>
    </div>

    <div class="players-section">
      {#if me && opp}
        <div class="players-container">
          <PlayerCard player={me} isMe={true} />
          <div class="vs-divider">
            <span>VS</span>
          </div>
          <PlayerCard player={opp} isMe={false} />
        </div>
      {:else if me}
        <div class="single-player">
          <PlayerCard player={me} isMe={true} />
          <div class="waiting-opponent">
            <h3>Waiting for opponent...</h3>
            <div class="spinner"></div>
          </div>
        </div>
      {/if}
    </div>

    {#if game.status === 'playing' && canMove}
      <div class="choices-section">
        <h3>Choose your move:</h3>
        <div class="choices-grid">
          {#each choices as choice}
            <button 
              class="choice-btn"
              class:selected={currentStore.selectedChoice === choice.value}
              disabled={!canMove}
              on:click={() => makeMove(choice.value)}
            >
              <span class="choice-emoji">{choice.emoji}</span>
              <span class="choice-name">{choice.name}</span>
            </button>
          {/each}
        </div>
      </div>
    {:else if currentStore.hasSubmittedChoice && currentStore.selectedChoice}
      <div class="selected-choice">
        <h3>Your choice:</h3>
        <div class="choice-display">
          {#each choices as choice}
            {#if choice.value === currentStore.selectedChoice}
              <div class="selected-choice-card">
                <span class="choice-emoji large">{choice.emoji}</span>
                <span class="choice-name">{choice.name}</span>
              </div>
            {/if}
          {/each}
        </div>
        <p>Waiting for opponent's choice...</p>
      </div>
    {/if}

    {#if $roundResult}
      <GameResult result={$roundResult} />
    {/if}

    {#if $gameFinished}
      <div class="game-finished">
        <div class="final-result">
          <h2>🎉 Game Over!</h2>
          {#if $gameFinished.winner === 'player1' && me?.id === game.player1?.id}
            <p class="winner">🏆 You Won!</p>
          {:else if $gameFinished.winner === 'player2' && me?.id === game.player2?.id}
            <p class="winner">🏆 You Won!</p>
          {:else if $gameFinished.winner === 'tie'}
            <p class="tie">🤝 It's a Tie!</p>
          {:else}
            <p class="loser">😔 You Lost!</p>
          {/if}
          
          <div class="final-scores">
            <h3>Final Scores:</h3>
            <div class="scores">
              <div class="score">
                <span class="player-name">{game.player1?.name}</span>
                <span class="points">{game.player1?.score}</span>
              </div>
              <div class="score">
                <span class="player-name">{game.player2?.name}</span>
                <span class="points">{game.player2?.score}</span>
              </div>
            </div>
          </div>
          
          <div class="game-actions">
            <button class="primary" on:click={handleResetGame}>
              🔄 Play Again
            </button>
            <button class="secondary" on:click={handleLeaveGame}>
              🚪 Leave Game
            </button>
          </div>
        </div>
      </div>
    {/if}
  {:else}
    <div class="no-game">
      <p>No game data available</p>
      <button on:click={handleLeaveGame}>Back to Lobby</button>
    </div>
  {/if}
</div>

<style>
  .game-board {
    width: 100%;
    max-width: 1000px;
    background: white;
    border-radius: 20px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    padding: 2rem;
    margin: 0 auto;
  }

  .game-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #f0f0f0;
  }

  .game-info h2 {
    margin: 0 0 0.5rem 0;
    color: #333;
    font-size: 1.5rem;
  }

  .game-status {
    font-size: 1rem;
  }

  .status {
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-weight: 500;
  }

  .status.your-turn {
    background: rgba(76, 175, 80, 0.1);
    color: #4caf50;
  }

  .status.waiting {
    background: rgba(255, 193, 7, 0.1);
    color: #ff9800;
  }

  .status.finished {
    background: rgba(156, 39, 176, 0.1);
    color: #9c27b0;
  }

  .leave-btn {
    background: #f44336;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
  }

  .leave-btn:hover {
    background: #d32f2f;
  }

  .players-section {
    margin-bottom: 2rem;
  }

  .players-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2rem;
  }

  .vs-divider {
    font-size: 1.5rem;
    font-weight: bold;
    color: #666;
    padding: 1rem;
    background: #f5f5f5;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .single-player {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }

  .waiting-opponent {
    text-align: center;
    color: #666;
  }

  .waiting-opponent h3 {
    margin: 0 0 1rem 0;
  }

  .choices-section {
    text-align: center;
    margin-bottom: 2rem;
  }

  .choices-section h3 {
    margin: 0 0 1.5rem 0;
    color: #333;
    font-size: 1.3rem;
  }

  .choices-grid {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .choice-btn {
    background: white;
    border: 3px solid #e0e0e0;
    border-radius: 15px;
    padding: 1.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    min-width: 120px;
  }

  .choice-btn:hover {
    border-color: #667eea;
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.2);
  }

  .choice-btn.selected {
    border-color: #667eea;
    background: rgba(102, 126, 234, 0.1);
  }

  .choice-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  .choice-emoji {
    font-size: 3rem;
  }

  .choice-emoji.large {
    font-size: 4rem;
  }

  .choice-name {
    font-size: 1rem;
    font-weight: 500;
    color: #333;
  }

  .selected-choice {
    text-align: center;
    margin-bottom: 2rem;
  }

  .selected-choice h3 {
    margin: 0 0 1rem 0;
    color: #333;
  }

  .choice-display {
    margin-bottom: 1rem;
  }

  .selected-choice-card {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1.5rem;
    border: 3px solid #667eea;
    border-radius: 15px;
    background: rgba(102, 126, 234, 0.1);
  }

  .game-finished {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .final-result {
    background: white;
    border-radius: 20px;
    padding: 3rem;
    text-align: center;
    max-width: 500px;
    width: 90%;
  }

  .final-result h2 {
    margin: 0 0 1rem 0;
    color: #333;
  }

  .winner {
    font-size: 1.5rem;
    color: #4caf50;
    font-weight: bold;
    margin: 0 0 2rem 0;
  }

  .loser {
    font-size: 1.5rem;
    color: #f44336;
    font-weight: bold;
    margin: 0 0 2rem 0;
  }

  .tie {
    font-size: 1.5rem;
    color: #ff9800;
    font-weight: bold;
    margin: 0 0 2rem 0;
  }

  .final-scores h3 {
    margin: 0 0 1rem 0;
    color: #333;
  }

  .scores {
    display: flex;
    justify-content: space-around;
    margin-bottom: 2rem;
  }

  .score {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .player-name {
    font-weight: 500;
    color: #666;
  }

  .points {
    font-size: 2rem;
    font-weight: bold;
    color: #333;
  }

  .game-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  .spinner {
    width: 30px;
    height: 30px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .no-game {
    text-align: center;
    padding: 3rem;
  }

  .no-game p {
    margin: 0 0 2rem 0;
    color: #666;
    font-size: 1.2rem;
  }

  button.primary {
    background: #667eea;
    color: white;
  }

  button.primary:hover {
    background: #5a67d8;
  }

  button.secondary {
    background: #e0e0e0;
    color: #333;
  }

  button.secondary:hover {
    background: #d0d0d0;
  }

  button {
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 10px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s ease;
    font-weight: 500;
  }

  @media (max-width: 768px) {
    .game-board {
      padding: 1rem;
      margin: 0;
      border-radius: 0;
    }

    .players-container {
      flex-direction: column;
      gap: 1rem;
    }

    .vs-divider {
      width: 40px;
      height: 40px;
      font-size: 1rem;
    }

    .choices-grid {
      flex-direction: column;
      align-items: center;
    }

    .choice-btn {
      min-width: 200px;
    }

    .game-header {
      flex-direction: column;
      gap: 1rem;
      align-items: center;
    }
  }
</style>
  }
  .choices {
    display: flex;
    justify-content: center;
    margin: 20px 0;
  }
  .choice {
    margin: 0 10px;
    cursor: pointer;
    padding: 10px 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    transition: background-color 0.3s;
  }
  .choice:hover {
    background-color: #f0f0f0;
  }
</style>

<div class="game-board">
  <h1>Stone Paper Scissors</h1>
  <div class="choices">
    {#each choices as choice}
      <div class="choice" on:click={() => makeChoice(choice)}>
        {choice}
      </div>
    {/each}
  </div>
  <PlayerCard />
  {#if gameResult}
    <GameResult {gameResult} />
  {/if}
</div>