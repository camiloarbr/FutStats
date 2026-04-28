// 1. External imports
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

// 2. Internal imports
import { TeamEntity } from '../../teams/entities/team.entity';

@Entity('players')
export class PlayerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  imageUrl: string;

  @Column({ length: 120 })
  fullName: string;

  @Column({ length: 60 })
  position: string;

  @Column({ length: 80 })
  nationality: string;

  @Column()
  shirtNumber: number;

  @Column()
  matchesPlayed: number;

  @Column()
  goals: number;

  @Column()
  assists: number;

  @Column()
  shots: number;

  @Column()
  passes: number;

  @Column()
  yellowCards: number;

  @Column()
  redCards: number;

  @Column()
  minutesPlayed: number;

  @Column()
  teamId: number;

  @ManyToOne(() => TeamEntity, (team) => team.players, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'teamId' })
  team: TeamEntity;
}
