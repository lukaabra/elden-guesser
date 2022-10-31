import { Test, TestingModule } from '@nestjs/testing';
import { User, Prisma } from '@prisma/client';
import { createMock, createMockList } from 'ts-auto-mock';

import { UserService } from './user.service';
import { PrismaService } from '../../prisma.service';
import { NotFoundError } from '@prisma/client/runtime';

describe('UserService', () => {
  let service: UserService;
  let mockedPrismaService: jest.Mocked<PrismaService>;

  const prismaClientVersion = '4.2.1';

  const user: User = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'test@email.com',
    password: 'randomHash',
    created: new Date('2022-08-28 09:44:42.147'),
    updated: new Date('2022-08-28 09:44:42.147'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    })
      .useMocker((token) => {
        if (Object.is(token, PrismaService)) {
          return createMock<PrismaService>();
        }
      })
      .compile();

    service = module.get<UserService>(UserService);
    mockedPrismaService = module.get<PrismaService, jest.Mocked<PrismaService>>(
      PrismaService,
    );
  });

  it('should be an instance of UserService', () => {
    expect(service).toBeInstanceOf(UserService);
  });

  it('should create new user', async () => {
    mockedPrismaService.user.create = jest
      .fn()
      .mockResolvedValueOnce(createMock<User>(user));
    const createdUser = await service.create({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
    } as Prisma.UserCreateInput);

    expect(createdUser).toHaveProperty('id');
    expect(createdUser).toHaveProperty('created');
  });

  it('should throw on existing user creation', async () => {
    mockedPrismaService.user.create = jest
      .fn()
      .mockRejectedValueOnce(
        new Prisma.PrismaClientKnownRequestError(
          'Unique constraint failed on the fields: (`email`)',
          'P2002',
          prismaClientVersion,
        ),
      );

    try {
      await service.create({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
      } as Prisma.UserCreateInput);
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(Prisma.PrismaClientKnownRequestError);
      expect((error as Prisma.PrismaClientKnownRequestError).message).toEqual(
        'Unique constraint failed on the fields: (`email`)',
      );
      expect((error as Prisma.PrismaClientKnownRequestError).code).toEqual(
        'P2002',
      );
    }
  });

  it('should find one user and return without password', async () => {
    const email = 'test@email.com';

    mockedPrismaService.user.findFirstOrThrow = jest
      .fn()
      .mockResolvedValueOnce(createMock<User>(user));
    const foundUser = await service.findOneWhere({
      where: { email },
    } as Prisma.UserWhereInput);

    expect(foundUser).toBeDefined();
    expect(foundUser).toHaveProperty('email', user.email);
    expect(foundUser).not.toHaveProperty('password');
  });

  it('should find one user and return with password', async () => {
    const email = 'test@email.com';

    mockedPrismaService.user.findFirstOrThrow = jest
      .fn()
      .mockResolvedValueOnce(createMock<User>(user));
    const foundUser = await service.findOneWhere(
      {
        where: { email },
      } as Prisma.UserWhereInput,
      true,
    );

    expect(foundUser).toBeDefined();
    expect(foundUser).toHaveProperty('email', user.email);
    expect(foundUser).toHaveProperty('password', user.password);
  });

  it('should throw on find one when user does not exist', async () => {
    const incorrectEmail = 'abc@test.com';
    mockedPrismaService.user.findFirstOrThrow = jest
      .fn()
      .mockRejectedValueOnce(new NotFoundError('No User found'));

    try {
      await service.findOneWhere({ email: incorrectEmail });
    } catch (error) {
      expect(error).toEqual(new NotFoundError('No User found'));
    }
  });

  it('should find 2 users', async () => {
    mockedPrismaService.user.findMany = jest
      .fn()
      .mockResolvedValueOnce(createMockList<User>(2, () => user));
    const foundUsers = await service.findAll({
      where: { firstName: 'John' },
    });

    expect(foundUsers).toBeInstanceOf(Array);
    expect(foundUsers).toHaveProperty('length', 2);
  });
});
