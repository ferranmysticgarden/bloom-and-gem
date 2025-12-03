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
import { DailyReward } from '@/components/game/DailyReward';
import { DAILY_REWARDS } from '@/config/levels';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Pause } from 'lucide-react';

type GameScreen = 'menu' | 'level-select' | 'playing' | 'paused';

const Game = () => {
  const navigate = useNavigate();
  const { gameState, setGameState, startLevel, selectGem, swapGems, useBomb, useHammer, shuffleBoard } = useGameEngine();
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

  // Determine if level is won or lost
  const isLevelWon = !gameState.isPlaying && gameState.score >= gameState.targetScore && gameState.board.length > 0;
  const isLevelLost = !gameState.isPlaying && gameState.score < gameState.targetScore && gameState.moves <= 0 && gameState.board.length > 0;

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
          onPlay={handlePlay}
          onLevelSelect={() => setScreen('level-select')}
          onDailyReward={() => setShowDailyReward(true)}
          onSettings={() => {}}
          onLogout={handleLogout}
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

  // Level select screen
  if (screen === 'level-select') {
    return (
      <LevelSelect
        unlockedLevels={gameState.unlockedLevels}
        onSelectLevel={handleSelectLevel}
        onBack={handleMainMenu}
      />
    );
  }

  // Playing screen
  return (
    <div className="min-h-screen flex flex-col p-4">
      {/* Top bar */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handleMainMenu}
          className="p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-sm text-muted-foreground">{userEmail}</span>
        <button
          onClick={() => setScreen('paused')}
          className="p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors"
        >
          <Pause className="w-5 h-5" />
        </button>
      </div>

      <GameHeader
        level={gameState.level}
        score={gameState.score}
        targetScore={gameState.targetScore}
        moves={gameState.moves}
        combo={gameState.combo}
        lives={gameState.lives}
        maxLives={gameState.maxLives}
        gems={gameState.gems}
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
          <div className="fairy-card p-8 text-center">
            <h2 className="font-cinzel text-2xl mb-6">Pausado</h2>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setScreen('playing')}
                className="magic-button"
              >
                Continuar
              </button>
              <button
                onClick={handleMainMenu}
                className="px-6 py-3 rounded-full border border-border/50 hover:bg-muted/50"
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
