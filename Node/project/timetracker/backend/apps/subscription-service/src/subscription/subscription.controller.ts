import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SUBSCRIPTION_PATTERNS } from '@app/common';
import { SubscriptionService } from './subscription.service';
import {
  CancelPayload,
  GetMySubscriptionPayload,
  SubscribePayload,
} from './subscription.types';

@Controller()
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @MessagePattern(SUBSCRIPTION_PATTERNS.LIST_PLANS)
  listPlans() {
    return this.subscriptionService.listPlans();
  }

  @MessagePattern(SUBSCRIPTION_PATTERNS.SUBSCRIBE)
  subscribe(@Payload() payload: SubscribePayload) {
    return this.subscriptionService.subscribe(payload);
  }

  @MessagePattern(SUBSCRIPTION_PATTERNS.GET_MY_SUBSCRIPTION)
  getMine(@Payload() payload: GetMySubscriptionPayload) {
    return this.subscriptionService.getMine(payload);
  }

  @MessagePattern(SUBSCRIPTION_PATTERNS.CANCEL)
  cancel(@Payload() payload: CancelPayload) {
    return this.subscriptionService.cancel(payload);
  }
}
