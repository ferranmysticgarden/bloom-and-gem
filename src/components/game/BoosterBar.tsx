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
    <div className="flex justify-center gap-2 sm:gap-3 mt-2 sm:mt-4 px-2">
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
              'relative flex flex-col items-center gap-0.5 p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-300',
              'border border-border/50',
              isActive && 'ring-2 ring-primary scale-110',
              isDisabled ? 'opacity-40 cursor-not-allowed' : 'hover:scale-105 cursor-pointer',
              `bg-gradient-to-br ${color}`
            )}
          >
            <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow-lg" />
            <span className="text-[10px] sm:text-xs font-semibold text-white/90">{label}</span>
            
            {/* Count badge */}
            <div className="absolute -top-1 -right-1 bg-background text-foreground text-[10px] sm:text-xs font-bold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center border border-border">
              {count}
            </div>
            
            {/* Active glow */}
            {isActive && (
              <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-white/20 animate-pulse" />
            )}
          </button>
        );
      })}
    </div>
  );
});

BoosterBar.displayName = 'BoosterBar';
