// 1. External imports
import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, UseGuards } from '@nestjs/common';

// 2. Internal imports
import { CreateMatchDto } from './dto/create-match.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MatchEntity } from './entities/match.entity';
import { MatchesService } from './matches.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UpdateMatchDto } from './dto/update-match.dto';

@Controller('matches')
export class MatchesController {
  constructor(@Inject(MatchesService) private readonly matchesService: MatchesService) {}

  @Get()
  findAll(): Promise<MatchEntity[]> {
    return this.matchesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<MatchEntity> {
    return this.matchesService.findOne(Number(id));
  }

  @Post()
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() createMatchDto: CreateMatchDto): Promise<MatchEntity> {
    return this.matchesService.create(createMatchDto);
  }

  @Patch(':id')
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(@Param('id') id: string, @Body() updateMatchDto: UpdateMatchDto): Promise<MatchEntity> {
    return this.matchesService.update(Number(id), updateMatchDto);
  }

  @Delete(':id')
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id') id: string): Promise<{ deleted: boolean }> {
    return this.matchesService.remove(Number(id));
  }
}
