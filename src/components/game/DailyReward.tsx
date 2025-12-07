import { memo } from 'react';
import { Gift, Calendar, Gem } from 'lucide-react';
import { DAILY_REWARDS } from '@/config/levels';
import { cn } from '@/lib/utils';

interface DailyRewardProps {
  streak: number;
  onClaim: () => void;
  onClose: () => void;
}

export const DailyReward = memo(({ streak, onClaim, onClose }: DailyRewardProps) => {
  // Ensure streak is at least 1 and get safe index
  const safeStreak = Math.max(1, streak || 1);
  const rewardIndex = Math.max(0, Math.min((safeStreak - 1) % 7, DAILY_REWARDS.length - 1));
  const todayReward = DAILY_REWARDS[rewardIndex] || DAILY_REWARDS[0];
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="fairy-card p-6 max-w-sm w-full text-center animate-scale-in">
        {/* Sparkles */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="sparkle text-yellow-400"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          >
            ✨
          </div>
        ))}
        
        <Gift className="w-16 h-16 text-primary mx-auto mb-4 animate-bounce" />
        
        <h2 className="font-cinzel text-2xl mb-2">¡Recompensa Diaria!</h2>
        
        <div className="flex items-center justify-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-muted-foreground" />
          <span className="text-muted-foreground">Día {((streak - 1) % 7) + 1} de 7</span>
        </div>
        
        {/* Week progress */}
        <div className="flex justify-center gap-2 mb-6">
          {DAILY_REWARDS.map((reward, i) => (
            <div
              key={i}
              className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold',
                i < (streak % 7) || (streak % 7 === 0 && streak > 0)
                  ? 'bg-primary text-primary-foreground'
                  : i === (streak - 1) % 7
                  ? 'bg-accent text-accent-foreground ring-2 ring-yellow-400'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {i + 1}
            </div>
          ))}
        </div>
        
        {/* Today's reward */}
        <div className="bg-muted/50 rounded-xl p-4 mb-6">
          <p className="text-sm text-muted-foreground mb-2">Recompensa de hoy:</p>
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-1 text-yellow-400">
              <Gem className="w-5 h-5" />
              <span className="font-bold">{todayReward.gems}</span>
            </div>
            {Object.entries(todayReward.boosters || {}).map(([booster, count]) => (
              <div key={booster} className="flex items-center gap-1">
                <span>{booster === 'bomb' ? '💣' : booster === 'hammer' ? '🔨' : booster === 'shuffle' ? '🔀' : '🌈'}</span>
                <span className="font-bold">x{count}</span>
              </div>
            ))}
          </div>
        </div>
        
        <button onClick={onClaim} className="magic-button w-full mb-3">
          ¡Reclamar!
        </button>
        
        <button
          onClick={onClose}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Más tarde
        </button>
      </div>
    </div>
  );
});

DailyReward.displayName = 'DailyReward';
