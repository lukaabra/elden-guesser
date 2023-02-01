import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { NotFoundError } from '@prisma/client/runtime';

import { UserService } from '../users/user.service';
import { LoginRequest } from './dto/loginRequest.dto';
import { LoginResponse } from './dto/loginResponse.dto';
import { SignUp } from './dto/signup.dto';
import { Jwt } from './dto/jwt.dto';

@Injectable()
export class AuthService {
  loginErrorMessage = 'Email or password is incorrect.';

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  parseJwt(token: string): Jwt {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
  }

  async register(signUpPayload: SignUp): Promise<User | null> {
    const hashedPassword = await bcrypt.hash(signUpPayload.password, 10);

    const user = await this.userService.create({
      ...signUpPayload,
      password: hashedPassword,
    });
    delete user.password;

    return user;
  }

  async login(loginPayload: LoginRequest): Promise<LoginResponse> {
    const user = await this.validateUser(loginPayload);
    const jwtToken = this.jwtService.sign({
      email: user.email,
      userId: user.id,
    });

    return {
      accessToken: jwtToken,
      email: user.email,
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
    };
  }

  async validateUser(loginPayload: LoginRequest): Promise<User> {
    const { email, password } = loginPayload;

    const user = await this.validateUserEmail(email);

    this.validateUserPassword(password, user?.password);

    delete user.password;
    return user;
  }

  async validateUserEmail(email: string): Promise<User> {
    try {
      return (await this.userService.findOneWhere({ email }, true)) as User;
    } catch (error: unknown) {
      if (error instanceof NotFoundError) {
        // We don't want to let the client know that the user does not exist
        throw new UnauthorizedException(this.loginErrorMessage);
      }

      throw error;
    }
  }

  validateUserPassword(password: string, userPassword: string): void {
    const passwordHashIsSame = bcrypt.compareSync(password, userPassword);

    if (!passwordHashIsSame) {
      throw new UnauthorizedException(this.loginErrorMessage);
    }
  }

  async verifyPayload(payload: Jwt): Promise<Omit<User, 'password'>> {
    // TODO: Lookup user ID in revoked user ID list
    let user: User;
    try {
      user = (await this.userService.findOneWhere(
        {
          email: payload.email,
        },
        true,
      )) as User;
    } catch (error: unknown) {
      if (error instanceof NotFoundError) {
        throw new UnauthorizedException();
      }

      throw error;
    }

    delete user.password;

    return user;
  }
}
