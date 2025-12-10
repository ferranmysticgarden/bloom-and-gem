import { memo } from 'react';
import { Gift, Calendar, Gem } from 'lucide-react';
import { DAILY_REWARDS } from '@/config/levels';

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
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: '16px',
      }}
    >
      <div 
        style={{
          position: 'relative',
          maxWidth: '380px',
          width: '100%',
          textAlign: 'center',
          padding: '24px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, rgba(60, 20, 80, 0.98) 0%, rgba(40, 15, 60, 0.98) 100%)',
          border: '2px solid rgba(255, 215, 0, 0.4)',
          boxShadow: '0 0 40px rgba(150, 50, 200, 0.3)',
        }}
      >
        {/* Sparkles */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="sparkle text-yellow-400"
            style={{
              position: 'absolute',
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          >
            ✨
          </div>
        ))}
        
        <Gift className="w-16 h-16 text-primary mx-auto mb-4 animate-bounce" />
        
        <h2 className="font-cinzel text-2xl mb-2" style={{ color: 'white' }}>¡Recompensa Diaria!</h2>
        
        <div className="flex items-center justify-center gap-2 mb-4">
          <Calendar className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.6)' }} />
          <span style={{ color: 'rgba(255,255,255,0.6)' }}>Día {((streak - 1) % 7) + 1} de 7</span>
        </div>
        
        {/* Week progress - HORIZONTAL */}
        <div 
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '24px',
            flexWrap: 'nowrap',
          }}
        >
          {DAILY_REWARDS.map((reward, i) => (
            <div
              key={i}
              style={{
                width: '36px',
                height: '36px',
                minWidth: '36px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 'bold',
                background: i < (streak % 7) || (streak % 7 === 0 && streak > 0)
                  ? 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)'
                  : i === (streak - 1) % 7
                  ? 'linear-gradient(135deg, #FFA500 0%, #FF8C00 100%)'
                  : 'rgba(100, 100, 120, 0.3)',
                color: 'white',
                border: i === (streak - 1) % 7 ? '2px solid #FFD700' : 'none',
                boxShadow: i === (streak - 1) % 7 ? '0 0 10px rgba(255,215,0,0.5)' : 'none',
              }}
            >
              {i + 1}
            </div>
          ))}
        </div>
        
        {/* Today's reward */}
        <div 
          style={{
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '20px',
          }}
        >
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>Recompensa de hoy:</p>
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-1" style={{ color: '#FFD700' }}>
              <Gem className="w-5 h-5" />
              <span className="font-bold">{todayReward.gems}</span>
            </div>
            {Object.entries(todayReward.boosters || {}).map(([booster, count]) => (
              <div key={booster} className="flex items-center gap-1" style={{ color: 'white' }}>
                <span>{booster === 'bomb' ? '💣' : booster === 'hammer' ? '🔨' : booster === 'shuffle' ? '🔀' : '🌈'}</span>
                <span className="font-bold">x{count}</span>
              </div>
            ))}
          </div>
        </div>
        
        <button 
          onClick={onClaim} 
          style={{
            width: '100%',
            padding: '14px',
            marginBottom: '12px',
            borderRadius: '50px',
            border: 'none',
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            color: '#1a1a2e',
            fontWeight: '700',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          ¡Reclamar!
        </button>
        
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'rgba(255,255,255,0.6)',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          Más tarde
        </button>
      </div>
    </div>
  );
});

DailyReward.displayName = 'DailyReward';
