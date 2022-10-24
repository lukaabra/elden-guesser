import { IsDefined } from 'class-validator';

export class LoginResponse {
  @IsDefined()
  readonly access_token: string;
}
