const Game = require('../models/Game');

let games = {};

exports.startGame = (req, res) => {
    const gameId = req.body.gameId;
    games[gameId] = new Game();
    res.status(201).json({ message: 'Game started', gameId });
};

exports.makeMove = (req, res) => {
    const { gameId, playerId, choice } = req.body;
    const game = games[gameId];

    if (!game) {
        return res.status(404).json({ message: 'Game not found' });
    }

    game.addPlayerMove(playerId, choice);
    const result = game.checkWinner();

    if (result) {
        res.status(200).json({ message: 'Round finished', result });
    } else {
        res.status(200).json({ message: 'Move recorded' });
    }
};

exports.getGameState = (req, res) => {
    const gameId = req.params.gameId;
    const game = games[gameId];

    if (!game) {
        return res.status(404).json({ message: 'Game not found' });
    }

    res.status(200).json(game);
};