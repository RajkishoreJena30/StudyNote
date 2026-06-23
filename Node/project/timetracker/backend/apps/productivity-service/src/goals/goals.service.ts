import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Goal, GoalProgress, Prisma } from '@prisma/client';
import { Cache } from 'cache-manager';
import { PrismaService } from '@app/prisma';
import {
  ConsistencyPayload,
  ConsistencyReport,
  CreateGoalPayload,
  DeleteGoalPayload,
  GetGoalPayload,
  ListGoalsPayload,
  LogProgressPayload,
  UpdateGoalPayload,
} from './goals.types';

const DAY_MS = 24 * 60 * 60 * 1000;

@Injectable()
export class GoalsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async create(dto: CreateGoalPayload): Promise<Goal> {
    const goal = await this.prisma.goal.create({
      data: {
        userId: dto.userId,
        title: dto.title.trim(),
        type: dto.type,
        targetMinutes: dto.targetMinutes,
      },
    });
    await this.invalidate(dto.userId);
    return goal;
  }

  async list(dto: ListGoalsPayload): Promise<Goal[]> {
    return this.prisma.goal.findMany({
      where: { userId: dto.userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async get(dto: GetGoalPayload): Promise<Goal> {
    return this.findOwnedOrThrow(dto.userId, dto.id);
  }

  async update(dto: UpdateGoalPayload): Promise<Goal> {
    await this.findOwnedOrThrow(dto.userId, dto.id);

    const data: Prisma.GoalUpdateInput = {};
    if (dto.title !== undefined) data.title = dto.title.trim();
    if (dto.targetMinutes !== undefined) data.targetMinutes = dto.targetMinutes;
    if (dto.isActive !== undefined) data.isActive = dto.isActive;

    const goal = await this.prisma.goal.update({
      where: { id: dto.id },
      data,
    });
    await this.invalidate(dto.userId);
    return goal;
  }

  async remove(dto: DeleteGoalPayload): Promise<{ success: boolean }> {
    await this.findOwnedOrThrow(dto.userId, dto.id);
    await this.prisma.goal.delete({ where: { id: dto.id } });
    await this.invalidate(dto.userId);
    return { success: true };
  }

  async logProgress(dto: LogProgressPayload): Promise<{
    goal: Goal;
    progress: GoalProgress;
  }> {
    const goal = await this.findOwnedOrThrow(dto.userId, dto.goalId);
    const day = this.toUtcDate(dto.date);

    const existing = await this.prisma.goalProgress.findUnique({
      where: { goalId_date: { goalId: goal.id, date: day } },
    });

    const achievedMinutes = (existing?.achievedMinutes ?? 0) + dto.minutes;
    const completed = achievedMinutes >= goal.targetMinutes;
    const newlyCompleted = completed && !(existing?.completed ?? false);

    const progress = await this.prisma.goalProgress.upsert({
      where: { goalId_date: { goalId: goal.id, date: day } },
      update: { achievedMinutes, completed },
      create: {
        goalId: goal.id,
        date: day,
        achievedMinutes,
        completed,
      },
    });

    let updatedGoal = goal;
    if (newlyCompleted) {
      const { currentStreak, longestStreak, lastCompletedDate } =
        this.computeStreak(goal, day);
      updatedGoal = await this.prisma.goal.update({
        where: { id: goal.id },
        data: { currentStreak, longestStreak, lastCompletedDate },
      });
    }

    await this.invalidate(dto.userId);
    return { goal: updatedGoal, progress };
  }

  async consistency(dto: ConsistencyPayload): Promise<ConsistencyReport> {
    const cacheKey = `consistency:${dto.userId}`;
    const cached = await this.cache.get<ConsistencyReport>(cacheKey);
    if (cached) {
      return cached;
    }

    const since = this.toUtcDate(
      new Date(Date.now() - 29 * DAY_MS).toISOString(),
    );

    const goals = await this.prisma.goal.findMany({
      where: { userId: dto.userId },
      include: {
        progress: { where: { date: { gte: since } } },
      },
    });

    const activeDays = new Set<string>();
    let totalMinutes = 0;
    let longestCurrentStreak = 0;

    const perGoal = goals.map((goal) => {
      let completedDays = 0;
      for (const p of goal.progress) {
        totalMinutes += p.achievedMinutes;
        if (p.achievedMinutes > 0) {
          activeDays.add(p.date.toISOString().slice(0, 10));
        }
        if (p.completed) {
          completedDays += 1;
        }
      }
      longestCurrentStreak = Math.max(longestCurrentStreak, goal.currentStreak);
      return {
        goalId: goal.id,
        title: goal.title,
        currentStreak: goal.currentStreak,
        longestStreak: goal.longestStreak,
        completionRate: Math.round((completedDays / 30) * 100) / 100,
      };
    });

    const report: ConsistencyReport = {
      activeGoals: goals.filter((g) => g.isActive).length,
      longestCurrentStreak,
      totalMinutesLast30Days: totalMinutes,
      daysActiveLast30Days: activeDays.size,
      consistencyScore: Math.round((activeDays.size / 30) * 100),
      dailyActivity: await this.buildDailyActivity(dto.userId),
      perGoal,
    };

    await this.cache.set(cacheKey, report);
    return report;
  }

  // Builds a GitHub-style activity heatmap: focus minutes per day for the last
  // 12 weeks (84 days), including days with no activity so the grid is complete.
  private async buildDailyActivity(
    userId: string,
  ): Promise<{ date: string; minutes: number }[]> {
    const HEATMAP_DAYS = 84;
    const since = this.toUtcDate(
      new Date(Date.now() - (HEATMAP_DAYS - 1) * DAY_MS).toISOString(),
    );

    const entries = await this.prisma.timeEntry.findMany({
      where: {
        userId,
        endTime: { not: null },
        startTime: { gte: since },
      },
      select: { startTime: true, durationSeconds: true },
    });

    const minutesByDay = new Map<string, number>();
    for (const entry of entries) {
      const key = entry.startTime.toISOString().slice(0, 10);
      const minutes = Math.round(entry.durationSeconds / 60);
      minutesByDay.set(key, (minutesByDay.get(key) ?? 0) + minutes);
    }

    const series: { date: string; minutes: number }[] = [];
    for (let i = HEATMAP_DAYS - 1; i >= 0; i -= 1) {
      const key = this.toUtcDate(new Date(Date.now() - i * DAY_MS).toISOString())
        .toISOString()
        .slice(0, 10);
      series.push({ date: key, minutes: minutesByDay.get(key) ?? 0 });
    }
    return series;
  }

  private computeStreak(
    goal: Goal,
    day: Date,
  ): { currentStreak: number; longestStreak: number; lastCompletedDate: Date } {
    let currentStreak: number;

    if (!goal.lastCompletedDate) {
      currentStreak = 1;
    } else {
      const diffDays = Math.round(
        (day.getTime() - this.toUtcDate(goal.lastCompletedDate.toISOString()).getTime()) /
          DAY_MS,
      );
      if (diffDays === 1) {
        currentStreak = goal.currentStreak + 1;
      } else if (diffDays === 0) {
        currentStreak = goal.currentStreak;
      } else if (diffDays > 1) {
        currentStreak = 1;
      } else {
        currentStreak = goal.currentStreak;
      }
    }

    const lastCompletedDate =
      !goal.lastCompletedDate || day > goal.lastCompletedDate
        ? day
        : goal.lastCompletedDate;

    return {
      currentStreak,
      longestStreak: Math.max(goal.longestStreak, currentStreak),
      lastCompletedDate,
    };
  }

  private toUtcDate(input?: string | Date): Date {
    const d = input ? new Date(input) : new Date();
    return new Date(
      Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()),
    );
  }

  private async invalidate(userId: string): Promise<void> {
    await this.cache.del(`consistency:${userId}`);
  }

  private async findOwnedOrThrow(userId: string, id: string): Promise<Goal> {
    const goal = await this.prisma.goal.findFirst({
      where: { id, userId },
    });
    if (!goal) {
      throw new NotFoundException('Goal not found');
    }
    return goal;
  }
}
