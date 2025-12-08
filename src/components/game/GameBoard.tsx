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
  const rows = board?.length || 0;
  const cols = board?.[0]?.length || 0;
  
  // Return early if no board
  if (rows === 0 || cols === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
        <div style={{ color: 'rgba(255,255,255,0.6)' }}>Cargando tablero...</div>
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
    if (typeof window === 'undefined') return 42;
    const screenWidth = window.innerWidth;
    const maxBoardWidth = Math.min(screenWidth - 32, 420);
    const gap = 4;
    const cellSize = Math.floor((maxBoardWidth - (cols - 1) * gap) / cols);
    return Math.max(38, Math.min(52, cellSize));
  };

  const [cellSize, setCellSize] = useState(getCellSize);

  useEffect(() => {
    const handleResize = () => setCellSize(getCellSize());
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [cols]);

  const gap = 4;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
      {/* Board container - AZULADO como en la referencia */}
      <div 
        style={{
          background: 'linear-gradient(180deg, hsl(250, 30%, 28%) 0%, hsl(260, 28%, 22%) 100%)',
          boxShadow: '0 8px 32px hsla(260, 40%, 10%, 0.8)',
          borderRadius: '20px',
          padding: '12px',
        }}
      >
        {/* Grid 8x9 */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
            gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
            gap: `${gap}px`,
          }}
        >
          {board.map((row, rowIndex) =>
            row.map((gem, colIndex) => (
              <div 
                key={`${rowIndex}-${colIndex}`}
                style={{
                  width: `${cellSize}px`,
                  height: `${cellSize}px`,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  background: 'hsl(230, 35%, 22%)',
                  boxShadow: 'inset 0 2px 6px hsla(230, 40%, 8%, 0.9)',
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