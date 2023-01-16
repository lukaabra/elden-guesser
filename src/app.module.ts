import { Module } from '@nestjs/common';
import { ProductModule } from './data/server/products/product.module';
import { AuthModule } from './data/server/auth/auth.module';
import { UserModule } from './data/server/users/user.module';

@Module({
  imports: [ProductModule, AuthModule, UserModule],
})
export class AppModule {}
