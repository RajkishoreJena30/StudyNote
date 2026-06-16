import { HttpException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

type ServiceName = 'user' | 'booking' | 'payment' | 'search';

/**
 * Tiny resilient HTTP client used by the gateway to talk to microservices.
 * Includes a timeout + a naive retry to demonstrate fault tolerance at the
 * edge. In production, swap for an HTTP client with a circuit breaker
 * (e.g. opossum) — documented in the LLD.
 */
@Injectable()
export class HttpClientService {
  private readonly logger = new Logger(HttpClientService.name);

  constructor(private readonly config: ConfigService) {}

  private baseUrl(service: ServiceName): string {
    return this.config.get<string>(`services.${service}`)!;
  }

  async request<T>(
    service: ServiceName,
    path: string,
    init: RequestInit & { idempotencyKey?: string } = {},
    retries = 2,
  ): Promise<T> {
    const url = `${this.baseUrl(service)}${path}`;
    const headers: Record<string, string> = {
      'content-type': 'application/json',
      ...(init.headers as Record<string, string>),
    };
    if (init.idempotencyKey) headers['Idempotency-Key'] = init.idempotencyKey;

    for (let attempt = 0; attempt <= retries; attempt++) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5_000);
      try {
        const res = await fetch(url, { ...init, headers, signal: controller.signal });
        clearTimeout(timeout);
        const body = (await res.json().catch(() => ({}))) as T & { error?: unknown };
        if (!res.ok) {
          throw new HttpException(body?.error ?? 'Upstream error', res.status);
        }
        return body;
      } catch (err) {
        clearTimeout(timeout);
        if (err instanceof HttpException && err.getStatus() < 500) throw err;
        if (attempt === retries) {
          this.logger.error(`${service}${path} failed after ${retries} retries`);
          throw new HttpException('Service unavailable', 503);
        }
        await new Promise((r) => setTimeout(r, 200 * (attempt + 1)));
      }
    }
    throw new HttpException('Service unavailable', 503);
  }
}
