import React from 'react';
import { useMancalaGame } from '../hooks/useMancalaGame'; // Update this path as needed
import styled from 'styled-components';

// Constants for the game
const PIT_COUNT = 6;

// Styled components
const BoardContainer = styled.div`
  display: grid;
  grid-template-columns: 100px auto 100px;
  grid-template-rows: auto auto;
  justify-items: center;
  align-items: center;
  user-select: none;
`;

const PitRow = styled.div`
  display: flex;
  justify-content: center;
`;

const Highlight = styled.div`
  background-color: #ffffa8; // Highlight color, adjust as needed
  grid-column: 2;
  padding: 10px;
  border-radius: 10px;
`;

const Pit = styled.div`
  background-color: #f4ce93;
  border: 1px solid #aa6c39;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  margin: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const Store = styled.div`
  background-color: #d6a67c;
  border: 1px solid #aa6c39;
  width: 100px;
  height: 300px; // Adjust height to match the combined height of two pit rows
  border-radius: 50px;
  margin: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2em;
  grid-row: 1 / span 2; // Span both pit rows
`;

// Board component
const Board: React.FC = () => {
  const { board, currentPlayer, handlePitClick, playerScores } = useMancalaGame();

  return (
    <BoardContainer>
      <Store style={{ gridColumn: 1 }}>{playerScores[1]}</Store> {/* Player 2's store */}
      
      <Highlight style={{ opacity: currentPlayer === 0 ? 1 : 0.5 }}>
        <PitRow>{board[0].slice(0, PIT_COUNT).map((stone, index) => (
          <Pit key={index} onClick={() => handlePitClick(0, index)}>{stone}</Pit>
        ))}</PitRow>
      </Highlight>

      <Highlight style={{ opacity: currentPlayer === 1 ? 1 : 0.5 }}>
        <PitRow>{board[1].slice(0, PIT_COUNT).reverse().map((stone, index) => (
          <Pit key={index} onClick={() => handlePitClick(1, PIT_COUNT - 1 - index)}>{stone}</Pit>
        ))}</PitRow>
      </Highlight>

      <Store style={{ gridColumn: 3 }}>{playerScores[0]}</Store> {/* Player 1's store */}
    </BoardContainer>
  );
};

export default Board;