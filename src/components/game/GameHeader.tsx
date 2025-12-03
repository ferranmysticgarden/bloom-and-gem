import { memo } from 'react';
import { Heart, Star, Target, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GameHeaderProps {
  level: number;
  score: number;
  targetScore: number;
  moves: number;
  combo: number;
  lives: number;
  maxLives: number;
  gems: number;
}

export const GameHeader = memo(({
  level,
  score,
  targetScore,
  moves,
  combo,
  lives,
  maxLives,
  gems,
}: GameHeaderProps) => {
  const progress = Math.min((score / targetScore) * 100, 100);
  
  return (
    <div className="fairy-card p-4 mb-4">
      {/* Level and Lives */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <span className="font-cinzel text-lg text-primary">Nivel {level}</span>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: maxLives }).map((_, i) => (
            <Heart
              key={i}
              className={cn(
                'w-5 h-5 transition-all duration-300',
                i < lives ? 'text-red-500 fill-red-500' : 'text-muted-foreground'
              )}
            />
          ))}
        </div>
        <div className="flex items-center gap-1 text-yellow-400">
          <span className="text-lg">💎</span>
          <span className="font-semibold">{gems}</span>
        </div>
      </div>
      
      {/* Score Progress */}
      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400" />
            {score.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <Target className="w-4 h-4 text-green-400" />
            {targetScore.toLocaleString()}
          </span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary via-accent to-secondary transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      {/* Moves and Combo */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full">
          <span className="text-sm text-muted-foreground">Movimientos</span>
          <span className={cn(
            'font-bold text-lg',
            moves <= 5 ? 'text-red-400' : 'text-foreground'
          )}>
            {moves}
          </span>
        </div>
        
        {combo > 1 && (
          <div className="flex items-center gap-1 bg-accent/20 px-3 py-1.5 rounded-full animate-pulse">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="font-bold text-yellow-400">x{combo} Combo!</span>
          </div>
        )}
      </div>
    </div>
  );
});

GameHeader.displayName = 'GameHeader';
