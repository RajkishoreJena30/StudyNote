import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { NOTIFICATION_PATTERNS } from '@app/common';
import { NotificationService } from './notification.service';
import {
  CreateNotificationPayload,
  ListNotificationsPayload,
} from './notification.types';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @MessagePattern(NOTIFICATION_PATTERNS.LIST)
  list(@Payload() payload: ListNotificationsPayload) {
    return this.notificationService.list(payload);
  }

  @MessagePattern(NOTIFICATION_PATTERNS.CREATE)
  create(@Payload() payload: CreateNotificationPayload) {
    return this.notificationService.create(payload);
  }
}