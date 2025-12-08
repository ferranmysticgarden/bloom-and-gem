import { memo } from 'react';
import { Bomb, Hammer, Shuffle, Rainbow } from 'lucide-react';

interface BoosterBarProps {
  boosters: {
    bomb: number;
    hammer: number;
    shuffle: number;
    rainbow: number;
  };
  activeBooster: string | null;
  onBoosterSelect: (booster: string) => void;
}

const BOOSTER_CONFIG = [
  { id: 'bomb', icon: Bomb, label: 'Bomba', color: '#F97316' },
  { id: 'hammer', icon: Hammer, label: 'Martillo', color: '#6B7280' },
  { id: 'shuffle', icon: Shuffle, label: 'Mezclar', color: '#3B82F6' },
  { id: 'rainbow', icon: Rainbow, label: 'Arcoíris', color: '#A855F7' },
];

export const BoosterBar = memo(({ boosters, activeBooster, onBoosterSelect }: BoosterBarProps) => {
  return (
    <div 
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
        padding: '12px 8px',
      }}
    >
      {BOOSTER_CONFIG.map(({ id, icon: Icon, label, color }) => {
        const count = boosters[id as keyof typeof boosters];
        const isActive = activeBooster === id;
        const isDisabled = count <= 0;
        
        return (
          <button
            key={id}
            onClick={() => !isDisabled && onBoosterSelect(id)}
            disabled={isDisabled}
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
              padding: '8px 12px',
              borderRadius: '12px',
              border: isActive ? '2px solid #FACC15' : '2px solid transparent',
              background: `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)`,
              opacity: isDisabled ? 0.4 : 1,
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              transform: isActive ? 'scale(1.1)' : 'scale(1)',
              transition: 'all 0.2s ease',
              minWidth: '56px',
            }}
          >
            <Icon style={{ width: '20px', height: '20px', color: 'white' }} />
            <span style={{ fontSize: '10px', fontWeight: '600', color: 'white' }}>{label}</span>
            
            {/* Count badge */}
            <div 
              style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 'bold',
                background: 'hsl(280, 30%, 20%)',
                color: 'white',
                border: '2px solid hsl(280, 25%, 35%)',
              }}
            >
              {count}
            </div>
          </button>
        );
      })}
    </div>
  );
});

BoosterBar.displayName = 'BoosterBar';