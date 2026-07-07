import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CurrentUser,
  NOTIFICATION_PATTERNS,
  NOTIFICATION_SERVICE,
  sendRpc,
} from '@app/common';
import { CreateNotificationDto } from './dto/notification.dto';

@ApiTags('notifications')
@ApiBearerAuth()
@Controller('notifications')
export class NotificationController {
  constructor(
    @Inject(NOTIFICATION_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List my notifications' })
  list(@CurrentUser('id') userId: string) {
    return sendRpc(this.client.send(NOTIFICATION_PATTERNS.LIST, { userId }));
  }

  @Post()
  @ApiOperation({ summary: 'Create a notification' })
  create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateNotificationDto,
  ) {
    return sendRpc(
      this.client.send(NOTIFICATION_PATTERNS.CREATE, { userId, ...dto }),
    );
  }
}