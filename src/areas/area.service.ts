import { Injectable, NotFoundException } from '@nestjs/common';
import { Area, Prisma } from '@prisma/client';

import { PrismaService } from '../prisma.service';

@Injectable()
export class AreaService {
  constructor(private prisma: PrismaService) {}

  async findOneById(
    areaWhereUniqueInput: Prisma.AreaWhereUniqueInput,
  ): Promise<Area | null> {
    const area = await this.prisma.area.findUnique({
      where: areaWhereUniqueInput,
    });

    if (!area) {
      throw new NotFoundException(
        `Area with ID: ${areaWhereUniqueInput?.id} does not exist.`,
      );
    }

    return area;
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
