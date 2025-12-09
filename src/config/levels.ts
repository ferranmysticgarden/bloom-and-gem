import { LevelConfig } from '@/types/game';

// TODOS los niveles son 8x8
export const LEVELS: LevelConfig[] = [
  // NIVELES 1-5: Fáciles - para que puedas disfrutar sin quedarte sin movimientos
  { level: 1, gridSize: 8, moves: 35, targetScore: 300, gemTypes: 5, specialChance: 0.05 },
  { level: 2, gridSize: 8, moves: 33, targetScore: 400, gemTypes: 5, specialChance: 0.05 },
  { level: 3, gridSize: 8, moves: 32, targetScore: 500, gemTypes: 5, specialChance: 0.06 },
  { level: 4, gridSize: 8, moves: 30, targetScore: 600, gemTypes: 6, specialChance: 0.06 },
  { level: 5, gridSize: 8, moves: 28, targetScore: 800, gemTypes: 6, specialChance: 0.07 },
  // NIVELES 6-10: Dificultad media - empiezas a notar el reto
  { level: 6, gridSize: 8, moves: 26, targetScore: 1000, gemTypes: 6, specialChance: 0.07 },
  { level: 7, gridSize: 8, moves: 24, targetScore: 1200, gemTypes: 6, specialChance: 0.08 },
  { level: 8, gridSize: 8, moves: 22, targetScore: 1500, gemTypes: 6, specialChance: 0.08 },
  { level: 9, gridSize: 8, moves: 20, targetScore: 1800, gemTypes: 6, specialChance: 0.09 },
  { level: 10, gridSize: 8, moves: 18, targetScore: 2000, gemTypes: 6, specialChance: 0.10 },
  // NIVELES 11+: Dificultad alta - aquí necesitas estrategia y boosters
  ...Array.from({ length: 90 }, (_, i) => ({
    level: i + 11,
    gridSize: 8,
    moves: Math.max(12, 18 - Math.floor((i) / 10)),
    targetScore: 2000 + (i + 1) * 400,
    gemTypes: 6,
    specialChance: Math.min(0.15, 0.10 + (i + 1) * 0.003),
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