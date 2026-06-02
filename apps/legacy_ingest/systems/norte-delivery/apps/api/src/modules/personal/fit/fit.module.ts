import { Module } from '@nestjs/common';
import { FitController } from './fit.controller';
import { FitService } from './fit.service';
import { PrismaModule } from '../../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FitController],
  providers: [FitService],
  exports: [FitService],
})
export class FitModule {}
