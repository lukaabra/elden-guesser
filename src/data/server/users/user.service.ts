import { Injectable } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';

import { PrismaService } from '../../prisma.service';

import type { UserNoPassword } from '../../types/UserNoPassword';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async findOneWhere(
    userWhereInput: Prisma.UserWhereInput,
    fetchPassword = false,
  ): Promise<User | UserNoPassword> {
    const user = await this.prisma.user.findFirstOrThrow({
      where: userWhereInput,
    });

    if (!fetchPassword) {
      delete user.password;
    }

    return user;
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<UserNoPassword[]> {
    const { skip, take, cursor, where, orderBy } = params;
    const users = await this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
    return users.map((user) => {
      delete user.password;
      return user;
    });
  }

  async exists(userWhereInput: Prisma.UserWhereInput): Promise<boolean> {
    return Boolean(await this.prisma.user.findFirst({ where: userWhereInput }));
  }
}
