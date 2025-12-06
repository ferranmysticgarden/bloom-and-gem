import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameEngine } from '@/hooks/useGameEngine';
import { GameBoard } from '@/components/game/GameBoard';
import { GameHeader } from '@/components/game/GameHeader';
import { BoosterBar } from '@/components/game/BoosterBar';
import { LevelComplete } from '@/components/game/LevelComplete';
import { GameOver } from '@/components/game/GameOver';
import { MainMenu } from '@/components/game/MainMenu';
import { LevelSelect } from '@/components/game/LevelSelect';
import { Shop } from '@/components/game/Shop';
import { DailyReward } from '@/components/game/DailyReward';
import { DAILY_REWARDS } from '@/config/levels';
import { supabase } from '@/integrations/supabase/client';
import mysticForestBg from '@/assets/mystic-forest-bg.jpg';

type GameScreen = 'menu' | 'level-select' | 'playing' | 'paused' | 'shop';

const Game = () => {
  const navigate = useNavigate();
  const { gameState, setGameState, startLevel, selectGem, swapGems, useBomb, useHammer, shuffleBoard, loading } = useGameEngine();
  const [screen, setScreen] = useState<GameScreen>('menu');
  const [activeBooster, setActiveBooster] = useState<string | null>(null);
  const [showDailyReward, setShowDailyReward] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');

  // Check auth and show daily reward
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }
      setUserEmail(session.user.email || '');
      
      // Check daily reward
      const lastReward = localStorage.getItem('lastDailyReward');
      const today = new Date().toDateString();
      if (lastReward !== today) {
        setShowDailyReward(true);
      }
    };
    checkAuth();
  }, [navigate]);

  const handlePlay = useCallback(() => {
    startLevel(gameState.unlockedLevels);
    setScreen('playing');
  }, [gameState.unlockedLevels, startLevel]);

  const handleSelectLevel = useCallback((level: number) => {
    startLevel(level);
    setScreen('playing');
  }, [startLevel]);

  const handleMainMenu = useCallback(() => {
    setScreen('menu');
    setActiveBooster(null);
  }, []);

  const handleBoosterSelect = useCallback((booster: string) => {
    if (booster === 'shuffle') {
      shuffleBoard();
    } else {
      setActiveBooster(prev => prev === booster ? null : booster);
    }
  }, [shuffleBoard]);

  const handleBoardClick = useCallback((pos: { row: number; col: number }) => {
    if (activeBooster === 'bomb') {
      useBomb(pos);
      setActiveBooster(null);
    } else if (activeBooster === 'hammer') {
      useHammer(pos);
      setActiveBooster(null);
    } else {
      selectGem(pos);
    }
  }, [activeBooster, useBomb, useHammer, selectGem]);

  const handleClaimDailyReward = useCallback(() => {
    const streak = (gameState.streak % 7) + 1;
    const reward = DAILY_REWARDS[streak - 1];
    
    setGameState(prev => ({
      ...prev,
      gems: prev.gems + reward.gems,
      boosters: {
        bomb: prev.boosters.bomb + (reward.boosters.bomb || 0),
        hammer: prev.boosters.hammer + (reward.boosters.hammer || 0),
        shuffle: prev.boosters.shuffle + (reward.boosters.shuffle || 0),
        rainbow: prev.boosters.rainbow + (reward.boosters.rainbow || 0),
      },
      streak: streak,
    }));
    
    localStorage.setItem('lastDailyReward', new Date().toDateString());
    setShowDailyReward(false);
  }, [gameState.streak, setGameState]);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  }, [navigate]);

  const handlePurchase = useCallback((itemId: string) => {
    // Handle purchase logic here
    console.log('Purchasing:', itemId);
  }, []);

  // Determine if level is won or lost
  const isLevelWon = !gameState.isPlaying && gameState.score >= gameState.targetScore && gameState.board.length > 0;
  const isLevelLost = !gameState.isPlaying && gameState.score < gameState.targetScore && gameState.moves <= 0 && gameState.board.length > 0;

  // Loading screen
  if (loading) {
    return (
      <div 
        className="min-h-screen min-h-[100dvh] flex items-center justify-center"
        style={{
          backgroundImage: `url(${mysticForestBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="text-white text-xl font-cinzel animate-pulse">Cargando...</div>
      </div>
    );
  }

  // Menu screen
  if (screen === 'menu') {
    return (
      <>
        <MainMenu
          lives={gameState.lives}
          maxLives={gameState.maxLives}
          gems={gameState.gems}
          unlockedLevels={gameState.unlockedLevels}
          totalScore={gameState.totalScore}
          streak={gameState.streak}
          userEmail={userEmail}
          onPlay={handlePlay}
          onLevelSelect={() => setScreen('level-select')}
          onShop={() => setScreen('shop')}
          onLogout={handleLogout}
          onExit={handleLogout}
        />
        {showDailyReward && (
          <DailyReward
            streak={gameState.streak + 1}
            onClaim={handleClaimDailyReward}
            onClose={() => setShowDailyReward(false)}
          />
        )}
      </>
    );
  }

  // Shop screen
  if (screen === 'shop') {
    return (
      <Shop
        lives={gameState.lives}
        gems={gameState.gems}
        totalScore={gameState.totalScore}
        onClose={handleMainMenu}
        onPurchase={handlePurchase}
      />
    );
  }

  // Level select screen
  if (screen === 'level-select') {
    return (
      <LevelSelect
        unlockedLevels={gameState.unlockedLevels}
        onSelectLevel={handleSelectLevel}
        onBack={handleMainMenu}
        onExit={handleLogout}
      />
    );
  }

  // Playing screen
  return (
    <div 
      className="min-h-screen min-h-[100dvh] flex flex-col p-2 sm:p-4 relative overflow-hidden"
      style={{
        backgroundImage: `url(${mysticForestBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Floating particles - reduced for mobile performance */}
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none z-0"
          style={{
            width: 3 + Math.random() * 4,
            height: 3 + Math.random() * 4,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: `radial-gradient(circle, hsla(0, 0%, 100%, 0.9), hsla(45, 100%, 50%, 0.6))`,
            boxShadow: '0 0 10px hsla(45, 100%, 50%, 0.5)',
            animation: `float-particle ${6 + Math.random() * 6}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 8}s`,
          }}
        />
      ))}

      <div className="relative z-10 flex flex-col flex-1 max-w-lg mx-auto w-full">
        <GameHeader
          level={gameState.level}
          score={gameState.score}
          targetScore={gameState.targetScore}
          moves={gameState.moves}
          combo={gameState.combo}
          onExit={handleMainMenu}
        />

        <GameBoard
          board={gameState.board}
          selectedGem={gameState.selectedGem}
          onGemClick={handleBoardClick}
          onGemSwap={swapGems}
        />

        <BoosterBar
          boosters={gameState.boosters}
          activeBooster={activeBooster}
          onBoosterSelect={handleBoosterSelect}
        />
      </div>

      {/* Level complete modal */}
      {isLevelWon && (
        <LevelComplete
          level={gameState.level}
          score={gameState.score}
          targetScore={gameState.targetScore}
          gemsEarned={Math.floor(gameState.score / 100)}
          onNextLevel={() => handleSelectLevel(gameState.level + 1)}
          onMainMenu={handleMainMenu}
        />
      )}

      {/* Game over modal */}
      {isLevelLost && (
        <GameOver
          level={gameState.level}
          score={gameState.score}
          targetScore={gameState.targetScore}
          lives={gameState.lives}
          onRetry={() => handleSelectLevel(gameState.level)}
          onMainMenu={handleMainMenu}
        />
      )}

      {/* Pause modal */}
      {screen === 'paused' && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div 
            className="p-8 text-center rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(60, 20, 80, 0.95) 0%, rgba(40, 15, 60, 0.95) 100%)',
              border: '2px solid rgba(255, 215, 0, 0.3)',
            }}
          >
            <h2 className="font-cinzel text-2xl mb-6 text-white">Pausado</h2>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setScreen('playing')}
                className="px-6 py-3 rounded-full font-semibold"
                style={{
                  background: 'linear-gradient(135deg, #FFA500 0%, #FF8C00 100%)',
                  color: '#1a1a2e',
                }}
              >
                Continuar
              </button>
              <button
                onClick={handleMainMenu}
                className="px-6 py-3 rounded-full border border-white/30 hover:bg-white/10 text-white"
              >
                Menú Principal
              </button>
            </div>
          </div>
        </div>
      )}

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
};

export default Game;
