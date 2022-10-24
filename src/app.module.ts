import { Module } from '@nestjs/common';
import { AreaModule } from './data/server/areas/area.module';
import { AuthModule } from './data/server/auth/auth.module';
import { UserModule } from './data/server/users/user.module';

@Module({
  imports: [AreaModule, AuthModule, UserModule],
})
export class AppModule {}
