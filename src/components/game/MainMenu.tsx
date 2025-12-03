import { memo } from 'react';
import { Play, Grid3X3, ShoppingBag, LogOut, Power, Heart } from 'lucide-react';
import mysticForestBg from '@/assets/mystic-forest-bg.jpg';

interface MainMenuProps {
  lives: number;
  maxLives: number;
  gems: number;
  unlockedLevels: number;
  totalScore: number;
  streak: number;
  userEmail?: string;
  onPlay: () => void;
  onLevelSelect: () => void;
  onShop: () => void;
  onLogout: () => void;
  onExit: () => void;
}

export const MainMenu = memo(({
  lives,
  maxLives,
  gems,
  unlockedLevels,
  totalScore,
  userEmail,
  onPlay,
  onLevelSelect,
  onShop,
  onLogout,
  onExit,
}: MainMenuProps) => {
  return (
    <div 
      className="min-h-screen flex flex-col items-center p-4 relative overflow-hidden"
      style={{
        backgroundImage: `url(${mysticForestBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Floating particles */}
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none animate-float-particle"
          style={{
            width: 3 + Math.random() * 5,
            height: 3 + Math.random() * 5,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: `radial-gradient(circle, rgba(255,255,255,0.9), rgba(255,215,0,0.6))`,
            boxShadow: '0 0 10px rgba(255,215,0,0.5)',
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${6 + Math.random() * 6}s`,
          }}
        />
      ))}
      
      {/* Stats Bar - Top - SIEMPRE VISIBLE */}
      <div className="relative z-50 flex gap-3 mt-6 mb-6">
        {/* Vidas */}
        <div 
          className="flex items-center gap-2 px-5 py-2.5 rounded-full shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)',
            border: '2px solid #ef4444',
            boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)',
          }}
        >
          <Heart className="w-5 h-5 text-red-400 fill-red-400" />
          <span className="font-bold text-white text-lg">{lives}</span>
        </div>
        
        {/* Gemas */}
        <div 
          className="flex items-center gap-2 px-5 py-2.5 rounded-full shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #581c87 0%, #7c3aed 100%)',
            border: '2px solid #a855f7',
            boxShadow: '0 4px 15px rgba(168, 85, 247, 0.4)',
          }}
        >
          <span className="text-xl">💎</span>
          <span className="font-bold text-white text-lg">{gems}</span>
        </div>
        
        {/* Puntos/Links */}
        <div 
          className="flex items-center gap-2 px-5 py-2.5 rounded-full shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #1e3a5f 0%, #1e40af 100%)',
            border: '2px solid #3b82f6',
            boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
          }}
        >
          <span className="text-xl">🔗</span>
          <span className="font-bold text-white text-lg">{totalScore}</span>
        </div>
      </div>
      
      {/* Logo */}
      <div className="relative z-10 text-center mb-6">
        <h1 
          className="font-cinzel text-5xl md:text-6xl font-bold"
          style={{
            background: 'linear-gradient(180deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 30px rgba(255, 215, 0, 0.5)',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
          }}
        >
          Mystic Garden Pro
        </h1>
        
        {/* Decorative icons */}
        <div className="flex justify-center gap-4 mt-3 text-4xl">
          <span className="animate-bounce" style={{ animationDelay: '0s' }}>🍄</span>
          <span className="animate-bounce" style={{ animationDelay: '0.3s' }}>💎</span>
          <span className="animate-bounce" style={{ animationDelay: '0.6s' }}>🧚</span>
        </div>
        
        <p className="text-white/80 mt-2 text-sm tracking-widest">
          Match • Collect • Win
        </p>
        {userEmail && (
          <p className="text-white/60 text-xs mt-1">{userEmail}</p>
        )}
      </div>
      
      {/* Main Card */}
      <div 
        className="relative z-10 w-full max-w-md p-6 rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(20, 20, 40, 0.95) 0%, rgba(30, 20, 50, 0.95) 100%)',
          border: '2px solid rgba(255, 215, 0, 0.3)',
          boxShadow: '0 0 40px rgba(255, 215, 0, 0.15), inset 0 0 30px rgba(0,0,0,0.3)',
        }}
      >
        {/* Level indicator */}
        <div className="text-center mb-4">
          <span 
            className="inline-block px-4 py-1 rounded-full text-sm font-semibold"
            style={{
              background: 'linear-gradient(135deg, #FFA500 0%, #FF8C00 100%)',
              color: '#1a1a2e',
            }}
          >
            Nivel {unlockedLevels}
          </span>
          <p className="text-white/70 mt-2 text-sm">Recolectar 1000 puntos</p>
        </div>
        
        {/* Play Button */}
        <button
          onClick={onPlay}
          className="w-full py-4 rounded-full font-bold text-xl flex items-center justify-center gap-3 mb-4 transition-transform hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            color: '#1a1a2e',
            boxShadow: '0 4px 20px rgba(255, 215, 0, 0.4)',
          }}
        >
          <Play className="w-6 h-6" fill="#1a1a2e" />
          Jugar
        </button>
        
        {/* Secondary Buttons */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={onLevelSelect}
            className="flex-1 py-3 rounded-full font-semibold flex items-center justify-center gap-2 transition-all hover:bg-white/10"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
            }}
          >
            <Grid3X3 className="w-5 h-5" />
            Niveles
          </button>
          <button
            onClick={onShop}
            className="flex-1 py-3 rounded-full font-semibold flex items-center justify-center gap-2 transition-all hover:bg-white/10"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
            }}
          >
            <ShoppingBag className="w-5 h-5" />
            Tienda
          </button>
        </div>
        
        {/* Bottom Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onLogout}
            className="flex-1 py-2 rounded-full text-sm flex items-center justify-center gap-2 transition-all hover:bg-white/5 text-white/70"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
          <button
            onClick={onExit}
            className="flex-1 py-2 rounded-full text-sm flex items-center justify-center gap-2 transition-all hover:bg-white/5 text-white/70"
          >
            <Power className="w-4 h-4" />
            Salir
          </button>
        </div>
      </div>
      
      {/* Levels Preview */}
      <div 
        className="relative z-10 w-full max-w-md mt-6 p-4 rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(20, 20, 40, 0.9) 0%, rgba(30, 20, 50, 0.9) 100%)',
          border: '2px solid rgba(255, 215, 0, 0.2)',
        }}
      >
        <p className="text-center text-white/50 text-xs uppercase tracking-widest mb-3">
          Niveles Objetivo
        </p>
        <div className="flex justify-center gap-2">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-white"
            style={{
              background: 'linear-gradient(135deg, #FFA500 0%, #FF8C00 100%)',
            }}
          >
            {unlockedLevels}
          </div>
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center text-white/40"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            🔒
          </div>
        </div>
      </div>

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
        .animate-float-particle {
          animation: float-particle 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
});

MainMenu.displayName = 'MainMenu';
