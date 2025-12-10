<script>
  export let player;
  export let isMe = false;

  const getChoiceEmoji = (choice) => {
    const choices = {
      'rock': '🗿',
      'paper': '📄',
      'scissors': '✂️'
    };
    return choices[choice] || '❓';
  };
</script>

<div class="player-card" class:me={isMe} class:opponent={!isMe}>
  <div class="player-header">
    <h3 class="player-name">
      {isMe ? '👤 ' : '🤖 '}{player?.name || 'Unknown'}
      {#if isMe}<span class="you-indicator">(You)</span>{/if}
    </h3>
    <div class="player-score">
      Score: <span class="score-number">{player?.score || 0}</span>
    </div>
  </div>
  
  <div class="player-choice">
    {#if player?.choice}
      <div class="choice-display">
        <span class="choice-emoji">{getChoiceEmoji(player.choice)}</span>
        <span class="choice-name">{player.choice}</span>
      </div>
    {:else}
      <div class="waiting-choice">
        <span class="waiting-icon">🤔</span>
        <span class="waiting-text">Thinking...</span>
      </div>
    {/if}
  </div>
</div>

<style>
  .player-card {
    background: white;
    border-radius: 15px;
    padding: 1.5rem;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    border: 3px solid #e0e0e0;
    transition: all 0.3s ease;
    min-width: 200px;
    text-align: center;
  }

  .player-card.me {
    border-color: #4caf50;
    background: linear-gradient(135deg, #e8f5e8 0%, #ffffff 100%);
  }

  .player-card.opponent {
    border-color: #2196f3;
    background: linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%);
  }

  .player-header {
    margin-bottom: 1rem;
  }

  .player-name {
    margin: 0 0 0.5rem 0;
    color: #333;
    font-size: 1.1rem;
    font-weight: 600;
  }

  .you-indicator {
    font-size: 0.8rem;
    color: #4caf50;
    font-weight: normal;
  }

  .player-score {
    color: #666;
    font-size: 0.9rem;
  }

  .score-number {
    font-weight: bold;
    color: #333;
    font-size: 1.1rem;
  }

  .player-choice {
    padding: 1rem 0;
  }

  .choice-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .choice-emoji {
    font-size: 3rem;
    margin-bottom: 0.25rem;
  }

  .choice-name {
    font-weight: 500;
    color: #333;
    text-transform: capitalize;
    font-size: 1rem;
  }

  .waiting-choice {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    opacity: 0.7;
  }

  .waiting-icon {
    font-size: 3rem;
    animation: pulse 2s infinite;
  }

  .waiting-text {
    font-style: italic;
    color: #666;
    font-size: 0.9rem;
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }

  @media (max-width: 768px) {
    .player-card {
      min-width: 150px;
      padding: 1rem;
    }

    .player-name {
      font-size: 1rem;
    }

    .choice-emoji {
      font-size: 2.5rem;
    }
  }
</style>