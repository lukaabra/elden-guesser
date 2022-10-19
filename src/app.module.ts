import { Module } from '@nestjs/common';
import { AreaModule } from './areas/area.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';

@Module({
  imports: [AreaModule, AuthModule, UserModule],
})
export class AppModule {}
