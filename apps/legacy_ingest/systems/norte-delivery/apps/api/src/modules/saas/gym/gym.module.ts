import { Module } from '@nestjs/common';
import { GymController } from './gym.controller';
import { GymService } from './gym.service';
import { GymGateway } from './gym.gateway';
import { PrismaModule } from '../../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [GymController],
  providers: [GymService, GymGateway],
  exports: [GymService, GymGateway],
})
export class GymModule {}
