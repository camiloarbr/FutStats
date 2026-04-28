// 1. External imports
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

// 2. Internal imports
import { CreateTeamDto } from './dto/create-team.dto';
import { TeamEntity } from './entities/team.entity';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(TeamEntity)
    private readonly teamsRepository: Repository<TeamEntity>,
  ) {}

  findAll(): Promise<TeamEntity[]> {
    return this.teamsRepository.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<TeamEntity> {
    const team = await this.teamsRepository.findOne({ where: { id } });

    if (!team) {
      throw new NotFoundException(`Team with id ${id} was not found.`);
    }

    return team;
  }

  async create(createTeamDto: CreateTeamDto): Promise<TeamEntity> {
    const team = this.teamsRepository.create(createTeamDto);
    return this.teamsRepository.save(team);
  }

  async update(id: number, updateTeamDto: UpdateTeamDto): Promise<TeamEntity> {
    const team = await this.findOne(id);
    const updatedTeam = this.teamsRepository.merge(team, updateTeamDto);
    return this.teamsRepository.save(updatedTeam);
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    const team = await this.findOne(id);
    await this.teamsRepository.remove(team);
    return { deleted: true };
  }
}
