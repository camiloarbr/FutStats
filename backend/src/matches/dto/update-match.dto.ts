// 1. External imports
import { IsDateString, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

// 2. Internal imports

export class UpdateMatchDto {
  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  stadium?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  homeScore?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  awayScore?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  possessionHome?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  possessionAway?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  shotsHome?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  shotsAway?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  foulsHome?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  foulsAway?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  homeTeamId?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  awayTeamId?: number;
}
