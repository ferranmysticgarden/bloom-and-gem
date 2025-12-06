import { useState, useCallback, useEffect, useRef } from 'react';
import { Gem, GemType, Position, GameState, SpecialGemType } from '@/types/game';
import { LEVELS, GEM_TYPES } from '@/config/levels';
import { useGameProgress } from './useGameProgress';

const BOARD_SIZE = 8;

const generateId = () => Math.random().toString(36).substring(2, 9);

const getRandomGemType = (numTypes: number): GemType => {
  const types = GEM_TYPES.slice(0, numTypes);
  return types[Math.floor(Math.random() * types.length)];
};

const createGem = (row: number, col: number, numTypes: number, specialChance: number): Gem => {
  const special: SpecialGemType = Math.random() < specialChance 
    ? (['bomb', 'lightning', 'rainbow'] as SpecialGemType[])[Math.floor(Math.random() * 3)]
    : null;
  
  return {
    id: generateId(),
    type: getRandomGemType(numTypes),
    special,
    row,
    col,
    isMatched: false,
    isNew: true,
    isFalling: false,
  };
};

export const useGameEngine = () => {
  const { progress, loading, saveProgress } = useGameProgress();
  const initializedRef = useRef(false);
  
  const [gameState, setGameState] = useState<GameState>({
    board: [],
    score: 0,
    moves: 20,
    targetScore: 500,
    level: 1,
    isPlaying: false,
    selectedGem: null,
    combo: 0,
    lives: 5,
    maxLives: 5,
    gems: 100,
    boosters: { bomb: 3, hammer: 3, shuffle: 2, rainbow: 1 },
    dailyRewardClaimed: false,
    lastDailyReward: null,
    unlockedLevels: 1,
    totalScore: 0,
    streak: 0,
  });

  // Sync progress from database when loaded
  useEffect(() => {
    if (!loading && !initializedRef.current) {
      initializedRef.current = true;
      setGameState(prev => ({
        ...prev,
        lives: progress.lives,
        gems: progress.gems,
        unlockedLevels: progress.unlockedLevels,
        boosters: {
          ...prev.boosters,
          bomb: progress.bombs,
          hammer: progress.hammers,
        },
      }));
    }
  }, [loading, progress]);

  const initializeBoard = useCallback((level: number) => {
    const config = LEVELS[level - 1] || LEVELS[0];
    const size = config.gridSize;
    const board: (Gem | null)[][] = [];
    
    for (let row = 0; row < size; row++) {
      board[row] = [];
      for (let col = 0; col < size; col++) {
        let gem = createGem(row, col, config.gemTypes, 0);
        
        // Prevent initial matches
        while (
          (col >= 2 && board[row][col - 1]?.type === gem.type && board[row][col - 2]?.type === gem.type) ||
          (row >= 2 && board[row - 1]?.[col]?.type === gem.type && board[row - 2]?.[col]?.type === gem.type)
        ) {
          gem = createGem(row, col, config.gemTypes, 0);
        }
        
        board[row][col] = gem;
      }
    }
    
    return board;
  }, []);

  const startLevel = useCallback((level: number) => {
    const config = LEVELS[level - 1] || LEVELS[0];
    const board = initializeBoard(level);
    
    setGameState(prev => ({
      ...prev,
      board,
      score: 0,
      moves: config.moves,
      targetScore: config.targetScore,
      level,
      isPlaying: true,
      selectedGem: null,
      combo: 0,
    }));
  }, [initializeBoard]);

  const findMatches = useCallback((board: (Gem | null)[][]): Position[] => {
    const matches: Position[] = [];
    const size = board.length;
    
    // Horizontal matches
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size - 2; col++) {
        const gem = board[row][col];
        if (gem && board[row][col + 1]?.type === gem.type && board[row][col + 2]?.type === gem.type) {
          let matchLength = 3;
          while (col + matchLength < size && board[row][col + matchLength]?.type === gem.type) {
            matchLength++;
          }
          for (let i = 0; i < matchLength; i++) {
            if (!matches.find(m => m.row === row && m.col === col + i)) {
              matches.push({ row, col: col + i });
            }
          }
        }
      }
    }
    
    // Vertical matches
    for (let col = 0; col < size; col++) {
      for (let row = 0; row < size - 2; row++) {
        const gem = board[row][col];
        if (gem && board[row + 1]?.[col]?.type === gem.type && board[row + 2]?.[col]?.type === gem.type) {
          let matchLength = 3;
          while (row + matchLength < size && board[row + matchLength]?.[col]?.type === gem.type) {
            matchLength++;
          }
          for (let i = 0; i < matchLength; i++) {
            if (!matches.find(m => m.row === row + i && m.col === col)) {
              matches.push({ row: row + i, col });
            }
          }
        }
      }
    }
    
    return matches;
  }, []);

  const removeMatches = useCallback((board: (Gem | null)[][], matches: Position[]): (Gem | null)[][] => {
    const newBoard = board.map(row => [...row]);
    
    matches.forEach(({ row, col }) => {
      newBoard[row][col] = null;
    });
    
    return newBoard;
  }, []);

  const applyGravity = useCallback((board: (Gem | null)[][], level: number): (Gem | null)[][] => {
    const config = LEVELS[level - 1] || LEVELS[0];
    const size = board.length;
    const newBoard = board.map(row => [...row]);
    
    for (let col = 0; col < size; col++) {
      let emptyRow = size - 1;
      
      for (let row = size - 1; row >= 0; row--) {
        if (newBoard[row][col] !== null) {
          if (row !== emptyRow) {
            newBoard[emptyRow][col] = { ...newBoard[row][col]!, row: emptyRow, isFalling: true };
            newBoard[row][col] = null;
          }
          emptyRow--;
        }
      }
      
      // Fill empty spaces with new gems
      for (let row = emptyRow; row >= 0; row--) {
        newBoard[row][col] = createGem(row, col, config.gemTypes, config.specialChance);
      }
    }
    
    return newBoard;
  }, []);

  const swapGems = useCallback((pos1: Position, pos2: Position) => {
    setGameState(prev => {
      if (!prev.isPlaying || prev.moves <= 0) return prev;
      
      const newBoard = prev.board.map(row => [...row]);
      const gem1 = newBoard[pos1.row][pos1.col];
      const gem2 = newBoard[pos2.row][pos2.col];
      
      if (!gem1 || !gem2) return prev;
      
      // Swap
      newBoard[pos1.row][pos1.col] = { ...gem2, row: pos1.row, col: pos1.col };
      newBoard[pos2.row][pos2.col] = { ...gem1, row: pos2.row, col: pos2.col };
      
      // Check for matches
      const matches = findMatches(newBoard);
      
      if (matches.length === 0) {
        // Swap back if no matches
        return { ...prev, selectedGem: null };
      }
      
      return {
        ...prev,
        board: newBoard,
        moves: prev.moves - 1,
        selectedGem: null,
      };
    });
  }, [findMatches]);

  const selectGem = useCallback((pos: Position) => {
    setGameState(prev => {
      if (!prev.isPlaying) return prev;
      
      if (!prev.selectedGem) {
        return { ...prev, selectedGem: pos };
      }
      
      const { row: r1, col: c1 } = prev.selectedGem;
      const { row: r2, col: c2 } = pos;
      
      // Check if adjacent
      const isAdjacent = (Math.abs(r1 - r2) === 1 && c1 === c2) || (Math.abs(c1 - c2) === 1 && r1 === r2);
      
      if (isAdjacent) {
        // Will trigger swap in next render
        return prev;
      }
      
      return { ...prev, selectedGem: pos };
    });
  }, []);

  const processMatches = useCallback(() => {
    setGameState(prev => {
      const matches = findMatches(prev.board);
      
      if (matches.length === 0) {
        // Check win/lose condition
        if (prev.score >= prev.targetScore) {
          const newUnlockedLevels = Math.max(prev.unlockedLevels, prev.level + 1);
          const newGems = prev.gems + Math.floor(prev.score / 100);
          
          // Save progress to database
          saveProgress({
            unlockedLevels: newUnlockedLevels,
            gems: newGems,
          });
          
          return {
            ...prev,
            isPlaying: false,
            unlockedLevels: newUnlockedLevels,
            totalScore: prev.totalScore + prev.score,
            gems: newGems,
          };
        }
        if (prev.moves <= 0) {
          const newLives = prev.lives - 1;
          
          // Save lives to database
          saveProgress({ lives: newLives });
          
          return {
            ...prev,
            isPlaying: false,
            lives: newLives,
          };
        }
        return { ...prev, combo: 0 };
      }
      
      const scoreGain = matches.length * 10 * (1 + prev.combo * 0.5);
      let boardAfterRemoval = removeMatches(prev.board, matches);
      boardAfterRemoval = applyGravity(boardAfterRemoval, prev.level);
      
      return {
        ...prev,
        board: boardAfterRemoval,
        score: prev.score + Math.floor(scoreGain),
        combo: prev.combo + 1,
      };
    });
  }, [findMatches, removeMatches, applyGravity, saveProgress]);

  const useBomb = useCallback((pos: Position) => {
    setGameState(prev => {
      if (prev.boosters.bomb <= 0) return prev;
      
      const newBoard = prev.board.map(row => [...row]);
      const size = newBoard.length;
      const config = LEVELS[prev.level - 1] || LEVELS[0];
      let destroyed = 0;
      
      // Destroy 3x3 area
      for (let r = pos.row - 1; r <= pos.row + 1; r++) {
        for (let c = pos.col - 1; c <= pos.col + 1; c++) {
          if (r >= 0 && r < size && c >= 0 && c < size && newBoard[r][c]) {
            newBoard[r][c] = null;
            destroyed++;
          }
        }
      }
      
      const boardWithGravity = applyGravity(newBoard, prev.level);
      
      return {
        ...prev,
        board: boardWithGravity,
        boosters: { ...prev.boosters, bomb: prev.boosters.bomb - 1 },
        score: prev.score + destroyed * 15,
      };
    });
  }, [applyGravity]);

  const useHammer = useCallback((pos: Position) => {
    setGameState(prev => {
      if (prev.boosters.hammer <= 0) return prev;
      
      const newBoard = prev.board.map(row => [...row]);
      const config = LEVELS[prev.level - 1] || LEVELS[0];
      
      if (newBoard[pos.row][pos.col]) {
        newBoard[pos.row][pos.col] = null;
        const boardWithGravity = applyGravity(newBoard, prev.level);
        
        return {
          ...prev,
          board: boardWithGravity,
          boosters: { ...prev.boosters, hammer: prev.boosters.hammer - 1 },
          score: prev.score + 10,
        };
      }
      
      return prev;
    });
  }, [applyGravity]);

  const shuffleBoard = useCallback(() => {
    setGameState(prev => {
      if (prev.boosters.shuffle <= 0) return prev;
      
      const config = LEVELS[prev.level - 1] || LEVELS[0];
      const board = initializeBoard(prev.level);
      
      return {
        ...prev,
        board,
        boosters: { ...prev.boosters, shuffle: prev.boosters.shuffle - 1 },
      };
    });
  }, [initializeBoard]);

  // Process matches after board changes
  useEffect(() => {
    if (gameState.isPlaying) {
      const timer = setTimeout(processMatches, 300);
      return () => clearTimeout(timer);
    }
  }, [gameState.board, gameState.isPlaying, processMatches]);

  // Handle gem selection and swapping
  useEffect(() => {
    if (gameState.selectedGem) {
      const handleSwap = (pos: Position) => {
        const { row: r1, col: c1 } = gameState.selectedGem!;
        const { row: r2, col: c2 } = pos;
        const isAdjacent = (Math.abs(r1 - r2) === 1 && c1 === c2) || (Math.abs(c1 - c2) === 1 && r1 === r2);
        
        if (isAdjacent) {
          swapGems(gameState.selectedGem!, pos);
        }
      };
    }
  }, [gameState.selectedGem, swapGems]);

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
