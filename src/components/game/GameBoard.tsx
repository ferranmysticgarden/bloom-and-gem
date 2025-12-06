import { memo, useCallback, useState, useEffect } from 'react';
import { Gem, Position } from '@/types/game';
import { GemComponent } from './GemComponent';

interface GameBoardProps {
  board: (Gem | null)[][];
  selectedGem: Position | null;
  onGemClick: (pos: Position) => void;
  onGemSwap: (pos1: Position, pos2: Position) => void;
}

// Hook para obtener dimensiones de la ventana de forma reactiva
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 375,
    height: typeof window !== 'undefined' ? window.innerHeight : 667,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    // Llamar una vez al montar
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

export const GameBoard = memo(({ board, selectedGem, onGemClick, onGemSwap }: GameBoardProps) => {
  const size = board.length;
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  
  // Calcular el tamaño de celda basado en el espacio disponible
  // Dejamos margen para header, booster bar y padding
  const availableWidth = windowWidth - 32; // 16px padding cada lado
  const availableHeight = windowHeight - 280; // Espacio para header y boosters
  
  // Usar el menor entre ancho y alto para que el tablero sea cuadrado
  const maxBoardSize = Math.min(availableWidth, availableHeight);
  const cellSize = Math.floor((maxBoardSize - (size * 4)) / size); // 4px de gap total por celda
  
  // Limitar tamaño mínimo y máximo
  const finalCellSize = Math.max(36, Math.min(60, cellSize));

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
    { emoji: '🍄', position: 'top-left', style: { top: '-16px', left: '-16px' } },
    { emoji: '✨', position: 'top-right', style: { top: '-12px', right: '-12px' } },
    { emoji: '💎', position: 'bottom-left', style: { bottom: '-16px', left: '-16px' } },
    { emoji: '🍄', position: 'bottom-right', style: { bottom: '-12px', right: '-12px' } },
  ];

  const boardWidth = (finalCellSize * size) + (size - 1) * 4 + 16; // cells + gaps + padding

  return (
    <div 
      className="relative mx-auto my-2 flex items-center justify-center" 
      style={{ 
        width: '100%',
        maxWidth: `${boardWidth + 16}px`,
      }}
    >
      {/* Corner decorations */}
      {decorations.map((dec, i) => (
        <div
          key={i}
          className="absolute text-xl z-20 animate-pulse"
          style={dec.style}
        >
          {dec.emoji}
        </div>
      ))}
      
      {/* Board container with golden border */}
      <div 
        className="p-2 rounded-2xl relative w-full"
        style={{
          background: 'linear-gradient(135deg, hsl(45 90% 50%) 0%, hsl(35 90% 50%) 50%, hsl(25 90% 50%) 100%)',
          boxShadow: '0 0 30px hsla(35, 90%, 50%, 0.5), 0 0 60px hsla(35, 90%, 50%, 0.3)',
        }}
      >
        {/* Inner board */}
        <div 
          className="grid p-2 rounded-xl relative mx-auto"
          style={{ 
            gridTemplateColumns: `repeat(${size}, ${finalCellSize}px)`,
            gridTemplateRows: `repeat(${size}, ${finalCellSize}px)`,
            gap: '4px',
            background: 'linear-gradient(135deg, hsl(270 60% 15%) 0%, hsl(280 50% 20%) 100%)',
            width: 'fit-content',
          }}
        >
          {board.map((row, rowIndex) =>
            row.map((gem, colIndex) => (
              <div 
                key={`${rowIndex}-${colIndex}`}
                className="relative rounded-lg"
                style={{
                  width: `${finalCellSize}px`,
                  height: `${finalCellSize}px`,
                  background: 'hsla(280, 50%, 25%, 0.6)',
                  border: '1px solid hsla(280, 50%, 40%, 0.3)',
                }}
              >
                {gem && (
                  <GemComponent
                    gem={gem}
                    isSelected={selectedGem?.row === rowIndex && selectedGem?.col === colIndex}
                    onClick={() => handleGemClick(rowIndex, colIndex)}
                    cellSize={finalCellSize}
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
