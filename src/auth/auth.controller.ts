import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { Account } from '@prisma/client';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { SignUp } from './dto/signup.dto';
import { Login } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() signUpPayload: SignUp): Promise<Account> {
    return this.authService.register(signUpPayload);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginPayload: Login) {
    return this.authService.login(loginPayload);
  }
}
