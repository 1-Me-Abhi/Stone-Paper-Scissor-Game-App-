const WebSocket = require('ws');
const Game = require('../models/Game');

let games = {};

const socketHandler = (ws) => {
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        
        switch (data.type) {
            case 'join':
                handleJoin(ws, data);
                break;
            case 'move':
                handleMove(ws, data);
                break;
            case 'disconnect':
                handleDisconnect(ws);
                break;
            default:
                break;
        }
    });

    ws.on('close', () => {
        handleDisconnect(ws);
    });
};

const handleJoin = (ws, data) => {
    const gameId = data.gameId;
    if (!games[gameId]) {
        games[gameId] = new Game(gameId);
    }
    const player = games[gameId].addPlayer(ws);
    ws.send(JSON.stringify({ type: 'joined', player }));
};

const handleMove = (ws, data) => {
    const gameId = data.gameId;
    const playerChoice = data.choice;
    const game = games[gameId];

    if (game) {
        const result = game.processMove(ws, playerChoice);
        if (result) {
            broadcastGameState(gameId);
        }
    }
};

const handleDisconnect = (ws) => {
    for (const gameId in games) {
        const game = games[gameId];
        if (game.removePlayer(ws)) {
            broadcastGameState(gameId);
            break;
        }
    }
};

const broadcastGameState = (gameId) => {
    const game = games[gameId];
    const state = game.getState();
    game.players.forEach(player => {
        player.ws.send(JSON.stringify({ type: 'gameState', state }));
    });
};

module.exports = socketHandler;