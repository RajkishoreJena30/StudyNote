import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Task } from '@prisma/client';
import { PrismaService } from '@app/prisma';
import {
  CreateTaskPayload,
  DeleteTaskPayload,
  GetTaskPayload,
  ListTasksPayload,
  UpdateTaskPayload,
} from './tasks.types';

export interface PaginatedTasks {
  data: Task[];
  total: number;
  page: number;
  limit: number;
}

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTaskPayload): Promise<Task> {
    return this.prisma.task.create({
      data: {
        userId: dto.userId,
        title: dto.title.trim(),
        description: dto.description,
        priority: dto.priority,
        status: dto.status,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        estimatedMinutes: dto.estimatedMinutes,
      },
    });
  }

  async list(dto: ListTasksPayload): Promise<PaginatedTasks> {
    const page = Math.max(1, dto.page ?? 1);
    const limit = Math.min(100, Math.max(1, dto.limit ?? 20));
    const where: Prisma.TaskWhereInput = {
      userId: dto.userId,
      ...(dto.status ? { status: dto.status } : {}),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.task.findMany({
        where,
        orderBy: [{ status: 'asc' }, { dueDate: 'asc' }, { createdAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.task.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async get(dto: GetTaskPayload): Promise<Task> {
    return this.findOwnedOrThrow(dto.userId, dto.id);
  }

  async update(dto: UpdateTaskPayload): Promise<Task> {
    await this.findOwnedOrThrow(dto.userId, dto.id);

    const data: Prisma.TaskUpdateInput = {};
    if (dto.title !== undefined) data.title = dto.title.trim();
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.priority !== undefined) data.priority = dto.priority;
    if (dto.status !== undefined) data.status = dto.status;
    if (dto.estimatedMinutes !== undefined)
      data.estimatedMinutes = dto.estimatedMinutes;
    if (dto.dueDate !== undefined)
      data.dueDate = dto.dueDate ? new Date(dto.dueDate) : null;

    return this.prisma.task.update({ where: { id: dto.id }, data });
  }

  async remove(dto: DeleteTaskPayload): Promise<{ success: boolean }> {
    await this.findOwnedOrThrow(dto.userId, dto.id);
    await this.prisma.task.delete({ where: { id: dto.id } });
    return { success: true };
  }

  private async findOwnedOrThrow(
    userId: string,
    id: string,
  ): Promise<Task> {
    const task = await this.prisma.task.findFirst({
      where: { id, userId },
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }
}
