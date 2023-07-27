const cors = require("cors");
const express = require("express");
const app = express();
app.use(cors());
const server = app.listen(5000, () => {
  console.log(`Server started at ${5000}`);
});
const io = require("socket.io")(server, { cors: { origin: "*" } });

let gameState = {
  board: Array(9).fill(null),
  isXNext: true,
  winner: null
};

const broadcastGameState = () => {
  io.emit("gameState", gameState);
};

const calculateWinner = () => {
  const squares = gameState.board;
  const combination = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < combination.length; i++) {
    const [a, b, c] = combination[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

io.on("connection", (client) => {
  client.on("getGameState", () => {
    broadcastGameState();
  });

  client.on("makeMove", (index) => {
    if (gameState.board[index] === null && calculateWinner() === null) {
      gameState.board[index] = gameState.isXNext ? "X" : "O";
      gameState.winner = calculateWinner();

      if (!gameState.winner) {
        gameState.isXNext = !gameState.isXNext;
      }

      broadcastGameState();
    }
  });

  client.on("resetGame", () => {
    gameState.board = Array(9).fill(null);
    gameState.isXNext = true;
    gameState.winner = null;
    broadcastGameState();
  });

  client.on("disconnect", () => {
    console.log("User disconnected");
  });
});
