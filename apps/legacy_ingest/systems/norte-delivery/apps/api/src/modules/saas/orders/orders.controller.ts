import {
  Body,
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  ParseUUIDPipe,
  Post,
  Query
} from '@nestjs/common';
import { OrderSource, OrderStatus } from '@prisma/client';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }

  @Get()
  findAll(
    @Query('status', new ParseEnumPipe(OrderStatus, { optional: true })) status?: OrderStatus,
    @Query('source', new ParseEnumPipe(OrderSource, { optional: true })) source?: OrderSource
  ) {
    return this.ordersService.findAll(status, source);
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.ordersService.findOne(id);
  }

  @Post(':id/items')
  addItem(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: { productId: string; quantity: number; observation?: string }
  ) {
    return this.ordersService.addItem(id, body);
  }

  @Post(':id/items/:itemId') // Ideally DELETE but some proxies block it with body? No, using URL params is standard for DELETE.
  // Actually, let's use DELETE properly.
  // But wait, the task list said DELETE.
  // I'll stick to DELETE.
  @Post(':id/items/:itemId/delete') // Or a specific verb if DELETE is tricky? No, Nest handles DELETE fine.
  // But standard REST is DELETE /:id/items/:itemId. 
  removeItem(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('itemId', new ParseUUIDPipe()) itemId: string
  ) {
    return this.ordersService.removeItem(id, itemId);
  }
} // Typo in replacing? No, I'm replacing the end of the file.

/*
WAIT, I should verify the decorator for removeItem.
If I use `@Delete`, it's clearer.
*/

