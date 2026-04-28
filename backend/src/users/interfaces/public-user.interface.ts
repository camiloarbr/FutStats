// 1. External imports

// 2. Internal imports
import type { UserRole } from '../entities/user.entity';

export interface PublicUserInterface {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  isActive: boolean;
}
