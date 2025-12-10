<script>
  import { onMount } from 'svelte';
  import { gameStore } from '../stores/gameStore';
  import PlayerCard from './PlayerCard.svelte';
  import GameResult from './GameResult.svelte';

  let playerChoice = '';
  let gameResult = null;

  const choices = ['stone', 'paper', 'scissors'];

  function makeChoice(choice) {
    playerChoice = choice;
    gameStore.makeMove(choice);
  }

  onMount(() => {
    const unsubscribe = gameStore.subscribe(state => {
      gameResult = state.result;
    });

    return () => unsubscribe();
  });
</script>

<style>
  .game-board {
    display: flex;
    flex-direction: column;
    align-items: center;
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