import { Injectable } from '@nestjs/common';
import { Prisma, OrderSource } from '@prisma/client';
import { FinanceService } from '../../finance/finance.service';
import { OrdersService } from '../../orders/orders.service';
import { IfoodMapper, IfoodOrderPayload } from './ifood.mapper';

@Injectable()
export class IfoodService {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly financeService: FinanceService,
    private readonly mapper: IfoodMapper
  ) {}

  async receiveOrder(payload: IfoodOrderPayload) {
    const dto = this.mapper.toCreateOrderDto(payload);
    const order = await this.ordersService.create(dto);

    if (payload.marketplaceFee && payload.marketplaceFee > 0) {
      await this.financeService.recordMarketplaceFee({
        source: OrderSource.IFOOD,
        amount: new Prisma.Decimal(payload.marketplaceFee),
        orderId: order.id,
        description: `Taxa iFood ${payload.externalId ?? payload.orderId}`
      });
    }

    return order;
  }
}

