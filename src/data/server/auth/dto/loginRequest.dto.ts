import { IsDefined, IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class LoginRequest {
  @IsDefined()
  @IsEmail()
  readonly email: string;

  @IsDefined()
  @IsNotEmpty()
  @MinLength(8)
  readonly password: string;
}
