import { Injectable } from '@nestjs/common';
import { Location, Prisma } from '@prisma/client';

import { PrismaService } from '../prisma.service';

@Injectable()
export class LocationService {
  constructor(private prisma: PrismaService) {}

  async findOne(
    areaWhereUniqueInput: Prisma.AreaWhereUniqueInput,
  ): Promise<Location | null> {
    return this.prisma.location.findUnique({
      where: areaWhereUniqueInput,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.LocationWhereUniqueInput;
    where?: Prisma.LocationWhereInput;
    orderBy?: Prisma.LocationOrderByWithRelationInput;
  }): Promise<Location[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.location.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }
}
