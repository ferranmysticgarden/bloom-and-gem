import { memo, useCallback } from 'react';
import { Gem, Position } from '@/types/game';
import { GemComponent } from './GemComponent';

interface GameBoardProps {
  board: (Gem | null)[][];
  selectedGem: Position | null;
  onGemClick: (pos: Position) => void;
  onGemSwap: (pos1: Position, pos2: Position) => void;
}

export const GameBoard = memo(({ board, selectedGem, onGemClick, onGemSwap }: GameBoardProps) => {
  const size = board.length;
  const cellSize = Math.min(52, (window.innerWidth - 64) / size);

  const handleGemClick = useCallback((row: number, col: number) => {
    const pos = { row, col };
    
    if (selectedGem) {
      const { row: r1, col: c1 } = selectedGem;
      const isAdjacent = (Math.abs(r1 - row) === 1 && c1 === col) || (Math.abs(c1 - col) === 1 && r1 === row);
      
      if (isAdjacent) {
        onGemSwap(selectedGem, pos);
        return;
      }
    }
    
    onGemClick(pos);
  }, [selectedGem, onGemClick, onGemSwap]);

  // Corner decorations
  const decorations = [
    { emoji: '🍄', position: 'top-left', style: { top: '-20px', left: '-20px' } },
    { emoji: '✨', position: 'top-right', style: { top: '-15px', right: '-15px' } },
    { emoji: '💎', position: 'bottom-left', style: { bottom: '-20px', left: '-20px' } },
    { emoji: '🍄', position: 'bottom-right', style: { bottom: '-15px', right: '-15px' } },
  ];

  return (
    <div className="relative mx-auto my-4" style={{ width: 'fit-content' }}>
      {/* Corner decorations */}
      {decorations.map((dec, i) => (
        <div
          key={i}
          className="absolute text-2xl z-20 animate-pulse"
          style={dec.style}
        >
          {dec.emoji}
        </div>
      ))}
      
      {/* Board container with golden border */}
      <div 
        className="p-2 rounded-2xl relative"
        style={{
          background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
          boxShadow: '0 0 40px rgba(255, 165, 0, 0.5), 0 0 80px rgba(255, 165, 0, 0.3)',
        }}
      >
        {/* Inner board */}
        <div 
          className="grid gap-1 p-2 rounded-xl relative"
          style={{ 
            gridTemplateColumns: `repeat(${size}, ${cellSize}px)`,
            gridTemplateRows: `repeat(${size}, ${cellSize}px)`,
            background: 'linear-gradient(135deg, hsl(270, 60%, 15%) 0%, hsl(280, 50%, 20%) 100%)',
          }}
        >
          {board.map((row, rowIndex) =>
            row.map((gem, colIndex) => (
              <div 
                key={`${rowIndex}-${colIndex}`}
                className="relative rounded-lg"
                style={{
                  background: 'rgba(60, 20, 80, 0.6)',
                  border: '1px solid rgba(100, 50, 150, 0.3)',
                }}
              >
                {gem && (
                  <GemComponent
                    gem={gem}
                    isSelected={selectedGem?.row === rowIndex && selectedGem?.col === colIndex}
                    onClick={() => handleGemClick(rowIndex, colIndex)}
                    cellSize={cellSize}
                  />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
});

GameBoard.displayName = 'GameBoard';
