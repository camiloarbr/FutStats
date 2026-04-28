import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { UserEntity } from '../users/entities/user.entity';

export async function seedAdmin(dataSource: DataSource): Promise<void> {
  const userRepo = dataSource.getRepository(UserEntity);

  const existing = await userRepo.findOne({
    where: { email: 'admin@futstats.com' },
  });

  if (!existing) {
    const hashed = await bcrypt.hash('admin123', 10);
    const admin = userRepo.create({
      username: 'Admin',
      email: 'admin@futstats.com',
      passwordHash: hashed,
      role: 'admin',
      isActive: true,
    });

    await userRepo.save(admin);
    console.log('Admin user seeded.');
    return;
  }

  console.log('Admin user already exists, skipping seed.');
}