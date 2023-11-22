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
    if (player !== currentPlayer || gameOver || board[player][pitIndex] === 0) {
      return;
    }

    const newBoard = board.map(row => [...row]);
    let stones = newBoard[player][pitIndex];
    newBoard[player][pitIndex] = 0;

    let currentRow = player;
    let currentIndex = pitIndex;

    while (stones > 0) {
      currentIndex++;
      if (currentIndex === PIT_COUNT) {
        if (currentRow === player) {
          // Skip the store, move to the next row
          currentRow = 1 - currentRow as Player;
          currentIndex = 0;
        } else {
          // Wrap around to the player's first pit
          currentRow = 1 - currentRow as Player;
          currentIndex = 0;
          continue;
        }
      }

      newBoard[currentRow][currentIndex]++;
      stones--;

      if (stones === 0) {
        if (newBoard[currentRow][currentIndex] > 1) {
          // Continue distributing from the current pit
          stones = newBoard[currentRow][currentIndex];
          newBoard[currentRow][currentIndex] = 0;
        } else if (currentRow === player && newBoard[currentRow][currentIndex] === 1) {
          // Capture condition
          const oppositeIndex = PIT_COUNT - 1 - currentIndex;
          newBoard[player][STORE_INDEX] += newBoard[1 - player][oppositeIndex];
          newBoard[1 - player][oppositeIndex] = 0;
        }
      }
    }

    // End of turn, switch player
    setCurrentPlayer(1 - player as Player);

    // Game over check
    if (newBoard[currentPlayer].slice(0, PIT_COUNT).every(pit => pit === 0)) {
      const opponent = 1 - currentPlayer as Player;
      const remainingStones = newBoard[opponent].slice(0, PIT_COUNT).reduce((sum, pit) => sum + pit, 0);
      newBoard[opponent][STORE_INDEX] += remainingStones;
      newBoard[opponent].fill(0, 0, PIT_COUNT);
      setGameOver(true);
    }

    setBoard(newBoard);
    setPlayerScores([newBoard[0][STORE_INDEX], newBoard[1][STORE_INDEX]]);
  };

  return { board, currentPlayer, gameOver, handlePitClick, playerScores };
};