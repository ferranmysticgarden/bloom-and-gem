import { LevelConfig } from '@/types/game';

// TODOS los niveles son 8x8
export const LEVELS: LevelConfig[] = [
  { level: 1, gridSize: 8, moves: 25, targetScore: 500, gemTypes: 6, specialChance: 0 },
  { level: 2, gridSize: 8, moves: 24, targetScore: 800, gemTypes: 6, specialChance: 0.02 },
  { level: 3, gridSize: 8, moves: 23, targetScore: 1000, gemTypes: 6, specialChance: 0.03 },
  { level: 4, gridSize: 8, moves: 22, targetScore: 1500, gemTypes: 6, specialChance: 0.04 },
  { level: 5, gridSize: 8, moves: 21, targetScore: 2000, gemTypes: 6, specialChance: 0.05 },
  { level: 6, gridSize: 8, moves: 20, targetScore: 2500, gemTypes: 6, specialChance: 0.05 },
  { level: 7, gridSize: 8, moves: 19, targetScore: 3000, gemTypes: 6, specialChance: 0.06 },
  { level: 8, gridSize: 8, moves: 18, targetScore: 3500, gemTypes: 6, specialChance: 0.07 },
  { level: 9, gridSize: 8, moves: 17, targetScore: 4000, gemTypes: 6, specialChance: 0.08 },
  { level: 10, gridSize: 8, moves: 16, targetScore: 5000, gemTypes: 6, specialChance: 0.1 },
  // Más niveles - todos 8x8
  ...Array.from({ length: 90 }, (_, i) => ({
    level: i + 11,
    gridSize: 8,
    moves: Math.max(12, 16 - Math.floor((i) / 15)),
    targetScore: 5000 + (i + 1) * 500,
    gemTypes: 6,
    specialChance: Math.min(0.15, 0.1 + (i + 1) * 0.005),
  })),
];

// 6 tipos de flores - ICONOS IDÉNTICOS A LA IMAGEN DE REFERENCIA
export const GEM_TYPES = ['leaf', 'cherry', 'tulip', 'sunflower', 'hibiscus', 'daisy'] as const;

export const GEM_EMOJIS: Record<string, string> = {
  leaf: '🌿',
  cherry: '🌸',
  tulip: '🌷',
  sunflower: '🌻',
  hibiscus: '🌺',
  daisy: '🌼',
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