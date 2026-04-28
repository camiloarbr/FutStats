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

  @Column({ length: 120 })
  stadium: string;

  @Column()
  homeScore: number;

  @Column()
  awayScore: number;

  @Column()
  possessionHome: number;

  @Column()
  possessionAway: number;

  @Column()
  shotsHome: number;

  @Column()
  shotsAway: number;

  @Column()
  foulsHome: number;

  @Column()
  foulsAway: number;

  @Column()
  homeTeamId: number;

  @ManyToOne(() => TeamEntity, (team) => team.homeMatches, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'homeTeamId' })
  homeTeam: TeamEntity;

  @Column()
  awayTeamId: number;

  @ManyToOne(() => TeamEntity, (team) => team.awayMatches, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'awayTeamId' })
  awayTeam: TeamEntity;
}
