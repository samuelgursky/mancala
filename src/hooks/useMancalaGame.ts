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
      return;
    }

    // Create a new board state to avoid mutating the current state
    const newBoard = board.map(row => [...row]);
    let stones = newBoard[player][pitIndex];
    newBoard[player][pitIndex] = 0; // Remove stones from the selected pit

    let currentRow = player;
    let currentIndex = pitIndex;

    while (stones > 0) {
      currentIndex = (currentIndex + 1) % (PIT_COUNT + 1); // Move to the next pit

      // Skip opponent's store
      if (currentRow !== player && currentIndex === STORE_INDEX) {
        currentRow = 1 - currentRow as Player; // Switch rows
        continue;
      }

      // Place a stone in the current pit
      newBoard[currentRow][currentIndex]++;
      stones--;

      // If it was the last stone
      if (stones === 0) {
        // Extra turn if the last stone lands in the player's store
        if (currentRow === player && currentIndex === STORE_INDEX) {
          // The currentPlayer will remain the same, so don't update it
        } else {
          // Switch to the other player if the last stone did not land in the player's store
          setCurrentPlayer(1 - player as Player);
        }

        // Capture logic
        if (currentRow === player && currentIndex < PIT_COUNT && newBoard[currentRow][currentIndex] === 1) {
          const oppositeRow = 1 - currentRow as Player;
          const oppositePitIndex = PIT_COUNT - 1 - currentIndex;

          // Check if capturing is valid before proceeding
          if (newBoard[oppositeRow][oppositePitIndex] > 0) {
            // Move captured stones to the player's store
            newBoard[player][STORE_INDEX] += newBoard[oppositeRow][oppositePitIndex] + 1;
            // Clear the captured pit and the pit the last stone was placed in
            newBoard[oppositeRow][oppositePitIndex] = 0;
            newBoard[currentRow][currentIndex] = 0;
          }
        }
      }
    }

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