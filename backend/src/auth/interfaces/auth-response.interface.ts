// 1. External imports

// 2. Internal imports
import type { PublicUserInterface } from '../../users/interfaces/public-user.interface';

export interface AuthResponseInterface {
  accessToken: string;
  user: PublicUserInterface;
}
