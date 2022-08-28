import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Account } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { AccountService } from '../accounts/account.service';

@Injectable()
export class AuthService {
  constructor(
    private accountService: AccountService,
    private jwtService: JwtService,
  ) {}

  async register(signUpPayload: any): Promise<Account | null> {
    if (this.accountService.exists({ email: signUpPayload.email })) {
      throw new ConflictException(
        `Account with email ${signUpPayload.email} already exists.`,
      );
    }

    const hashedPassword = await bcrypt.hash(signUpPayload.password, 10);
    signUpPayload.passwordHash = hashedPassword;
    delete signUpPayload.password;

    const account = await this.accountService.create(signUpPayload);
    delete account.passwordHash;

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
      account?.passwordHash,
    );

    if (passwordHashIsSame) {
      delete account.passwordHash;
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
