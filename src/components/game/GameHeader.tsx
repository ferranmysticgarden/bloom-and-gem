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
      className="w-full max-w-md mx-auto rounded-3xl mb-6 overflow-hidden"
      style={{
        background: 'hsl(280, 30%, 22%)',
        boxShadow: '0 8px 32px hsla(280, 50%, 15%, 0.6)',
      }}
    >
      {/* Top row - Levels button and Level number */}
      <div className="flex justify-between items-center px-4 py-4">
        <button
          onClick={onExit}
          className="px-5 py-2.5 rounded-full font-medium flex items-center gap-2 transition-all hover:scale-105"
          style={{
            background: 'hsl(0, 0%, 8%)',
            color: 'white',
          }}
        >
          <ArrowLeft className="w-4 h-4" />
          Levels
        </button>
        
        <div 
          className="font-cinzel text-2xl italic"
          style={{
            color: '#FFD700',
            textShadow: '0 0 12px rgba(255, 215, 0, 0.6)',
          }}
        >
          Level <span className="font-bold">{level}</span>
        </div>
      </div>
      
      {/* Stats row - 3 boxes */}
      <div className="flex gap-3 px-4 pb-4">
        {/* Moves */}
        <div 
          className="flex-1 py-4 rounded-2xl text-center"
          style={{
            background: 'hsla(280, 25%, 18%, 0.8)',
            border: '1px solid hsla(280, 30%, 35%, 0.4)',
          }}
        >
          <p className="text-white/70 text-xs uppercase tracking-wider mb-1">Moves</p>
          <p className="text-white font-bold text-3xl">{moves}</p>
        </div>
        
        {/* Score */}
        <div 
          className="flex-1 py-4 rounded-2xl text-center"
          style={{
            background: 'hsla(280, 25%, 18%, 0.8)',
            border: '1px solid hsla(280, 30%, 35%, 0.4)',
          }}
        >
          <p className="text-white/70 text-xs uppercase tracking-wider mb-1">Score</p>
          <p className="text-white font-bold text-3xl">{score}</p>
        </div>
        
        {/* Objective */}
        <div 
          className="flex-1 py-4 rounded-2xl text-center"
          style={{
            background: 'hsla(280, 25%, 18%, 0.8)',
            border: '1px solid hsla(280, 30%, 35%, 0.4)',
          }}
        >
          <p className="text-white/70 text-xs uppercase tracking-wider mb-1">Objective</p>
          <p className="text-white font-bold text-xl">{score} <span className="text-white/50">/</span> {targetScore}</p>
        </div>
      </div>
      
      {/* Collect points text */}
      <div className="text-center pb-5">
        <p className="text-white text-base">
          Collect <span className="font-bold">{targetScore}</span> points
        </p>
      </div>
      
      {/* Combo indicator */}
      {combo > 1 && (
        <div 
          className="text-center py-2 mx-4 mb-4 rounded-full animate-pulse"
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
