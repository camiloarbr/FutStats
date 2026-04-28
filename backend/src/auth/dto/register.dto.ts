// 1. External imports
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

// 2. Internal imports

export class RegisterDto {
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
