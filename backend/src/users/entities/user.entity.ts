// 1. External imports
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

// 2. Internal imports

export type UserRole = 'admin' | 'user';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', length: 80 })
  username: string;

  @Column({ type: 'text', length: 120, unique: true })
  email: string;

  @Column({ type: 'text' })
  passwordHash: string;

  @Column({ type: 'text', default: 'user', length: 20 })
  role: UserRole;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}
