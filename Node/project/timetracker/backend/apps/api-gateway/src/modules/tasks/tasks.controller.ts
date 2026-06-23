import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CurrentUser,
  PRODUCTIVITY_SERVICE,
  sendRpc,
  TASK_PATTERNS,
} from '@app/common';
import {
  CreateTaskDto,
  ListTasksQueryDto,
  UpdateTaskDto,
} from './dto/task.dto';

@ApiBearerAuth()
@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(
    @Inject(PRODUCTIVITY_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a task' })
  create(@CurrentUser('id') userId: string, @Body() dto: CreateTaskDto) {
    return sendRpc(this.client.send(TASK_PATTERNS.CREATE, { userId, ...dto }));
  }

  @Get()
  @ApiOperation({ summary: 'List my tasks' })
  list(
    @CurrentUser('id') userId: string,
    @Query() query: ListTasksQueryDto,
  ) {
    return sendRpc(this.client.send(TASK_PATTERNS.LIST, { userId, ...query }));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a task by id' })
  get(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return sendRpc(this.client.send(TASK_PATTERNS.GET, { userId, id }));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  update(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return sendRpc(
      this.client.send(TASK_PATTERNS.UPDATE, { userId, id, ...dto }),
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  remove(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return sendRpc(this.client.send(TASK_PATTERNS.DELETE, { userId, id }));
  }
}
