import React from 'react';

export default function Modal({ gameStatus, solutionWord, numGuesses, onPlayAgain }) {

  if (gameStatus === 'IN_PROGRESS') return null;

  const isWin = gameStatus === 'WON';

  return (
    <div className="modal-overlay">
      <div className="modal">
        {isWin ? (
          <>
            <h2>🎉 You Won!</h2>
            <p>
              Congratulations! You found the word in{' '}
              <strong>{numGuesses}</strong> guess{numGuesses !== 1 ? 'es' : ''}.
            </p>
          </>
        ) : (
          <>
            <h2>😞 Game Over</h2>
            <p>
              The word was: <span className="solution-word">{solutionWord}</span>
            </p>
          </>
        )}
        <button onClick={onPlayAgain}>Play Again</button>
      </div>
    </div>
  );
}
