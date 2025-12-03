import { memo } from 'react';
import { Star, Trophy, Gem } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LevelCompleteProps {
  level: number;
  score: number;
  targetScore: number;
  gemsEarned: number;
  onNextLevel: () => void;
  onMainMenu: () => void;
}

export const LevelComplete = memo(({
  level,
  score,
  targetScore,
  gemsEarned,
  onNextLevel,
  onMainMenu,
}: LevelCompleteProps) => {
  const stars = score >= targetScore * 2 ? 3 : score >= targetScore * 1.5 ? 2 : 1;
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="fairy-card p-8 max-w-sm w-full text-center animate-scale-in">
        {/* Floating sparkles */}
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="sparkle text-yellow-400"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              animationDelay: `${Math.random() * 2}s`,
              fontSize: 12 + Math.random() * 12,
            }}
          >
            ✨
          </div>
        ))}
        
        <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4 drop-shadow-lg" />
        
        <h2 className="font-cinzel text-3xl text-foreground mb-2">
          ¡Nivel {level} Completado!
        </h2>
        
        {/* Stars */}
        <div className="flex justify-center gap-2 my-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                'w-10 h-10 transition-all duration-500',
                i < stars 
                  ? 'text-yellow-400 fill-yellow-400 drop-shadow-lg' 
                  : 'text-muted-foreground/30'
              )}
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
        
        <div className="space-y-2 mb-6">
          <p className="text-lg">
            Puntuación: <span className="font-bold text-primary">{score.toLocaleString()}</span>
          </p>
          <p className="flex items-center justify-center gap-2 text-yellow-400">
            <Gem className="w-5 h-5" />
            <span className="font-bold">+{gemsEarned} Gemas</span>
          </p>
        </div>
        
        <div className="flex flex-col gap-3">
          <button
            onClick={onNextLevel}
            className="magic-button w-full"
          >
            Siguiente Nivel →
          </button>
          <button
            onClick={onMainMenu}
            className="px-6 py-3 rounded-full border border-border/50 hover:bg-muted/50 transition-colors"
          >
            Menú Principal
          </button>
        </div>
      </div>
    </div>
  );
});

LevelComplete.displayName = 'LevelComplete';
