import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from 'ts-auto-mock';
import { Account } from '@prisma/client';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignUp } from './dto/signup.dto';
import { LoginRequest } from './dto/loginRequest.dto';
import { Jwt } from './dto/jwt.dto';
import { LoginResponse } from './dto/loginResponse.dto';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let mockedAuthService: jest.Mocked<AuthService>;

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
  const loginResponse: Jwt = {
    email: 'test@email.com',
    accountId: 1,
    iat: 1662009133,
    exp: 1662045133,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
    })
      .useMocker((token) => {
        if (Object.is(token, AuthService)) {
          return createMock<AuthService>();
        }
      })
      .compile();

    controller = module.get<AuthController>(AuthController);
    mockedAuthService = module.get<AuthService, jest.Mocked<AuthService>>(
      AuthService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should register account', async () => {
    mockedAuthService.register = jest.fn().mockResolvedValueOnce(
      createMock<Omit<Account, 'password'>>({
        email: registerPayload.email,
        firstName: registerPayload.firstName,
        lastName: registerPayload.lastName,
      }),
    );
    const account = await controller.register(registerPayload);

    expect(account).toHaveProperty('email', registerPayload.email);
    expect(account).toHaveProperty('firstName', registerPayload.firstName);
    expect(account).toHaveProperty('lastName', registerPayload.lastName);
    expect(account).not.toHaveProperty('password');
  });

  it('should fail to register', async () => {
    mockedAuthService.register = jest
      .fn()
      .mockRejectedValueOnce(
        new UnauthorizedException(mockedAuthService.loginErrorMessage),
      );

    try {
      await controller.register(registerPayload);
    } catch (error) {
      expect(error).toEqual(
        new UnauthorizedException(mockedAuthService.loginErrorMessage),
      );
    }
  });

  it('should login account', async () => {
    const loginResponse: LoginResponse = {
      access_token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZW1haWwuY29tIiwiYWNjb3VudElkIjoxLCJpYXQiOjE2NjIwMDkxMzMsImV4cCI6MTY2MjA0NTEzM30.9HOgZLKX3RT5hqqXS5YU8NWZjH17CkBTuGpUOHF2h_s',
    };
    mockedAuthService.login = jest
      .fn()
      .mockResolvedValueOnce(createMock<LoginResponse>(loginResponse));
    const result = await controller.login(loginPayload);

    expect(result).toHaveProperty('access_token');
  });

  it('should fail to login', async () => {
    mockedAuthService.login = jest
      .fn()
      .mockRejectedValueOnce(
        new UnauthorizedException(mockedAuthService.loginErrorMessage),
      );

    try {
      await controller.login(loginPayload);
    } catch (error) {
      expect(error).toEqual(
        new UnauthorizedException(mockedAuthService.loginErrorMessage),
      );
    }
  });
});
