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
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CurrentUser,
  GOAL_PATTERNS,
  PRODUCTIVITY_SERVICE,
  sendRpc,
} from '@app/common';
import { CreateGoalDto, LogProgressDto, UpdateGoalDto } from './dto/goal.dto';

@ApiBearerAuth()
@ApiTags('goals')
@Controller('goals')
export class GoalsController {
  constructor(
    @Inject(PRODUCTIVITY_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a goal' })
  create(@CurrentUser('id') userId: string, @Body() dto: CreateGoalDto) {
    return sendRpc(this.client.send(GOAL_PATTERNS.CREATE, { userId, ...dto }));
  }

  @Get()
  @ApiOperation({ summary: 'List my goals' })
  list(@CurrentUser('id') userId: string) {
    return sendRpc(this.client.send(GOAL_PATTERNS.LIST, { userId }));
  }

  @Get('consistency')
  @ApiOperation({ summary: 'Consistency & focus report (last 30 days)' })
  consistency(@CurrentUser('id') userId: string) {
    return sendRpc(this.client.send(GOAL_PATTERNS.CONSISTENCY, { userId }));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a goal by id' })
  get(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return sendRpc(this.client.send(GOAL_PATTERNS.GET, { userId, id }));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a goal' })
  update(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateGoalDto,
  ) {
    return sendRpc(
      this.client.send(GOAL_PATTERNS.UPDATE, { userId, id, ...dto }),
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a goal' })
  remove(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return sendRpc(this.client.send(GOAL_PATTERNS.DELETE, { userId, id }));
  }

  @Post(':id/progress')
  @ApiOperation({ summary: 'Log focused minutes toward a goal' })
  logProgress(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: LogProgressDto,
  ) {
    return sendRpc(
      this.client.send(GOAL_PATTERNS.LOG_PROGRESS, {
        userId,
        goalId: id,
        ...dto,
      }),
    );
  }
}
