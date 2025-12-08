import { memo } from 'react';
import { Gem } from '@/types/game';
import { GEM_EMOJIS, SPECIAL_EMOJIS } from '@/config/levels';
import { cn } from '@/lib/utils';

interface GemComponentProps {
  gem: Gem;
  isSelected: boolean;
  onClick: () => void;
  cellSize: number;
}

export const GemComponent = memo(({ gem, isSelected, onClick, cellSize }: GemComponentProps) => {
  const emoji = gem.special ? SPECIAL_EMOJIS[gem.special] : GEM_EMOJIS[gem.type];
  
  return (
    <div
      onClick={onClick}
      className={cn(
        'w-full h-full flex items-center justify-center cursor-pointer transition-transform duration-200',
        gem.isNew && 'animate-gem-fall',
        gem.isMatched && 'animate-gem-match',
        isSelected && 'scale-110',
      )}
      style={{
        fontSize: cellSize * 0.78,
      }}
    >
      <span 
        className={cn(
          'transition-all duration-200',
          isSelected && 'drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]'
        )}
      >
        {emoji}
      </span>
      
      {/* Sparkle effect for special gems */}
      {gem.special && (
        <div className="absolute inset-0 pointer-events-none">
          <span 
            className="absolute text-xs"
            style={{ 
              top: '5%', 
              left: '15%', 
              animation: 'sparkle 2s ease-in-out infinite',
            }}
          >
            ✨
          </span>
          <span 
            className="absolute text-xs"
            style={{ 
              bottom: '10%', 
              right: '10%', 
              animation: 'sparkle 2s ease-in-out infinite 0.5s',
            }}
          >
            ✨
          </span>
        </div>
      )}
    </div>
  );
});

GemComponent.displayName = 'GemComponent';
