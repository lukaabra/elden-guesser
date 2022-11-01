import {
  Controller,
  Get,
  Param,
  Query,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';

import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { parseQueryParams } from '../../utils/queryParamUtils';

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
    @Query('filter') filter?,
  ): Promise<UserNoPassword[]> {
    const params: QueryParams = parseQueryParams(limit, page, sort, filter);

    return this.userService.findAll({ ...params });
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async getOne(@Param('id') id: string): Promise<UserNoPassword> {
    return this.userService.findOneWhere({ id: Number(id) });
  }
}
