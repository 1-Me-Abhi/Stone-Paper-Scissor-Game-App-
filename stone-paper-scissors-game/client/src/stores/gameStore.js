import { writable } from 'svelte/store';

export const gameStore = writable({
    players: [],
    currentPlayer: null,
    choices: {
        player1: null,
        player2: null
    },
    scores: {
        player1: 0,
        player2: 0
    },
    gameStatus: 'waiting', // 'waiting', 'playing', 'finished'
    winner: null
});

export const setPlayers = (players) => {
    gameStore.update(store => {
        return { ...store, players };
    });
};

export const setCurrentPlayer = (player) => {
    gameStore.update(store => {
        return { ...store, currentPlayer: player };
    });
};

export const makeChoice = (player, choice) => {
    gameStore.update(store => {
        store.choices[player] = choice;
        return { ...store };
    });
};

export const resetChoices = () => {
    gameStore.update(store => {
        return { ...store, choices: { player1: null, player2: null }, winner: null };
    });
};

export const updateScores = (winner) => {
    gameStore.update(store => {
        if (winner) {
            store.scores[winner]++;
            store.winner = winner;
        }
        return { ...store };
    });
};

export const setGameStatus = (status) => {
    gameStore.update(store => {
        return { ...store, gameStatus: status };
    });
};