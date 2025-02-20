"use strict";
// Utilities - Used for reading user input
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// ====================================================================================================
const PLAYER_X = 'X';
const PLAYER_O = 'O';

let currentPlayer;
let userPlayer;
let aiPlayer;

// !! SET DEPTH LIMIT HERE !!
// Limit the depth of the MinMax algorithm
const depthLimit = 5;

// Set up the game board, with empty cells
const board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ];

// Set heuristic values for each field
const fieldValues = [ 
    [3, 2, 3],
    [2, 4, 2],
    [3, 2, 3]
]

// ====================================================================================================
// Game logic

// Evaluate the board based on the heuristic values
function evaluateBoard(board) {
    let score = 0;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === PLAYER_X) {
          score += fieldValues[i][j];
        } else if (board[i][j] === PLAYER_O) {
          score -= fieldValues[i][j];
        }
      }
    }
    return score;
}

// MinMax algorithm
function minMax(board, depth, isMaximizing, maxDepth) {
    const scores = {
      [aiPlayer]: 10,
      [userPlayer]: -10,
      tie: 0
    };
  
    // Check for terminal states - Win, Loss or Tie
    const result = checkWinner(board);
    if (result !== null || depth === maxDepth) {
        // Use the heuristic value if maxDepth is reached
        return result ? scores[result] : evaluateBoard(board);
    }
  
    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (board[i][j] === '') {
            board[i][j] = aiPlayer;
            let score = minMax(board, depth + 1, false, maxDepth);
            board[i][j] = '';
            bestScore = Math.max(score, bestScore); // Maximize the PLAYER_X score
          }
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (board[i][j] === '') {
            board[i][j] = userPlayer;
            let score = minMax(board, depth + 1, true, maxDepth);
            board[i][j] = '';
            bestScore = Math.min(score, bestScore); // Minimize the PLAYER_O score
          }
        }
      }
      return bestScore;
    }
}

// Check for a winner, or tie
function checkWinner(board) {
    // Check rows, columns, and diagonals for a winning state
    for (let i = 0; i < 3; i++) {
      if (board[i][0] && board[i][0] === board[i][1] && board[i][0] === board[i][2]) {
        return board[i][0];
      }
      if (board[0][i] && board[0][i] === board[1][i] && board[0][i] === board[2][i]) {
        return board[0][i];
      }
    }
    if (board[0][0] && board[0][0] === board[1][1] && board[0][0] === board[2][2]) {
      return board[0][0];
    }
    if (board[0][2] && board[0][2] === board[1][1] && board[0][2] === board[2][0]) {
      return board[0][2];
    }
  
    // Check for a tie - if no empty spaces left
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === '') {
          return null;
        }
      }
    }
    return 'tie';
}

function bestMove(board) {
    let bestScore = -Infinity;
    let move;
    const maxDepth = depthLimit; // Limit the depth of the MinMax algorithm
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === '') {
          board[i][j] = aiPlayer;
          let score = minMax(board, 0, false, maxDepth);
          board[i][j] = '';
          if (score > bestScore) {
            bestScore = score;
            move = { i, j }; // Store the best move
          }
        }
      }
    }
    return move;
  }

// ====================================================================================================
// UI
function printBoard(board) {
    console.log('---------');
    for (let i = 0; i < board.length; i++) {
      let row = board[i].map(cell => cell === '' ? ' ' : cell);
      console.log(row.join(' | ')); // Row content
      if (i < board.length - 1) {
        console.log('---------');
      }
    }
    console.log('---------');
}  

// ====================================================================================================
// Game loop 
function startGame() {
    rl.question('Do you want to play as X or O? ', setupGame);
  }
  
  function setupGame(choice) {
    userPlayer = choice.toUpperCase();
    aiPlayer = userPlayer === PLAYER_X ? PLAYER_O : PLAYER_X;
    currentPlayer = PLAYER_X; // PLAYER_X is always first to move
    makeMove();
  }
  
  function makeMove() {
    printBoard(board);
    if (currentPlayer === aiPlayer) {
      let move = bestMove(board, aiPlayer);
      board[move.i][move.j] = aiPlayer;
      checkGameOver();
    } else {
      rl.question('Enter your move (row and column): ', handleUserMove);
    }
  }
  
  function handleUserMove(input) {
    let [i, j] = input.split(' ').map(Number);
    // Convert from 1-based to 0-based indexing
    i -= 1;
    j -= 1;
    if (board[i][j] === '') {
      board[i][j] = userPlayer;
      checkGameOver();
    } else {
      console.log('Invalid move. Try again.');
      makeMove();
    }
  }
  
  function checkGameOver() {
    let result = checkWinner(board);
    if (result !== null) {
      printBoard(board);
      if (result === 'tie') {
        console.log('It\'s a tie!');
      } else {
        console.log(`${result} wins!`);
      }
      rl.close();
    } else {
      currentPlayer = currentPlayer === PLAYER_X ? PLAYER_O : PLAYER_X;
      makeMove();
    }
  }
  
  startGame();