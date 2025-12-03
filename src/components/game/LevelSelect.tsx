import { memo } from 'react';
import { Lock, Star, Play } from 'lucide-react';
import { LEVELS } from '@/config/levels';
import { cn } from '@/lib/utils';

interface LevelSelectProps {
  unlockedLevels: number;
  onSelectLevel: (level: number) => void;
  onBack: () => void;
}

export const LevelSelect = memo(({ unlockedLevels, onSelectLevel, onBack }: LevelSelectProps) => {
  const displayLevels = LEVELS.slice(0, Math.min(50, unlockedLevels + 10));
  
  return (
    <div className="min-h-screen p-4 pb-20">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="font-cinzel text-3xl text-foreground mb-2">
          🗺️ Mapa del Reino
        </h1>
        <p className="text-muted-foreground">
          {unlockedLevels} niveles desbloqueados
        </p>
      </div>
      
      {/* Level Grid */}
      <div className="grid grid-cols-5 gap-3 max-w-md mx-auto">
        {displayLevels.map((config) => {
          const isUnlocked = config.level <= unlockedLevels;
          const isNext = config.level === unlockedLevels + 1;
          
          return (
            <button
              key={config.level}
              onClick={() => isUnlocked && onSelectLevel(config.level)}
              disabled={!isUnlocked}
              className={cn(
                'aspect-square rounded-xl flex flex-col items-center justify-center relative',
                'transition-all duration-300 border',
                isUnlocked 
                  ? 'bg-gradient-to-br from-primary/20 to-accent/20 border-primary/50 hover:scale-110 cursor-pointer' 
                  : 'bg-muted/30 border-border/30 cursor-not-allowed',
                isNext && 'ring-2 ring-yellow-400 animate-pulse'
              )}
            >
              {isUnlocked ? (
                <>
                  <span className="font-cinzel font-bold text-lg">{config.level}</span>
                  <div className="flex gap-0.5 mt-1">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Star key={i} className="w-2 h-2 text-yellow-400/50" />
                    ))}
                  </div>
                </>
              ) : (
                <Lock className="w-5 h-5 text-muted-foreground" />
              )}
              
              {isNext && (
                <div className="absolute -top-1 -right-1">
                  <Play className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      {/* Back Button */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2">
        <button
          onClick={onBack}
          className="px-8 py-3 rounded-full bg-muted/50 border border-border/50 hover:bg-muted transition-colors"
        >
          ← Volver
        </button>
      </div>
    </div>
  );
});

LevelSelect.displayName = 'LevelSelect';
