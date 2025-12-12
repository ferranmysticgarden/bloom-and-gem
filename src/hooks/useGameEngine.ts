import { useState, useCallback, useEffect, useRef } from 'react';
import { GameState, Gem, Position, GemType } from '@/types/game';
import { LEVELS, GEM_TYPES } from '@/config/levels';
import { useGameProgress } from './useGameProgress';

const INITIAL_STATE: GameState = {
  board: [],
  score: 0,
  moves: 0,
  targetScore: 0,
  level: 1,
  isPlaying: false,
  selectedGem: null,
  combo: 0,
  lives: 5,
  maxLives: 5,
  gems: 100,
  boosters: {
    bomb: 1,
    hammer: 3,
    shuffle: 3,
    rainbow: 1,
  },
  dailyRewardClaimed: false,
  lastDailyReward: null,
  unlockedLevels: 1,
  totalScore: 0,
  streak: 0,
};

const createGem = (row: number, col: number, gemTypes: number): Gem => {
  const availableTypes = GEM_TYPES.slice(0, gemTypes);
  const type = availableTypes[Math.floor(Math.random() * availableTypes.length)] as GemType;
  
  return {
    id: `${row}-${col}-${Date.now()}-${Math.random()}`,
    type,
    special: null,
    row,
    col,
    isMatched: false,
    isNew: true,
    isFalling: false,
  };
};

const createBoard = (size: number, gemTypes: number): (Gem | null)[][] => {
  const board: (Gem | null)[][] = [];
  
  for (let row = 0; row < size; row++) {
    board[row] = [];
    for (let col = 0; col < size; col++) {
      let gem = createGem(row, col, gemTypes);
      
      // Avoid initial matches
      let attempts = 0;
      while (attempts < 50) {
        const leftMatch = col >= 2 && 
          board[row][col - 1]?.type === gem.type && 
          board[row][col - 2]?.type === gem.type;
        const topMatch = row >= 2 && 
          board[row - 1]?.[col]?.type === gem.type && 
          board[row - 2]?.[col]?.type === gem.type;
        
        if (!leftMatch && !topMatch) break;
        
        gem = createGem(row, col, gemTypes);
        attempts++;
      }
      
      board[row][col] = gem;
    }
  }
  
  return board;
};

const findMatches = (board: (Gem | null)[][]): Position[] => {
  const matches: Set<string> = new Set();
  const rows = board.length;
  const cols = board[0]?.length || 0;
  
  // Check horizontal matches
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols - 2; col++) {
      const gem1 = board[row][col];
      const gem2 = board[row][col + 1];
      const gem3 = board[row][col + 2];
      
      if (gem1 && gem2 && gem3 && gem1.type === gem2.type && gem2.type === gem3.type) {
        matches.add(`${row}-${col}`);
        matches.add(`${row}-${col + 1}`);
        matches.add(`${row}-${col + 2}`);
        
        // Check for longer matches
        let i = col + 3;
        while (i < cols && board[row][i]?.type === gem1.type) {
          matches.add(`${row}-${i}`);
          i++;
        }
      }
    }
  }
  
  // Check vertical matches
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows - 2; row++) {
      const gem1 = board[row][col];
      const gem2 = board[row + 1]?.[col];
      const gem3 = board[row + 2]?.[col];
      
      if (gem1 && gem2 && gem3 && gem1.type === gem2.type && gem2.type === gem3.type) {
        matches.add(`${row}-${col}`);
        matches.add(`${row + 1}-${col}`);
        matches.add(`${row + 2}-${col}`);
        
        // Check for longer matches
        let i = row + 3;
        while (i < rows && board[i]?.[col]?.type === gem1.type) {
          matches.add(`${i}-${col}`);
          i++;
        }
      }
    }
  }
  
  return Array.from(matches).map(key => {
    const [row, col] = key.split('-').map(Number);
    return { row, col };
  });
};

const applyGravity = (board: (Gem | null)[][], gemTypes: number): (Gem | null)[][] => {
  const newBoard = board.map(row => [...row]);
  const cols = newBoard[0]?.length || 0;
  const rows = newBoard.length;
  
  for (let col = 0; col < cols; col++) {
    // Move gems down
    let emptyRow = rows - 1;
    
    for (let row = rows - 1; row >= 0; row--) {
      if (newBoard[row][col]) {
        if (row !== emptyRow) {
          newBoard[emptyRow][col] = {
            ...newBoard[row][col]!,
            row: emptyRow,
            isFalling: true,
            isNew: false,
          };
          newBoard[row][col] = null;
        }
        emptyRow--;
      }
    }
    
    // Fill empty spaces with new gems
    for (let row = emptyRow; row >= 0; row--) {
      newBoard[row][col] = createGem(row, col, gemTypes);
    }
  }
  
  return newBoard;
};

