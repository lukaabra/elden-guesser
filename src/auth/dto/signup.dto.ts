import {
  IsDefined,
  IsNotEmpty,
  IsEmail,
  MinLength,
  Validate,
} from 'class-validator';

import { AccountExists } from '../../accounts/validators/accountExists.validator';

export class SignUp {
  @IsDefined()
  @IsNotEmpty()
  readonly firstName: string;

  @IsDefined()
  @IsNotEmpty()
  readonly lastName: string;

  @IsDefined()
  @IsEmail()
  @Validate(AccountExists)
  readonly email: string;

  @IsDefined()
  @IsNotEmpty()
  @MinLength(8)
  readonly password: string;
}
