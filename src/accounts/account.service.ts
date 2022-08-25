import { Injectable } from '@nestjs/common';
import { Account, Prisma } from '@prisma/client';

import { PrismaService } from '../prisma.service';

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}

  async findOne(
    accountWhereInput: Prisma.AccountWhereInput,
  ): Promise<Account | null> {
    return this.prisma.account.findFirst({ where: accountWhereInput });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.AccountWhereUniqueInput;
    where?: Prisma.AccountWhereInput;
    orderBy?: Prisma.AccountOrderByWithRelationInput;
  }): Promise<Account[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.account.findMany({ skip, take, cursor, where, orderBy });
  }
}
