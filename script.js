// script.js

// Player Names
const PLAYER_NAME = 'ASTA';
const BOT_NAME = 'AURAFOLIO BOT';

document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const message = document.querySelector('.message');
    const resetButton = document.getElementById('reset');

    let currentPlayer = 'X';
    let gameActive = true;
    const gameState = Array(9).fill('');

    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });

    resetButton.addEventListener('click', resetGame);

    function handleCellClick(event) {
        const cellIndex = event.target.getAttribute('data-index');

        if (gameState[cellIndex] !== '' || !gameActive) {
            return;
        }

        gameState[cellIndex] = currentPlayer;
        event.target.textContent = currentPlayer;

        if (checkWinner()) {
            message.textContent = `Player ${currentPlayer} wins!`;
            gameActive = false;
            return;
        } else if (!gameState.includes('')) {
            message.textContent = 'Draw!';
            gameActive = false;
            return;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        message.textContent = `Player ${currentPlayer}'s turn`;

        if (currentPlayer === 'O' && gameActive) {
            setTimeout(botMove, 500);
        }
    }

    function botMove() {
        let bestMove = minimax(gameState, BOT_NAME === 'AURAFOLIO BOT' ? 'O' : 'X');
        gameState[bestMove.index] = currentPlayer;
        document.querySelector(`.cell[data-index='${bestMove.index}']`).textContent = currentPlayer;

        if (checkWinner()) {
            message.textContent = `Player ${currentPlayer} wins!`;
            gameActive = false;
            return;
        } else if (!gameState.includes('')) {
            message.textContent = 'Draw!';
            gameActive = false;
            return;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        message.textContent = `Player ${currentPlayer}'s turn`;
    }

    function minimax(newGameState, player) {
        const availSpots = newGameState.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);

        if (checkWin(newGameState, 'X')) {
            return { score: -10 };
        } else if (checkWin(newGameState, 'O')) {
            return { score: 10 };
        } else if (availSpots.length === 0) {
            return { score: 0 };
        }

        const moves = [];
        for (let i = 0; i < availSpots.length; i++) {
            const move = {};
            move.index = availSpots[i];
            newGameState[availSpots[i]] = player;

            if (player === 'O') {
                const result = minimax(newGameState, 'X');
                move.score = result.score;
            } else {
                const result = minimax(newGameState, 'O');
                move.score = result.score;
            }

            newGameState[availSpots[i]] = '';
            moves.push(move);
        }

        let bestMove;
        if (player === 'O') {
            let bestScore = -10000;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            let bestScore = 10000;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }

        return moves[bestMove];
    }

    function checkWinner() {
        return winningConditions.some(condition => {
            return condition.every(index => gameState[index] === currentPlayer);
        });
    }

    function checkWin(gameState, player) {
        return winningConditions.some(condition => {
            return condition.every(index => gameState[index] === player);
        });
    }

    function resetGame() {
        gameState.fill('');
        cells.forEach(cell => cell.textContent = '');
        currentPlayer = 'X';
        gameActive = true;
        message.textContent = `Player ${currentPlayer}'s turn`;
    }
});

/* 
  Created by ASTA
  AURAFOLIO BOT handles the bot moves
  Copyright © 2024 Aurafolio. All rights reserved.
*/
