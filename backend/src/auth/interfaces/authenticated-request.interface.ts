// 1. External imports
import type { Request } from 'express';

// 2. Internal imports
import type { JwtPayloadInterface } from './jwt-payload.interface';

export interface AuthenticatedRequestInterface extends Request {
  user?: JwtPayloadInterface;
}
