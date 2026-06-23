export type UserRole = 'USER' | 'ADMIN';

/**
 * Decoded JWT access-token payload.
 */
export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}

/**
 * The authenticated principal attached to the request by the JWT guard and
 * forwarded to downstream microservices.
 */
export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
}
