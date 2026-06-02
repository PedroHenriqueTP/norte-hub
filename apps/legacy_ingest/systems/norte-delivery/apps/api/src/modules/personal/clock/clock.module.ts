import { Module } from '@nestjs/common';
import { ClockController } from './clock.controller';
import { ClockService } from './clock.service';
import { PrismaModule } from '../../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ClockController],
  providers: [ClockService],
  exports: [ClockService]
})
export class ClockModule {}
