import { memo } from 'react';
import { Heart, RotateCcw, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GameOverProps {
  level: number;
  score: number;
  targetScore: number;
  lives: number;
  onRetry: () => void;
  onMainMenu: () => void;
}

export const GameOver = memo(({
  level,
  score,
  targetScore,
  lives,
  onRetry,
  onMainMenu,
}: GameOverProps) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="fairy-card p-8 max-w-sm w-full text-center animate-scale-in">
        <div className="relative mb-4">
          <Heart className="w-16 h-16 text-muted-foreground mx-auto" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl">💔</span>
          </div>
        </div>
        
        <h2 className="font-cinzel text-2xl text-foreground mb-2">
          Sin Movimientos
        </h2>
        
        <p className="text-muted-foreground mb-4">
          Nivel {level} - {score.toLocaleString()} / {targetScore.toLocaleString()}
        </p>
        
        <div className="flex items-center justify-center gap-1 mb-6">
          <span className="text-sm text-muted-foreground">Vidas restantes:</span>
          {Array.from({ length: 5 }).map((_, i) => (
            <Heart
              key={i}
              className={cn(
                'w-4 h-4',
                i < lives ? 'text-red-500 fill-red-500' : 'text-muted-foreground'
              )}
            />
          ))}
        </div>
        
        <div className="flex flex-col gap-3">
          {lives > 0 ? (
            <button
              onClick={onRetry}
              className="magic-button w-full flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Reintentar
            </button>
          ) : (
            <div className="text-red-400 py-3">
              <p className="font-semibold">Sin vidas</p>
              <p className="text-sm">Las vidas se regeneran con el tiempo</p>
            </div>
          )}
          
          <button
            onClick={onMainMenu}
            className="px-6 py-3 rounded-full border border-border/50 hover:bg-muted/50 transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Menú Principal
          </button>
        </div>
      </div>
    </div>
  );
});

GameOver.displayName = 'GameOver';
