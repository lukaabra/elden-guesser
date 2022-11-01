import {
  Controller,
  Get,
  Param,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { Area, Prisma } from '@prisma/client';

import { AreaService } from './area.service';
import { DEFAULT_LIMIT } from '../../constants';
import {
  sortParamSatisfiesFormat,
  parseSortParam,
  parseFilterParam,
} from '../../utils/queryParamUtils';

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
    const params: QueryParams = { take: DEFAULT_LIMIT };

    if (limit) {
      params.take = parseInt(limit);
    }

    // page 1 = first 20
    if (page) {
      params.skip = params.take * (parseInt(page) - 1);
    }

    if (sortParamSatisfiesFormat(sort)) {
      params.orderBy = parseSortParam(sort);
    }

    if (filter) {
      params.where = parseFilterParam(filter);
    }

    return this.areaService.findAll({ ...params });
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getOne(@Param('id') id: string): Promise<Area> {
    return this.areaService.findOneWhere({ id: Number(id) });
  }
}
