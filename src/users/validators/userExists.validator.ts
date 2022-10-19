import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { UserService } from '../user.service';

@ValidatorConstraint({ name: 'UserExists', async: true })
@Injectable()
export class UserExists implements ValidatorConstraintInterface {
  constructor(private readonly userService: UserService) {}

  async validate(email: string): Promise<boolean> {
    return Boolean(await this.userService.findOneWhere({ email }));
  }

  defaultMessage(): string {
    return `User with email <<$value>> already exists.`;
  }
}
