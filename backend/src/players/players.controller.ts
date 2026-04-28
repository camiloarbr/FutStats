// 1. External imports
import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';

// 2. Internal imports
import { CreatePlayerDto } from './dto/create-player.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PlayerEntity } from './entities/player.entity';
import { PlayersService } from './players.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UpdatePlayerDto } from './dto/update-player.dto';

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  findAll(): Promise<PlayerEntity[]> {
    return this.playersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<PlayerEntity> {
    return this.playersService.findOne(Number(id));
  }

  @Post()
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() createPlayerDto: CreatePlayerDto): Promise<PlayerEntity> {
    return this.playersService.create(createPlayerDto);
  }

  @Patch(':id')
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(@Param('id') id: string, @Body() updatePlayerDto: UpdatePlayerDto): Promise<PlayerEntity> {
    return this.playersService.update(Number(id), updatePlayerDto);
  }

  @Delete(':id')
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id') id: string): Promise<{ deleted: boolean }> {
    return this.playersService.remove(Number(id));
  }
}
