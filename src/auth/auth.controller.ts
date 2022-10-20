import {
  Controller,
  Post,
  UseGuards,
  Body,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { User } from '@prisma/client';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { SignUp } from './dto/signup.dto';
import { LoginRequest } from './dto/loginRequest.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() signUpPayload: SignUp): Promise<User> {
    return this.authService.register(signUpPayload);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginPayload: LoginRequest) {
    return this.authService.login(loginPayload);
  }
}
