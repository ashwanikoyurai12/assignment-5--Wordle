import React from 'react';

export default function Tile({ letter, status, delay = 0 }) {
  const isEvaluated = ['correct', 'present', 'absent'].includes(status);

  const className = [
    'tile',
    status,              // e.g. 'correct', 'filled', 'empty'
    isEvaluated && 'flip' // add flip only for revealed tiles
  ]
    .filter(Boolean)
    .join(' ');

  const style = isEvaluated ? { animationDelay: `${delay}ms` } : {};

  return (
    <div className={className} style={style}>
      {letter}
    </div>
  );
}
