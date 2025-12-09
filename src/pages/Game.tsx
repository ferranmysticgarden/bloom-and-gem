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
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Auth error:', error);
          navigate('/auth');
          return;
        }
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
      } catch (err) {
        console.error('Auth check failed:', err);
        navigate('/auth');
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

  // Determine if level is won or lost
  const isLevelWon = !gameState.isPlaying && gameState.score >= gameState.targetScore && gameState.board.length > 0;
  const isLevelLost = !gameState.isPlaying && gameState.score < gameState.targetScore && gameState.moves <= 0 && gameState.board.length > 0;

  // Loading screen
  if (loading) {
    return (
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: `url(${mysticForestBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div style={{ color: 'white', fontSize: '20px', fontFamily: "'Cinzel', serif" }}>Cargando...</div>
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
          padding: '60px 12px 12px 12px',
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

      {/* Pause modal */}
      {screen === 'paused' && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
          }}
        >
          <div 
            style={{
              padding: '32px',
              textAlign: 'center',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(60, 20, 80, 0.95) 0%, rgba(40, 15, 60, 0.95) 100%)',
              border: '2px solid rgba(255, 215, 0, 0.3)',
            }}
          >
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: '24px', marginBottom: '24px', color: 'white' }}>Pausado</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                onClick={() => setScreen('playing')}
                style={{
                  padding: '12px 24px',
                  borderRadius: '9999px',
                  fontWeight: '600',
                  background: 'linear-gradient(135deg, #FFA500 0%, #FF8C00 100%)',
                  color: '#1a1a2e',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Continuar
              </button>
              <button
                onClick={handleMainMenu}
                style={{
                  padding: '12px 24px',
                  borderRadius: '9999px',
                  border: '1px solid rgba(255,255,255,0.3)',
                  background: 'transparent',
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                Menú Principal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;