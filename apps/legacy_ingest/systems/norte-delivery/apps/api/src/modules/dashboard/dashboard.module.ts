import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { OrdersModule } from '../saas/orders/orders.module';
import { FinanceModule } from '../saas/finance/finance.module';
import { TablesModule } from '../saas/tables/tables.module';

@Module({
  imports: [OrdersModule, FinanceModule, TablesModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
