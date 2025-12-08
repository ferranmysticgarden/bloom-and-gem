import { memo } from 'react';
import { ArrowLeft } from 'lucide-react';

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
  return (
    <div 
      className="w-full max-w-md mx-auto rounded-2xl mb-4 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, hsl(280, 40%, 25%) 0%, hsl(290, 35%, 20%) 100%)',
        boxShadow: '0 4px 20px hsla(280, 50%, 30%, 0.5)',
      }}
    >
      {/* Top row - Levels button and Level number */}
      <div className="flex justify-between items-center px-4 py-3">
        <button
          onClick={onExit}
          className="px-4 py-2 rounded-full font-medium flex items-center gap-2 transition-all hover:scale-105"
          style={{
            background: 'hsla(280, 30%, 15%, 0.8)',
            color: 'white',
            border: '1px solid hsla(280, 40%, 40%, 0.5)',
          }}
        >
          <ArrowLeft className="w-4 h-4" />
          Levels
        </button>
        
        <div 
          className="font-cinzel text-xl italic"
          style={{
            color: '#FFD700',
            textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
          }}
        >
          Level <span className="font-bold">{level}</span>
        </div>
      </div>
      
      {/* Stats row */}
      <div className="flex gap-2 px-4 pb-3">
        {/* Moves */}
        <div 
          className="flex-1 py-3 rounded-xl text-center"
          style={{
            background: 'hsla(280, 30%, 15%, 0.6)',
            border: '1px solid hsla(280, 40%, 40%, 0.3)',
          }}
        >
          <p className="text-white/60 text-xs uppercase tracking-wide mb-1">Moves</p>
          <p className="text-white font-bold text-2xl">{moves}</p>
        </div>
        
        {/* Score */}
        <div 
          className="flex-1 py-3 rounded-xl text-center"
          style={{
            background: 'hsla(280, 30%, 15%, 0.6)',
            border: '1px solid hsla(280, 40%, 40%, 0.3)',
          }}
        >
          <p className="text-white/60 text-xs uppercase tracking-wide mb-1">Score</p>
          <p className="text-white font-bold text-2xl">{score}</p>
        </div>
        
        {/* Objective */}
        <div 
          className="flex-1 py-3 rounded-xl text-center"
          style={{
            background: 'hsla(280, 30%, 15%, 0.6)',
            border: '1px solid hsla(280, 40%, 40%, 0.3)',
          }}
        >
          <p className="text-white/60 text-xs uppercase tracking-wide mb-1">Objective</p>
          <p className="text-white font-bold text-lg">{score} <span className="text-white/50">/</span> {targetScore}</p>
        </div>
      </div>
      
      {/* Collect points text */}
      <div className="text-center pb-4">
        <p className="text-white/80 text-sm">
          Collect <span className="font-bold text-white">{targetScore}</span> points
        </p>
      </div>
      
      {/* Combo indicator */}
      {combo > 1 && (
        <div 
          className="text-center py-2 mx-4 mb-3 rounded-full animate-pulse"
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
