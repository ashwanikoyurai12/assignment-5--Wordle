import React from 'react';
const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'],
];
export default function Keyboard({ onKeyPress, letterStatuses }) {
  const handleMouseDown = (e, key) => {
    e.preventDefault(); // prevent focus shift and double-fire
    onKeyPress(key);
  };
  return (
    <div className="keyboard">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div className="keyboard-row" key={rowIndex}>
          {row.map((key) => {
            const status = letterStatuses[key] || '';
            const isWide = key === 'ENTER' || key === 'BACKSPACE';
            const className = [
              'key',
              status,          // 'correct', 'present', 'absent', or ''
              isWide && 'wide' // wider keys for Enter and Backspace
            ]
              .filter(Boolean)
              .join(' ');
            const label = key === 'BACKSPACE' ? '⌫' : key;
            return (
              <button
                key={key}
                className={className}
                onMouseDown={(e) => handleMouseDown(e, key)}
                tabIndex={-1}       // prevent tab-focus on keyboard buttons
                aria-label={key}
              >
                {label}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
