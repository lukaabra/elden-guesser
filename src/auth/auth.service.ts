import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

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

    return { access_token: jwtToken };
  }

  async validateUser(loginPayload: LoginRequest): Promise<User> {
    const { email, password } = loginPayload;

    const user = await this.validateUserEmail(email);
    this.validateUserPassword(password, user?.password);

    delete user.password;
    return user;
  }

  async validateUserEmail(email: string): Promise<User> {
    return await this.userService.findOneWhere({ email });
  }

  async validateUserPassword(
    password: string,
    userPassword: string,
  ): Promise<void> {
    const passwordHashIsSame = await bcrypt.compare(password, userPassword);
    if (!passwordHashIsSame) {
      throw new Error(this.loginErrorMessage);
    }
  }

  async verifyPayload(payload: Jwt): Promise<Omit<User, 'password'>> {
    // TODO: Lookup user ID in revoked user ID list
    const user = await this.userService.findOneWhere({
      email: payload.email,
    });

    if (user) {
      delete user.password;
    }

    return user;
  }
}
