// 1. External imports
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

// 2. Internal imports
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [JwtModule.register({}), UsersModule],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard, RolesGuard],
  exports: [AuthService, JwtAuthGuard, JwtModule, RolesGuard],
})
export class AuthModule {}
