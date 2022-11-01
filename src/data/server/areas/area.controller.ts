import {
  Controller,
  Get,
  Param,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { Area } from '@prisma/client';

import { AreaService } from './area.service';
import { parseQueryParams } from '../../utils/queryParamUtils';

import type { QueryParams } from '../../types/QueryParams';

@Controller('areas')
export class AreaController {
  constructor(private areaService: AreaService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAll(
    @Query('limit') limit?,
    @Query('page') page?,
    @Query('sort') sort?,
    @Query('filter') filter?,
  ): Promise<Area[]> {
    const params: QueryParams = parseQueryParams(limit, page, sort, filter);

    return this.areaService.findAll({ ...params });
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getOne(@Param('id') id: string): Promise<Area> {
    return this.areaService.findOneWhere({ id: Number(id) });
  }
}
