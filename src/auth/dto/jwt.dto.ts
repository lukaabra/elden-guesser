import { IsDefined, IsEmail } from 'class-validator';

export class Jwt {
  @IsDefined()
  @IsEmail()
  readonly email: string;

  @IsDefined()
  readonly userId: number;

  @IsDefined()
  readonly iat: number;

  @IsDefined()
  readonly exp: number;
}
