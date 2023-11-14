document.addEventListener('DOMContentLoaded', init);

let board;
let currentPlayer;
let gameActive;
let playerXName;
let playerOName;
let playerXColor;
let playerOColor;

function init() {
    // Prompt for player names
    playerXName = prompt("Enter Player X's name:");
    playerOName = prompt("Enter Player O's name:");

    // Generate random colors for player X and player O
    playerXColor = getRandomColor();
    playerOColor = getRandomColor();

    board = Array.from(Array(3), () => new Array(3).fill(''));
    currentPlayer = 'X';
    gameActive = true;

    createBoard();
}

function getRandomColor() {
    // Generate a random hex color code
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

function createBoard() {
    const boardElement = document.getElementById('board');

    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('click', handleCellClick);
            boardElement.appendChild(cell);
        }
    }

    updateBoard();
}

function handleCellClick(event) {
    if (!gameActive) return;

    const row = event.target.dataset.row;
    const col = event.target.dataset.col;

    if (board[row][col] === '') {
        board[row][col] = currentPlayer;
        updateBoard();
        checkWinner();
        togglePlayer();

        // Dynamically set background color based on the current player
        const color = currentPlayer === 'X' ? playerXColor : playerOColor;
        event.target.style.backgroundColor = color;

        // Add class to the clicked cell to change its background color
        event.target.classList.add(`player${currentPlayer}`);
    }
}

function updateBoard() {
    const cells = document.querySelectorAll('.cell');

    cells.forEach((cell, index) => {
        const row = Math.floor(index / 3);
        const col = index % 3;
        cell.textContent = board[row][col];
    });
}

function togglePlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function checkWinner() {
    if (checkRows() || checkColumns() || checkDiagonals()) {
        displayResult(`Player ${currentPlayer === 'X' ? playerXName : playerOName} wins!`);
        highlightWinnerCells();
        gameActive = false;
        openModal();
    } else if (isBoardFull()) {
        displayResult("It's a draw!");
        displaySmartyBoyMessage();
        gameActive = false;
        openModal();
    }
}

function checkRows() {
    for (let row = 0; row < 3; row++) {
        if (board[row][0] !== '' && board[row][0] === board[row][1] && board[row][1] === board[row][2]) {
            return true;
        }
    }
    return false;
}

function checkColumns() {
    for (let col = 0; col < 3; col++) {
        if (board[0][col] !== '' && board[0][col] === board[1][col] && board[1][col] === board[2][col]) {
            return true;
        }
    }
    return false;
}

function checkDiagonals() {
    if (board[0][0] !== '' && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
        return true;
    }

    if (board[0][2] !== '' && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
        return true;
    }

    return false;
}

function isBoardFull() {
    return board.every(row => row.every(cell => cell !== ''));
}

function displayResult(message) {
    const resultElement = document.getElementById('result');
    resultElement.textContent = message;
}

function highlightWinnerCells() {
    const winningCombination = getWinningCombination();

    if (winningCombination) {
        const cells = document.querySelectorAll('.cell');
        cells.forEach((cell, index) => {
            const row = Math.floor(index / 3);
            const col = index % 3;
            if (winningCombination.includes(`${row}-${col}`)) {
                cell.classList.add('win');
            }
        });
    }
}

function getWinningCombination() {
    for (let row = 0; row < 3; row++) {
        if (board[row][0] !== '' && board[row][0] === board[row][1] && board[row][1] === board[row][2]) {
            return [`${row}-0`, `${row}-1`, `${row}-2`];
        }
    }

    for (let col = 0; col < 3; col++) {
        if (board[0][col] !== '' && board[0][col] === board[1][col] && board[1][col] === board[2][col]) {
            return [`0-${col}`, `1-${col}`, `2-${col}`];
        }
    }

    if (board[0][0] !== '' && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
        return ['0-0', '1-1', '2-2'];
    }

    if (board[0][2] !== '' && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
        return ['0-2', '1-1', '2-0'];
    }

    return null;
}

function displaySmartyBoyMessage() {
    const resultElement = document.getElementById('result');
    resultElement.textContent = "Smarty Boy! It's a draw!";
    resultElement.classList.add('smart-boy');
}

function openModal() {
    const modal = document.getElementById('resultModal');
    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('resultModal');
    modal.style.display = 'none';
}

function newGame() {
    closeModal();
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';
    const resultElement = document.getElementById('result');
    resultElement.textContent = '';
    resultElement.classList.remove('smart-boy');
    gameActive = true;
    init();
}
