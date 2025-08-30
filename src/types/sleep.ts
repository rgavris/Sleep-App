export interface SleepSession {
  id: string;
  startTime: Date;
  endTime: Date;
  duration: number; // in minutes
  quality: SleepQuality;
  deepSleep: number; // in minutes
  lightSleep: number; // in minutes
  remSleep: number; // in minutes
  awakeTime: number; // in minutes
  heartRate: number[];
  notes: string;
  tags: string[];
}

export interface SleepEntry {
  id: string;
  date: string;
  bedtime: string;
  wakeTime: string;
  duration: number; // in hours
  quality: SleepQuality;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum SleepQuality {
  POOR = 'poor',
  FAIR = 'fair',
  GOOD = 'good',
  EXCELLENT = 'excellent'
}

export interface SleepGoal {
  id: string;
  targetDuration: number; // in hours
  targetBedtime: string;
  targetWakeTime: string;
  qualityTarget: SleepQuality;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SleepAnalytics {
  averageDuration: number;
  averageQuality: SleepQuality;
  totalSleepHours: number;
  sleepEfficiency: number; // percentage
  consistencyScore: number; // 0-100
  weeklyTrend: SleepTrend[];
}

export interface SleepTrend {
  date: string;
  duration: number;
  quality: SleepQuality;
}

export interface SleepStats {
  totalEntries: number;
  currentStreak: number;
  longestStreak: number;
  averageBedtime: string;
  averageWakeTime: string;
}
