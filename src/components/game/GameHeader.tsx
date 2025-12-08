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
      style={{
        width: '100%',
        background: 'linear-gradient(180deg, hsl(280, 35%, 32%) 0%, hsl(280, 30%, 26%) 100%)',
        boxShadow: '0 4px 20px hsla(280, 40%, 10%, 0.6)',
        borderRadius: '20px',
        marginBottom: '12px',
        overflow: 'hidden',
      }}
    >
      {/* Top row - Levels button LEFT, Level number RIGHT */}
      <div 
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
        }}
      >
        {/* Levels button - black pill */}
        <button
          onClick={onExit}
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '9999px',
            background: 'hsl(0, 0%, 8%)',
            color: 'white',
            fontSize: '15px',
            fontWeight: '500',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <ArrowLeft style={{ width: '18px', height: '18px' }} />
          Levels
        </button>
        
        {/* Level X - RIGHT side, italic "Level", bold number */}
        <div 
          style={{
            fontFamily: "'Cinzel', serif",
            color: '#FFD700',
            textShadow: '0 0 15px rgba(255, 215, 0, 0.5)',
            fontSize: '22px',
          }}
        >
          <span style={{ fontStyle: 'italic', fontWeight: '400' }}>Level</span>
          {' '}
          <span style={{ fontWeight: '700' }}>{level}</span>
        </div>
      </div>
      
      {/* Stats row - 3 boxes HORIZONTAL */}
      <div 
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '10px',
          padding: '0 16px 12px 16px',
        }}
      >
        {/* Moves */}
        <div 
          style={{
            flex: 1,
            padding: '12px 8px',
            borderRadius: '14px',
            textAlign: 'center',
            background: 'hsla(280, 25%, 22%, 0.9)',
          }}
        >
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginBottom: '4px', margin: '0 0 4px 0' }}>Moves</p>
          <p style={{ color: 'white', fontWeight: 'bold', fontSize: '26px', lineHeight: '1', margin: 0 }}>{moves}</p>
        </div>
        
        {/* Score */}
        <div 
          style={{
            flex: 1,
            padding: '12px 8px',
            borderRadius: '14px',
            textAlign: 'center',
            background: 'hsla(280, 25%, 22%, 0.9)',
          }}
        >
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginBottom: '4px', margin: '0 0 4px 0' }}>Score</p>
          <p style={{ color: 'white', fontWeight: 'bold', fontSize: '26px', lineHeight: '1', margin: 0 }}>{score}</p>
        </div>
        
        {/* Objective */}
        <div 
          style={{
            flex: 1,
            padding: '12px 8px',
            borderRadius: '14px',
            textAlign: 'center',
            background: 'hsla(280, 25%, 22%, 0.9)',
          }}
        >
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginBottom: '4px', margin: '0 0 4px 0' }}>Objective</p>
          <p style={{ color: 'white', fontWeight: 'bold', fontSize: '18px', lineHeight: '1', margin: 0 }}>{score} / {targetScore}</p>
        </div>
      </div>
      
      {/* Collect points text */}
      <div style={{ textAlign: 'center', paddingBottom: '14px' }}>
        <p style={{ color: 'white', fontSize: '15px', margin: 0 }}>
          Collect <span style={{ fontWeight: 'bold' }}>{targetScore}</span> points
        </p>
      </div>
      
      {/* Combo indicator */}
      {combo > 1 && (
        <div 
          style={{
            textAlign: 'center',
            padding: '8px 16px',
            margin: '0 16px 12px 16px',
            borderRadius: '9999px',
            background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.25) 0%, rgba(255, 165, 0, 0.25) 100%)',
            border: '1px solid rgba(255, 215, 0, 0.4)',
          }}
        >
          <span style={{ color: '#FACC15', fontWeight: 'bold' }}>🔥 x{combo} Combo!</span>
        </div>
      )}
    </div>
  );
});

GameHeader.displayName = 'GameHeader';