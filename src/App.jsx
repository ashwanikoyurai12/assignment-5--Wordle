import React, { useState, useEffect, useCallback } from 'react';
import GameBoard from './components/GameBoard';
import Keyboard from './components/Keyboard';
import Modal from './components/Modal';
import { evaluateGuess } from './utils/evaluateGuess';
import SOLUTION_WORDS, { isValidGuess } from './data/words';
import './App.css';

function getRandomWord() {
  return SOLUTION_WORDS[Math.floor(Math.random() * SOLUTION_WORDS.length)];
}

export default function App() {
  
  const [solutionWord, setSolutionWord] = useState(() => getRandomWord());

  const [currentGuess, setCurrentGuess] = useState('');
  const [pastGuesses, setPastGuesses] = useState([]);
  const [gameStatus, setGameStatus] = useState('IN_PROGRESS'); // 'IN_PROGRESS' | 'WON' | 'LOST'

  // ---- UI state ----
  const [toast, setToast] = useState(null);       // { message, id } or null
  const [shakingRow, setShakingRow] = useState(null); // row index or null

  useEffect(() => {
    console.log('%c[DEBUG] Solution: ' + solutionWord, 'color: #538d4e; font-weight: bold;');
  }, [solutionWord]);

  const letterStatuses = React.useMemo(() => {
    const statuses = {};
    const priority = { absent: 0, present: 1, correct: 2 };

    pastGuesses.forEach((guess) => {
      const result = evaluateGuess(guess, solutionWord);
      for (let i = 0; i < 5; i++) {
        const letter = guess[i];
        const newStatus = result[i];
        const currentPriority = priority[statuses[letter]] ?? -1;
        const newPriority = priority[newStatus] ?? -1;

        // Only upgrade — never downgrade a letter's status
        if (newPriority > currentPriority) {
          statuses[letter] = newStatus;
        }
      }
    });

    return statuses;
  }, [pastGuesses, solutionWord]);

  const showToast = useCallback((message) => {
    const id = Date.now();
    setToast({ message, id });
    setTimeout(() => {
      setToast((prev) => (prev && prev.id === id ? null : prev));
    }, 1500);
  }, []);

  const triggerShake = useCallback(() => {
    setShakingRow(pastGuesses.length);
    setTimeout(() => setShakingRow(null), 500);
  }, [pastGuesses.length]);

  // ---- Core input handler ----

  /**
   * handleKeyInput processes a single key press — whether from the
   * physical keyboard or the on-screen keyboard.
   *
   * @param {string} key – 'A'-'Z', 'ENTER', or 'BACKSPACE'
   */
  const handleKeyInput = useCallback(
    (key) => {
      if (gameStatus !== 'IN_PROGRESS') return;

      if (key === 'BACKSPACE') {
        setCurrentGuess((prev) => prev.slice(0, -1));
        return;
      }
      if (key === 'ENTER') {
        if (currentGuess.length !== 5) {
          showToast('Not enough letters');
          triggerShake();
          return;
        }
        if (!isValidGuess(currentGuess)) {
          showToast('Not in word list');
          triggerShake();
          return;
        }
        const newPastGuesses = [...pastGuesses, currentGuess];
        setPastGuesses(newPastGuesses);
        setCurrentGuess('');
        if (currentGuess === solutionWord) {
          setGameStatus('WON');
        } else if (newPastGuesses.length >= 6) {
          setGameStatus('LOST');
        }
        return;
      }
      if (/^[A-Z]$/.test(key) && currentGuess.length < 5) {
        setCurrentGuess((prev) => prev + key);
      }
    },
    [gameStatus, currentGuess, pastGuesses, solutionWord, showToast, triggerShake]
  );

  const handleKeyDown = useCallback(
    (e) => {
      // Don't interfere with browser shortcuts
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (e.key === 'Enter') {
        handleKeyInput('ENTER');
      } else if (e.key === 'Backspace') {
        handleKeyInput('BACKSPACE');
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        handleKeyInput(e.key.toUpperCase());
      }
    },
    [handleKeyInput]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const handlePlayAgain = useCallback(() => {
    setSolutionWord(getRandomWord());
    setCurrentGuess('');
    setPastGuesses([]);
    setGameStatus('IN_PROGRESS');
    setToast(null);
    setShakingRow(null);
  }, []);

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <h1>Wordle</h1>
      </header>

      {/* Toast messages (errors, etc.) */}
      <div className="toast-container">
        {toast && (
          <div className="toast" key={toast.id}>
            {toast.message}
          </div>
        )}
      </div>

      {/* Game board: 6 rows × 5 tiles */}
      <GameBoard
        pastGuesses={pastGuesses}
        currentGuess={currentGuess}
        solutionWord={solutionWord}
        shakingRow={shakingRow}
      />

      {/* On-screen keyboard */}
      <Keyboard
        onKeyPress={handleKeyInput}
        letterStatuses={letterStatuses}
      />

      {/* Win/Loss modal */}
      <Modal
        gameStatus={gameStatus}
        solutionWord={solutionWord}
        numGuesses={pastGuesses.length}
        onPlayAgain={handlePlayAgain}
      />
    </div>
  );
}
