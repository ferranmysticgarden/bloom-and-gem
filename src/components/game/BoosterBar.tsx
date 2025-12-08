import { memo } from 'react';
import { Bomb, Hammer, Shuffle, Rainbow } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  { id: 'bomb', icon: Bomb, label: 'Bomba', color: 'from-orange-500 to-red-600' },
  { id: 'hammer', icon: Hammer, label: 'Martillo', color: 'from-gray-400 to-gray-600' },
  { id: 'shuffle', icon: Shuffle, label: 'Mezclar', color: 'from-blue-400 to-blue-600' },
  { id: 'rainbow', icon: Rainbow, label: 'Arcoíris', color: 'from-pink-400 via-purple-400 to-blue-400' },
];

export const BoosterBar = memo(({ boosters, activeBooster, onBoosterSelect }: BoosterBarProps) => {
  return (
    <div 
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
        marginTop: '12px',
        padding: '0 8px',
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
            className={cn(
              'relative flex flex-col items-center gap-0.5 p-2 rounded-xl transition-all duration-300',
              isActive && 'ring-2 ring-yellow-400 scale-110',
              isDisabled ? 'opacity-40 cursor-not-allowed' : 'hover:scale-105 cursor-pointer',
              `bg-gradient-to-br ${color}`
            )}
            style={{
              border: 'none',
              minWidth: '52px',
            }}
          >
            <Icon className="w-5 h-5 text-white drop-shadow-md" />
            <span className="text-[10px] font-semibold text-white">{label}</span>
            
            {/* Count badge - DARK background, not white */}
            <div 
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: 'bold',
                background: 'hsl(280, 30%, 20%)',
                color: 'white',
                border: '1px solid hsla(280, 30%, 35%, 0.5)',
              }}
            >
              {count}
            </div>
            
            {/* Active glow */}
            {isActive && (
              <div className="absolute inset-0 rounded-xl bg-white/20 animate-pulse" />
            )}
          </button>
        );
      })}
    </div>
  );
});

BoosterBar.displayName = 'BoosterBar';