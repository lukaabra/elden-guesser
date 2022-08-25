import { Controller, Post, UseGuards, Request } from '@nestjs/common';

import { LocalAuthGuard } from './local-auth.guard';

@Controller('/login')
export class AuthController {
  @UseGuards(LocalAuthGuard)
  @Post()
  async login(@Request() req) {
    return req.user;
  }
}
