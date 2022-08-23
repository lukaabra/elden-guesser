import { Module } from '@nestjs/common';
import { AreaModule } from './areas/area.module';

@Module({
  imports: [AreaModule],
})
export class AppModule {}
