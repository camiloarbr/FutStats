// 1. External imports
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

// 2. Internal imports

export type UserRole = 'admin' | 'user';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 80 })
  username: string;

  @Column({ length: 120, unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ default: 'user', length: 20 })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: true })
  isActive: boolean;
}
