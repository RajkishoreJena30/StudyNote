import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TIME_PATTERNS } from '@app/common';
import { TimeTrackingService } from './time-tracking.service';
import {
  ActiveTimerPayload,
  CreateTimeEntryPayload,
  DeleteTimeEntryPayload,
  ListTimeEntriesPayload,
  StartTimerPayload,
  StopTimerPayload,
  SummaryPayload,
} from './time-tracking.types';

@Controller()
export class TimeTrackingController {
  constructor(private readonly timeService: TimeTrackingService) {}

  @MessagePattern(TIME_PATTERNS.START)
  start(@Payload() payload: StartTimerPayload) {
    return this.timeService.start(payload);
  }

  @MessagePattern(TIME_PATTERNS.STOP)
  stop(@Payload() payload: StopTimerPayload) {
    return this.timeService.stop(payload);
  }

  @MessagePattern(TIME_PATTERNS.CREATE)
  create(@Payload() payload: CreateTimeEntryPayload) {
    return this.timeService.create(payload);
  }

  @MessagePattern(TIME_PATTERNS.LIST)
  list(@Payload() payload: ListTimeEntriesPayload) {
    return this.timeService.list(payload);
  }

  @MessagePattern(TIME_PATTERNS.ACTIVE)
  active(@Payload() payload: ActiveTimerPayload) {
    return this.timeService.active(payload);
  }

  @MessagePattern(TIME_PATTERNS.SUMMARY)
  summary(@Payload() payload: SummaryPayload) {
    return this.timeService.summary(payload);
  }

  @MessagePattern(TIME_PATTERNS.DELETE)
  remove(@Payload() payload: DeleteTimeEntryPayload) {
    return this.timeService.remove(payload);
  }
}
