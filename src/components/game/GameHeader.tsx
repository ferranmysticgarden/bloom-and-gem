import { memo } from 'react';
import { Trophy, Zap, Target, X } from 'lucide-react';

interface GameHeaderProps {
  level: number;
  score: number;
  targetScore: number;
  moves: number;
  combo: number;
  onExit: () => void;
}

export const GameHeader = memo(({
  level,
  score,
  targetScore,
  moves,
  combo,
  onExit,
}: GameHeaderProps) => {
  const progress = Math.min((score / targetScore) * 100, 100);
  
  return (
    <div 
      className="mx-auto w-full max-w-lg p-4 rounded-2xl mb-4"
      style={{
        background: 'linear-gradient(135deg, rgba(60, 20, 80, 0.95) 0%, rgba(40, 15, 60, 0.95) 100%)',
        border: '2px solid rgba(150, 100, 200, 0.3)',
        boxShadow: '0 4px 20px rgba(100, 50, 150, 0.3)',
      }}
    >
      {/* Top row - Level and Exit */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #FFA500 0%, #FF8C00 100%)',
            }}
          >
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white/60 text-xs uppercase">Nivel</p>
            <p className="text-white font-bold text-lg">{level}</p>
          </div>
        </div>
        
        <button
          onClick={onExit}
          className="px-4 py-2 rounded-full font-semibold flex items-center gap-2 transition-all hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: 'white',
          }}
        >
          <X className="w-4 h-4" />
          Salir
        </button>
      </div>
      
      {/* Stats row */}
      <div className="flex gap-3 mb-3">
        <div 
          className="flex-1 p-3 rounded-xl"
          style={{
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-white/60 text-xs uppercase">Movimientos</span>
          </div>
          <p className="text-white font-bold text-2xl">{moves}</p>
        </div>
        
        <div 
          className="flex-1 p-3 rounded-xl"
          style={{
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4 text-pink-400" />
            <span className="text-white/60 text-xs uppercase">Puntuación</span>
          </div>
          <p className="text-white font-bold text-2xl">{score}</p>
        </div>
      </div>
      
      {/* Objective */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-white/60 text-sm">Objetivo</span>
          <span className="text-white font-semibold">{score} / {targetScore}</span>
        </div>
        <div 
          className="h-3 rounded-full overflow-hidden"
          style={{ background: 'rgba(0, 0, 0, 0.4)' }}
        >
          <div 
            className="h-full transition-all duration-500 ease-out rounded-full"
            style={{ 
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #f472b6 0%, #ec4899 50%, #db2777 100%)',
              boxShadow: '0 0 10px rgba(236, 72, 153, 0.5)',
            }}
          />
        </div>
        <p className="text-center text-white/50 text-xs mt-2">
          Recolectar {targetScore} puntos
        </p>
      </div>
      
      {/* Combo indicator */}
      {combo > 1 && (
        <div 
          className="mt-3 text-center py-2 rounded-full animate-pulse"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 165, 0, 0.2) 100%)',
            border: '1px solid rgba(255, 215, 0, 0.5)',
          }}
        >
          <span className="text-yellow-400 font-bold">🔥 x{combo} Combo!</span>
        </div>
      )}
    </div>
  );
});

GameHeader.displayName = 'GameHeader';
