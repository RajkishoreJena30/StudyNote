import {
  CallHandler,
  ConflictException,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, from, of } from 'rxjs';
import { switchMap, tap, catchError } from 'rxjs/operators';
import { Request } from 'express';
import { IdempotencyService } from './idempotency.service';

export const IDEMPOTENT_SCOPE = 'idempotent_scope';

/**
 * Apply with @UseInterceptors(IdempotencyInterceptor) + @SetMetadata.
 * Reads the `Idempotency-Key` header and short-circuits replays.
 */
@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  constructor(
    private readonly idempotency: IdempotencyService,
    private readonly reflector: Reflector,
  ) {}

  intercept(ctx: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = ctx.switchToHttp().getRequest<Request>();
    const key = req.header('Idempotency-Key');
    const scope =
      this.reflector.get<string>(IDEMPOTENT_SCOPE, ctx.getHandler()) ?? 'http';

    // No key -> not an idempotent request; pass through.
    if (!key) return next.handle();

    return from(this.idempotency.claim(scope, key)).pipe(
      switchMap((claimed) => {
        if (!claimed) {
          return from(this.idempotency.get(scope, key)).pipe(
            switchMap((record) => {
              if (record?.status === 'COMPLETED') return of(record.response);
              // Still in progress -> tell client to retry later.
              throw new ConflictException('Request already in progress');
            }),
          );
        }
        return next.handle().pipe(
          tap((response) => this.idempotency.complete(scope, key, response)),
          catchError((err) => {
            // free the claim so a genuine retry can succeed
            void this.idempotency.release(scope, key);
            throw err;
          }),
        );
      }),
    );
  }
}
