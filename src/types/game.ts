/**
 * Game Types and Interfaces for "Koki Matematika: Warung Pecahan & Desimal"
 * Designed for SD Kelas 5-6 / Fase C Kurikulum Merdeka
 */

export type ProblemType = 'pecahan' | 'desimal' | 'persen' | 'campuran';
export type StationType = 'pizza' | 'jus' | 'diskon' | 'sate' | 'timbangan' | 'bakso';

export interface CustomerCharacter {
  id: string;
  name: string;
  role: string;
  avatarKey: 'budi' | 'siti' | 'pak_joko' | 'bu_rt' | 'mochi_cat' | 'rina';
  dialogueGreet: string;
  dialogueHappy: string;
  dialogueDisappointed: string;
}

export interface FractionTarget {
  numerator: number;
  denominator: number;
}

export interface PercentTarget {
  originalPrice: number;
  discountPercent: number;
  finalPrice: number;
  gridCellsNeeded?: number; // e.g. 25 for 25%
}

export interface OrderTicket {
  id: string;
  customer: CustomerCharacter;
  problemType: ProblemType;
  stationType: StationType;
  recipeName: string;
  recipeDescription: string;
  // Specific targets
  targetFraction?: FractionTarget;
  targetDecimal?: number; // e.g. 0.75
  targetPercent?: PercentTarget;
  // Visual hints and math narrative
  orderPrompt: string; // e.g., "Tolong siapkan 3/4 loyang Martabak Manis!"
  explanationNote: string; // Educational explanation displayed on evaluation
  timeLimitSec: number;
  rewardCoins: number;
  rewardStars: number;
}

export interface LevelDefinition {
  id: string;
  title: string;
  subtitle: string;
  gradeTarget: 'Kelas 5' | 'Kelas 6' | 'Fase C Umum';
  problemType: ProblemType;
  stationType: StationType;
  description: string;
  learningGoal: string; // Capaian Pembelajaran
  orders: OrderTicket[];
  isCustom?: boolean;
}

export interface SessionHistoryItem {
  id: string;
  timestamp: number;
  levelTitle: string;
  gradeTarget: string;
  score: number;
  totalOrders: number;
  correctOrders: number;
  accuracy: number; // percentage
  timeSpentSec: number;
  notes: string[];
}

export interface ShopItem {
  id: string;
  name: string;
  category: 'apron' | 'hat' | 'decor' | 'recipe';
  description: string;
  cost: number;
  unlocked: boolean;
  iconSvg: string;
}

export interface PlayerStats {
  stars: number;
  coins: number;
  keys: number;
  completedLevels: string[];
  activeApron: string;
  activeHat: string;
  unlockedItemIds: string[];
  history: SessionHistoryItem[];
}

export type TimerMode = 'normal' | 'relaxed' | 'untimed';

export interface TeacherConfig {
  pin: string;
  timerMode: TimerMode;
  allowHints: boolean;
  customLevels: LevelDefinition[];
}
