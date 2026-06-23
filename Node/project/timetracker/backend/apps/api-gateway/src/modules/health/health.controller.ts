import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '@app/common';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Public()
  @Get()
  @ApiOperation({ summary: 'Liveness probe for the load balancer' })
  check() {
    return { status: 'ok', service: 'api-gateway', timestamp: new Date().toISOString() };
  }
}
