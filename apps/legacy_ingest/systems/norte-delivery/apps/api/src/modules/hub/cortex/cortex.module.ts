import { Module } from '@nestjs/common';
import { CortexController } from './cortex.controller';
import { CortexService } from './cortex.service';
import { PrismaModule } from '../../../common/prisma/prisma.module';
import { CloudModule } from '../../saas/cloud/cloud.module';

@Module({
  imports: [PrismaModule, CloudModule],
  controllers: [CortexController],
  providers: [CortexService],
  exports: [CortexService]
})
export class CortexModule {}
