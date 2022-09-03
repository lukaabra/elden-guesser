import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Account } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { AccountService } from '../accounts/account.service';
import { LoginRequest } from './dto/loginRequest.dto';
import { LoginResponse } from './dto/loginResponse.dto';
import { SignUp } from './dto/signup.dto';
import { Jwt } from './dto/jwt.dto';

@Injectable()
export class AuthService {
  loginErrorMessage = 'Email or password is incorrect.';

  constructor(
    private accountService: AccountService,
    private jwtService: JwtService,
  ) {}

  parseJwt(token: string): Jwt {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
  }

  async register(signUpPayload: SignUp): Promise<Account | null> {
    const hashedPassword = await bcrypt.hash(signUpPayload.password, 10);

    const account = await this.accountService.create({
      ...signUpPayload,
      password: hashedPassword,
    });
    delete account.password;

    return account;
  }

  async login(loginPayload: LoginRequest): Promise<LoginResponse> {
    const account = await this.validateAccount(loginPayload);
    const jwtToken = this.jwtService.sign({
      email: account.email,
      accountId: account.id,
    });

    return { access_token: jwtToken };
  }

  async validateAccount(loginPayload: LoginRequest): Promise<Account> {
    const { email, password } = loginPayload;

    const account = await this.validateAccountEmail(email);
    this.validateAccountPassword(password, account?.password);

    delete account.password;
    return account;
  }

  async validateAccountEmail(email: string): Promise<Account> {
    const account = await this.accountService.findOneWhere({ email });
    if (!account) {
      throw new UnauthorizedException(this.loginErrorMessage);
    }

    return account;
  }

  async validateAccountPassword(
    password: string,
    accountPassword: string,
  ): Promise<void> {
    const passwordHashIsSame = await bcrypt.compare(password, accountPassword);
    if (!passwordHashIsSame) {
      throw new UnauthorizedException(this.loginErrorMessage);
    }
  }

  async verifyPayload(payload: Jwt): Promise<Omit<Account, 'password'>> {
    // TODO: Lookup account ID in revoked account ID list
    const account = await this.accountService.findOneWhere({
      email: payload.email,
    });

    if (account) {
      delete account.password;
    }

    return account;
  }
}
