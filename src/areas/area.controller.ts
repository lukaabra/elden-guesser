import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { Area } from '@prisma/client';

import { AreaService } from './area.service';

@Controller('/area')
export class AreaController {
  constructor(private areaService: AreaService) {}

  // TODO: Add query strings
  @Get()
  async getAll(): Promise<Area[]> {
    return this.areaService.findAll({});
  }

  @Get('/:id')
  async getOne(@Param('id') id: string): Promise<Area> {
    return this.areaService.findOne({ id: Number(id) });
  }

  @Post()
  async create(@Body() areaData: { label: string }): Promise<Area> {
    return this.areaService.create(areaData);
  }
}
