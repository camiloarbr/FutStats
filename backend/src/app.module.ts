// 1. External imports
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// 2. Internal imports
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { MatchEntity } from './matches/entities/match.entity';
import { MatchesModule } from './matches/matches.module';
import { PlayerEntity } from './players/entities/player.entity';
import { PlayersModule } from './players/players.module';
import { TeamEntity } from './teams/entities/team.entity';
import { TeamsModule } from './teams/teams.module';
import { UserEntity } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'sqlite',
        database: configService.get<string>('DATABASE_PATH', 'futstats.sqlite'),
        entities: [MatchEntity, PlayerEntity, TeamEntity, UserEntity],
        synchronize: configService.get<string>('TYPEORM_SYNCHRONIZE', 'true') === 'true',
      }),
    }),
    AuthModule,
    DatabaseModule,
    MatchesModule,
    PlayersModule,
    TeamsModule,
    UsersModule,
  ],
})
export class AppModule {}
