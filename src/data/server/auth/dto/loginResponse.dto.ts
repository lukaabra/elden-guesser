import { IsDefined } from 'class-validator';

export class LoginResponse {
  @IsDefined()
  readonly accessToken: string;

  readonly email: string;

  readonly id: number;

  readonly name: string;
}
