import { Injectable } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';

import { PrismaService } from '../../prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async findOneWhere(
    userWhereInput: Prisma.UserWhereInput,
    fetchPassword = false,
  ): Promise<User | Omit<User, 'password'>> {
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
  }): Promise<User[] | Omit<User, 'password'>[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({ skip, take, cursor, where, orderBy });
  }

  async exists(userWhereInput: Prisma.UserWhereInput): Promise<boolean> {
    return Boolean(await this.prisma.user.findFirst({ where: userWhereInput }));
  }
}
