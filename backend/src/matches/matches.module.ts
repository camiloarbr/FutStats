// 1. External imports
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// 2. Internal imports
import { AuthModule } from '../auth/auth.module';
import { MatchEntity } from './entities/match.entity';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import { TeamsModule } from '../teams/teams.module';

@Module({
  imports: [AuthModule, TeamsModule, TypeOrmModule.forFeature([MatchEntity])],
  controllers: [MatchesController],
  providers: [MatchesService],
  exports: [TypeOrmModule, MatchesService],
})
export class MatchesModule {}
