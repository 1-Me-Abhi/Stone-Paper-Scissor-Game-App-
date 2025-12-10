<script>
  import { onMount, onDestroy } from 'svelte';
  import { gameStore, gameActions, connected, error, gameState, playerInfo, gamesList } from './stores/gameStore.js';
  import GameBoard from './components/GameBoard.svelte';
  import PlayerCard from './components/PlayerCard.svelte';
  import GameResult from './components/GameResult.svelte';

  let playerName = '';
  let currentView = 'login';
  let errorMessage = '';
  let connectionStatus = 'disconnected';

  // Subscribe to stores
  const unsubscribe = [
    gameStore.subscribe(store => {
      currentView = store.currentView;
      playerName = store.playerName;
      connectionStatus = store.connectionStatus;
    }),
    error.subscribe(err => {
      errorMessage = err || '';
    })
  ];

  onMount(() => {
    // Auto-connect to server when app loads
    gameActions.connectToServer();
  });

  onDestroy(() => {
    unsubscribe.forEach(fn => fn());
    gameActions.disconnect();
  });

  function handleLogin() {
    if (playerName.trim()) {
      gameActions.joinLobby(playerName.trim());
    }
  }

  function handleCreateGame() {
    gameActions.createGame();
  }

  function handleQuickJoin() {
    gameActions.quickJoin();
  }

  function handleJoinGame(gameId) {
    gameActions.joinGame(gameId);
  }

  function handleLeaveGame() {
    gameActions.leaveGame();
  }
</script>

<main class="app">
  <header class="header">
    <h1>🗿📄✂️ Stone Paper Scissors</h1>
    <div class="connection-status {connectionStatus}">
      {connectionStatus === 'connected' ? '🟢 Connected' : 
       connectionStatus === 'connecting' ? '🟡 Connecting...' : 
       '🔴 Disconnected'}
    </div>
  </header>

  {#if errorMessage}
    <div class="error-message">
      <span>⚠️ {errorMessage}</span>
      <button on:click={() => errorMessage = ''}>×</button>
    </div>
  {/if}

  <div class="container">
    {#if currentView === 'login'}
      <div class="login-screen">
        <div class="login-card">
          <h2>Welcome to Stone Paper Scissors!</h2>
          <p>Enter your name to start playing</p>
          <form on:submit|preventDefault={handleLogin}>
            <input 
              type="text" 
              placeholder="Your name" 
              bind:value={playerName}
              maxlength="20"
              required
            />
            <button type="submit" disabled={!playerName.trim() || connectionStatus !== 'connected'}>
              {connectionStatus === 'connected' ? 'Join Game' : 'Connecting...'}
            </button>
          </form>
        </div>
      </div>

    {:else if currentView === 'lobby'}
      <div class="lobby">
        <div class="lobby-header">
          <h2>Game Lobby</h2>
          <p>Welcome, <strong>{playerName}</strong>!</p>
        </div>
        
        <div class="lobby-actions">
          <button class="primary" on:click={handleCreateGame}>
            🎮 Create New Game
          </button>
          <button class="secondary" on:click={handleQuickJoin}>
            ⚡ Quick Join
          </button>
        </div>

        <div class="games-list">
          <h3>Available Games</h3>
          {#if $gamesList && $gamesList.length > 0}
            <div class="games-grid">
              {#each $gamesList as game}
                {#if game.status === 'waiting'}
                  <div class="game-card">
                    <div class="game-info">
                      <span class="game-id">Game #{game.id}</span>
                      <span class="players-count">{game.playersCount}/2 players</span>
                    </div>
                    <button on:click={() => handleJoinGame(game.id)}>
                      Join Game
                    </button>
                  </div>
                {/if}
              {/each}
            </div>
          {:else}
            <p class="no-games">No games available. Create one!</p>
          {/if}
        </div>
      </div>

    {:else if currentView === 'waiting'}
      <div class="waiting-screen">
        <div class="waiting-card">
          <h2>🎮 Game Created!</h2>
          <p>Waiting for another player to join...</p>
          <div class="spinner"></div>
          <button class="secondary" on:click={handleLeaveGame}>
            Cancel
          </button>
        </div>
      </div>

    {:else if currentView === 'game'}
      <GameBoard />
    {/if}
  </div>
</main>

<style>
  :global(body) {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    color: #333;
  }

  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .header {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }

  .header h1 {
    margin: 0;
    color: white;
    font-size: 1.8rem;
  }

  .connection-status {
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 500;
  }

  .connection-status.connected {
    background: rgba(76, 175, 80, 0.2);
    color: #4caf50;
  }

  .connection-status.connecting {
    background: rgba(255, 193, 7, 0.2);
    color: #ffc107;
  }

  .connection-status.disconnected {
    background: rgba(244, 67, 54, 0.2);
    color: #f44336;
  }

  .container {
    flex: 1;
    padding: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .login-screen, .waiting-screen {
    width: 100%;
    max-width: 400px;
  }

  .login-card, .waiting-card {
    background: white;
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    text-align: center;
  }

  .login-card h2, .waiting-card h2 {
    margin: 0 0 1rem 0;
    color: #333;
  }

  .login-card p, .waiting-card p {
    margin: 0 0 2rem 0;
    color: #666;
  }

  .login-card input {
    width: 100%;
    padding: 1rem;
    border: 2px solid #e0e0e0;
    border-radius: 10px;
    font-size: 1rem;
    margin-bottom: 1rem;
    box-sizing: border-box;
  }

  .login-card input:focus {
    outline: none;
    border-color: #667eea;
  }

  .lobby {
    width: 100%;
    max-width: 800px;
    background: white;
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }

  .lobby-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .lobby-header h2 {
    margin: 0 0 0.5rem 0;
    color: #333;
  }

  .lobby-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-bottom: 2rem;
  }

  .games-list h3 {
    margin: 0 0 1rem 0;
    color: #333;
  }

  .games-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }

  .game-card {
    background: #f5f5f5;
    border-radius: 10px;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .game-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .game-id {
    font-weight: 500;
    color: #333;
  }

  .players-count {
    font-size: 0.9rem;
    color: #666;
  }

  .no-games {
    text-align: center;
    color: #666;
    font-style: italic;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 1rem auto;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  button {
    background: #667eea;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 10px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s ease;
    font-weight: 500;
  }

  button:hover {
    background: #5a67d8;
    transform: translateY(-2px);
  }

  button:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }

  button.secondary {
    background: #e0e0e0;
    color: #333;
  }

  button.secondary:hover {
    background: #d0d0d0;
  }

  .error-message {
    background: #ffebee;
    border: 1px solid #ffcdd2;
    color: #c62828;
    padding: 1rem;
    border-radius: 10px;
    margin: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .error-message button {
    background: none;
    color: #c62828;
    border: none;
    font-size: 1.2rem;
    padding: 0;
    min-width: auto;
  }
</style>