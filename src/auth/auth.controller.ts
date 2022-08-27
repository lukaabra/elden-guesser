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
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body): Promise<Account> {
    return this.authService.register(body);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
