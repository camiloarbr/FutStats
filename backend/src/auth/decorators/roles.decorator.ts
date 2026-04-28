// 1. External imports
import { SetMetadata } from '@nestjs/common';

// 2. Internal imports
import type { UserRole } from '../../users/entities/user.entity';

export const ROLES_KEY = 'roles';

export function Roles(...roles: UserRole[]): ReturnType<typeof SetMetadata> {
  return SetMetadata(ROLES_KEY, roles);
}
