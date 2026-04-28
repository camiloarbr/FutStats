// 1. External imports
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

// 2. Internal imports
import { CreateMatchDto } from './dto/create-match.dto';
import { MatchEntity } from './entities/match.entity';
import { TeamsService } from '../teams/teams.service';
import { UpdateMatchDto } from './dto/update-match.dto';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(MatchEntity)
    private readonly matchesRepository: Repository<MatchEntity>,
    private readonly teamsService: TeamsService,
  ) {}

  findAll(): Promise<MatchEntity[]> {
    return this.matchesRepository.find({ order: { date: 'ASC', id: 'ASC' } });
  }

  async findOne(id: number): Promise<MatchEntity> {
    const match = await this.matchesRepository.findOne({ where: { id } });

    if (!match) {
      throw new NotFoundException(`Match with id ${id} was not found.`);
    }

    return match;
  }

  async create(createMatchDto: CreateMatchDto): Promise<MatchEntity> {
    await this.validateTeams(createMatchDto.homeTeamId, createMatchDto.awayTeamId);
    const match = this.matchesRepository.create({
      ...createMatchDto,
      date: new Date(createMatchDto.date),
    });
    return this.matchesRepository.save(match);
  }

  async update(id: number, updateMatchDto: UpdateMatchDto): Promise<MatchEntity> {
    const match = await this.findOne(id);
    const homeTeamId = updateMatchDto.homeTeamId ?? match.homeTeamId;
    const awayTeamId = updateMatchDto.awayTeamId ?? match.awayTeamId;

    await this.validateTeams(homeTeamId, awayTeamId);

    const updatedMatch = this.matchesRepository.merge(match, {
      ...updateMatchDto,
      date: updateMatchDto.date ? new Date(updateMatchDto.date) : match.date,
    });

    return this.matchesRepository.save(updatedMatch);
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    const match = await this.findOne(id);
    await this.matchesRepository.remove(match);
    return { deleted: true };
  }

  private async validateTeams(homeTeamId: number, awayTeamId: number): Promise<void> {
    if (homeTeamId === awayTeamId) {
      throw new BadRequestException('Home team and away team must be different.');
    }

    await this.teamsService.findOne(homeTeamId);
    await this.teamsService.findOne(awayTeamId);
  }
}
