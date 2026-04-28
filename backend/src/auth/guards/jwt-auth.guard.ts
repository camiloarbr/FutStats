// 1. External imports
import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

// 2. Internal imports
import type { AuthenticatedRequestInterface } from '../interfaces/authenticated-request.interface';
import type { JwtPayloadInterface } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject(JwtService) private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequestInterface>();
    const token = this.extractBearerToken(request.headers.authorization);

    if (!token) {
      throw new UnauthorizedException('Missing authorization token.');
    }

    try {
      request.user = await this.jwtService.verifyAsync<JwtPayloadInterface>(token, {
        secret: this.configService.getOrThrow<string>('JWT_SECRET'),
      });
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired authorization token.');
    }
  }

  private extractBearerToken(authorizationHeader: string | undefined): string | null {
    if (!authorizationHeader) {
      return null;
    }

    const [type, token] = authorizationHeader.split(' ');
    return type === 'Bearer' && token ? token : null;
  }
}
