import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { IntegrationsModule } from '../integrations/integrations.module';
import { CommonModule } from '../../../common/common.module';

@Module({
    imports: [CommonModule, IntegrationsModule],
    controllers: [ProductsController],
    providers: [ProductsService],
    exports: [ProductsService],
})
export class ProductsModule { }
