import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GOAL_PATTERNS } from '@app/common';
import { GoalsService } from './goals.service';
import {
  ConsistencyPayload,
  CreateGoalPayload,
  DeleteGoalPayload,
  GetGoalPayload,
  ListGoalsPayload,
  LogProgressPayload,
  UpdateGoalPayload,
} from './goals.types';

@Controller()
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @MessagePattern(GOAL_PATTERNS.CREATE)
  create(@Payload() payload: CreateGoalPayload) {
    return this.goalsService.create(payload);
  }

  @MessagePattern(GOAL_PATTERNS.LIST)
  list(@Payload() payload: ListGoalsPayload) {
    return this.goalsService.list(payload);
  }

  @MessagePattern(GOAL_PATTERNS.GET)
  get(@Payload() payload: GetGoalPayload) {
    return this.goalsService.get(payload);
  }

  @MessagePattern(GOAL_PATTERNS.UPDATE)
  update(@Payload() payload: UpdateGoalPayload) {
    return this.goalsService.update(payload);
  }

  @MessagePattern(GOAL_PATTERNS.DELETE)
  remove(@Payload() payload: DeleteGoalPayload) {
    return this.goalsService.remove(payload);
  }

  @MessagePattern(GOAL_PATTERNS.LOG_PROGRESS)
  logProgress(@Payload() payload: LogProgressPayload) {
    return this.goalsService.logProgress(payload);
  }

  @MessagePattern(GOAL_PATTERNS.CONSISTENCY)
  consistency(@Payload() payload: ConsistencyPayload) {
    return this.goalsService.consistency(payload);
  }
}
