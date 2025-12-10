<script>
  import GameBoard from './components/GameBoard.svelte';
  import PlayerCard from './components/PlayerCard.svelte';
  import GameResult from './components/GameResult.svelte';
  import { gameStore } from './stores/gameStore.js';

  let player1 = { name: 'Player 1', score: 0 };
  let player2 = { name: 'Player 2', score: 0 };
  let gameStatus = '';

  $: gameStatus = gameStore.status;

  const resetGame = () => {
    gameStore.reset();
    player1.score = 0;
    player2.score = 0;
  };
</script>

<main>
  <h1>Stone Paper Scissors Game</h1>
  <PlayerCard {player1} />
  <PlayerCard {player2} />
  <GameBoard />
  <GameResult {gameStatus} />
  <button on:click={resetGame}>Reset Game</button>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 600px;
    margin: 0 auto;
  }
</style>