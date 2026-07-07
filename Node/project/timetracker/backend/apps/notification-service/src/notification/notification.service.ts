import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import {
  CreateNotificationPayload,
  ListNotificationsPayload,
} from './notification.types';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  async list({ userId }: ListNotificationsPayload) {
    // Replace with real Prisma queries once you add a model (see Step 6).
    return { userId, notifications: [] };
  }

  async create(payload: CreateNotificationPayload) {
    return { ...payload, id: 'stub', createdAt: new Date().toISOString() };
  }
}