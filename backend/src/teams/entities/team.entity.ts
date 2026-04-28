// 1. External imports
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

// 2. Internal imports
import { MatchEntity } from '../../matches/entities/match.entity';
import { PlayerEntity } from '../../players/entities/player.entity';

@Entity('teams')
export class TeamEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  imageUrl: string;

  @Column({ length: 80 })
  name: string;

  @Column({ length: 80 })
  country: string;

  @Column({ length: 80 })
  league: string;

  @Column()
  foundedYear: number;

  @Column()
  matchesPlayed: number;

  @Column()
  wins: number;

  @Column()
  draws: number;

  @Column()
  losses: number;

  @Column()
  goalsFor: number;

  @Column()
  goalsAgainst: number;

  @Column()
  points: number;

  @OneToMany(() => PlayerEntity, (player) => player.team)
  players: PlayerEntity[];

  @OneToMany(() => MatchEntity, (match) => match.homeTeam)
  homeMatches: MatchEntity[];

  @OneToMany(() => MatchEntity, (match) => match.awayTeam)
  awayMatches: MatchEntity[];
}
