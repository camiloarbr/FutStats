// 1. External imports

// 2. Internal imports
import type { UserRole } from '../../users/entities/user.entity';

export interface JwtPayloadInterface {
  sub: number;
  email: string;
  role: UserRole;
}
