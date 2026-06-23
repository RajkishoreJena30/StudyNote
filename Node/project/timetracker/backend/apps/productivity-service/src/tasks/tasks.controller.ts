import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TASK_PATTERNS } from '@app/common';
import { TasksService } from './tasks.service';
import {
  CreateTaskPayload,
  DeleteTaskPayload,
  GetTaskPayload,
  ListTasksPayload,
  UpdateTaskPayload,
} from './tasks.types';

@Controller()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @MessagePattern(TASK_PATTERNS.CREATE)
  create(@Payload() payload: CreateTaskPayload) {
    return this.tasksService.create(payload);
  }

  @MessagePattern(TASK_PATTERNS.LIST)
  list(@Payload() payload: ListTasksPayload) {
    return this.tasksService.list(payload);
  }

  @MessagePattern(TASK_PATTERNS.GET)
  get(@Payload() payload: GetTaskPayload) {
    return this.tasksService.get(payload);
  }

  @MessagePattern(TASK_PATTERNS.UPDATE)
  update(@Payload() payload: UpdateTaskPayload) {
    return this.tasksService.update(payload);
  }

  @MessagePattern(TASK_PATTERNS.DELETE)
  remove(@Payload() payload: DeleteTaskPayload) {
    return this.tasksService.remove(payload);
  }
}
