import { useState, useEffect } from 'react';

// Constants for the game
const INITIAL_STONES = 4;
const PIT_COUNT = 6;

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
    initialBoard[0][PIT_COUNT] = 0; // Player 1's Mancala pit
    initialBoard[1][PIT_COUNT] = 0; // Player 2's Mancala pit
    setBoard(initialBoard);
  }, []);

  const handlePitClick = (player: Player, pitIndex: number) => {
    if (gameOver || player !== currentPlayer || board[player][pitIndex] === 0) {
      return;
    }

    let stones = board[player][pitIndex];
    board[player][pitIndex] = 0;
    let currentRow = player;
    let currentIndex = pitIndex;
    let lastStoneIndex = 0;
    let lastStoneRow = player;

    while (stones > 0) {
      currentIndex++;
      if (currentIndex > PIT_COUNT) {
        currentRow = 1 - currentRow as Player;
        currentIndex = 0;
      }

      // Skip opponent's Mancala pit
      if (currentRow !== currentPlayer && currentIndex === PIT_COUNT) {
        continue;
      }

      // Place stones in pits
      if (!(currentIndex === PIT_COUNT && currentRow !== currentPlayer)) {
        board[currentRow][currentIndex]++;
        stones--;
        lastStoneIndex = currentIndex;
        lastStoneRow = currentRow;
      }
    }

    // Extra turn logic
    if (lastStoneIndex === PIT_COUNT && lastStoneRow === currentPlayer) {
      // Do not switch player if last stone lands in player's Mancala pit
    } else {
      // Capture logic
      if (lastStoneIndex < PIT_COUNT && lastStoneRow === currentPlayer && board[lastStoneRow][lastStoneIndex] === 1) {
        const oppositeIndex = PIT_COUNT - lastStoneIndex - 1;
        const capturedStones = board[1 - lastStoneRow][oppositeIndex];
        board[currentPlayer][PIT_COUNT] += capturedStones + 1; // Add captured stones to player's Mancala pit
        board[1 - lastStoneRow][oppositeIndex] = 0;
        board[lastStoneRow][lastStoneIndex] = 0;
      }
      // Switch player
      setCurrentPlayer(1 - currentPlayer as Player);
    }

    // Check for game over
    const isGameOver = board[currentPlayer].slice(0, PIT_COUNT).every(pit => pit === 0);
    if (isGameOver) {
      const remainingStones = board[1 - currentPlayer].slice(0, PIT_COUNT).reduce((sum, pit) => sum + pit, 0);
      board[1 - currentPlayer][PIT_COUNT] += remainingStones;
      board[1 - currentPlayer].fill(0, 0, PIT_COUNT); // Clear pits
      setGameOver(true);
    }

    // Update board and scores
    setBoard(board.map(row => [...row]));
    setPlayerScores([board[0][PIT_COUNT], board[1][PIT_COUNT]]);
  };

  return { board, currentPlayer, gameOver, handlePitClick, playerScores };
};