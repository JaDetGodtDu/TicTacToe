# Tic-Tac-Toe AI

This is a simple command-line Tic-Tac-Toe game built in JavaScript using Node.js. 
The AI opponent uses the MinMax algorithm to make the best moves possible.

## Setup
### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your system.

### Installation
1. Clone this repository or download the source code.
2. Navigate to the project folder in your terminal.

## Running the Game
Run the following command in your terminal:

```sh
node tictactoe.js
```

## How to Play
Follow the on-screen prompts to choose your symbol and make moves.
- The game will prompt you to choose whether to play as 'X' or 'O'.
- The AI will make its move automatically after you input yours.
- Enter your move as row and column numbers (e.g., `2(row) 2(column)` for the center tile).
- The game will announce the winner or if it ends in a tie.

You can change the depthlimit of the MinMax algorithm, by changing the value of the `const depthLimit` variable on line 21 in app.js.
You can also switch alpha/beta pruning on and off, using the `const alphaBeta` variable on line 24.

## Example Gameplay
```
Do you want to play as X or O? X
---------
  |   |  
---------
  |   |  
---------
  |   |  
---------
Enter your move (row and column): 2 2
---------
  |   |  
---------
  | X |  
---------
  |   |  
---------
```

## License
This project is open-source and available for learning purposes!
This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).


