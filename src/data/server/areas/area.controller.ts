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

type AreasAllParams = {
  skip?: number;
  take?: number;
  orderBy?: { label: Prisma.SortOrder };
  where?: { label: { contains: string } };
};

@Controller('areas')
export class AreaController {
  constructor(private areaService: AreaService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAll(
    @Query('limit') limit?,
    @Query('page') page?,
    @Query('order') order?,
    @Query('like') like?,
  ): Promise<Area[]> {
    const params: AreasAllParams = { take: DEFAULT_LIMIT };

    if (limit) {
      params.take = parseInt(limit);
    }

    // page 1 = first 20
    if (page) {
      params.skip = params.take * (parseInt(page) - 1);
    }

    if (order in Prisma.SortOrder) {
      params.orderBy = { label: order as Prisma.SortOrder };
    }

    if (like) {
      params.where = { label: { contains: like } };
    }

    return this.areaService.findAll({ ...params });
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getOne(@Param('id') id: string): Promise<Area> {
    return this.areaService.findOneWhere({ id: Number(id) });
  }
}
