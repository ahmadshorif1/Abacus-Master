export type Language = 'bn' | 'en';

export interface RodData {
  id: number;
  upper: boolean; // true = pushed down to beam (worth 5)
  lowerCount: number; // 0..4 = beads pushed up to beam (each worth 1)
}

export type ThemeType = 'rainbow' | 'classic' | 'modern';

export interface UserStats {
  solvedCount: number;
  correctCount: number;
  streak: number;
  bestStreak: number;
  xp: number;
  level: number;
  completedLessons: string[];
  lastActive: string;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  isAnonymous: boolean;
  stats: UserStats;
}

export type PracticeTab = 'free' | 'read' | 'set' | 'anzan' | 'challenge';

export interface LessonStep {
  id: string;
  title: string;
  instructionBn: string;
  instructionEn: string;
  targetNumber?: number;
  explanationBn: string;
  explanationEn: string;
  formula?: string;
  initialRods?: number[]; // digits array from right to left or left to right
}

export interface Lesson {
  id: string;
  category: 'basics' | 'small_friend' | 'big_friend' | 'mixed' | 'anzan';
  titleBn: string;
  titleEn: string;
  descBn: string;
  descEn: string;
  icon: string;
  steps: LessonStep[];
}

export interface AdConfiguration {
  adsterraEnabled: boolean;
  monetagEnabled: boolean;
  adsterraNativeBannerKey: string;
  adsterraSocialBarKey: string;
  monetagZoneId: string;
  monetagInPagePushKey: string;
  testMode: boolean;
}
