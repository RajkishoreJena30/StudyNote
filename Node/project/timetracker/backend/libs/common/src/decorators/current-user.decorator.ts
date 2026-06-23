import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthenticatedUser } from '../interfaces';

/**
 * Extracts the authenticated user (set by `JwtAuthGuard`) from the request.
 * Optionally returns a single property: `@CurrentUser('id')`.
 */
export const CurrentUser = createParamDecorator(
  (
    data: keyof AuthenticatedUser | undefined,
    ctx: ExecutionContext,
  ): AuthenticatedUser | string => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user as AuthenticatedUser | undefined;

    if (!user) {
      throw new InternalServerErrorException(
        'CurrentUser used on an unauthenticated route',
      );
    }

    return data ? user[data] : user;
  },
);
