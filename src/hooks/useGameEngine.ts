import { useState, useCallback, useEffect, useRef } from "react";
import { Gem, GemType, Position, GameState, SpecialGemType } from "@/types/game";
import { LEVELS, GEM_TYPES } from "@/config/levels";
import { useGameProgress } from "./useGameProgress";

const generateId = () => Math.random().toString(36).substring(2, 9);

const getRandomGemType = (numTypes: number): GemType => {
  const safeNumTypes = Math.max(1, Math.min(numTypes || 4, GEM_TYPES.length));
  const types = GEM_TYPES.slice(0, safeNumTypes);
  return types[Math.floor(Math.random() * types.length)] || "leaf";
};

const createGem = (row: number, col: number, numTypes: number, specialChance: number): Gem => {
  const special: SpecialGemType =
    Math.random() < specialChance
      ? (["bomb", "lightning", "rainbow"] as SpecialGemType[])[Math.floor(Math.random() * 3)]
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

  // Initialize board without initial matches
  const initializeBoard = useCallback((level: number) => {
    const safeLevel = Math.max(1, level || 1);
    const levelIndex = Math.min(safeLevel - 1, LEVELS.length - 1);
    const config = LEVELS[levelIndex] || LEVELS[0];

    if (!config) {
      console.error("No level config found");
      return [];
    }

    const size = config.gridSize || 8;
    const board: (Gem | null)[][] = [];

    for (let row = 0; row < size; row++) {
      board[row] = [];
      for (let col = 0; col < size; col++) {
        let gem = createGem(row, col, config.gemTypes || 4, 0);
        let attempts = 0;

        // Prevent initial matches
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

  // Find all matches on the board
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
            if (!matches.find((m) => m.row === row && m.col === col + i)) {
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
            if (!matches.find((m) => m.row === row + i && m.col === col)) {
              matches.push({ row: row + i, col });
            }
          }
        }
      }
    }

    return matches;
  }, []);

  // Remove matched gems from board
  const removeMatches = useCallback((board: (Gem | null)[][], matches: Position[]): (Gem | null)[][] => {
    const newBoard = board.map((row) => [...row]);
    matches.forEach(({ row, col }) => {
      if (newBoard[row]) {
        newBoard[row][col] = null;
      }
    });
    return newBoard;
  }, []);

  // Apply gravity and fill empty spaces
  const applyGravity = useCallback((board: (Gem | null)[][], level: number): (Gem | null)[][] => {
    const safeLevel = Math.max(1, level || 1);
    const levelIndex = Math.min(safeLevel - 1, LEVELS.length - 1);
    const config = LEVELS[levelIndex] || LEVELS[0];
    const size = board.length;

    if (size === 0) return board;

    const newBoard = board.map((row) => [...row]);

    for (let col = 0; col < size; col++) {
      let emptyRow = size - 1;

      // Move existing gems down
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

  // Process matches recursively until no more matches
  const processMatchesRecursive = useCallback(
    (board: (Gem | null)[][], level: number, combo: number, accumulatedScore: number = 0) => {
      const matches = findMatches(board);

      if (matches.length === 0) {
        isProcessingRef.current = false;

        // Update final state after all cascades
        setGameState((current) => {
          const finalScore = current.score + accumulatedScore;
          const hasWon = finalScore >= current.targetScore;
          const hasLost = current.moves <= 0 && !hasWon;

          return {
            ...current,
            score: finalScore,
            combo: 0,
            isPlaying: !hasWon && !hasLost,
          };
        });
        return;
      }

      // Calculate score for this cascade
      const scoreGain = matches.length * 10 * combo;
      let updatedBoard = removeMatches(board, matches);
      updatedBoard = applyGravity(updatedBoard, level);

      // Update board and continue processing
      setGameState((current) => ({
        ...current,
        board: updatedBoard,
        combo,
      }));

      // Continue cascade after animation
      setTimeout(() => {
        processMatchesRecursive(updatedBoard, level, combo + 1, accumulatedScore + scoreGain);
      }, 300);
    },
    [findMatches, removeMatches, applyGravity],
  );

  // Swap two gems
  const swapGems = useCallback(
    (pos1: Position, pos2: Position) => {
      if (isProcessingRef.current) {
        return;
      }

      setGameState((prev) => {
        if (!prev.isPlaying || prev.moves <= 0) return prev;

        const newBoard = prev.board.map((row) => [...row]);
        const gem1 = newBoard[pos1.row]?.[pos1.col];
        const gem2 = newBoard[pos2.row]?.[pos2.col];

        if (!gem1 || !gem2) return prev;

        // Perform swap
        newBoard[pos1.row][pos1.col] = { ...gem2, row: pos1.row, col: pos1.col };
        newBoard[pos2.row][pos2.col] = { ...gem1, row: pos2.row, col: pos2.col };

        // Check for matches
        const matches = findMatches(newBoard);

        if (matches.length === 0) {
          // No matches, revert swap
          return { ...prev, selectedGem: null };
        }

        // Valid move, start processing
        isProcessingRef.current = true;

        // Start cascade processing after animation
        setTimeout(() => {
          processMatchesRecursive(newBoard, prev.level, 1);
        }, 300);

        return {
          ...prev,
          board: newBoard,
          moves: prev.moves - 1,
          selectedGem: null,
        };
      });
    },
    [findMatches, processMatchesRecursive],
  );

  // Handle gem click/selection
  const handleGemClick = useCallback(
    (position: Position) => {
      if (isProcessingRef.current) return;

      setGameState((prev) => {
        if (!prev.isPlaying || prev.moves <= 0) return prev;

        if (!prev.selectedGem) {
          return { ...prev, selectedGem: position };
        }

        // Check if clicking same gem (deselect)
        if (prev.selectedGem.row === position.row && prev.selectedGem.col === position.col) {
          return { ...prev, selectedGem: null };
        }

        // Check if gems are adjacent
        const isAdjacent =
          (Math.abs(prev.selectedGem.row - position.row) === 1 && prev.selectedGem.col === position.col) ||
          (Math.abs(prev.selectedGem.col - position.col) === 1 && prev.selectedGem.row === position.row);

        if (isAdjacent) {
          // Perform swap
          swapGems(prev.selectedGem, position);
          return { ...prev, selectedGem: null };
        }

        // Select new gem
        return { ...prev, selectedGem: position };
      });
    },
    [swapGems],
  );

  // Start a new level
  const startLevel = useCallback(
    (level: number) => {
      const safeLevel = Math.max(1, level || 1);
      const levelIndex = Math.min(safeLevel - 1, LEVELS.length - 1);
      const config = LEVELS[levelIndex] || LEVELS[0];

      if (!config) {
        console.error("No level config found");
        return;
      }

      const board = initializeBoard(safeLevel);

      if (!board || board.length === 0) {
        console.error("Failed to initialize board");
        return;
      }

      isProcessingRef.current = false;

      setGameState((prev) => ({
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
    },
    [initializeBoard],
  );

  // Booster: Bomb (destroys 3x3 area)
  const useBomb = useCallback(
    (position: Position) => {
      if (isProcessingRef.current) return;

      setGameState((prev) => {
        if (prev.boosters.bomb <= 0) return prev;

        const newBoard = prev.board.map((row) => [...row]);
        const matches: Position[] = [];

        // Find all gems in 3x3 area
        for (let row = Math.max(0, position.row - 1); row <= Math.min(newBoard.length - 1, position.row + 1); row++) {
          for (
            let col = Math.max(0, position.col - 1);
            col <= Math.min(newBoard[0].length - 1, position.col + 1);
            col++
          ) {
            if (newBoard[row]?.[col]) {
              matches.push({ row, col });
            }
          }
        }

        const updatedBoard = removeMatches(newBoard, matches);
        const finalBoard = applyGravity(updatedBoard, prev.level);

        isProcessingRef.current = true;

        // Check for cascades
        setTimeout(() => {
          processMatchesRecursive(finalBoard, prev.level, 1, matches.length * 20);
        }, 300);

        // Save progress
        saveProgress({
          ...progress,
          bombs: Math.max(0, progress.bombs - 1),
        });

        return {
          ...prev,
          board: finalBoard,
          boosters: { ...prev.boosters, bomb: prev.boosters.bomb - 1 },
        };
      });
    },
    [removeMatches, applyGravity, progress, saveProgress, processMatchesRecursive],
  );

  // Booster: Hammer (destroys single gem)
  const useHammer = useCallback(
    (position: Position) => {
      if (isProcessingRef.current) return;

      setGameState((prev) => {
        if (prev.boosters.hammer <= 0) return prev;

        const newBoard = prev.board.map((row) => [...row]);
        const matches: Position[] = [position];

        const updatedBoard = removeMatches(newBoard, matches);
        const finalBoard = applyGravity(updatedBoard, prev.level);

        isProcessingRef.current = true;

        // Check for cascades
        setTimeout(() => {
          processMatchesRecursive(finalBoard, prev.level, 1, 10);
        }, 300);

        // Save progress
        saveProgress({
          ...progress,
          hammers: Math.max(0, progress.hammers - 1),
        });

        return {
          ...prev,
          board: finalBoard,
          boosters: { ...prev.boosters, hammer: prev.boosters.hammer - 1 },
        };
      });
    },
    [removeMatches, applyGravity, progress, saveProgress, processMatchesRecursive],
  );

  // Booster: Shuffle (randomizes board)
  const shuffleBoard = useCallback(() => {
    if (isProcessingRef.current) return;

    setGameState((prev) => {
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

  // Reset current level
  const resetLevel = useCallback(() => {
    startLevel(gameState.level);
  }, [gameState.level, startLevel]);

  // Go to next level
  const nextLevel = useCallback(() => {
    const nextLevelNum = gameState.level + 1;
    if (nextLevelNum <= gameState.unlockedLevels) {
      startLevel(nextLevelNum);
    }
  }, [gameState.level, gameState.unlockedLevels, startLevel]);

  // Initialize from saved progress
  useEffect(() => {
    if (!loading && !initializedRef.current) {
      initializedRef.current = true;
      setGameState((prev) => ({
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

  // Save progress when game ends
  const prevIsPlayingRef = useRef(gameState.isPlaying);
  useEffect(() => {
    const wasPlaying = prevIsPlayingRef.current;
    const isNowPlaying = gameState.isPlaying;
    prevIsPlayingRef.current = isNowPlaying;

    if (wasPlaying && !isNowPlaying && gameState.board.length > 0) {
      const hasWon = gameState.score >= gameState.targetScore;

      if (hasWon && gameState.level === gameState.unlockedLevels) {
        const newUnlockedLevels = Math.min(gameState.level + 1, LEVELS.length);
        saveProgress({
          ...progress,
          unlockedLevels: newUnlockedLevels,
          gems: progress.gems + Math.floor(gameState.score / 100),
        });

        setGameState((prev) => ({
          ...prev,
          unlockedLevels: newUnlockedLevels,
          gems: prev.gems + Math.floor(gameState.score / 100),
        }));
      } else if (!hasWon) {
        saveProgress({
          ...progress,
          lives: Math.max(0, progress.lives - 1),
        });

        setGameState((prev) => ({
          ...prev,
          lives: Math.max(0, prev.lives - 1),
        }));
      }
    }
  }, [
    gameState.isPlaying,
    gameState.score,
    gameState.targetScore,
    gameState.level,
    gameState.unlockedLevels,
    gameState.board.length,
    progress,
    saveProgress,
  ]);

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
