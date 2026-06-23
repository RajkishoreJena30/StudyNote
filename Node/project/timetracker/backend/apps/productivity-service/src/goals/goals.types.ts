import { GoalType } from '@prisma/client';

export interface CreateGoalPayload {
  userId: string;
  title: string;
  type?: GoalType;
  targetMinutes: number;
}

export interface ListGoalsPayload {
  userId: string;
}

export interface GetGoalPayload {
  userId: string;
  id: string;
}

export interface UpdateGoalPayload {
  userId: string;
  id: string;
  title?: string;
  targetMinutes?: number;
  isActive?: boolean;
}

export interface DeleteGoalPayload {
  userId: string;
  id: string;
}

export interface LogProgressPayload {
  userId: string;
  goalId: string;
  minutes: number;
  date?: string;
}

export interface ConsistencyPayload {
  userId: string;
}

export interface ConsistencyReport {
  activeGoals: number;
  longestCurrentStreak: number;
  totalMinutesLast30Days: number;
  daysActiveLast30Days: number;
  consistencyScore: number;
  dailyActivity: { date: string; minutes: number }[];
  perGoal: {
    goalId: string;
    title: string;
    currentStreak: number;
    longestStreak: number;
    completionRate: number;
  }[];
}
