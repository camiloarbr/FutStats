// 1. External imports
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

// 2. Internal imports
import { TeamEntity } from '../../teams/entities/team.entity';

@Entity('players')
export class PlayerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  imageUrl: string;

  @Column({ type: 'text', length: 120 })
  fullName: string;

  @Column({ type: 'text', length: 60 })
  position: string;

  @Column({ type: 'text', length: 80 })
  nationality: string;

  @Column({ type: 'integer' })
  shirtNumber: number;

  @Column({ type: 'integer' })
  matchesPlayed: number;

  @Column({ type: 'integer' })
  goals: number;

  @Column({ type: 'integer' })
  assists: number;

  @Column({ type: 'integer' })
  shots: number;

  @Column({ type: 'integer' })
  passes: number;

  @Column({ type: 'integer' })
  yellowCards: number;

  @Column({ type: 'integer' })
  redCards: number;

  @Column({ type: 'integer' })
  minutesPlayed: number;

  @Column({ type: 'integer' })
  teamId: number;

  @ManyToOne(() => TeamEntity, (team) => team.players, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'teamId' })
  team: TeamEntity;
}
