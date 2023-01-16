import {
  Controller,
  Get,
  Param,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { Product } from '@prisma/client';

import { ProductService } from './product.service';
import { parseQueryParams } from '../../utils/queryParamUtils';

import type { QueryParams } from '../../types/QueryParams';

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAll(
    @Query('limit') limit?,
    @Query('page') page?,
    @Query('sort') sort?,
    @Query('filter') filter?,
  ): Promise<Product[]> {
    const params: QueryParams = parseQueryParams(limit, page, sort, filter);

    return this.productService.findAll({ ...params });
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getOne(@Param('id') id: string): Promise<Product> {
    return this.productService.findOneWhere({ id: Number(id) });
  }
}
