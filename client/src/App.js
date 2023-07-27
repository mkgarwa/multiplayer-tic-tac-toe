import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./styles.css";

const socket = io("https://ksd479-5000.csb.app");

const App = () => {
  const [gameState, setGameState] = useState({
    board: Array(9).fill(null),
    isXNext: true,
    winner: null,
  });

  useEffect(() => {
    // Emit event to get the initial game state
    socket.emit("getGameState");

    // Listen for the game state from the server
    socket.on("gameState", (data) => {
      setGameState(data);
    });

    socket.on("gameOver", (data) => {
      setGameState(data);
    });

    socket.on("gameReset", (data) => {
      setGameState(data);
    });
  }, []);

  const handleCellClick = (index) => {
    if (!gameState.board[index]) {
      socket.emit("makeMove", index);
    }
  };

  const renderCell = (index) => {
    return (
      <div className="box" onClick={() => handleCellClick(index)}>
        {gameState.board[index]}
      </div>
    );
  };

  const resetGame = () => {
    socket.emit("resetGame");
  };

  return (
    <div className="app">
      <h1>{gameState.isXNext ? "X's turn" : "O's turn"}</h1>
      <div className="wining-box">
        {gameState.winner && (
          <>
            <h1>Winner is {gameState.winner}</h1>
            <button onClick={resetGame}>RESET</button>
          </>
        )}
      </div>
      <div className="wrapper">
        {gameState.board.map((cell, index) => (
          <div key={index}>{renderCell(index)}</div>
        ))}
      </div>
    </div>
  );
};

export default App;
