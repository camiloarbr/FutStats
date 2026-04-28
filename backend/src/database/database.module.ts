// 1. External imports
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// 2. Internal imports
import { DatabaseBootstrapService } from './database-bootstrap.service';
import { MatchEntity } from '../matches/entities/match.entity';
import { PlayerEntity } from '../players/entities/player.entity';
import { TeamEntity } from '../teams/entities/team.entity';
import { UserEntity } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MatchEntity, PlayerEntity, TeamEntity, UserEntity])],
  providers: [DatabaseBootstrapService],
})
export class DatabaseModule {}
