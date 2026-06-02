import { Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { PrismaModule } from '../../../common/prisma/prisma.module';

import { AuthModule } from '../../auth/auth.module';
@Module({
    imports: [PrismaModule, AuthModule],
    controllers: [BillingController],
    providers: [BillingService],
})
export class BillingModule { }
