<script>
  import { onMount } from 'svelte';
  import { gameStore } from '../stores/gameStore';

  export let playerId;

  let playerChoice = '';
  let playerScore = 0;

  const unsubscribe = gameStore.subscribe(state => {
    const player = state.players.find(p => p.id === playerId);
    if (player) {
      playerChoice = player.choice;
      playerScore = player.score;
    }
  });

  onMount(() => {
    return () => {
      unsubscribe();
    };
  });
</script>

<div class="player-card">
  <h2>Player {playerId}</h2>
  <p>Choice: {playerChoice}</p>
  <p>Score: {playerScore}</p>
</div>

<style>
  .player-card {
    border: 1px solid #ccc;
    padding: 10px;
    margin: 10px;
    border-radius: 5px;
    text-align: center;
  }
</style>