// ... resto del archivo igual ...

const swapGems = useCallback((pos1: Position, pos2: Position) => {
  // ✅ CORRECCIÓN: Eliminar la condición 'gameState.moves <= 0'
  if (isProcessingRef.current || !gameState.isPlaying) return;
  
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
      moves: prev.moves - 1, // ← Aquí SÍ se resta, pero solo si hay match
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

// ... resto igual ...
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
