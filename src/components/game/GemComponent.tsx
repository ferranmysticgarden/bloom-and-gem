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
        'gem-cell',
        gem.isNew && 'animate-gem-fall',
        gem.isMatched && 'animate-gem-match',
      )}
      style={{ 
        width: cellSize, 
        height: cellSize,
        padding: 4,
      }}
    >
      <div
        className={cn(
          'gem',
          `gem-${gem.type}`,
          isSelected && 'selected',
          gem.special && 'ring-2 ring-white/50'
        )}
        style={{
          fontSize: cellSize * 0.5,
        }}
      >
        {emoji}
        
        {/* Sparkle effect for special gems */}
        {gem.special && (
          <>
            <div className="sparkle" style={{ top: '10%', left: '20%', animationDelay: '0s' }}>✨</div>
            <div className="sparkle" style={{ top: '70%', right: '15%', animationDelay: '0.5s' }}>✨</div>
          </>
        )}
      </div>
    </div>
  );
});

GemComponent.displayName = 'GemComponent';
