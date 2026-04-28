// 1. External imports
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// 2. Internal imports
import { AuthModule } from '../auth/auth.module';
import { PlayerEntity } from './entities/player.entity';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';
import { TeamsModule } from '../teams/teams.module';

@Module({
  imports: [AuthModule, TeamsModule, TypeOrmModule.forFeature([PlayerEntity])],
  controllers: [PlayersController],
  providers: [PlayersService],
  exports: [TypeOrmModule, PlayersService],
})
export class PlayersModule {}
