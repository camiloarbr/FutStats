// 1. External imports
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

// 2. Internal imports
import { CreatePlayerDto } from './dto/create-player.dto';
import { PlayerEntity } from './entities/player.entity';
import { TeamsService } from '../teams/teams.service';
import { UpdatePlayerDto } from './dto/update-player.dto';

@Injectable()
export class PlayersService {
  constructor(
    @InjectRepository(PlayerEntity)
    private readonly playersRepository: Repository<PlayerEntity>,
    private readonly teamsService: TeamsService,
  ) {}

  findAll(): Promise<PlayerEntity[]> {
    return this.playersRepository.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<PlayerEntity> {
    const player = await this.playersRepository.findOne({ where: { id } });

    if (!player) {
      throw new NotFoundException(`Player with id ${id} was not found.`);
    }

    return player;
  }

  async create(createPlayerDto: CreatePlayerDto): Promise<PlayerEntity> {
    await this.teamsService.findOne(createPlayerDto.teamId);
    const player = this.playersRepository.create(createPlayerDto);
    return this.playersRepository.save(player);
  }

  async update(id: number, updatePlayerDto: UpdatePlayerDto): Promise<PlayerEntity> {
    const player = await this.findOne(id);

    if (updatePlayerDto.teamId !== undefined) {
      await this.teamsService.findOne(updatePlayerDto.teamId);
    }

    const updatedPlayer = this.playersRepository.merge(player, updatePlayerDto);
    return this.playersRepository.save(updatedPlayer);
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    const player = await this.findOne(id);
    await this.playersRepository.remove(player);
    return { deleted: true };
  }
}
