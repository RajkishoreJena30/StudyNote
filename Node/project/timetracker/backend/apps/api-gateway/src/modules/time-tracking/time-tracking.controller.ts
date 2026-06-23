import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CurrentUser,
  PRODUCTIVITY_SERVICE,
  sendRpc,
  TIME_PATTERNS,
} from '@app/common';
import {
  CreateTimeEntryDto,
  ListTimeEntriesQueryDto,
  StartTimerDto,
  StopTimerDto,
  SummaryQueryDto,
} from './dto/time-tracking.dto';

@ApiBearerAuth()
@ApiTags('time-tracking')
@Controller('time-entries')
export class TimeTrackingController {
  constructor(
    @Inject(PRODUCTIVITY_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Post('start')
  @ApiOperation({ summary: 'Start a timer (stops any running one)' })
  start(@CurrentUser('id') userId: string, @Body() dto: StartTimerDto) {
    return sendRpc(this.client.send(TIME_PATTERNS.START, { userId, ...dto }));
  }

  @Post('stop')
  @ApiOperation({ summary: 'Stop the running timer' })
  stop(@CurrentUser('id') userId: string, @Body() dto: StopTimerDto) {
    return sendRpc(this.client.send(TIME_PATTERNS.STOP, { userId, ...dto }));
  }

  @Get('active')
  @ApiOperation({ summary: 'Get the currently running timer' })
  active(@CurrentUser('id') userId: string) {
    return sendRpc(this.client.send(TIME_PATTERNS.ACTIVE, { userId }));
  }

  @Get('summary')
  @ApiOperation({ summary: 'Aggregated time summary (default last 7 days)' })
  summary(
    @CurrentUser('id') userId: string,
    @Query() query: SummaryQueryDto,
  ) {
    return sendRpc(
      this.client.send(TIME_PATTERNS.SUMMARY, { userId, ...query }),
    );
  }

  @Post()
  @ApiOperation({ summary: 'Create a manual time entry' })
  create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateTimeEntryDto,
  ) {
    return sendRpc(this.client.send(TIME_PATTERNS.CREATE, { userId, ...dto }));
  }

  @Get()
  @ApiOperation({ summary: 'List my time entries' })
  list(
    @CurrentUser('id') userId: string,
    @Query() query: ListTimeEntriesQueryDto,
  ) {
    return sendRpc(this.client.send(TIME_PATTERNS.LIST, { userId, ...query }));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a time entry' })
  remove(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return sendRpc(this.client.send(TIME_PATTERNS.DELETE, { userId, id }));
  }
}
