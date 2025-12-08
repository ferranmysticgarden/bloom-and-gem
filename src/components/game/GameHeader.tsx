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
      className="w-full max-w-md mx-auto rounded-3xl mb-4 overflow-hidden"
      style={{
        background: 'hsl(280, 32%, 24%)',
        boxShadow: '0 8px 32px hsla(280, 50%, 12%, 0.7)',
      }}
    >
      {/* Top row - Levels button and Level number */}
      <div className="flex flex-row justify-between items-center px-4 py-3">
        <button
          onClick={onExit}
          className="px-4 py-2 rounded-full font-medium flex flex-row items-center gap-2 transition-all hover:scale-105"
          style={{
            background: 'hsl(0, 0%, 8%)',
            color: 'white',
            fontSize: '14px',
          }}
        >
          <ArrowLeft className="w-4 h-4" />
          Levels
        </button>
        
        <div 
          className="font-cinzel text-xl"
          style={{
            color: '#FFD700',
            textShadow: '0 0 12px rgba(255, 215, 0, 0.6)',
          }}
        >
          LEVEL <span className="font-bold">{level}</span>
        </div>
      </div>
      
      {/* Stats row - 3 boxes HORIZONTAL */}
      <div 
        className="px-4 pb-3"
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '8px',
        }}
      >
        {/* Moves */}
        <div 
          style={{
            flex: 1,
            padding: '14px 8px',
            borderRadius: '16px',
            textAlign: 'center',
            background: 'hsla(275, 28%, 18%, 0.9)',
            border: '1px solid hsla(275, 25%, 30%, 0.3)',
          }}
        >
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '12px', textTransform: 'capitalize', letterSpacing: '0.5px', marginBottom: '6px' }}>Moves</p>
          <p style={{ color: 'white', fontWeight: 'bold', fontSize: '26px' }}>{moves}</p>
        </div>
        
        {/* Score */}
        <div 
          style={{
            flex: 1,
            padding: '14px 8px',
            borderRadius: '16px',
            textAlign: 'center',
            background: 'hsla(275, 28%, 18%, 0.9)',
            border: '1px solid hsla(275, 25%, 30%, 0.3)',
          }}
        >
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '12px', textTransform: 'capitalize', letterSpacing: '0.5px', marginBottom: '6px' }}>Score</p>
          <p style={{ color: 'white', fontWeight: 'bold', fontSize: '26px' }}>{score}</p>
        </div>
        
        {/* Objective */}
        <div 
          style={{
            flex: 1,
            padding: '14px 8px',
            borderRadius: '16px',
            textAlign: 'center',
            background: 'hsla(275, 28%, 18%, 0.9)',
            border: '1px solid hsla(275, 25%, 30%, 0.3)',
          }}
        >
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '12px', textTransform: 'capitalize', letterSpacing: '0.5px', marginBottom: '6px' }}>Objective</p>
          <p style={{ color: 'white', fontWeight: 'bold', fontSize: '20px' }}>{score} / {targetScore}</p>
        </div>
      </div>
      
      {/* Collect points text */}
      <div style={{ textAlign: 'center', paddingBottom: '16px' }}>
        <p style={{ color: 'white', fontSize: '14px' }}>
          Collect <span style={{ fontWeight: 'bold' }}>{targetScore}</span> points
        </p>
      </div>
      
      {/* Combo indicator */}
      {combo > 1 && (
        <div 
          style={{
            textAlign: 'center',
            padding: '8px',
            margin: '0 16px 16px 16px',
            borderRadius: '9999px',
            background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 165, 0, 0.2) 100%)',
            border: '1px solid rgba(255, 215, 0, 0.5)',
          }}
        >
          <span style={{ color: '#FACC15', fontWeight: 'bold' }}>🔥 x{combo} Combo!</span>
        </div>
      )}
    </div>
  );
});

GameHeader.displayName = 'GameHeader';
