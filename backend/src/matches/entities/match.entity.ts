// 1. External imports
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

// 2. Internal imports
import { TeamEntity } from '../../teams/entities/team.entity';

@Entity('matches')
export class MatchEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'datetime' })
  date: Date;

  @Column({ type: 'text', length: 120 })
  stadium: string;

  @Column({ type: 'integer' })
  homeScore: number;

  @Column({ type: 'integer' })
  awayScore: number;

  @Column({ type: 'integer' })
  possessionHome: number;

  @Column({ type: 'integer' })
  possessionAway: number;

  @Column({ type: 'integer' })
  shotsHome: number;

  @Column({ type: 'integer' })
  shotsAway: number;

  @Column({ type: 'integer' })
  foulsHome: number;

  @Column({ type: 'integer' })
  foulsAway: number;

  @Column({ type: 'integer' })
  homeTeamId: number;

  @ManyToOne(() => TeamEntity, (team) => team.homeMatches, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'homeTeamId' })
  homeTeam: TeamEntity;

  @Column({ type: 'integer' })
  awayTeamId: number;

  @ManyToOne(() => TeamEntity, (team) => team.awayMatches, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'awayTeamId' })
  awayTeam: TeamEntity;
}
