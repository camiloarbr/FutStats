// 1. External imports
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// 2. Internal imports
import { AuthModule } from '../auth/auth.module';
import { TeamEntity } from './entities/team.entity';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([TeamEntity])],
  controllers: [TeamsController],
  providers: [TeamsService],
  exports: [TypeOrmModule, TeamsService],
})
export class TeamsModule {}
