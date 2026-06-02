import { Module } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { PrismaModule } from '../../../common/prisma/prisma.module';

import { FinanceController } from './finance.controller';

@Module({
  imports: [PrismaModule],
  controllers: [FinanceController],
  providers: [FinanceService],
  exports: [FinanceService]
})
export class FinanceModule { }

