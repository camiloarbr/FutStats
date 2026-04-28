// 1. External imports
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

// 2. Internal imports
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import type { AuthResponseInterface } from './interfaces/auth-response.interface';
import type { JwtPayloadInterface } from './interfaces/jwt-payload.interface';
import type { UserEntity } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject(JwtService) private readonly jwtService: JwtService,
    @Inject(UsersService) private readonly usersService: UsersService,
  ) {}

  async login(loginDto: LoginDto): Promise<AuthResponseInterface> {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const passwordMatches = await bcrypt.compare(loginDto.password, user.passwordHash);

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    return this.buildAuthResponse(user);
  }

  async register(registerDto: RegisterDto): Promise<AuthResponseInterface> {
    const user = await this.usersService.create(
      registerDto.username,
      registerDto.email,
      registerDto.password,
    );

    return this.buildAuthResponse(user);
  }

  private async buildAuthResponse(user: UserEntity): Promise<AuthResponseInterface> {
    const payload: JwtPayloadInterface = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '1d'),
    });

    return {
      accessToken,
      user: this.usersService.toPublicUser(user),
    };
  }
}
