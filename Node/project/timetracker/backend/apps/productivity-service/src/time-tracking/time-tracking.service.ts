import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, TimeEntry } from '@prisma/client';
import { PrismaService } from '@app/prisma';
import {
  ActiveTimerPayload,
  CreateTimeEntryPayload,
  DeleteTimeEntryPayload,
  ListTimeEntriesPayload,
  StartTimerPayload,
  StopTimerPayload,
  SummaryPayload,
  TimeSummary,
} from './time-tracking.types';

export interface PaginatedEntries {
  data: TimeEntry[];
  total: number;
  page: number;
  limit: number;
}

@Injectable()
export class TimeTrackingService {
  constructor(private readonly prisma: PrismaService) {}

  async start(dto: StartTimerPayload): Promise<TimeEntry> {
    if (dto.taskId) {
      await this.assertTaskOwnership(dto.userId, dto.taskId);
    }

    // Only one running timer per user — stop any existing one first.
    await this.stopAllRunning(dto.userId);

    return this.prisma.timeEntry.create({
      data: {
        userId: dto.userId,
        taskId: dto.taskId,
        description: dto.description,
        startTime: new Date(),
        isRunning: true,
      },
    });
  }

  async stop(dto: StopTimerPayload): Promise<TimeEntry> {
    const entry = dto.id
      ? await this.prisma.timeEntry.findFirst({
          where: { id: dto.id, userId: dto.userId },
        })
      : await this.prisma.timeEntry.findFirst({
          where: { userId: dto.userId, isRunning: true },
          orderBy: { startTime: 'desc' },
        });

    if (!entry) {
      throw new NotFoundException('No running timer found');
    }
    if (!entry.isRunning) {
      throw new BadRequestException('Timer is already stopped');
    }

    const endTime = new Date();
    const durationSeconds = Math.max(
      0,
      Math.round((endTime.getTime() - entry.startTime.getTime()) / 1000),
    );

    return this.prisma.timeEntry.update({
      where: { id: entry.id },
      data: { endTime, durationSeconds, isRunning: false },
    });
  }

  async create(dto: CreateTimeEntryPayload): Promise<TimeEntry> {
    if (dto.taskId) {
      await this.assertTaskOwnership(dto.userId, dto.taskId);
    }

    const startTime = new Date(dto.startTime);
    const endTime = new Date(dto.endTime);
    if (endTime <= startTime) {
      throw new BadRequestException('endTime must be after startTime');
    }

    const durationSeconds = Math.round(
      (endTime.getTime() - startTime.getTime()) / 1000,
    );

    return this.prisma.timeEntry.create({
      data: {
        userId: dto.userId,
        taskId: dto.taskId,
        description: dto.description,
        startTime,
        endTime,
        durationSeconds,
        isRunning: false,
      },
    });
  }

  async list(dto: ListTimeEntriesPayload): Promise<PaginatedEntries> {
    const page = Math.max(1, dto.page ?? 1);
    const limit = Math.min(100, Math.max(1, dto.limit ?? 20));
    const where: Prisma.TimeEntryWhereInput = {
      userId: dto.userId,
      ...(dto.taskId ? { taskId: dto.taskId } : {}),
      ...(dto.from || dto.to
        ? {
            startTime: {
              ...(dto.from ? { gte: new Date(dto.from) } : {}),
              ...(dto.to ? { lte: new Date(dto.to) } : {}),
            },
          }
        : {}),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.timeEntry.findMany({
        where,
        orderBy: { startTime: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.timeEntry.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async active(dto: ActiveTimerPayload): Promise<TimeEntry | null> {
    return this.prisma.timeEntry.findFirst({
      where: { userId: dto.userId, isRunning: true },
      orderBy: { startTime: 'desc' },
    });
  }

  async summary(dto: SummaryPayload): Promise<TimeSummary> {
    const from = dto.from
      ? new Date(dto.from)
      : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const to = dto.to ? new Date(dto.to) : new Date();

    const entries = await this.prisma.timeEntry.findMany({
      where: {
        userId: dto.userId,
        isRunning: false,
        startTime: { gte: from, lte: to },
      },
      select: { startTime: true, durationSeconds: true },
    });

    const dailyMap = new Map<string, number>();
    let totalSeconds = 0;
    for (const entry of entries) {
      totalSeconds += entry.durationSeconds;
      const day = entry.startTime.toISOString().slice(0, 10);
      dailyMap.set(day, (dailyMap.get(day) ?? 0) + entry.durationSeconds);
    }

    const daily = Array.from(dailyMap.entries())
      .map(([date, seconds]) => ({ date, seconds }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      totalSeconds,
      totalMinutes: Math.round(totalSeconds / 60),
      entryCount: entries.length,
      daily,
    };
  }

  async remove(dto: DeleteTimeEntryPayload): Promise<{ success: boolean }> {
    const entry = await this.prisma.timeEntry.findFirst({
      where: { id: dto.id, userId: dto.userId },
    });
    if (!entry) {
      throw new NotFoundException('Time entry not found');
    }
    await this.prisma.timeEntry.delete({ where: { id: dto.id } });
    return { success: true };
  }

  private async stopAllRunning(userId: string): Promise<void> {
    const running = await this.prisma.timeEntry.findMany({
      where: { userId, isRunning: true },
    });
    const now = Date.now();
    await this.prisma.$transaction(
      running.map((entry) =>
        this.prisma.timeEntry.update({
          where: { id: entry.id },
          data: {
            endTime: new Date(),
            isRunning: false,
            durationSeconds: Math.max(
              0,
              Math.round((now - entry.startTime.getTime()) / 1000),
            ),
          },
        }),
      ),
    );
  }

  private async assertTaskOwnership(
    userId: string,
    taskId: string,
  ): Promise<void> {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId, userId },
      select: { id: true },
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
  }
}
