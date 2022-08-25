import { Module } from '@nestjs/common';
import { AreaModule } from './areas/area.module';
import { AuthModule } from './auth/auth.module';
import { AccountModule } from './accounts/account.module';

@Module({
  imports: [AreaModule, AuthModule, AccountModule],
})
export class AppModule {}
