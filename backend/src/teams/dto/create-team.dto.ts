// 1. External imports
import { IsInt, IsString, Min } from 'class-validator';

// 2. Internal imports

export class CreateTeamDto {
  @IsString()
  imageUrl: string;

  @IsString()
  name: string;

  @IsString()
  country: string;

  @IsString()
  league: string;

  @IsInt()
  @Min(1800)
  foundedYear: number;

  @IsInt()
  @Min(0)
  matchesPlayed: number;

  @IsInt()
  @Min(0)
  wins: number;

  @IsInt()
  @Min(0)
  draws: number;

  @IsInt()
  @Min(0)
  losses: number;

  @IsInt()
  @Min(0)
  goalsFor: number;

  @IsInt()
  @Min(0)
  goalsAgainst: number;

  @IsInt()
  @Min(0)
  points: number;
}
