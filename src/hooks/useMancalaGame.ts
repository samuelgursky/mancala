import { useState, useEffect } from 'react';

// Constants for the game
const INITIAL_STONES = 4;
const PIT_COUNT = 6;
const STORE_INDEX = PIT_COUNT; // Index of the store in each player's row

// TypeScript types for the board state and player
type BoardState = number[][];
type Player = 0 | 1;

export const useMancalaGame = () => {
  const [board, setBoard] = useState<BoardState>(
    Array(2).fill(null).map(() => Array(PIT_COUNT + 1).fill(INITIAL_STONES))
  );
  const [currentPlayer, setCurrentPlayer] = useState<Player>(0);
  const [gameOver, setGameOver] = useState(false);
  const [playerScores, setPlayerScores] = useState<number[]>([0, 0]);

  useEffect(() => {
    const initialBoard: BoardState = Array(2)
      .fill(null)
      .map(() => Array(PIT_COUNT + 1).fill(INITIAL_STONES));
    // Setting the initial stones in the stores to 0
    initialBoard[0][STORE_INDEX] = 0;
    initialBoard[1][STORE_INDEX] = 0;
    setBoard(initialBoard);
  }, []);

  const handlePitClick = (player: Player, pitIndex: number) => {
    // No action if it's not the current player's turn, the game is over, or the selected pit is empty
    if (player !== currentPlayer || gameOver || board[player][pitIndex] === 0) {
      console.log("Action prevented: Not current player's turn, game over, or pit is empty.");
      return;
    }

    // Create a new board state to avoid mutating the current state
    const newBoard = board.map(row => [...row]);
    let stones = newBoard[player][pitIndex];
    newBoard[player][pitIndex] = 0; // Remove stones from the selected pit

    console.log(`Starting distribution from player ${player}, pit ${pitIndex}, stones ${stones}`);

    let currentRow = player;
    let currentIndex = pitIndex;

    while (stones > 0) {
      currentIndex = (currentIndex + 1) % (PIT_COUNT + 1); // Move to the next pit

      // Switch to opponent's row after placing a stone in player's store
      if (currentIndex === 0 && currentRow === player) {
        console.log("Switching to opponent's row");
        currentRow = 1 - currentRow as Player;
      }

      // Skip opponent's store
      if (currentRow !== player && currentIndex === STORE_INDEX) {
        console.log("Skipping opponent's store");
        currentRow = 1 - currentRow as Player; // Switch rows
        continue;
      }

      // Place a stone in the current pit
      newBoard[currentRow][currentIndex]++;
      stones--;

      console.log(`Placed a stone in row ${currentRow}, pit ${currentIndex}, remaining stones ${stones}`);

      // If it was the last stone
      if (stones === 0) {
        // Extra turn if the last stone lands in the player's store
        if (currentRow === player && currentIndex === STORE_INDEX) {
          console.log("Extra turn granted");
          // The currentPlayer will remain the same, so don't update it
        } else {
          console.log("Switching player");
          // Switch to the other player if the last stone did not land in the player's store
          setCurrentPlayer(1 - player as Player);
        }
      }
    }

    // Check if the game is over
    if (newBoard[currentPlayer].slice(0, PIT_COUNT).every(pit => pit === 0)) {
      console.log("Checking if game is over");
      // Move remaining stones to the opponent's store
      const opponent = 1 - currentPlayer as Player;
      const remainingStones = newBoard[opponent].slice(0, PIT_COUNT).reduce((sum, pit) => sum + pit, 0);
      newBoard[opponent][STORE_INDEX] += remainingStones;
      newBoard[opponent].fill(0, 0, PIT_COUNT); // Clear pits
      setGameOver(true);
    }

    // Update the state with the new board and the scores
    setBoard(newBoard);
    setPlayerScores([newBoard[0][STORE_INDEX], newBoard[1][STORE_INDEX]]);

    console.log("Board state updated");

    // Check if the game is over
    if (newBoard[currentPlayer].slice(0, PIT_COUNT).every(pit => pit === 0)) {
      // Move remaining stones to the opponent's store
      const opponent = 1 - currentPlayer as Player;
      const remainingStones = newBoard[opponent].slice(0, PIT_COUNT).reduce((sum, pit) => sum + pit, 0);
      newBoard[opponent][STORE_INDEX] += remainingStones;
      newBoard[opponent].fill(0, 0, PIT_COUNT); // Clear pits
      setGameOver(true);
    }

    // Update the state with the new board and the scores
    setBoard(newBoard);
    setPlayerScores([newBoard[0][STORE_INDEX], newBoard[1][STORE_INDEX]]);
  };

  return { board, currentPlayer, gameOver, handlePitClick, playerScores };
};