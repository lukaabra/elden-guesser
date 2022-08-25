import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AccountService } from '../accounts/account.service';

@Injectable()
export class AuthService {
  constructor(
    private accountService: AccountService,
    private jwtService: JwtService,
  ) {}

  async validateAccount(email: string, pass: string): Promise<any> {
    const account = await this.accountService.findOne({ email });

    if (account?.passwordHash === pass) {
      delete account.passwordHash;
      return account;
    }

    return null;
  }

  async login(user: any) {
    console.log(user, 'user');
    const payload = { username: user.username, sub: user.userId };

    return { access_token: this.jwtService.sign(payload) };
  }
}
