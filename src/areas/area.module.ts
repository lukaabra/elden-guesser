import { Module } from '@nestjs/common';

import { PrismaService } from '../prisma.service';
import { AreaController } from './area.controller';
import { AreaService } from './area.service';

@Module({
  controllers: [AreaController],
  providers: [AreaService, PrismaService],
  exports: [AreaService],
})
export class AreaModule {}
