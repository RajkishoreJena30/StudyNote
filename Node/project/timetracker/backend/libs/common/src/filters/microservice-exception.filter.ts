import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  RpcExceptionFilter,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

export interface SerializedRpcError {
  status: number;
  message: string | string[];
}

/**
 * Global filter for TCP microservices. Normalises any thrown error into a
 * serializable `{ status, message }` shape so the gateway can rebuild an
 * HttpException with the correct status code.
 */
@Catch()
export class MicroserviceExceptionFilter
  implements RpcExceptionFilter<unknown>
{
  catch(
    exception: unknown,
    _host: ArgumentsHost,
  ): Observable<SerializedRpcError> {
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message =
        typeof res === 'string'
          ? res
          : ((res as { message?: string | string[] }).message ??
            exception.message);
    } else if (exception instanceof RpcException) {
      const err = exception.getError() as Partial<SerializedRpcError>;
      status = err.status ?? status;
      message = err.message ?? message;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    return throwError(() => ({ status, message }));
  }
}
