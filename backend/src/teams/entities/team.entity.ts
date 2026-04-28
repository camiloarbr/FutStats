// 1. External imports
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

// 2. Internal imports
import { MatchEntity } from '../../matches/entities/match.entity';
import { PlayerEntity } from '../../players/entities/player.entity';

@Entity('teams')
export class TeamEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  imageUrl: string;

  @Column({ type: 'text', length: 80 })
  name: string;

  @Column({ type: 'text', length: 80 })
  country: string;

  @Column({ type: 'text', length: 80 })
  league: string;

  @Column({ type: 'integer' })
  foundedYear: number;

  @Column({ type: 'integer' })
  matchesPlayed: number;

  @Column({ type: 'integer' })
  wins: number;

  @Column({ type: 'integer' })
  draws: number;

  @Column({ type: 'integer' })
  losses: number;

  @Column({ type: 'integer' })
  goalsFor: number;

  @Column({ type: 'integer' })
  goalsAgainst: number;

  @Column({ type: 'integer' })
  points: number;

  @OneToMany(() => PlayerEntity, (player) => player.team)
  players: PlayerEntity[];

  @OneToMany(() => MatchEntity, (match) => match.homeTeam)
  homeMatches: MatchEntity[];

  @OneToMany(() => MatchEntity, (match) => match.awayTeam)
  awayMatches: MatchEntity[];
}
