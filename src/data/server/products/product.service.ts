import { Injectable } from '@nestjs/common';
import { Product, Prisma } from '@prisma/client';

import { PrismaService } from '../../prisma.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async findOneWhere(
    productWhereInput: Prisma.ProductWhereInput,
  ): Promise<Product | null> {
    return await this.prisma.product.findFirstOrThrow({
      where: productWhereInput,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ProductWhereUniqueInput;
    where?: Prisma.ProductWhereInput;
    orderBy?: Prisma.ProductOrderByWithRelationInput[];
  }): Promise<Product[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.product.findMany({ skip, take, cursor, where, orderBy });
  }
}
