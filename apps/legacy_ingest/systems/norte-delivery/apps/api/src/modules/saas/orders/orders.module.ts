import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersGateway } from './orders.gateway';
import { OrdersService } from './orders.service';
import { PrismaModule } from '../../../common/prisma/prisma.module';
import { FinanceModule } from '../finance/finance.module';

@Module({
  imports: [PrismaModule, FinanceModule],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersGateway],
  exports: [OrdersService]
})
export class OrdersModule {}

