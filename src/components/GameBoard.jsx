import React from 'react';
import Row from './Row';
import { evaluateGuess } from '../utils/evaluateGuess';

export default function GameBoard({ pastGuesses, currentGuess, solutionWord, shakingRow }) {
  const rows = [];

  for (let i = 0; i < 6; i++) {
    if (i < pastGuesses.length) {
      const statuses = evaluateGuess(pastGuesses[i], solutionWord);
      rows.push(
        <Row key={i} letters={pastGuesses[i]} statuses={statuses} />
      );
    } else if (i === pastGuesses.length) {

      rows.push(
        <Row
          key={i}
          letters={currentGuess}
          isShaking={shakingRow === i}
        />
      );
    } else {
  
      rows.push(<Row key={i} />);
    }
  }

  return <div className="game-board">{rows}</div>;
}
