import {
  Controller,
  Get,
  Param,
  Query,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { User, Prisma } from '@prisma/client';

import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DEFAULT_LIMIT } from '../../constants';
import {
  sortParamSatisfiesFormat,
  parseSortParam,
} from '../../utils/queryParamUtils';

import type { UserNoPassword } from '../../types/UserNoPassword';
import type { QueryParams } from '../../types/QueryParams';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async getAll(
    @Query('limit') limit?,
    @Query('page') page?,
    @Query('sort') sort?,
    @Query('like') like?,
  ): Promise<UserNoPassword[]> {
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

    // if (like) {
    //   params.where = { label: { contains: like } };
    // }

    return this.userService.findAll({ ...params });
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async getOne(@Param('id') id: string): Promise<UserNoPassword> {
    return this.userService.findOneWhere({ id: Number(id) });
  }
}
