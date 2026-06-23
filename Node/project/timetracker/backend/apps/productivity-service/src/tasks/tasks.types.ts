import { Priority, TaskStatus } from '@prisma/client';

export interface CreateTaskPayload {
  userId: string;
  title: string;
  description?: string;
  priority?: Priority;
  status?: TaskStatus;
  dueDate?: string;
  estimatedMinutes?: number;
}

export interface ListTasksPayload {
  userId: string;
  status?: TaskStatus;
  page?: number;
  limit?: number;
}

export interface GetTaskPayload {
  userId: string;
  id: string;
}

export interface UpdateTaskPayload {
  userId: string;
  id: string;
  title?: string;
  description?: string;
  priority?: Priority;
  status?: TaskStatus;
  dueDate?: string | null;
  estimatedMinutes?: number | null;
}

export interface DeleteTaskPayload {
  userId: string;
  id: string;
}
