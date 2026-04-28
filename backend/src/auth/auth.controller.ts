// 1. External imports
import { Body, Controller, Post } from '@nestjs/common';

// 2. Internal imports
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import type { AuthResponseInterface } from './interfaces/auth-response.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto): Promise<AuthResponseInterface> {
    return this.authService.login(loginDto);
  }
}
