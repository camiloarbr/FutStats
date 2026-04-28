// 1. External imports
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

// 2. Internal imports

export class UpdatePlayerDto {
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsString()
  nationality?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  shirtNumber?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  matchesPlayed?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  goals?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  assists?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  shots?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  passes?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  yellowCards?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  redCards?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  minutesPlayed?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  teamId?: number;
}
