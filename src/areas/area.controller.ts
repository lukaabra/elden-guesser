import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { Area } from '@prisma/client';

import { AreaService } from './area.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('area')
export class AreaController {
  constructor(private areaService: AreaService) {}

  // TODO: Add query strings
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(@Request() req): Promise<Area[]> {
    return this.areaService.findAll({});
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string): Promise<Area> {
    return this.areaService.findOneById({ id: Number(id) });
  }
}
