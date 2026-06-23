export type UserRole = 'USER' | 'ADMIN';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'ARCHIVED';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';
export type GoalType = 'DAILY' | 'WEEKLY';
export type BillingInterval = 'MONTH' | 'YEAR';
export type SubscriptionStatus = 'TRIALING' | 'ACTIVE' | 'CANCELED' | 'PAST_DUE';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

export interface AuthResult {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: Priority;
  dueDate?: string | null;
  estimatedMinutes?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface TimeEntry {
  id: string;
  taskId?: string | null;
  description?: string | null;
  startTime: string;
  endTime?: string | null;
  durationSeconds: number;
  isRunning: boolean;
}

export interface TimeSummary {
  totalSeconds: number;
  totalMinutes: number;
  entryCount: number;
  daily: { date: string; seconds: number }[];
}

export interface Goal {
  id: string;
  title: string;
  type: GoalType;
  targetMinutes: number;
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate?: string | null;
  isActive: boolean;
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

export interface Plan {
  id: string;
  code: string;
  name: string;
  description: string;
  priceCents: number;
  interval: BillingInterval;
  features: string[];
}

export interface Subscription {
  id: string;
  planId: string;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  plan?: Plan;
}
