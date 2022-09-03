import { Test, TestingModule } from '@nestjs/testing';
import { Account, Prisma } from '@prisma/client';
import { createMock, createMockList } from 'ts-auto-mock';

import { AccountService } from './account.service';
import { PrismaService } from '../prisma.service';
import { NotFoundError } from '@prisma/client/runtime';

describe('AccountService', () => {
  let service: AccountService;
  let mockedPrismaService: jest.Mocked<PrismaService>;

  const prismaClientVersion = '4.2.1';

  const account: Account = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'test@email.com',
    password: 'randomHash',
    created: new Date('2022-08-28 09:44:42.147'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountService],
    })
      .useMocker((token) => {
        if (Object.is(token, PrismaService)) {
          return createMock<PrismaService>();
        }
      })
      .compile();

    service = module.get<AccountService>(AccountService);
    mockedPrismaService = module.get<PrismaService, jest.Mocked<PrismaService>>(
      PrismaService,
    );
  });

  it('should be an instance of AccountService', () => {
    expect(service).toBeInstanceOf(AccountService);
  });

  it('should create new account', async () => {
    mockedPrismaService.account.create = jest
      .fn()
      .mockResolvedValueOnce(createMock<Account>(account));
    const createdAccount = await service.create({
      firstName: account.firstName,
      lastName: account.lastName,
      email: account.email,
      password: account.password,
    } as Prisma.AccountCreateInput);

    expect(createdAccount).toHaveProperty('id');
    expect(createdAccount).toHaveProperty('created');
  });

  it('should throw on existing account creation', async () => {
    mockedPrismaService.account.create = jest
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
        firstName: account.firstName,
        lastName: account.lastName,
        email: account.email,
        password: account.password,
      } as Prisma.AccountCreateInput);
    } catch (error) {
      expect(error).toBeInstanceOf(Prisma.PrismaClientKnownRequestError);
      expect(error.message).toEqual(
        'Unique constraint failed on the fields: (`email`)',
      );
      expect(error.code).toEqual('P2002');
    }
  });

  it('should find one account', async () => {
    const email = 'test@email.com';

    mockedPrismaService.account.findFirstOrThrow = jest
      .fn()
      .mockResolvedValueOnce(createMock<Account>(account));
    const foundAccount = await service.findOneWhere({
      where: { email },
    } as Prisma.AccountWhereInput);

    expect(foundAccount).toBeDefined();
    expect(foundAccount).toHaveProperty('email', account.email);
  });

  it('should throw on find one when account does not exist', async () => {
    const incorrectEmail = 'abc@test.com';
    mockedPrismaService.account.findFirstOrThrow = jest
      .fn()
      .mockRejectedValueOnce(new NotFoundError('No Account found'));

    try {
      await service.findOneWhere({ email: incorrectEmail });
    } catch (error) {
      expect(error).toEqual(new NotFoundError('No Account found'));
    }
  });

  it('should find 2 accounts', async () => {
    mockedPrismaService.account.findMany = jest
      .fn()
      .mockResolvedValueOnce(createMockList<Account>(2, () => account));
    const foundAccounts = await service.findAll({
      where: { firstName: 'John' },
    });

    expect(foundAccounts).toBeInstanceOf(Array);
    expect(foundAccounts).toHaveProperty('length', 2);
  });
});
