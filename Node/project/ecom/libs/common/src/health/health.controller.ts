import { Controller, Get } from '@nestjs/common';

/**
 * Lightweight liveness/readiness endpoint. Each service mounts this so the
 * load balancer + docker healthchecks + Kubernetes probes have a target.
 */
@Controller('health')
export class HealthController {
  @Get()
  check(): { status: string; uptime: number; timestamp: string } {
    return {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }
}
