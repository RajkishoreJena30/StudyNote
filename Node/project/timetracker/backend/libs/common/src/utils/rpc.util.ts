import { HttpException, HttpStatus } from '@nestjs/common';
import { catchError, firstValueFrom, Observable, throwError } from 'rxjs';
import { SerializedRpcError } from '../filters';

/**
 * Awaits a microservice response, converting any serialized RPC error back
 * into a proper `HttpException` so the gateway's HTTP filter handles it.
 */
export function sendRpc<T>(observable: Observable<T>): Promise<T> {
  return firstValueFrom(
    observable.pipe(
      catchError((error: Partial<SerializedRpcError>) => {
        const status = error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error?.message ?? 'Internal server error';
        return throwError(() => new HttpException(message, status));
      }),
    ),
  );
}
