import { io } from 'socket.io-client';

const socket = io('http://localhost:3000'); // Adjust the URL as needed

const socketClient = {
    joinGame: (username) => {
        socket.emit('joinGame', username);
    },
    makeMove: (move) => {
        socket.emit('makeMove', move);
    },
    onGameUpdate: (callback) => {
        socket.on('gameUpdate', callback);
    },
    onGameResult: (callback) => {
        socket.on('gameResult', callback);
    },
    onDisconnect: (callback) => {
        socket.on('disconnect', callback);
    },
    disconnect: () => {
        socket.disconnect();
    }
};

export default socketClient;