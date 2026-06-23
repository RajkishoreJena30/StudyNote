import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../interfaces';

export const ROLES_KEY = 'roles';

/**
 * Restricts a route to the given roles. Enforced by `RolesGuard`.
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
