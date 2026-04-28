// 1. External imports
import { IsInt, IsString, Min } from 'class-validator';

// 2. Internal imports

export class CreatePlayerDto {
  @IsString()
  imageUrl: string;

  @IsString()
  fullName: string;

  @IsString()
  position: string;

  @IsString()
  nationality: string;

  @IsInt()
  @Min(0)
  shirtNumber: number;

  @IsInt()
  @Min(0)
  matchesPlayed: number;

  @IsInt()
  @Min(0)
  goals: number;

  @IsInt()
  @Min(0)
  assists: number;

  @IsInt()
  @Min(0)
  shots: number;

  @IsInt()
  @Min(0)
  passes: number;

  @IsInt()
  @Min(0)
  yellowCards: number;

  @IsInt()
  @Min(0)
  redCards: number;

  @IsInt()
  @Min(0)
  minutesPlayed: number;

  @IsInt()
  @Min(1)
  teamId: number;
}
