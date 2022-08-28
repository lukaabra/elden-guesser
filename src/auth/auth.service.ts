import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Account } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { AccountService } from '../accounts/account.service';
import { SignUp } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private accountService: AccountService,
    private jwtService: JwtService,
  ) {}

  async register(signUpPayload: SignUp): Promise<Account | null> {
    const hashedPassword = await bcrypt.hash(signUpPayload.password, 10);

    const account = await this.accountService.create({
      ...signUpPayload,
      password: hashedPassword,
    });
    delete account.password;

    return account;
  }

  async login(user: any) {
    const payload = { email: user.email, id: user.id };

    return { access_token: this.jwtService.sign(payload) };
  }

  async validateAccount(email: string, password: string): Promise<any> {
    const account = await this.accountService.findOneWhere({ email });
    const passwordHashIsSame = await bcrypt.compare(
      password,
      account?.password,
    );

    if (passwordHashIsSame) {
      delete account.password;
      return account;
    }

    return null;
  }

  async verifyPayload(payload: any): Promise<Account> {
    // TODO: Lookup account ID in revoked account ID list
    const account = await this.accountService.findOneWhere({
      email: payload.email,
    });

    return account;
  }
}
