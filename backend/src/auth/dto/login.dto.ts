// 1. External imports
import { IsEmail, IsString, MinLength } from 'class-validator';

// 2. Internal imports

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
