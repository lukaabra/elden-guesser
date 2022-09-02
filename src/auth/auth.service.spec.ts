import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from 'ts-auto-mock';
import { Account } from '@prisma/client';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { AccountService } from '../accounts/account.service';
import { AuthService } from './auth.service';
import { SignUp } from './dto/signup.dto';
import { Login } from './dto/login.dto';
import { Jwt } from './dto/jwt.dto';

// TODO: Add toHaveBeenCalled to tests
describe('AuthService', () => {
  let service: AuthService;
  let mockedAccountService: jest.Mocked<AccountService>;
  let mockedJwtService: jest.Mocked<JwtService>;

  const registerPayload: SignUp = {
    email: 'test@email.com',
    password: '12345678',
    firstName: 'John',
    lastName: 'Doe',
  };
  const loginPayload: Login = {
    email: 'test@email.com',
    password: 'password123',
  };
  const jwtPayload: Jwt = {
    email: 'test@email.com',
    password: 'password123',
    iat: 1662008930,
    exp: 1662044930,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    })
      .useMocker((token) => {
        if (Object.is(token, AccountService)) {
          return createMock<AccountService>();
        }

        if (Object.is(token, JwtService)) {
          return createMock<JwtService>();
        }
      })
      .compile();

    service = module.get<AuthService>(AuthService);
    mockedAccountService = module.get<
      AccountService,
      jest.Mocked<AccountService>
    >(AccountService);
    mockedJwtService = module.get<JwtService, jest.Mocked<JwtService>>(
      JwtService,
    );
  });

  it('should register account', async () => {
    const spiedBcryptHash = jest.spyOn(bcrypt, 'hash');
    mockedAccountService.create = jest
      .fn()
      .mockResolvedValueOnce(createMock<Account>(registerPayload));
    const account = await service.register(registerPayload);

    expect(spiedBcryptHash).toHaveBeenCalled();
    expect(account).toHaveProperty('email', registerPayload.email);
    expect(account).toHaveProperty('firstName', registerPayload.firstName);
    expect(account).toHaveProperty('lastName', registerPayload.lastName);
    expect(account).not.toHaveProperty('password');
  });

  // TODO: Integration testing with Docker
  // https://www.prisma.io/docs/guides/testing/integration-testing
  // it('should throw on register when email is taken', () => {
  //   expect(service).toBeDefined();
  // });

  it('should login account', async () => {
    const signedString = 'signedTestValue';
    mockedJwtService.sign = jest.fn().mockReturnValueOnce(signedString);
    service.validateAccount = jest.fn().mockResolvedValueOnce(null);
    const jwtToken = await service.login(loginPayload);

    expect(mockedJwtService.sign).toHaveBeenCalled();
    expect(jwtToken).toHaveProperty('access_token', jwtToken.access_token);
    expect(jwtToken.access_token).toEqual(signedString);
    expect(typeof jwtToken.access_token).toBe('string');
  });

  it('should throw on failed login', async () => {
    service.validateAccount = jest
      .fn()
      .mockRejectedValueOnce(
        new UnauthorizedException(service.loginErrorMessage),
      );

    try {
      await service.login(loginPayload);
    } catch (error) {
      expect(error).toEqual(
        new UnauthorizedException(service.loginErrorMessage),
      );
    }
  });

  it('should validate account', async () => {
    service.validateAccountEmail = jest
      .fn()
      .mockResolvedValueOnce(createMock<Account>(registerPayload));
    service.validateAccountPassword = jest.fn().mockResolvedValueOnce(null);
    const account = await service.validateAccount(loginPayload);

    expect(service.validateAccountEmail).toHaveBeenCalled();
    expect(service.validateAccountPassword).toHaveBeenCalled();
    expect(account).toHaveProperty('email', registerPayload.email);
    expect(account).toHaveProperty('firstName', registerPayload.firstName);
    expect(account).toHaveProperty('lastName', registerPayload.lastName);
    expect(account).not.toHaveProperty('password');
  });

  it('should validate account email', async () => {
    mockedAccountService.findOneWhere = jest
      .fn()
      .mockResolvedValueOnce(createMock<Account>(registerPayload));
    const account = await service.validateAccountEmail(registerPayload.email);

    expect(account).toHaveProperty('password');
    expect(account.email).toEqual(registerPayload.email);
  });

  it('should throw on validate account email', async () => {
    mockedAccountService.findOneWhere = jest.fn().mockResolvedValueOnce(null);
    const email = 'incorrect-email@email.com';

    try {
      await service.validateAccountEmail(email);
    } catch (error) {
      expect(error).toEqual(
        new UnauthorizedException(service.loginErrorMessage),
      );
    }
  });

  it('should validate account password', async () => {
    const correctPassword = loginPayload.password;
    const spiedBcryptCompare = jest
      .spyOn(bcrypt, 'compare')
      .mockImplementation(() => true);

    await service.validateAccountPassword(
      correctPassword,
      loginPayload.password,
    );
    expect(spiedBcryptCompare).toHaveBeenCalled();
  });

  it('should throw on validate account password', async () => {
    const incorrectPassword = 'incorrect123';
    const spiedBcryptCompare = jest.spyOn(bcrypt, 'compare');

    try {
      await service.validateAccountPassword(
        incorrectPassword,
        loginPayload.password,
      );
    } catch (error) {
      expect(spiedBcryptCompare).toHaveBeenCalled();
      expect(error).toEqual(
        new UnauthorizedException(service.loginErrorMessage),
      );
    }
  });

  it('should verify JWT payload', async () => {
    mockedAccountService.findOneWhere = jest
      .fn()
      .mockResolvedValueOnce(createMock<Account>(registerPayload));
    const account = await service.verifyPayload(jwtPayload);

    expect(account).toHaveProperty('email', jwtPayload.email);
    expect(account).not.toHaveProperty('password');
  });

  it('should not verify JWT payload', async () => {
    mockedAccountService.findOneWhere = jest.fn().mockResolvedValueOnce(null);
    const account = await service.verifyPayload(jwtPayload);

    expect(account).toBe(null);
  });
});
