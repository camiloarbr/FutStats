// 1. External imports
import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';

// 2. Internal imports
import { CreateTeamDto } from './dto/create-team.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { TeamEntity } from './entities/team.entity';
import { TeamsService } from './teams.service';
import { UpdateTeamDto } from './dto/update-team.dto';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  findAll(): Promise<TeamEntity[]> {
    return this.teamsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<TeamEntity> {
    return this.teamsService.findOne(Number(id));
  }

  @Post()
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() createTeamDto: CreateTeamDto): Promise<TeamEntity> {
    return this.teamsService.create(createTeamDto);
  }

  @Patch(':id')
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto): Promise<TeamEntity> {
    return this.teamsService.update(Number(id), updateTeamDto);
  }

  @Delete(':id')
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id') id: string): Promise<{ deleted: boolean }> {
    return this.teamsService.remove(Number(id));
  }
}
