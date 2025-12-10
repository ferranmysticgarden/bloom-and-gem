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

  const [authChecked, setAuthChecked] = useState(false);

  // Check auth and show daily reward
  useEffect(() => {
    let mounted = true;
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;
        
        if (!session) {
          navigate('/auth');
        } else {
          setUserEmail(session.user.email || '');
          setAuthChecked(true);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      
      if (!session) {
        navigate('/auth');
      } else {
        setUserEmail(session.user.email || '');
        setAuthChecked(true);
        
        // Check daily reward - solo después de que el menú esté listo
        setTimeout(() => {
          if (!mounted) return;
          const lastReward = localStorage.getItem('lastDailyReward');
          const today = new Date().toDateString();
          if (lastReward !== today) {
            setShowDailyReward(true);
          }
        }, 500); // Pequeño delay para que el menú se cargue primero
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
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
    const streak = ((gameState.streak || 0) % 7) + 1;
    const rewardIndex = Math.max(0, Math.min(streak - 1, DAILY_REWARDS.length - 1));
    const reward = DAILY_REWARDS[rewardIndex] || DAILY_REWARDS[0];
    
    if (!reward) {
      console.error('No reward found for streak:', streak);
      setShowDailyReward(false);
      return;
    }
    
    setGameState(prev => ({
      ...prev,
      gems: prev.gems + (reward.gems || 0),
      boosters: {
        bomb: prev.boosters.bomb + (reward.boosters?.bomb || 0),
        hammer: prev.boosters.hammer + (reward.boosters?.hammer || 0),
        shuffle: prev.boosters.shuffle + (reward.boosters?.shuffle || 0),
        rainbow: prev.boosters.rainbow + (reward.boosters?.rainbow || 0),
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
    console.log('Purchasing:', itemId);
  }, []);

  // Determine if level is won or lost - con más logging para debug
  const hasBoard = gameState.board && gameState.board.length > 0;
  const isLevelWon = !gameState.isPlaying && hasBoard && gameState.score >= gameState.targetScore;
  const isLevelLost = !gameState.isPlaying && hasBoard && gameState.score < gameState.targetScore && gameState.moves <= 0;
  
  // Debug: log state changes
  useEffect(() => {
    if (hasBoard && !gameState.isPlaying) {
      console.log('Game ended - Won:', isLevelWon, 'Lost:', isLevelLost, 'Score:', gameState.score, 'Target:', gameState.targetScore);
    }
  }, [gameState.isPlaying, hasBoard, isLevelWon, isLevelLost, gameState.score, gameState.targetScore]);

  // Loading screen - show while checking auth or loading game
  if (loading || !authChecked) {
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
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(180deg, #1a0a2e 0%, #16213e 50%, #0f0c29 100%)',
          overflow: 'hidden',
        }}
      >
        {/* Logo/Title */}
        <div 
          style={{ 
            fontFamily: "'Cinzel', serif", 
            fontSize: '32px', 
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '24px',
            textShadow: '0 0 30px rgba(255,215,0,0.3)',
          }}
        >
          Mystic Garden
        </div>
        
        {/* Loading spinner */}
        <div 
          style={{
            width: '50px',
            height: '50px',
            border: '4px solid rgba(255,255,255,0.1)',
            borderTop: '4px solid #FFD700',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
        
        <div 
          style={{ 
            color: 'rgba(255,255,255,0.7)', 
            fontSize: '16px', 
            fontFamily: "'Quicksand', sans-serif",
            marginTop: '20px',
          }}
        >
          Cargando...
        </div>
        
        {/* CSS for spinner animation */}
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Menu screen
  if (screen === 'menu') {
    return (
      <>
        <MainMenu
          lives={gameState.lives}
          gems={gameState.gems}
          unlockedLevels={gameState.unlockedLevels}
          totalScore={gameState.totalScore}
          userEmail={userEmail}
          onPlay={handlePlay}
          onLevelSelect={() => setScreen('level-select')}
          onShop={() => setScreen('shop')}
          onLogout={handleLogout}
          onExit={handleLogout}
        />
      {showDailyReward && (
          <DailyReward
            streak={((gameState.streak || 0) % 7) + 1}
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

  // Playing screen - PANTALLA COMPLETA
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
        display: 'flex',
        flexDirection: 'column',
        backgroundImage: `url(${mysticForestBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Overlay - más claro para ver el fondo */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(180deg, rgba(60, 20, 80, 0.3) 0%, rgba(20, 40, 60, 0.4) 100%)',
          zIndex: 1,
        }}
      />

      {/* Contenido principal - llena toda la pantalla */}
      <div 
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          padding: '12px',
          gap: '8px',
          maxWidth: '420px',
          margin: '0 auto',
          width: '100%',
          height: '100%',
          boxSizing: 'border-box',
        }}
      >
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

      {/* Pause modal removed - was dead code (screen never set to 'paused') */}
    </div>
  );
};

export default Game;