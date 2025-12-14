export type GemType = 'leaf' | 'cherry' | 'tulip' | 'sunflower' | 'hibiscus' | 'daisy';

export type SpecialGemType = 'bomb' | 'lightning' | 'rainbow' | null;

export interface Gem {
  id: string;
  type: GemType;
  special: SpecialGemType;
  row: number;
  col: number;
  isMatched: boolean;
  isNew: boolean;
  isFalling: boolean;
}

export interface Position {
  row: number;
  col: number;
}

export interface GameState {
  board: (Gem | null)[][];
  score: number;
  moves: number;
  targetScore: number;
  level: number;
  isPlaying: boolean;
  selectedGem: Position | null;
  combo: number;
  lives: number;
  maxLives: number;
  gems: number;
  boosters: {
    bomb: number;
    hammer: number;
    shuffle: number;
    rainbow: number;
  };
  dailyRewardClaimed: boolean;
  lastDailyReward: string | null;
  unlockedLevels: number;
  totalScore: number;
  streak: number;
}

export interface LevelConfig {
  level: number;
  gridSize: number;
  moves: number;
  targetScore: number;
  gemTypes: number;
  specialChance: number;
  obstacles?: number;
}

export interface MatchResult {
  gems: Position[];
  isSpecial: boolean;
  specialType?: SpecialGemType;
}