export const useGameEngine = () => {
  const { progress, loading, saveProgress } = useGameProgress();
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const isProcessingRef = useRef(false);
  const cascadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Sync progress with game state
  useEffect(() => {
    if (!loading && progress) {
      setGameState(prev => ({
        ...prev,
        lives: progress.lives,
        gems: progress.gems,
        unlockedLevels: progress.unlockedLevels,
        boosters: {
          bomb: progress.bombs,
          hammer: progress.hammers,
          shuffle: progress.shuffles,
          rainbow: progress.rainbows,
        },
      }));
    }
  }, [progress, loading]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (cascadeTimeoutRef.current) {
        clearTimeout(cascadeTimeoutRef.current);
      }
    };
  }, []);

  const processMatchesAndCascade = useCallback((board: (Gem | null)[][], currentScore: number, currentCombo: number, level: number): void => {
    if (isProcessingRef.current) return;
    
    const levelConfig = LEVELS[level - 1] || LEVELS[0];
    const gemTypes = levelConfig.gemTypes;
    
    const matches = findMatches(board);
    
    if (matches.length > 0) {
      isProcessingRef.current = true;
      
      // Mark matched gems
      const markedBoard = board.map(row => row.map(gem => {
        if (gem && matches.some(m => m.row === gem.row && m.col === gem.col)) {
          return { ...gem, isMatched: true };
        }
        return gem;
      }));
      
      setGameState(prev => ({ ...prev, board: markedBoard }));
      
      // Remove matched gems and apply gravity after animation
      cascadeTimeoutRef.current = setTimeout(() => {
        const clearedBoard = markedBoard.map(row => 
          row.map(gem => (gem?.isMatched ? null : gem))
        );
        
        const newBoard = applyGravity(clearedBoard, gemTypes);
        const points = matches.length * 10 * (currentCombo + 1);
        const newScore = currentScore + points;
        const newCombo = currentCombo + 1;
        
        setGameState(prev => ({
          ...prev,
          board: newBoard,
          score: newScore,
          combo: newCombo,
        }));
        
        isProcessingRef.current = false;
        
        // Check for more matches (cascade)
        cascadeTimeoutRef.current = setTimeout(() => {
          processMatchesAndCascade(newBoard, newScore, newCombo, level);
        }, 150);
      }, 200);
    } else {
      // No more matches - check win/lose condition
      setGameState(prev => {
        if (prev.moves <= 0 || prev.score >= prev.targetScore) {
          const won = prev.score >= prev.targetScore;
          
          if (won && prev.level >= prev.unlockedLevels) {
            const newUnlockedLevels = Math.min(prev.level + 1, 100);
            saveProgress({ 
              unlockedLevels: newUnlockedLevels,
              gems: prev.gems + Math.floor(prev.score / 100),
            });
          } else if (!won && prev.lives > 0) {
            saveProgress({ lives: prev.lives - 1 });
          }
          
          return { ...prev, isPlaying: false, combo: 0 };
        }
        return { ...prev, combo: 0 };
      });
    }
  }, [saveProgress]);

  const startLevel = useCallback((level: number) => {
    if (cascadeTimeoutRef.current) {
      clearTimeout(cascadeTimeoutRef.current);
    }
    isProcessingRef.current = false;
    
    const levelConfig = LEVELS[Math.min(level - 1, LEVELS.length - 1)] || LEVELS[0];
    const board = createBoard(levelConfig.gridSize, levelConfig.gemTypes);
    
    setGameState(prev => ({
      ...prev,
      board,
      score: 0,
      moves: levelConfig.moves,
      targetScore: levelConfig.targetScore,
      level,
      isPlaying: true,
      selectedGem: null,
      combo: 0,
    }));
  }, []);

  const selectGem = useCallback((pos: Position) => {
    if (isProcessingRef.current || !gameState.isPlaying) return;
    
    setGameState(prev => ({
      ...prev,
      selectedGem: prev.selectedGem?.row === pos.row && prev.selectedGem?.col === pos.col 
        ? null 
        : pos,
    }));
  }, [gameState.isPlaying]);

  const swapGems = useCallback((pos1: Position, pos2: Position) => {
    if (isProcessingRef.current || !gameState.isPlaying || gameState.moves <= 0) return;
    
    const newBoard = gameState.board.map(row => [...row]);
    const gem1 = newBoard[pos1.row][pos1.col];
    const gem2 = newBoard[pos2.row][pos2.col];
    
    if (!gem1 || !gem2) return;
    
    // Swap positions
    newBoard[pos1.row][pos1.col] = { ...gem2, row: pos1.row, col: pos1.col };
    newBoard[pos2.row][pos2.col] = { ...gem1, row: pos2.row, col: pos2.col };
    
    const matches = findMatches(newBoard);
    
    if (matches.length > 0) {
      setGameState(prev => ({
        ...prev,
        board: newBoard,
        moves: prev.moves - 1,
        selectedGem: null,
      }));
      
      setTimeout(() => {
        processMatchesAndCascade(newBoard, gameState.score, 0, gameState.level);
      }, 100);
    } else {
      // Invalid swap - revert
      setGameState(prev => ({ ...prev, selectedGem: null }));
    }
  }, [gameState.board, gameState.isPlaying, gameState.moves, gameState.score, gameState.level, processMatchesAndCascade]);

  const useBomb = useCallback((pos: Position) => {
    if (!gameState.isPlaying || gameState.boosters.bomb <= 0 || isProcessingRef.current) return;
    
    const levelConfig = LEVELS[gameState.level - 1] || LEVELS[0];
    const newBoard = gameState.board.map(row => [...row]);
    
    // Clear 3x3 area
    for (let r = pos.row - 1; r <= pos.row + 1; r++) {
      for (let c = pos.col - 1; c <= pos.col + 1; c++) {
        if (r >= 0 && r < newBoard.length && c >= 0 && c < newBoard[0].length) {
          newBoard[r][c] = null;
        }
      }
    }
    
    const filledBoard = applyGravity(newBoard, levelConfig.gemTypes);
    
    setGameState(prev => ({
      ...prev,
      board: filledBoard,
      score: prev.score + 90,
      boosters: { ...prev.boosters, bomb: prev.boosters.bomb - 1 },
    }));
    
    saveProgress({ bombs: gameState.boosters.bomb - 1 });
    
    setTimeout(() => {
      processMatchesAndCascade(filledBoard, gameState.score + 90, 0, gameState.level);
    }, 200);
  }, [gameState, saveProgress, processMatchesAndCascade]);

  const useHammer = useCallback((pos: Position) => {
    if (!gameState.isPlaying || gameState.boosters.hammer <= 0 || isProcessingRef.current) return;
    
    const levelConfig = LEVELS[gameState.level - 1] || LEVELS[0];
    const newBoard = gameState.board.map(row => [...row]);
    
    if (newBoard[pos.row][pos.col]) {
      newBoard[pos.row][pos.col] = null;
    }
    
    const filledBoard = applyGravity(newBoard, levelConfig.gemTypes);
    
    setGameState(prev => ({
      ...prev,
      board: filledBoard,
      score: prev.score + 10,
      boosters: { ...prev.boosters, hammer: prev.boosters.hammer - 1 },
    }));
    
    saveProgress({ hammers: gameState.boosters.hammer - 1 });
    
    setTimeout(() => {
      processMatchesAndCascade(filledBoard, gameState.score + 10, 0, gameState.level);
    }, 200);
  }, [gameState, saveProgress, processMatchesAndCascade]);

  const shuffleBoard = useCallback(() => {
    if (!gameState.isPlaying || gameState.boosters.shuffle <= 0 || isProcessingRef.current) return;
    
    const levelConfig = LEVELS[gameState.level - 1] || LEVELS[0];
    const newBoard = createBoard(levelConfig.gridSize, levelConfig.gemTypes);
    
    setGameState(prev => ({
      ...prev,
      board: newBoard,
      boosters: { ...prev.boosters, shuffle: prev.boosters.shuffle - 1 },
    }));
    
    saveProgress({ shuffles: gameState.boosters.shuffle - 1 });
  }, [gameState.isPlaying, gameState.boosters.shuffle, gameState.level, saveProgress]);

  return {
    gameState,
    setGameState,
    startLevel,
    selectGem,
    swapGems,
    useBomb,
    useHammer,
    shuffleBoard,
    loading,
  };
};
