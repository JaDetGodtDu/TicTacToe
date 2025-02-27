"use strict";
// Utilities - Used for reading user input
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// ====================================================================================================
// Game setup
const PLAYER_X = "X";
const PLAYER_O = "O";

// Variables to track whos turn it is, the user player and the AI player
let currentPlayer;
let userPlayer;
let aiPlayer;

// !! SET DEPTH LIMIT HERE !!
// Limit the depth of the MinMax algorithm
const depthLimit = 4;

// Set to true to use Alpha-Beta pruning
const alphaBeta = true;

// Set up the game board, with empty cells
const board = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

// Set heuristic values for each field
const fieldValues = [
  [3, 2, 3],
  [2, 4, 2],
  [3, 2, 3],
];

// ====================================================================================================
// Game logic

// Evaluate the board based on the heuristic values
function evaluateBoard(board) {
  let score = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === PLAYER_X) {
        score += fieldValues[i][j]; // Increase score for PLAYER_X, by adding value of the current field
      } else if (board[i][j] === PLAYER_O) {
        score -= fieldValues[i][j]; // Decrease score for PLAYER_O, by subtracting value of the current field
      }
    }
  }
  return score;
}

// MinMax algorithm
function minMax(board, depth, isMaximizing, maxDepth, alpha, beta, usePruning) {
  const scores = {
    [aiPlayer]: 10, // AI always wants to maximize the score - Was easier this way
    [userPlayer]: -10,
    tie: 0,
  };

  // Check for terminal states - Win, Loss or Tie
  const result = checkWinner(board);
  if (result !== null || depth === maxDepth) {
    // Check if there is an actual winner or if the depth limit has been reached
    if (result !== null) {
      return scores[result] - (isMaximizing ? depth : -depth); // Penalize the AI for taking longer to win, by subtracting the depth
    }
    return evaluateBoard(board); // Return the evaluated score of the board
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    // AI's turn: Try to get the highest score possible
    for (let i = 0; i < 3; i++) {
      // Loop through rows
      for (let j = 0; j < 3; j++) {
        // Loop through columns
        if (board[i][j] === "") {
          // Check if the cell is empty
          board[i][j] = aiPlayer; // Set the cell to the AI player
          let score = minMax(board, depth + 1, false, maxDepth, alpha, beta, usePruning); // Recursively call the MinMax algorithm
          board[i][j] = ""; // Reset the cell / Undo the move
          bestScore = Math.max(score, bestScore); // Maximize the PLAYER_X score
          if (usePruning) {
            alpha = Math.max(alpha, bestScore);
            if (beta <= alpha) return bestScore; // Cutoff branch if score is worse than current best score
          }
        }
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    // Player's turn: The AI assumes the player seeks to minimize the score
    for (let i = 0; i < 3; i++) {
      // Loop through rows
      for (let j = 0; j < 3; j++) {
        // Loop through columns
        if (board[i][j] === "") {
          // Check if the cell is empty
          board[i][j] = userPlayer; // Set the cell to the player
          let score = minMax(board, depth + 1, true, maxDepth, alpha, beta, usePruning); // Recursively call the MinMax algorithm
          board[i][j] = ""; // Reset the cell / Undo the move
          bestScore = Math.min(score, bestScore); // Minimize the PLAYER_O score
          if (usePruning) {
            beta = Math.min(beta, bestScore);
            if (beta <= alpha) return bestScore; // Cutoff branch if score is worse than current best score
          }
        }
      }
    }
    return bestScore;
  }
}

// Check for a winner, or tie
function checkWinner(board) {
  // Check rows and columns for a winning state
  for (let i = 0; i < 3; i++) {
    if (board[i][0] && board[i][0] === board[i][1] && board[i][0] === board[i][2]) {
      return board[i][0]; // Row win
    }
    if (board[0][i] && board[0][i] === board[1][i] && board[0][i] === board[2][i]) {
      return board[0][i]; // Column win
    }
  }
  // Check diagonals for a winning state
  if (board[0][0] && board[0][0] === board[1][1] && board[0][0] === board[2][2]) {
    return board[0][0]; // Left diagonal win
  }
  if (board[0][2] && board[0][2] === board[1][1] && board[0][2] === board[2][0]) {
    return board[0][2]; // Right diagonal win
  }

  // Check for empty cells
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === "") {
        return null; // Empty cell = Game still in progress
      }
    }
  }
  return "tie"; // No empty cells results in a tie
}

// Find the best move for the AI
function bestMove(board) {
  let bestScore = -Infinity;
  let move;
  const maxDepth = depthLimit; // Limit the depth of the MinMax algorithm
  const usePruning = alphaBeta; // Use Alpha-Beta pruning

  for (let i = 0; i < 3; i++) {
    // Loop through rows
    for (let j = 0; j < 3; j++) {
      // Loop through columns
      if (board[i][j] === "") {
        // Check if the cell is empty
        board[i][j] = aiPlayer; // Set the cell to the AI player
        if (checkWinner(board) === aiPlayer) {
          // Check if the AI can win in one move
          return { i, j }; // If move is a winning move return immediately
        }
        let score = minMax(board, 0, false, maxDepth, -Infinity, Infinity, usePruning); // Call the MinMax algorithm
        board[i][j] = ""; // Reset the cell / Undo the move
        if (score > bestScore) {
          // Check if the current score is better than the best score
          bestScore = score; // Update the best score
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
  console.log("\n---------");
  for (let i = 0; i < board.length; i++) {
    let row = board[i].map((cell) => (cell === "" ? " " : cell));
    console.log(row.join(" | ")); // Row content
    if (i < board.length - 1) {
      console.log("---------");
    }
  }
  console.log("---------\n");
}

// ====================================================================================================
// Game loop
function startGame() {
  console.log(`\nWelcome to Tic Tac Toe!\n`);
  console.log(`Depthlimit is set to: \x1b[4m${depthLimit}\x1b[0m`);
  if (alphaBeta) {
    console.log(`Alpha-Beta pruning is \x1b[4menabled\x1b[0m.\n`);
  } else {
    console.log(`Alpha-Beta pruning is \x1b[4mdisabled\x1b[0m.\n`);
  }
  rl.question("Do you want to play as X or O? ", setupGame);
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
    rl.question("Enter your move (row and column): ", handleUserMove);
  }
}

function handleUserMove(input) {
  let [i, j] = input.split(" ").map(Number);
  // Convert from 1-based to 0-based indexing
  i -= 1;
  j -= 1;
  if (board[i][j] === "") {
    board[i][j] = userPlayer;
    checkGameOver();
  } else {
    console.log("\nInvalid move. Try again.");
    makeMove();
  }
}

function checkGameOver() {
  let result = checkWinner(board);
  if (result !== null) {
    printBoard(board);
    if (result === "tie") {
      console.log("It's a tie!");
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
