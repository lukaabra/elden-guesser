import { IsDefined, IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class Jwt {
  @IsDefined()
  @IsEmail()
  readonly email: string;

  @IsDefined()
  @IsNotEmpty()
  @MinLength(8)
  readonly password: string;

  @IsDefined()
  readonly iat: number;

  @IsDefined()
  readonly exp: number;
}
