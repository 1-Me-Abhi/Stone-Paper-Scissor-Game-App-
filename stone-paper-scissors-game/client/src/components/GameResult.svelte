<script>
  import { onMount } from 'svelte';
  import { gameStore } from '../stores/gameStore';

  let result;
  let playerScores;

  const unsubscribe = gameStore.subscribe(state => {
    result = state.result;
    playerScores = state.scores;
  });

  onMount(() => {
    return () => unsubscribe();
  });
</script>

<style>
  .result {
    font-size: 2em;
    margin: 20px 0;
  }
  .scores {
    font-size: 1.5em;
  }
</style>

<div class="game-result">
  {#if result}
    <div class="result">
      {result.winner ? `${result.winner} wins!` : "It's a tie!"}
    </div>
    <div class="scores">
      {#each Object.entries(playerScores) as [player, score]}
        <div>{player}: {score}</div>
      {/each}
    </div>
  {/if}
</div>