import { memo, useCallback } from 'react';
import { Gem, Position } from '@/types/game';
import { GemComponent } from './GemComponent';
import { cn } from '@/lib/utils';

interface GameBoardProps {
  board: (Gem | null)[][];
  selectedGem: Position | null;
  onGemClick: (pos: Position) => void;
  onGemSwap: (pos1: Position, pos2: Position) => void;
}

export const GameBoard = memo(({ board, selectedGem, onGemClick, onGemSwap }: GameBoardProps) => {
  const size = board.length;
  const cellSize = Math.min(48, (window.innerWidth - 48) / size);

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

  return (
    <div className="fairy-card p-3 mx-auto" style={{ width: 'fit-content' }}>
      <div 
        className="grid gap-1 relative"
        style={{ 
          gridTemplateColumns: `repeat(${size}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${size}, ${cellSize}px)`,
        }}
      >
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 rounded-xl pointer-events-none" />
        
        {board.map((row, rowIndex) =>
          row.map((gem, colIndex) => (
            <div 
              key={`${rowIndex}-${colIndex}`}
              className="relative"
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
        
        {/* Floating particles */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="floating-particle bg-primary/30"
            style={{
              width: 4 + Math.random() * 4,
              height: 4 + Math.random() * 4,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
});

GameBoard.displayName = 'GameBoard';
