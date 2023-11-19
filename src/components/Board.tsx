import React, { useState, useEffect } from 'react';
import { useMancalaGame } from '../hooks/useMancalaGame';
import styled from 'styled-components';

// Constants for the game
const PIT_COUNT = 6;

// Styled components
const BoardContainer = styled.div<{ rotationDegrees: number }>`
  width: 100%;
  padding: 20px;
  margin: auto;
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;
  grid-template-rows: auto auto;
  justify-items: center;
  align-items: center;
  user-select: none;
  transition: transform 0.5s;
  transform: ${props => `rotate(${props.rotationDegrees}deg)`};
`;

const PitRow = styled.div`
  display: flex;
  justify-content: center;
`;

const Highlight = styled.div`
  background-color: #ffffa8;
  grid-column: 2;
  padding: 10px;
  border-radius: 10px;
`;

const Pit = styled.div`
  background-color: #f4ce93;
  border: 1px solid #aa6c39;
  border-radius: 50%;
  width: 10vw; // Responsive width based on viewport width
  height: 10vw; // Responsive height
  max-width: 60px; // Maximum size
  max-height: 60px;
  margin: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const Store = styled.div<{ isActivePlayer: boolean }>`
  background-color: #d6a67c;
  border: 1px solid #aa6c39;
  width: 15vw; // Responsive width
  height: 45vw; // Responsive height
  max-width: 100px;
  max-height: 300px;
  border-radius: 50px;
  margin: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2em;
  grid-row: 1 / span 2;
  opacity: ${props => props.isActivePlayer ? 1 : 0.5}; // Adjusting opacity based on active player
`;

// Board component
const Board: React.FC = () => {
  const { board, currentPlayer, handlePitClick, playerScores } = useMancalaGame();
  const [rotationDegrees, setRotationDegrees] = useState(0);

  useEffect(() => {
    if (currentPlayer === 1) {
      setRotationDegrees(180);
    } else if (currentPlayer === 0 && rotationDegrees === 180) {
      setRotationDegrees(360);

      const timer = setTimeout(() => {
        setRotationDegrees(0);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [currentPlayer, rotationDegrees]);

  return (
    <BoardContainer rotationDegrees={rotationDegrees}>
      <Store isActivePlayer={currentPlayer === 1} style={{ gridColumn: 1 }}>{playerScores[1]}</Store>
      <Highlight style={{ opacity: currentPlayer === 0 ? 1 : 0.5 }}>
        <PitRow>
          {board[0].slice(0, PIT_COUNT).map((stone, index) => (
            <Pit key={index} onClick={() => handlePitClick(0, index)}>{stone}</Pit>
          ))}
        </PitRow>
      </Highlight>
      <Highlight style={{ opacity: currentPlayer === 1 ? 1 : 0.5 }}>
        <PitRow>
          {board[1].slice(0, PIT_COUNT).map((stone, index) => (
            <Pit key={index} onClick={() => handlePitClick(1, index)}>{stone}</Pit>
          ))}
        </PitRow>
      </Highlight>
      <Store isActivePlayer={currentPlayer === 0} style={{ gridColumn: 3 }}>{playerScores[0]}</Store>
    </BoardContainer>
  );
};

export default Board;