import { memo, useCallback, useState, useEffect } from 'react';
import { Gem, Position } from '@/types/game';
import { GemComponent } from './GemComponent';

interface GameBoardProps {
  board: (Gem | null)[][];
  selectedGem: Position | null;
  onGemClick: (pos: Position) => void;
  onGemSwap: (pos1: Position, pos2: Position) => void;
}

export const GameBoard = memo(({ board, selectedGem, onGemClick, onGemSwap }: GameBoardProps) => {
  const size = board?.length || 0;
  
  // Return early if no board
  if (size === 0 || !board[0]) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-white/60">Cargando tablero...</div>
      </div>
    );
  }

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

  // Calculate cell size based on screen width
  const getCellSize = () => {
    if (typeof window === 'undefined') return 48;
    const screenWidth = window.innerWidth;
    const maxBoardWidth = Math.min(screenWidth - 32, 400);
    const cellSize = Math.floor((maxBoardWidth - (size - 1) * 4 - 16) / size);
    return Math.max(36, Math.min(56, cellSize));
  };

  const [cellSize, setCellSize] = useState(getCellSize);

  useEffect(() => {
    const handleResize = () => setCellSize(getCellSize());
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [size]);

  return (
    <div className="flex justify-center items-center my-4 px-2">
      {/* Board container with golden border */}
      <div 
        className="rounded-2xl p-1"
        style={{
          background: 'linear-gradient(135deg, hsl(45, 90%, 50%) 0%, hsl(35, 90%, 50%) 50%, hsl(25, 90%, 50%) 100%)',
          boxShadow: '0 0 30px hsla(35, 90%, 50%, 0.5), 0 0 60px hsla(35, 90%, 50%, 0.3)',
        }}
      >
        {/* Inner board with grid */}
        <div 
          className="rounded-xl p-2"
          style={{
            background: 'linear-gradient(135deg, hsl(270, 60%, 15%) 0%, hsl(280, 50%, 20%) 100%)',
            display: 'grid',
            gridTemplateColumns: `repeat(${size}, ${cellSize}px)`,
            gridTemplateRows: `repeat(${size}, ${cellSize}px)`,
            gap: '4px',
          }}
        >
          {board.map((row, rowIndex) =>
            row.map((gem, colIndex) => (
              <div 
                key={`${rowIndex}-${colIndex}`}
                className="rounded-lg flex items-center justify-center"
                style={{
                  width: `${cellSize}px`,
                  height: `${cellSize}px`,
                  background: 'hsla(280, 50%, 25%, 0.6)',
                  border: '1px solid hsla(280, 50%, 40%, 0.3)',
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