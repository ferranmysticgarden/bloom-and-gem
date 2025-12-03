import { memo } from 'react';
import { Play, Map, Gift, Settings, Heart, Gem, Trophy, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MainMenuProps {
  lives: number;
  maxLives: number;
  gems: number;
  unlockedLevels: number;
  totalScore: number;
  streak: number;
  onPlay: () => void;
  onLevelSelect: () => void;
  onDailyReward: () => void;
  onSettings: () => void;
  onLogout: () => void;
}

export const MainMenu = memo(({
  lives,
  maxLives,
  gems,
  unlockedLevels,
  totalScore,
  streak,
  onPlay,
  onLevelSelect,
  onDailyReward,
  onSettings,
  onLogout,
}: MainMenuProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="floating-particle bg-primary/20"
          style={{
            width: 4 + Math.random() * 8,
            height: 4 + Math.random() * 8,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${6 + Math.random() * 6}s`,
          }}
        />
      ))}
      
      {/* Logo */}
      <div className="text-center mb-8 relative">
        <h1 className="font-cinzel text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg">
          Bloom
        </h1>
        <h1 className="font-cinzel text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg -mt-2">
          & Gem
        </h1>
        <p className="text-muted-foreground mt-2 font-quicksand">
          ✨ Aventura Mística ✨
        </p>
        
        {/* Decorative gems */}
        <div className="absolute -top-4 -left-4 text-4xl animate-bounce" style={{ animationDelay: '0s' }}>🌸</div>
        <div className="absolute -top-4 -right-4 text-4xl animate-bounce" style={{ animationDelay: '0.5s' }}>💎</div>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-3xl animate-bounce" style={{ animationDelay: '1s' }}>🦋</div>
      </div>
      
      {/* Stats bar */}
      <div className="fairy-card p-3 mb-6 flex gap-6">
        <div className="flex items-center gap-2">
          {Array.from({ length: maxLives }).map((_, i) => (
            <Heart
              key={i}
              className={cn(
                'w-5 h-5',
                i < lives ? 'text-red-500 fill-red-500' : 'text-muted-foreground'
              )}
            />
          ))}
        </div>
        <div className="flex items-center gap-1 text-yellow-400">
          <Gem className="w-5 h-5" />
          <span className="font-bold">{gems}</span>
        </div>
        <div className="flex items-center gap-1 text-purple-400">
          <Trophy className="w-5 h-5" />
          <span className="font-bold">{totalScore.toLocaleString()}</span>
        </div>
      </div>
      
      {/* Menu buttons */}
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button
          onClick={onPlay}
          className="magic-button text-xl py-4 flex items-center justify-center gap-3"
        >
          <Play className="w-6 h-6" />
          Jugar Nivel {unlockedLevels}
        </button>
        
        <button
          onClick={onLevelSelect}
          className="px-6 py-3 rounded-full border-2 border-primary/50 hover:bg-primary/10 transition-all flex items-center justify-center gap-2"
        >
          <Map className="w-5 h-5" />
          Seleccionar Nivel
        </button>
        
        <button
          onClick={onDailyReward}
          className="px-6 py-3 rounded-full border-2 border-yellow-500/50 hover:bg-yellow-500/10 transition-all flex items-center justify-center gap-2 text-yellow-400"
        >
          <Gift className="w-5 h-5" />
          Recompensa Diaria
          {streak > 0 && (
            <span className="bg-yellow-500 text-black text-xs px-2 py-0.5 rounded-full font-bold">
              🔥 {streak}
            </span>
          )}
        </button>
        
        <div className="flex gap-3 mt-2">
          <button
            onClick={onSettings}
            className="flex-1 px-4 py-2 rounded-full border border-border/50 hover:bg-muted/50 transition-all flex items-center justify-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Ajustes
          </button>
          <button
            onClick={onLogout}
            className="flex-1 px-4 py-2 rounded-full border border-red-500/30 hover:bg-red-500/10 transition-all flex items-center justify-center gap-2 text-red-400"
          >
            <LogOut className="w-4 h-4" />
            Salir
          </button>
        </div>
      </div>
      
      {/* Version */}
      <p className="absolute bottom-4 text-xs text-muted-foreground/50">
        v1.0.0 • Hecho con 💜
      </p>
    </div>
  );
});

MainMenu.displayName = 'MainMenu';
