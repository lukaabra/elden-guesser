import { Injectable } from '@nestjs/common';
import { Area, Prisma } from '@prisma/client';

import { PrismaService } from '../../prisma.service';

@Injectable()
export class AreaService {
  constructor(private prisma: PrismaService) {}

  async findOneWhere(
    areaWhereInput: Prisma.AreaWhereInput,
  ): Promise<Area | null> {
    return await this.prisma.area.findFirstOrThrow({
      where: areaWhereInput,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.AreaWhereUniqueInput;
    where?: Prisma.AreaWhereInput;
    orderBy?: Prisma.AreaOrderByWithRelationInput;
  }): Promise<Area[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.area.findMany({ skip, take, cursor, where, orderBy });
  }
}
