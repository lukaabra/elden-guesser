import { Injectable, NotFoundException } from '@nestjs/common';
import { Account, Prisma } from '@prisma/client';

import { PrismaService } from '../prisma.service';

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.AccountCreateInput): Promise<Account> {
    return this.prisma.account.create({ data });
  }

  async findOneWhere(
    accountWhereInput: Prisma.AccountWhereInput,
  ): Promise<Account | null> {
    const account = await this.prisma.account.findFirst({
      where: accountWhereInput,
    });

    if (!account) {
      throw new NotFoundException(
        `An account with email ${accountWhereInput?.email} does not exist`,
      );
    }

    return account;
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
