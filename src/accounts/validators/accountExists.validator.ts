import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { AccountService } from '../account.service';

@ValidatorConstraint({ name: 'AccountExists', async: true })
@Injectable()
export class AccountExists implements ValidatorConstraintInterface {
  constructor(private readonly accountService: AccountService) {}

  async validate(email: string): Promise<boolean> {
    return Boolean(await this.accountService.findOneWhere({ email }));
  }

  defaultMessage(): string {
    return `Account with email <<$value>> already exists.`;
  }
}
