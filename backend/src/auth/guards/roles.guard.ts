// 1. External imports
import {
  CanActivate,
  ExecutionContext,
  Inject,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

// 2. Internal imports
import { ROLES_KEY } from '../decorators/roles.decorator';
import type { AuthenticatedRequestInterface } from '../interfaces/authenticated-request.interface';
import type { UserRole } from '../../users/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(@Inject(Reflector) private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequestInterface>();
    const currentRole = request.user?.role;

    if (!currentRole || !requiredRoles.includes(currentRole)) {
      throw new ForbiddenException('You do not have permission to perform this action.');
    }

    return true;
  }
}
