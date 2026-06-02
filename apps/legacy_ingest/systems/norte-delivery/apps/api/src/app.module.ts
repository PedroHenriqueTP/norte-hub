import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TenantMiddleware } from './common/tenant/tenant.middleware';
import { OrdersModule } from './modules/saas/orders/orders.module';
import { FinanceModule } from './modules/saas/finance/finance.module';
import { IntegrationsModule } from './modules/saas/integrations/integrations.module';
import { TablesModule } from './modules/saas/tables/tables.module';
import { PrismaModule } from './common/prisma/prisma.module';

import { AuthModule } from './modules/auth/auth.module';
import { BillingModule } from './modules/saas/billing/billing.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/saas/products/products.module';
import { UploadModule } from './modules/saas/upload/upload.module';
import { WaitingListModule } from './modules/saas/waiting-list/waiting-list.module';
import { CustomersModule } from './modules/saas/customers/customers.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { InventoryModule } from './modules/saas/inventory/inventory.module';
import { HubModule } from './modules/hub/hub.module';
import { FitModule } from './modules/personal/fit/fit.module';

import { GymModule } from './modules/saas/gym/gym.module';
import { CloudModule } from './modules/saas/cloud/cloud.module';
import { CortexModule } from './modules/hub/cortex/cortex.module';
import { ClockModule } from './modules/personal/clock/clock.module';
import { TrainingModule } from './modules/personal/training/training.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot(),
    PrismaModule,
    AuthModule,
    UsersModule,
    OrdersModule,
    FinanceModule,
    IntegrationsModule,
    TablesModule,
    BillingModule,
    ProductsModule,
    UploadModule,
    WaitingListModule,
    CustomersModule,
    DashboardModule,
    InventoryModule,
    HubModule,
    FitModule,
    GymModule,
    CloudModule,
    CortexModule,
    ClockModule,
    TrainingModule
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware)
      .forRoutes('*');
  }
}

