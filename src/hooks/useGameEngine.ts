import { useState, useCallback, useEffect, useRef } from 'react';
import { Gem, GemType, Position, GameState, SpecialGemType } from '@/types/game';
import { LEVELS, GEM_TYPES } from '@/config/levels';
import { useGameProgress } from './useGameProgress';

const generateId = () => Math.random().toString(36).substring(2, 9);

const getRandomGemType = (numTypes: number): GemType => {
  const safeNumTypes = Math.max(1, Math.min(numTypes || 4, GEM_TYPES.length));
  const types = GEM_TYPES.slice(0, safeNumTypes);
  return types[Math.floor(Math.random() * types.length)] || 'leaf';
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
  const isProcessingRef = useRef(false);
  
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
    const safeLevel = Math.max(1, level || 1);
    const levelIndex = Math.min(safeLevel - 1, LEVELS.length - 1);
    const config = LEVELS[levelIndex] || LEVELS[0];
    
    if (!config) {
      console.error('No level config found');
      return [];
    }
    
    const size = config.gridSize || 8;
    const board: (Gem | null)[][] = [];
    
    for (let row = 0; row < size; row++) {
      board[row] = [];
      for (let col = 0; col < size; col++) {
        let gem = createGem(row, col, config.gemTypes || 4, 0);
        let attempts = 0;
        
        while (
          attempts < 10 &&
          ((col >= 2 && board[row][col - 1]?.type === gem.type && board[row][col - 2]?.type === gem.type) ||
          (row >= 2 && board[row - 1]?.[col]?.type === gem.type && board[row - 2]?.[col]?.type === gem.type))
        ) {
          gem = createGem(row, col, config.gemTypes || 4, 0);
          attempts++;
        }
        
        board[row][col] = gem;
      }
    }
    
    return board;
  }, []);

  const startLevel = useCallback((level: number) => {
    const safeLevel = Math.max(1, level || 1);
    const levelIndex = Math.min(safeLevel - 1, LEVELS.length - 1);
    const config = LEVELS[levelIndex] || LEVELS[0];
    
    if (!config) {
      console.error('No level config found');
      return;
    }
    
    const board = initializeBoard(safeLevel);
    
    if (!board || board.length === 0) {
      console.error('Failed to initialize board');
      return;
    }
    
    isProcessingRef.current = false;
    
    setGameState(prev => ({
      ...prev,
      board,
      score: 0,
      moves: config.moves || 20,
      targetScore: config.targetScore || 500,
      level: safeLevel,
      isPlaying: true,
      selectedGem: null,
      combo: 0,
    }));
  }, [initializeBoard]);

  const findMatches = useCallback((board: (Gem | null)[][]): Position[] => {
    const matches: Position[] = [];
    const size = board.length;
    
    if (size === 0) return matches;
    
    for (let row = 0; row < size; row++) {
      if (!board[row]) continue;
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
    
    for (let col = 0; col < size; col++) {
      for (let row = 0; row < size - 2; row++) {
        if (!board[row]) continue;
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
      if (newBoard[row]) {
        newBoard[row][col] = null;
      }
    });
    return newBoard;
  }, []);

  const applyGravity = useCallback((board: (Gem | null)[][], level: number): (Gem | null)[][] => {
    const safeLevel = Math.max(1, level || 1);
    const levelIndex = Math.min(safeLevel - 1, LEVELS.length - 1);
    const config = LEVELS[levelIndex] || LEVELS[0];
    const size = board.length;
    
    if (size === 0) return board;
    
    const newBoard = board.map(row => [...row]);
    
    for (let col = 0; col < size; col++) {
      let emptyRow = size - 1;
      
      for (let row = size - 1; row >= 0; row--) {
        if (newBoard[row] && newBoard[row][col] !== null) {
          if (row !== emptyRow && newBoard[emptyRow]) {
            newBoard[emptyRow][col] = { ...newBoard[row][col]!, row: emptyRow, isFalling: true };
            newBoard[row][col] = null;
          }
          emptyRow--;
        }
      }
      
      for (let row = emptyRow; row >= 0; row--) {
        if (newBoard[row]) {
          newBoard[row][col] = createGem(row, col, config?.gemTypes || 4, config?.specialChance || 0);
        }
      }
    }
    
    return newBoard;
  }, []);

  const swapGems = useCallback((pos1: Position, pos2: Position) => {
    if (isProcessingRef.current) {
      console.log('Swap blocked');
      return;
    }
    
    setGameState(prev => {
      if (!prev.isPlaying || prev.moves <= 0) return prev;
      
      const newBoard = prev.board.map(row => [...row]);
      const gem1 = newBoard[pos1.row]?.[pos1.col];
      const gem2 = newBoard[pos2.row]?.[pos2.col];
      
      if (!gem1 || !gem2) return prev;
      
      newBoard[pos1.row][pos1.col] = { ...gem2, row: pos1.row, col: pos1.col };
      newBoard[pos2.row][pos2.col] = { ...gem1, row: pos2.row, col: pos2.col };
      
      const matches = findMatches(newBoard);
      
      if (matches.length === 0) {
        return { ...prev, selectedGem: null };
      }
      
      isProcessingRef.current = true;
      
      setTimeout(() => {
        setGameState(current => {
          let updatedBoard = removeMatches(current.board, matches);
          updatedBoard = applyGravity(updatedBoard, current.level);
          
          const newMatches = findMatches(updatedBoard);
          if (newMatches.length > 0) {
            setTimeout(() => processMatchesRecursive(updatedBoard, current.level, current.combo + 1), 300);
          } else {
            isProcessingRef.current = false;
          }
          
          return {
            ...current,
            board: updatedBoard,
            score: current.score + matches.length * 10 * (current.combo + 1),
            moves: current.moves - 1,
            combo: newMatches.length > 0 ? current.combo + 1 : 0,
            selectedGem: null,
          };
        });
      }, 300);
      
      return {
        ...prev,
        board: newBoard,
        selectedGem: null,
      };
    });
  }, [findMatches, removeMatches, applyGravity]);

  const processMatchesRecursive = useCallback((board: (Gem | null)[][], level: number, combo: number) => {
    const matches = findMatches(board);
    
    if (matches.length === 0) {
      isProcessingRef.current = false;
      return;
    }
    
    setGameState(current => {
      let updatedBoard = removeMatches(board, matches);
      updatedBoard = applyGravity(updatedBoard, level);
      
      setTimeout(() => processMatchesRecursive(updatedBoard, level, combo + 1), 300);
      
      return {
        ...current,
        board: updatedBoard,
        score: current.score + matches.length * 10 * combo,
        combo,
      };
    });
  }, [findMatches, removeMatches, applyGravity]);

  const handleGemClick = useCallback((position: Position) => {
    if (isProcessingRef.current) return;
    
    setGameState(prev => {
      if (!prev.isPlaying || prev.moves <= 0) return prev;
      
      if (!prev.selectedGem) {
        return { ...prev, selectedGem: position };
      }
      
      const isAdjacent = 
        (Math.abs(prev.selectedGem.row - position.row) === 1 && prev.selectedGem.col === position.col) ||
        (Math.abs(prev.selectedGem.col - position.col) === 1 && prev.selectedGem.row === position.row);
      
      if (isAdjacent) {
        swapGems(prev.selectedGem, position);
        return { ...prev, selectedGem: null };
      }
      
      return { ...prev, selectedGem: position };
    });
  }, [swapGems]);

  const useBomb = useCallback((position: Position) => {
    setGameState(prev => {
      if (prev.boosters.bomb <= 0) return prev;
      
      const newBoard = prev.board.map(row => [...row]);
      const matches: Position[] = [];
      
      for (let row = Math.max(0, position.row - 1); row <= Math.min(newBoard.length - 1, position.row + 1); row++) {
        for (let col = Math.max(0, position.col - 1); col <= Math.min(newBoard[0].length - 1, position.col + 1); col++) {
          if (newBoard[row]?.[col]) {
            matches.push({ row, col });
          }
        }
      }
      
      const updatedBoard = removeMatches(newBoard, matches);
      const finalBoard = applyGravity(updatedBoard, prev.level);
      
      saveProgress({
        ...progress,
        bombs: progress.bombs - 1,
      });
      
      return {
        ...prev,
        board: finalBoard,
        score: prev.score + matches.length * 20,
        boosters: { ...prev.boosters, bomb: prev.boosters.bomb - 1 },
      };
    });
  }, [removeMatches, applyGravity, progress, saveProgress]);

  const useHammer = useCallback((position: Position) => {
    setGameState(prev => {
      if (prev.boosters.hammer <= 0) return prev;
      
      const newBoard = prev.board.map(row => [...row]);
      const matches: Position[] = [position];
      
      const updatedBoard = removeMatches(newBoard, matches);
      const finalBoard = applyGravity(updatedBoard, prev.level);
      
      saveProgress({
        ...progress,
        hammers: progress.hammers - 1,
      });
      
      return {
        ...prev,
        board: finalBoard,
        score: prev.score + 10,
        boosters: { ...prev.boosters, hammer: prev.boosters.hammer - 1 },
      };
    });
  }, [removeMatches, applyGravity, progress, saveProgress]);

  const shuffleBoard = useCallback(() => {
    setGameState(prev => {
      if (prev.boosters.shuffle <= 0) return prev;
      
      const newBoard = initializeBoard(prev.level);
      
      return {
        ...prev,
        board: newBoard,
        boosters: { ...prev.boosters, shuffle: prev.boosters.shuffle - 1 },
        selectedGem: null,
      };
    });
  }, [initializeBoard]);

  const resetLevel = useCallback(() => {
    startLevel(gameState.level);
  }, [gameState.level, startLevel]);

  const nextLevel = useCallback(() => {
    const nextLevelNum = gameState.level + 1;
    if (nextLevelNum <= gameState.unlockedLevels) {
      startLevel(nextLevelNum);
    }
  }, [gameState.level, gameState.unlockedLevels, startLevel]);

  useEffect(() => {
    if (gameState.isPlaying && gameState.moves === 0) {
      const hasWon = gameState.score >= gameState.targetScore;
      
      if (hasWon && gameState.level === gameState.unlockedLevels) {
        const newUnlockedLevels = Math.min(gameState.level + 1, LEVELS.length);
        saveProgress({
          ...progress,
          unlockedLevels: newUnlockedLevels,
        });
        
        setGameState(prev => ({
          ...prev,
          unlockedLevels: newUnlockedLevels,
        }));
      }
      
      setGameState(prev => ({ ...prev, isPlaying: false }));
    }
  }, [gameState.moves, gameState.isPlaying, gameState.score, gameState.targetScore, gameState.level, gameState.unlockedLevels, progress, saveProgress]);

  return {
    gameState,
    startLevel,
    handleGemClick,
    useBomb,
    useHammer,
    shuffleBoard,
    resetLevel,
    nextLevel,
    loading,
  };
};      
      isProcessingRef.current = true;
      
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
      
      if (prev.selectedGem.row === pos.row && prev.selectedGem.col === pos.col) {
        return { ...prev, selectedGem: null };
      }
      
      return { ...prev, selectedGem: pos };
    });
  }, []);

  const processMatches = useCallback(() => {
    setGameState(prev => {
      if (!prev.isPlaying || prev.board.length === 0) {
        isProcessingRef.current = false;
        return prev;
      }
      
      const matches = findMatches(prev.board);
      
      if (matches.length === 0) {
        isProcessingRef.current = false;
        
        if (prev.score >= prev.targetScore) {
          const newUnlockedLevels = Math.max(prev.unlockedLevels, prev.level + 1);
          const newGems = prev.gems + Math.floor(prev.score / 100);
          
          return {
            ...prev,
            isPlaying: false,
            unlockedLevels: newUnlockedLevels,
            totalScore: prev.totalScore + prev.score,
            gems: newGems,
            combo: 0,
          };
        }
        
        if (prev.moves <= 0) {        while (
          attempts < 10 &&
          ((col >= 2 && board[row][col - 1]?.type === gem.type && board[row][col - 2]?.type === gem.type) ||
          (row >= 2 && board[row - 1]?.[col]?.type === gem.type && board[row - 2]?.[col]?.type === gem.type))
        ) {
          gem = createGem(row, col, config.gemTypes || 4, 0);
          attempts++;
        }
        
        board[row][col] = gem;
      }
    }
    
    return board;
  }, []);

  const startLevel = useCallback((level: number) => {
    const safeLevel = Math.max(1, level || 1);
    const levelIndex = Math.min(safeLevel - 1, LEVELS.length - 1);
    const config = LEVELS[levelIndex] || LEVELS[0];
    
    if (!config) {
      console.error('No level config found');
      return;
    }
    
    const board = initializeBoard(safeLevel);
    
    if (!board || board.length === 0) {
      console.error('Failed to initialize board');
      return;
    }
    
    isProcessingRef.current = false;
    
    setGameState(prev => ({
      ...prev,
      board,
      score: 0,
      moves: config.moves || 20,
      targetScore: config.targetScore || 500,
      level: safeLevel,
      isPlaying: true,
      selectedGem: null,
      combo: 0,
    }));
  }, [initializeBoard]);

  const findMatches = useCallback((board: (Gem | null)[][]): Position[] => {
    const matches: Position[] = [];
    const size = board.length;
    
    if (size === 0) return matches;
    
    for (let row = 0; row < size; row++) {
      if (!board[row]) continue;
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
    
    for (let col = 0; col < size; col++) {
      for (let row = 0; row < size - 2; row++) {
        if (!board[row]) continue;
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
      if (newBoard[row]) {
        newBoard[row][col] = null;
      }
    });
    return newBoard;
  }, []);

  const applyGravity = useCallback((board: (Gem | null)[][], level: number): (Gem | null)[][] => {
    const safeLevel = Math.max(1, level || 1);
    const levelIndex = Math.min(safeLevel - 1, LEVELS.length - 1);
    const config = LEVELS[levelIndex] || LEVELS[0];
    const size = board.length;
    
    if (size === 0) return board;
    
    const newBoard = board.map(row => [...row]);
    
    for (let col = 0; col < size; col++) {
      let emptyRow = size - 1;
      
      for (let row = size - 1; row >= 0; row--) {
        if (newBoard[row] && newBoard[row][col] !== null) {
          if (row !== emptyRow && newBoard[emptyRow]) {
            newBoard[emptyRow][col] = { ...newBoard[row][col]!, row: emptyRow, isFalling: true };
            newBoard[row][col] = null;
          }
          emptyRow--;
        }
      }
      
      for (let row = emptyRow; row >= 0; row--) {
        if (newBoard[row]) {
          newBoard[row][col] = createGem(row, col, config?.gemTypes || 4, config?.specialChance || 0);
        }
      }
    }
    
    return newBoard;
  }, []);

  const swapGems = useCallback((pos1: Position, pos2: Position) => {
    if (isProcessingRef.current) {
      console.log('Swap blocked: processing');
      return;
    }
    
    setGameState(prev => {
      if (!prev.isPlaying || prev.moves <= 0) return prev;
      
      const newBoard = prev.board.map(row => [...row]);
      const gem1 = newBoard[pos1.row]?.[pos1.col];
      const gem2 = newBoard[pos2.row]?.[pos2.col];
      
      if (!gem1 || !gem2) return prev;
      
      newBoard[pos1.row][pos1.col] = { ...gem2, row: pos1.row, col: pos1.col };
      newBoard[pos2.row][pos2.col] = { ...gem1, row: pos2.row, col: pos2.col };
      
      const matches = findMatches(newBoard);
      
      if (matches.length === 0) {
        return { ...prev, selectedGem: null };
      }
      
      isProcessingRef.current = true;
      
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
      
      if (prev.selectedGem.row === pos.row && prev.selectedGem.col === pos.col) {
        return { ...prev, selectedGem: null };
      }
      
      return { ...prev, selectedGem: pos };
    });
  }, []);

  const processMatches = useCallback(() => {
    setGameState(prev => {
      if (!prev.isPlaying || prev.board.length === 0) {
        isProcessingRef.current = false;
        return prev;
      }
      
      const matches = findMatches(prev.board);
      
      if (matches.length === 0) {
        isProcessingRef.current = false;
        
        if (prev.score >= prev.targetScore) {
          const newUnlockedLevels = Math.max(prev.unlockedLevels, prev.level + 1);
          const newGems = prev.gems + Math.floor(prev.score / 100);
          
          return {
            ...prev,
            isPlaying: false,
            unlockedLevels: newUnlockedLevels,
            totalScore: prev.totalScore + prev.score,
            gems: newGems,
            combo: 0,
          };
        }
        
        if (prev.moves <= 0) {
          const newLives = Math.max(0, prev.lives - 1);
          
          return {
            ...prev,
            isPlaying: false,
            lives: newLives,
            combo: 0,
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
  }, [findMatches, removeMatches, applyGravity]);

  const prevIsPlayingRef = useRef(gameState.isPlaying);
  useEffect(() => {
    const wasPlaying = prevIsPlayingRef.current;
    const isNowPlaying = gameState.isPlaying;
    prevIsPlayingRef.current = isNowPlaying;

    if (wasPlaying && !isNowPlaying && gameState.board.length > 0) {
      const won = gameState.score >= gameState.targetScore;
      
      if (won) {
        saveProgress({
          unlockedLevels: gameState.unlockedLevels,
          gems: gameState.gems,
        });
      } else {
        saveProgress({ lives: gameState.lives });
      }
    }
  }, [gameState.isPlaying, gameState.score, gameState.targetScore, gameState.unlockedLevels, gameState.gems, gameState.lives, gameState.board.length, saveProgress]);

  const useBomb = useCallback((pos: Position) => {
    setGameState(prev => {
      if (prev.boosters.bomb <= 0) return prev;
      
      const newBoard = prev.board.map(row => [...row]);
      const size = newBoard.length;
      let destroyed = 0;
      
      for (let r = pos.row - 1; r <= pos.row + 1; r++) {
        for (let c = pos.col - 1; c <= pos.col + 1; c++) {
          if (r >= 0 && r < size && c >= 0 && c < size && newBoard[r]?.[c]) {
            newBoard[r][c] = null;
            destroyed++;
          }
        }
      }
      
      const boardWithGravity = applyGravity(newBoard, prev.level);
      isProcessingRef.current = true;
      
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
      
      if (newBoard[pos.row]?.[pos.col]) {
        newBoard[pos.row][pos.col] = null;
        const boardWithGravity = applyGravity(newBoard, prev.level);
        isProcessingRef.current = true;
        
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
      
      const board = initializeBoard(prev.level);
      isProcessingRef.current = false;
      
      return {
        ...prev,
        board,
        boosters: { ...prev.boosters, shuffle: prev.boosters.shuffle - 1 },
      };
    });
  }, [initializeBoard]);

  const boardVersionRef = useRef(0);
  
  useEffect(() => {
    boardVersionRef.current += 1;
  }, [gameState.board]);

  useEffect(() => {
    if (gameState.isPlaying && gameState.board.length > 0 && isProcessingRef.current) {
      const timer = setTimeout(() => {
        processMatches();
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [boardVersionRef.current, gameState.isPlaying, processMatches]);

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
};            }
          }
        }
      }
    }
    
    return matches;
  }, []);

  const removeMatches = useCallback((board: (Gem | null)[][], matches: Position[]): (Gem | null)[][] => {
    const newBoard = board.map(row => [...row]);
    
    matches.forEach(({ row, col }) => {
      if (newBoard[row]) {
        newBoard[row][col] = null;
      }
    });
    
    return newBoard;
  }, []);

  const applyGravity = useCallback((board: (Gem | null)[][], level: number): (Gem | null)[][] => {
    const safeLevel = Math.max(1, level || 1);
    const levelIndex = Math.min(safeLevel - 1, LEVELS.length - 1);
    const config = LEVELS[levelIndex] || LEVELS[0];
    const size = board.length;
    
    if (size === 0) return board;
    
    const newBoard = board.map(row => [...row]);
    
    for (let col = 0; col < size; col++) {
      let emptyRow = size - 1;
      
      for (let row = size - 1; row >= 0; row--) {
        if (newBoard[row] && newBoard[row][col] !== null) {
          if (row !== emptyRow && newBoard[emptyRow]) {
            newBoard[emptyRow][col] = { ...newBoard[row][col]!, row: emptyRow, isFalling: true };
            newBoard[row][col] = null;
          }
          emptyRow--;
        }
      }
      
      for (let row = emptyRow; row >= 0; row--) {
        if (newBoard[row]) {
          newBoard[row][col] = createGem(row, col, config?.gemTypes || 4, config?.specialChance || 0);
        }
      }
    }
    
    return newBoard;
  }, []);

  const swapGems = useCallback((pos1: Position, pos2: Position) => {
    // 🔥 FIX: No permitir swap si ya se está procesando
    if (isProcessingRef.current) {
      console.log('Swap bloqueado: procesamiento en curso');
      return;
    }
    
    setGameState(prev => {
      if (!prev.isPlaying || prev.moves <= 0) return prev;
      
      const newBoard = prev.board.map(row => [...row]);
      const gem1 = newBoard[pos1.row]?.[pos1.col];
      const gem2 = newBoard[pos2.row]?.[pos2.col];
      
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
      
      // 🔥 FIX: Marcar que vamos a empezar a procesar
      isProcessingRef.current = true;
      
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
      
      if (prev.selectedGem.row === pos.row && prev.selectedGem.col === pos.col) {
        return { ...prev, selectedGem: null };
      }
      
      return { ...prev, selectedGem: pos };
    });
  }, []);

  const processMatches = useCallback(() => {
    setGameState(prev => {
      if (!prev.isPlaying || prev.board.length === 0) {
        isProcessingRef.current = false;
        return prev;
      }
      
      const matches = findMatches(prev.board);
      
      if (matches.length === 0) {
        // 🔥 FIX: Liberar el flag cuando no hay más matches
        isProcessingRef.current = false;
        
        // Check win condition
        if (prev.score >= prev.targetScore) {
          const newUnlockedLevels = Math.max(prev.unlockedLevels, prev.level + 1);
          const newGems = prev.gems + Math.floor(prev.score / 100);
          
          console.log('Level WON!');
          
          return {
            ...prev,
            isPlaying: false,
            unlockedLevels: newUnlockedLevels,
            totalScore: prev.totalScore + prev.score,
            gems: newGems,
            combo: 0,
          };
        }
        
        // Check lose condition
        if (prev.moves <= 0) {
          const newLives = Math.max(0, prev.lives - 1);
          
          console.log('Level LOST!');
          
          return {
            ...prev,
            isPlaying: false,
            lives: newLives,
            combo: 0,
          };
        }
        
        return { ...prev, combo: 0 };
      }
      
      // Hay matches, seguir procesando
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
  }, [findMatches, removeMatches, applyGravity]);

  const prevIsPlayingRef = useRef(gameState.isPlaying);
  useEffect(() => {
    const wasPlaying = prevIsPlayingRef.current;
    const isNowPlaying = gameState.isPlaying;
    prevIsPlayingRef.current = isNowPlaying;

    if (wasPlaying && !isNowPlaying && gameState.board.length > 0) {
      const won = gameState.score >= gameState.targetScore;
      
      if (won) {
        console.log('Saving progress...');
        saveProgress({
          unlockedLevels: gameState.unlockedLevels,
          gems: gameState.gems,
        });
      } else {
        console.log('Saving lives...');
        saveProgress({ lives: gameState.lives });
      }
    }
  }, [gameState.isPlaying, gameState.score, gameState.targetScore, gameState.unlockedLevels, gameState.gems, gameState.lives, gameState.board.length, saveProgress]);

  const useBomb = useCallback((pos: Position) => {
    setGameState(prev => {
      if (prev.boosters.bomb <= 0) return prev;
      
      const newBoard = prev.board.map(row => [...row]);
      const size = newBoard.length;
      let destroyed = 0;
      
      for (let r = pos.row - 1; r <= pos.row + 1; r++) {
        for (let c = pos.col - 1; c <= pos.col + 1; c++) {
          if (r >= 0 && r < size && c >= 0 && c < size && newBoard[r]?.[c]) {
            newBoard[r][c] = null;
            destroyed++;
          }
        }
      }
      
      const boardWithGravity = applyGravity(newBoard, prev.level);
      
      // 🔥 FIX: Marcar procesamiento al usar booster
      isProcessingRef.current = true;
      
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
      
      if (newBoard[pos.row]?.[pos.col]) {
        newBoard[pos.row][pos.col] = null;
        const boardWithGravity = applyGravity(newBoard, prev.level);
        
        // 🔥 FIX: Marcar procesamiento
        isProcessingRef.current = true;
        
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
      
      const board = initializeBoard(prev.level);
      
      // 🔥 FIX: Resetear flag al hacer shuffle
      isProcessingRef.current = false;
      
      return {
        ...prev,
        board,
        boosters: { ...prev.boosters, shuffle: prev.boosters.shuffle - 1 },
      };
    });
  }, [initializeBoard]);

  // 🔥 FIX CRÍTICO: Usar un contador de versión del board en lugar de el board mismo
  const boardVersionRef = useRef(0);
  
  useEffect(() => {
    boardVersionRef.current += 1;
  }, [gameState.board]);

  useEffect(() => {
    // Solo procesar si estamos jugando Y hay un flag activo de procesamiento
    if (gameState.isPlaying && gameState.board.length > 0 && isProcessingRef.current) {
      const timer = setTimeout(() => {
        processMatches();
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [boardVersionRef.current, gameState.isPlaying, processMatches]);

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
};        let attempts = 0;
        
        // Prevent initial matches with max attempts to avoid infinite loop
        while (
          attempts < 10 &&
          ((col >= 2 && board[row][col - 1]?.type === gem.type && board[row][col - 2]?.type === gem.type) ||
          (row >= 2 && board[row - 1]?.[col]?.type === gem.type && board[row - 2]?.[col]?.type === gem.type))
        ) {
          gem = createGem(row, col, config.gemTypes || 4, 0);
          attempts++;
        }
        
        board[row][col] = gem;
      }
    }
    
    return board;
  }, []);

  const startLevel = useCallback((level: number) => {
    const safeLevel = Math.max(1, level || 1);
    const levelIndex = Math.min(safeLevel - 1, LEVELS.length - 1);
    const config = LEVELS[levelIndex] || LEVELS[0];
    
    if (!config) {
      console.error('No level config found');
      return;
    }
    
    const board = initializeBoard(safeLevel);
    
    if (!board || board.length === 0) {
      console.error('Failed to initialize board');
      return;
    }
    
    setGameState(prev => ({
      ...prev,
      board,
      score: 0,
      moves: config.moves || 20,
      targetScore: config.targetScore || 500,
      level: safeLevel,
      isPlaying: true,
      selectedGem: null,
      combo: 0,
    }));
  }, [initializeBoard]);

  const findMatches = useCallback((board: (Gem | null)[][]): Position[] => {
    const matches: Position[] = [];
    const size = board.length;
    
    if (size === 0) return matches;
    
    // Horizontal matches
    for (let row = 0; row < size; row++) {
      if (!board[row]) continue;
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
        if (!board[row]) continue;
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
    const safeLevel = Math.max(1, level || 1);
    const levelIndex = Math.min(safeLevel - 1, LEVELS.length - 1);
    const config = LEVELS[levelIndex] || LEVELS[0];
    const size = board.length;
    
    if (size === 0) return board;
    
    const newBoard = board.map(row => [...row]);
    
    for (let col = 0; col < size; col++) {
      let emptyRow = size - 1;
      
      for (let row = size - 1; row >= 0; row--) {
        if (newBoard[row] && newBoard[row][col] !== null) {
          if (row !== emptyRow && newBoard[emptyRow]) {
            newBoard[emptyRow][col] = { ...newBoard[row][col]!, row: emptyRow, isFalling: true };
            newBoard[row][col] = null;
          }
          emptyRow--;
        }
      }
      
      // Fill empty spaces with new gems
      for (let row = emptyRow; row >= 0; row--) {
        if (newBoard[row]) {
          newBoard[row][col] = createGem(row, col, config?.gemTypes || 4, config?.specialChance || 0);
        }
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
      
      // If clicking the same gem, deselect
      if (prev.selectedGem.row === pos.row && prev.selectedGem.col === pos.col) {
        return { ...prev, selectedGem: null };
      }
      
      // Select new gem (swap is handled by GameBoard's onGemSwap)
      return { ...prev, selectedGem: pos };
    });
  }, []);

  const processMatches = useCallback(() => {
    setGameState(prev => {
      // Evitar procesar si el tablero está vacío o no estamos jugando
      if (!prev.isPlaying || prev.board.length === 0) {
        return prev;
      }
      
      const matches = findMatches(prev.board);
      
      if (matches.length === 0) {
        // Check win/lose condition - PRIMERO verificamos puntuación
        if (prev.score >= prev.targetScore) {
          const newUnlockedLevels = Math.max(prev.unlockedLevels, prev.level + 1);
          const newGems = prev.gems + Math.floor(prev.score / 100);
          
          console.log('Level WON! Score:', prev.score, 'Target:', prev.targetScore);
          
          return {
            ...prev,
            isPlaying: false,
            unlockedLevels: newUnlockedLevels,
            totalScore: prev.totalScore + prev.score,
            gems: newGems,
            combo: 0,
          };
        }
        
        // LUEGO verificamos si nos quedamos sin movimientos
        if (prev.moves <= 0) {
          const newLives = Math.max(0, prev.lives - 1);
          
          console.log('Level LOST! Score:', prev.score, 'Target:', prev.targetScore, 'Moves:', prev.moves);
          
          return {
            ...prev,
            isPlaying: false,
            lives: newLives,
            combo: 0,
          };
        }
        
        // Sin matches pero aún jugando - solo resetear combo
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
  }, [findMatches, removeMatches, applyGravity]);

  // Effect to save progress when game ends
  const prevIsPlayingRef = useRef(gameState.isPlaying);
  useEffect(() => {
    const wasPlaying = prevIsPlayingRef.current;
    const isNowPlaying = gameState.isPlaying;
    prevIsPlayingRef.current = isNowPlaying;

    // Game just ended
    if (wasPlaying && !isNowPlaying && gameState.board.length > 0) {
      const won = gameState.score >= gameState.targetScore;
      
      if (won) {
        console.log('Level won! Saving progress...');
        saveProgress({
          unlockedLevels: gameState.unlockedLevels,
          gems: gameState.gems,
        });
      } else {
        console.log('Level lost! Saving lives...');
        saveProgress({ lives: gameState.lives });
      }
    }
  }, [gameState.isPlaying, gameState.score, gameState.targetScore, gameState.unlockedLevels, gameState.gems, gameState.lives, gameState.board.length, saveProgress]);

  const useBomb = useCallback((pos: Position) => {
    setGameState(prev => {
      if (prev.boosters.bomb <= 0) return prev;
      
      const newBoard = prev.board.map(row => [...row]);
      const size = newBoard.length;
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

  // Process matches after board changes - con protección anti-loop
  const processingRef = useRef(false);
  useEffect(() => {
    if (gameState.isPlaying && gameState.board.length > 0 && !processingRef.current) {
      processingRef.current = true;
      const timer = setTimeout(() => {
        processMatches();
        processingRef.current = false;
      }, 300);
      return () => {
        clearTimeout(timer);
        processingRef.current = false;
      };
    }
  }, [gameState.board, gameState.isPlaying, processMatches]);


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
