import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AccountService } from '../accounts/account.service';

@Injectable()
export class AuthService {
  constructor(
    private accountService: AccountService,
    private jwtService: JwtService,
  ) {}

  async validateAccount(email: string, password: string): Promise<any> {
    const account = await this.accountService.findOne({ email });

    if (account?.passwordHash === password) {
      delete account.passwordHash;
      return account;
    }

    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, id: user.id };

    return { access_token: this.jwtService.sign(payload) };
  }
}
