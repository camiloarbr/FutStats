// 1. External imports
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

// 2. Internal imports

export class UpdateTeamDto {
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  league?: string;

  @IsOptional()
  @IsInt()
  @Min(1800)
  foundedYear?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  matchesPlayed?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  wins?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  draws?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  losses?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  goalsFor?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  goalsAgainst?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  points?: number;
}
