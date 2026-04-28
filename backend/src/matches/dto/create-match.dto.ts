// 1. External imports
import { IsDateString, IsInt, IsString, Max, Min } from 'class-validator';

// 2. Internal imports

export class CreateMatchDto {
  @IsDateString()
  date: string;

  @IsString()
  stadium: string;

  @IsInt()
  @Min(0)
  homeScore: number;

  @IsInt()
  @Min(0)
  awayScore: number;

  @IsInt()
  @Min(0)
  @Max(100)
  possessionHome: number;

  @IsInt()
  @Min(0)
  @Max(100)
  possessionAway: number;

  @IsInt()
  @Min(0)
  shotsHome: number;

  @IsInt()
  @Min(0)
  shotsAway: number;

  @IsInt()
  @Min(0)
  foulsHome: number;

  @IsInt()
  @Min(0)
  foulsAway: number;

  @IsInt()
  @Min(1)
  homeTeamId: number;

  @IsInt()
  @Min(1)
  awayTeamId: number;
}
