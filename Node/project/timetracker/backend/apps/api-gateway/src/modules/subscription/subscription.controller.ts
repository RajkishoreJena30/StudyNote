import { Body, Controller, Delete, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CurrentUser,
  Public,
  sendRpc,
  SUBSCRIPTION_PATTERNS,
  SUBSCRIPTION_SERVICE,
} from '@app/common';
import { SubscribeDto } from './dto/subscription.dto';

@ApiTags('subscriptions')
@Controller('subscriptions')
export class SubscriptionController {
  constructor(
    @Inject(SUBSCRIPTION_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Public()
  @Get('plans')
  @ApiOperation({ summary: 'List available subscription plans' })
  listPlans() {
    return sendRpc(this.client.send(SUBSCRIPTION_PATTERNS.LIST_PLANS, {}));
  }

  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Subscribe to a plan' })
  subscribe(
    @CurrentUser('id') userId: string,
    @Body() dto: SubscribeDto,
  ) {
    return sendRpc(
      this.client.send(SUBSCRIPTION_PATTERNS.SUBSCRIBE, {
        userId,
        planId: dto.planId,
      }),
    );
  }

  @ApiBearerAuth()
  @Get('me')
  @ApiOperation({ summary: 'Get my current subscription' })
  getMine(@CurrentUser('id') userId: string) {
    return sendRpc(
      this.client.send(SUBSCRIPTION_PATTERNS.GET_MY_SUBSCRIPTION, { userId }),
    );
  }

  @ApiBearerAuth()
  @Delete()
  @ApiOperation({ summary: 'Cancel my subscription at period end' })
  cancel(@CurrentUser('id') userId: string) {
    return sendRpc(this.client.send(SUBSCRIPTION_PATTERNS.CANCEL, { userId }));
  }
}
