import { memo } from 'react';
import { Lock, Star, ArrowLeft, X } from 'lucide-react';
import { LEVELS } from '@/config/levels';
import mysticForestBg from '@/assets/mystic-forest-bg.jpg';

interface LevelSelectProps {
  unlockedLevels: number;
  onSelectLevel: (level: number) => void;
  onBack: () => void;
  onExit: () => void;
}

export const LevelSelect = memo(({ unlockedLevels, onSelectLevel, onBack, onExit }: LevelSelectProps) => {
  const displayLevels = LEVELS.slice(0, 50);
  
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
        padding: '16px',
        paddingBottom: '80px',
        overflow: 'auto',
        backgroundImage: `url(${mysticForestBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />
      
      {/* Header buttons */}
      <div className="relative z-10 flex justify-between items-center mb-6">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-full font-semibold flex items-center gap-2 transition-all hover:scale-105"
          style={{
            background: 'rgba(50, 50, 70, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white',
          }}
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>
        
        <button
          onClick={onExit}
          className="px-4 py-2 rounded-full font-semibold flex items-center gap-2 transition-all hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: 'white',
          }}
        >
          <X className="w-4 h-4" />
          Salir
        </button>
      </div>
      
      {/* Title */}
      <div className="relative z-10 text-center mb-6">
        <h1 
          className="font-cinzel text-4xl font-bold italic"
          style={{
            background: 'linear-gradient(180deg, #FFD700 0%, #FFA500 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 20px rgba(255, 215, 0, 0.3)',
          }}
        >
          Niveles
        </h1>
        <p className="text-white/70 mt-1">Selecciona un nivel para jugar</p>
      </div>
      
      {/* Level Grid */}
      <div 
        className="relative z-10 max-w-2xl mx-auto p-4 rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(20, 20, 40, 0.95) 0%, rgba(30, 20, 50, 0.95) 100%)',
          border: '2px solid rgba(255, 215, 0, 0.2)',
          boxShadow: '0 0 30px rgba(0, 0, 0, 0.5)',
        }}
      >
        <div className="grid grid-cols-5 gap-3">
          {displayLevels.map((config) => {
            const isUnlocked = config.level <= unlockedLevels;
            
            return (
              <button
                key={config.level}
                onClick={() => isUnlocked && onSelectLevel(config.level)}
                disabled={!isUnlocked}
                className="aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all duration-300"
                style={{
                  background: isUnlocked 
                    ? 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)'
                    : 'rgba(50, 50, 70, 0.5)',
                  border: isUnlocked 
                    ? '2px solid rgba(168, 85, 247, 0.5)'
                    : '1px solid rgba(100, 100, 120, 0.3)',
                  cursor: isUnlocked ? 'pointer' : 'not-allowed',
                  boxShadow: isUnlocked ? '0 4px 15px rgba(168, 85, 247, 0.3)' : 'none',
                }}
              >
                {isUnlocked ? (
                  <>
                    <span className="font-bold text-white text-xl">{config.level}</span>
                    <div className="flex gap-0.5 mt-1">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className="w-3 h-3" 
                          style={{ 
                            color: '#FFD700',
                            fill: '#FFD700',
                          }} 
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <Lock className="w-5 h-5 text-white/30" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none z-0"
          style={{
            width: 3 + Math.random() * 5,
            height: 3 + Math.random() * 5,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: `radial-gradient(circle, rgba(255,255,255,0.9), rgba(255,215,0,0.6))`,
            boxShadow: '0 0 10px rgba(255,215,0,0.5)',
            animation: `float-particle ${6 + Math.random() * 6}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 8}s`,
          }}
        />
      ))}

      <style>{`
        @keyframes float-particle {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-30px) translateX(10px);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
});

LevelSelect.displayName = 'LevelSelect';
