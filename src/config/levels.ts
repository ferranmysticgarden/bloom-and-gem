import { LevelConfig } from '@/types/game';

export const LEVELS: LevelConfig[] = [
  { level: 1, gridSize: 6, moves: 20, targetScore: 500, gemTypes: 4, specialChance: 0 },
  { level: 2, gridSize: 6, moves: 20, targetScore: 800, gemTypes: 4, specialChance: 0.02 },
  { level: 3, gridSize: 6, moves: 18, targetScore: 1000, gemTypes: 5, specialChance: 0.03 },
  { level: 4, gridSize: 7, moves: 20, targetScore: 1500, gemTypes: 5, specialChance: 0.04 },
  { level: 5, gridSize: 7, moves: 18, targetScore: 2000, gemTypes: 5, specialChance: 0.05 },
  { level: 6, gridSize: 7, moves: 16, targetScore: 2500, gemTypes: 6, specialChance: 0.05 },
  { level: 7, gridSize: 8, moves: 20, targetScore: 3000, gemTypes: 6, specialChance: 0.06 },
  { level: 8, gridSize: 8, moves: 18, targetScore: 3500, gemTypes: 6, specialChance: 0.07 },
  { level: 9, gridSize: 8, moves: 16, targetScore: 4000, gemTypes: 7, specialChance: 0.08 },
  { level: 10, gridSize: 8, moves: 15, targetScore: 5000, gemTypes: 7, specialChance: 0.1 },
  // More levels can be added
  ...Array.from({ length: 90 }, (_, i) => ({
    level: i + 11,
    gridSize: Math.min(8, 6 + Math.floor((i + 11) / 20)),
    moves: Math.max(10, 20 - Math.floor((i + 11) / 10)),
    targetScore: 5000 + (i + 1) * 500,
    gemTypes: 7,
    specialChance: Math.min(0.15, 0.1 + (i + 1) * 0.005),
  })),
];

export const GEM_TYPES = ['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'cyan'] as const;

export const GEM_EMOJIS: Record<string, string> = {
  red: '🌹',
  blue: '💎',
  green: '🍀',
  yellow: '⭐',
  purple: '🔮',
  pink: '🌸',
  cyan: '❄️',
};

export const SPECIAL_EMOJIS: Record<string, string> = {
  bomb: '💣',
  lightning: '⚡',
  rainbow: '🌈',
};

export const BOOSTER_COSTS = {
  bomb: 50,
  hammer: 30,
  shuffle: 20,
  rainbow: 100,
};

export const DAILY_REWARDS = [
  { day: 1, gems: 10, boosters: { bomb: 1 } },
  { day: 2, gems: 20, boosters: { hammer: 2 } },
  { day: 3, gems: 30, boosters: { shuffle: 2 } },
  { day: 4, gems: 50, boosters: { bomb: 2, hammer: 1 } },
  { day: 5, gems: 75, boosters: { rainbow: 1 } },
  { day: 6, gems: 100, boosters: { bomb: 3, hammer: 3 } },
  { day: 7, gems: 200, boosters: { rainbow: 2, bomb: 3, hammer: 3, shuffle: 3 } },
];
