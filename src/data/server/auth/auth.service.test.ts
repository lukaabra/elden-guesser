import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from 'ts-auto-mock';
import { User } from '@prisma/client';
import { UnauthorizedException } from '@nestjs/common';
import {
  PrismaClientKnownRequestError,
  NotFoundError,
} from '@prisma/client/runtime';
import * as bcrypt from 'bcrypt';

import { UserService } from '../users/user.service';
import { AuthService } from './auth.service';
import { SignUp } from './dto/signup.dto';
import { LoginRequest } from './dto/loginRequest.dto';
import { Jwt } from './dto/jwt.dto';

describe('AuthService', () => {
  let service: AuthService;
  let mockedUserService: jest.Mocked<UserService>;
  let mockedJwtService: jest.Mocked<JwtService>;

  const registerPayload: SignUp = {
    email: 'test@email.com',
    password: '12345678',
    firstName: 'John',
    lastName: 'Doe',
  };
  const loginPayload: LoginRequest = {
    email: 'test@email.com',
    password: 'password123',
  };
  const jwtPayload: Jwt = {
    email: 'test@email.com',
    userId: 1,
    iat: 1662009133,
    exp: 1662045133,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    })
      .useMocker((token) => {
        if (Object.is(token, UserService)) {
          return createMock<UserService>();
        }

        if (Object.is(token, JwtService)) {
          return createMock<JwtService>();
        }
      })
      .compile();

    service = module.get<AuthService>(AuthService);
    mockedUserService = module.get<UserService, jest.Mocked<UserService>>(
      UserService,
    );
    mockedJwtService = module.get<JwtService, jest.Mocked<JwtService>>(
      JwtService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register user', async () => {
    const spiedBcryptHash = jest.spyOn(bcrypt, 'hash');
    mockedUserService.create = jest
      .fn()
      .mockResolvedValueOnce(createMock<User>(registerPayload));
    const user = await service.register(registerPayload);

    expect(spiedBcryptHash).toHaveBeenCalled();

    expect(user).toHaveProperty('email', registerPayload.email);
    expect(user).toHaveProperty('firstName', registerPayload.firstName);
    expect(user).toHaveProperty('lastName', registerPayload.lastName);

    expect(user).not.toHaveProperty('password');
  });

  it('should throw on register when email is taken', async () => {
    mockedUserService.create = jest
      .fn()
      .mockRejectedValueOnce(
        new PrismaClientKnownRequestError(
          'unique column constraint',
          'P2002',
          '4.20',
          { target: ['email'] },
        ),
      );

    try {
      await service.register(registerPayload);
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(PrismaClientKnownRequestError);
      expect((error as PrismaClientKnownRequestError).code).toEqual('P2002');
    }
  });

  it('should login user', async () => {
    const signedString =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZW1haWwuY29tIiwiYWNjb3VudElkIjoxLCJpYXQiOjE2NjIwMDkxMzMsImV4cCI6MTY2MjA0NTEzM30.9HOgZLKX3RT5hqqXS5YU8NWZjH17CkBTuGpUOHF2h_s';
    mockedJwtService.sign = jest.fn().mockReturnValueOnce(signedString);
    service.validateUser = jest
      .fn()
      .mockResolvedValueOnce(createMock<User>(registerPayload));
    const jwtToken = await service.login(loginPayload);
    const decodedJwt = service.parseJwt(jwtToken.access_token);

    expect(mockedJwtService.sign).toHaveBeenCalled();

    expect(decodedJwt).not.toHaveProperty('password');

    expect(jwtToken).toHaveProperty('access_token', jwtToken.access_token);
    expect(jwtToken.access_token).toEqual(signedString);
  });

  it('should throw on failed login', async () => {
    service.validateUser = jest
      .fn()
      .mockRejectedValueOnce(
        new UnauthorizedException(service.loginErrorMessage),
      );

    try {
      await service.login(loginPayload);
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(UnauthorizedException);
      expect((error as UnauthorizedException).message).toEqual(
        service.loginErrorMessage,
      );
    }
  });

  it('should validate user', async () => {
    service.validateUserEmail = jest
      .fn()
      .mockResolvedValueOnce(createMock<User>(registerPayload));
    service.validateUserPassword = jest.fn().mockResolvedValueOnce(null);
    const user = await service.validateUser(loginPayload);

    expect(service.validateUserEmail).toHaveBeenCalled();
    expect(service.validateUserPassword).toHaveBeenCalled();

    expect(user).toHaveProperty('email', registerPayload.email);
    expect(user).toHaveProperty('firstName', registerPayload.firstName);
    expect(user).toHaveProperty('lastName', registerPayload.lastName);

    expect(user).not.toHaveProperty('password');
  });

  it('should validate user email', async () => {
    mockedUserService.findOneWhere = jest
      .fn()
      .mockResolvedValueOnce(createMock<User>(registerPayload));
    const user = await service.validateUserEmail(registerPayload.email);

    expect(user).toHaveProperty('password');
    expect(user.email).toEqual(registerPayload.email);
  });

  it('should throw on validate user email', async () => {
    mockedUserService.findOneWhere = jest
      .fn()
      .mockRejectedValueOnce(new NotFoundError('No User found'));
    const email = 'incorrect-email@email.com';

    try {
      await service.validateUserEmail(email);
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(UnauthorizedException);
      expect((error as UnauthorizedException).message).toEqual(
        service.loginErrorMessage,
      );
    }
  });

  it('should validate user password', () => {
    const correctPassword = loginPayload.password;
    const spiedBcryptCompare = jest
      .spyOn(bcrypt, 'compareSync')
      .mockImplementation(() => true);

    service.validateUserPassword(correctPassword, loginPayload.password);
    expect(spiedBcryptCompare).toHaveBeenCalled();
  });

  it('should throw on validate user password', () => {
    const incorrectPassword = 'incorrect123';
    const spiedBcryptCompare = jest.spyOn(bcrypt, 'compareSync');

    try {
      service.validateUserPassword(incorrectPassword, loginPayload.password);
    } catch (error: unknown) {
      expect(spiedBcryptCompare).toHaveBeenCalled();
      expect(error).toBeInstanceOf(UnauthorizedException);
      expect((error as UnauthorizedException).message).toEqual(
        service.loginErrorMessage,
      );
    }
  });

  it('should verify JWT payload', async () => {
    mockedUserService.findOneWhere = jest
      .fn()
      .mockResolvedValueOnce(
        createMock<Omit<User, 'password'>>(registerPayload),
      );
    const user = await service.verifyPayload(jwtPayload);

    expect(user).toHaveProperty('email', jwtPayload.email);
    expect(user).not.toHaveProperty('password');
  });

  it('should not verify JWT payload', async () => {
    mockedUserService.findOneWhere = jest
      .fn()
      .mockRejectedValueOnce(new NotFoundError('No User found'));

    try {
      await service.verifyPayload(jwtPayload);
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(UnauthorizedException);
      expect((error as UnauthorizedException).message).toEqual(
        service.loginErrorMessage,
      );
    }
  });
});
