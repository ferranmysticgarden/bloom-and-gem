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

  // Calculate cell size based on screen width - 8 columns for reference design
  const getCellSize = () => {
    if (typeof window === 'undefined') return 44;
    const screenWidth = window.innerWidth;
    const maxBoardWidth = Math.min(screenWidth - 40, 380);
    const cellSize = Math.floor((maxBoardWidth - (cols - 1) * 2) / cols);
    return Math.max(38, Math.min(48, cellSize));
  };

  const [cellSize, setCellSize] = useState(getCellSize);

  useEffect(() => {
    const handleResize = () => setCellSize(getCellSize());
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [cols]);

  return (
    <div className="flex justify-center items-center px-2">
      {/* Board container - dark purple rounded */}
      <div 
        className="rounded-2xl p-3"
        style={{
          background: 'linear-gradient(135deg, hsl(250, 35%, 18%) 0%, hsl(260, 30%, 15%) 100%)',
          boxShadow: '0 8px 32px hsla(260, 50%, 10%, 0.8)',
        }}
      >
        {/* Grid */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
            gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
            gap: '3px',
          }}
        >
          {board.map((row, rowIndex) =>
            row.map((gem, colIndex) => (
              <div 
                key={`${rowIndex}-${colIndex}`}
                className="rounded-full flex items-center justify-center overflow-hidden"
                style={{
                  width: `${cellSize}px`,
                  height: `${cellSize}px`,
                  background: 'hsl(250, 30%, 22%)',
                  boxShadow: 'inset 0 2px 4px hsla(250, 30%, 10%, 0.5)',
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
