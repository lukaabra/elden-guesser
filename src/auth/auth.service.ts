import { Injectable } from '@nestjs/common';
import { AccountService } from '../accounts/account.service';

@Injectable()
export class AuthService {
  constructor(private accountService: AccountService) {}

  async validateAccount(email: string, pass: string): Promise<any> {
    const account = await this.accountService.findOne({ email });
    if (account?.passwordHash === pass) {
      delete account.passwordHash;
      return account;
    }
    return null;
  }
}
