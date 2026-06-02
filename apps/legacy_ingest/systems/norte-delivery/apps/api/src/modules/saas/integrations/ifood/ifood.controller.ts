import { Body, Controller, Post } from '@nestjs/common';
import { IfoodService } from './ifood.service';
import { IfoodOrderPayload } from './ifood.mapper';

@Controller('integrations/ifood')
export class IfoodController {
  constructor(private readonly ifoodService: IfoodService) {}

  @Post('orders')
  receiveOrder(@Body() payload: IfoodOrderPayload) {
    return this.ifoodService.receiveOrder(payload);
  }
}

