import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, OrderSource, OrderStatus, PaymentMethod } from '@prisma/client';
import { randomBytes } from 'crypto';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { FinanceService } from '../finance/finance.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersGateway } from './orders.gateway';
import { ORDER_INCLUDE, OrderWithDetails } from './entities/order.entity';
import { TenantContext } from '../../../common/tenant/tenant.context';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly financeService: FinanceService,
    private readonly gateway: OrdersGateway
  ) { }

  async create(dto: CreateOrderDto): Promise<OrderWithDetails> {
    const tenantId = TenantContext.getTenantId();
    if (!tenantId) throw new Error('Tenant Context missing for Order');

    const client = this.prisma.extended; // Use Extended Client

    if (!dto.items?.length) {
      throw new BadRequestException('Informe pelo menos um item para o pedido.');
    }

    const externalId = dto.externalId?.trim();
    if (externalId) {
      // Logic for idempotency
      // Note: findUnique in extension passes through. 
      // ideally externalId is unique per Tenant, but schema has @unique global. 
      const existingOrder = await client.order.findUnique({ where: { externalId } });
      if (existingOrder) {
        return this.findOne(existingOrder.id);
      }
    }

    const customerId = await this.ensureCustomer(dto.customer, dto.customerId);
    const addressRelation = this.buildAddressRelation(dto, customerId);

    if (!addressRelation) {
      throw new BadRequestException('Informe um endereço para entrega.');
    }

    const productIds = [...new Set(dto.items.map((item) => item.productId))];
    const products = await client.product.findMany({
      where: { id: { in: productIds } }
    });

    if (products.length !== productIds.length) {
      throw new BadRequestException('Um ou mais produtos não foram encontrados.');
    }

    const itemsData = dto.items.map((item) => {
      const product = products.find((record: any) => record.id === item.productId);
      if (!product) {
        throw new BadRequestException(`Produto ${item.productId} não encontrado.`);
      }

      return {
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
        observation: item.observation,
        // OrderItem doesn't have tenantId in my simplistic plan, 
        // OR wait, I removed it from schema plan? 
        // Order has tenantId. OrderItems conceptually belong to Order.
        // Prisma create logic will use the context for the Root Order.
      };
    });

    const subtotal = itemsData.reduce(
      (acc, item) => acc.plus(item.price.mul(item.quantity)),
      new Prisma.Decimal(0)
    );
    const deliveryFee = new Prisma.Decimal(dto.deliveryFee ?? 0);
    const discount = new Prisma.Decimal(dto.discount ?? 0);
    const total = Prisma.Decimal.max(subtotal.plus(deliveryFee).minus(discount), new Prisma.Decimal(0));
    const marketplaceFee = new Prisma.Decimal(Math.max(0, dto.marketplaceFee ?? 0));

    // TenantId is automatically injected by the extended client
    const createdOrder = await client.order.create({
      data: {
        user: customerId ? { connect: { id: customerId } } : undefined,
        address: addressRelation,
        subtotal,
        deliveryFee,
        discount,
        total,
        status: OrderStatus.PENDING,
        source: dto.source ?? OrderSource.OWN_APP,
        notes: dto.notes,
        externalId: externalId ?? undefined,
        items: {
          create: itemsData
        }
      } as any, // 'as any' might still be needed if types are strict about expected tenantId, but runtime is safe
      include: ORDER_INCLUDE
    });

    await this.financeService.recordOrderTransaction({
      orderId: createdOrder.id,
      amount: total,
      paymentMethod: dto.paymentMethod ?? PaymentMethod.CASH,
      feeAmount: marketplaceFee.isZero() ? undefined : marketplaceFee
    });

    this.gateway.broadcast(createdOrder as any);
    return createdOrder as any;
  }

  async findAll(status?: OrderStatus, source?: OrderSource) {
    const filters: Prisma.OrderWhereInput = {};
    if (status) {
      filters.status = status;
    }
    if (source) {
      filters.source = source;
    }

    return this.prisma.extended.order.findMany({
      where: filters,
      orderBy: { createdAt: 'desc' },
      include: ORDER_INCLUDE
    });
  }

  async findOne(id: string) {
    // Use findFirst to ensure Tenant Filter is applied (findUnique is not intercepted by current extension)
    const order = await this.prisma.extended.order.findFirst({
      where: { id },
      include: ORDER_INCLUDE
    });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado.');
    }
    return order as any;
  }

  private buildAddressRelation(
    dto: CreateOrderDto,
    customerId?: string
  ): any | undefined {
    if (dto.addressId) {
      return { connect: { id: dto.addressId } };
    }

    if (!dto.address) {
      return undefined;
    }

    if (!customerId) {
      throw new BadRequestException('É necessário associar um cliente para criar o endereço.');
    }

    const tenantId = TenantContext.getTenantId();
    if (!tenantId) throw new Error('Tenant Context missing for Address');

    return {
      create: {
        street: dto.address.street,
        number: dto.address.number,
        complement: dto.address.complement,
        neighborhood: dto.address.neighborhood,
        city: dto.address.city,
        zipCode: dto.address.zipCode,
        userId: customerId,
        tenant: { connect: { id: tenantId } },
      }
    };
  }

  async addItem(orderId: string, itemDto: { productId: string; quantity: number; observation?: string }) {
    try {
      console.log(`[OrdersService] Adding item to order ${orderId}`, itemDto);
      const client = this.prisma.extended;

      // 1. Find Order and Product
      // Use findFirst for Product to ensure tenant isolation
      const order = await this.findOne(orderId);
      const product = await client.product.findFirst({ where: { id: itemDto.productId } });

      if (!product) throw new NotFoundException('Produto não encontrado');

      console.log(`[OrdersService] Product found: ${product.name}, Price: ${product.price}`);

      // 2. Calculate Item Price
      // FIX: Ensure convert to string before creating new Decimal to avoid object-in-constructor issues
      const itemPrice = new Prisma.Decimal(product.price.toString());
      const itemTotal = itemPrice.mul(itemDto.quantity);

      console.log(`[OrdersService] Calculated Total: ${itemTotal}`);

      // 3. Create Item
      await client.orderItem.create({
        data: {
          orderId: order.id,
          productId: product.id,
          quantity: itemDto.quantity,
          price: itemPrice,
          observation: itemDto.observation
        }
      });

      // 4. Update Order Totals
      const newSubtotal = new Prisma.Decimal(order.subtotal.toString()).plus(itemTotal);
      const newTotal = new Prisma.Decimal(order.total.toString()).plus(itemTotal);

      const updatedOrder = await client.order.update({
        where: { id: order.id },
        data: {
          subtotal: newSubtotal,
          total: newTotal
        },
        include: ORDER_INCLUDE
      });

      try {
        this.gateway.broadcast(updatedOrder as any);
      } catch (broadcastError) {
        console.error('[OrdersService] Broadcast failed (non-critical):', broadcastError);
      }

      return updatedOrder as any;
    } catch (error) {
      console.error('[OrdersService] Error adding item:', error);
      throw error;
    }
  }

  async removeItem(orderId: string, itemId: string) {
    const client = this.prisma.extended;

    // 1. Find Item
    const item = await client.orderItem.findUnique({
      where: { id: itemId }
    });

    if (!item || item.orderId !== orderId) { // Basic security check
      throw new NotFoundException('Item não encontrado neste pedido');
    }

    // 2. Calculate Deduction
    const itemTotal = item.price.mul(item.quantity);

    // 3. Delete Item
    await client.orderItem.delete({
      where: { id: itemId }
    });

    // 4. Update Order Totals
    const order = await this.findOne(orderId);
    const newSubtotal = order.subtotal.minus(itemTotal);
    const newTotal = order.total.minus(itemTotal);

    const updatedOrder = await client.order.update({
      where: { id: order.id },
      data: {
        subtotal: newSubtotal,
        total: newTotal
      },
      include: ORDER_INCLUDE
    });

    this.gateway.broadcast(updatedOrder as any);
    return updatedOrder as any;
  }

  async assignDriver(orderId: string, driverId: string) {
    const order = await this.prisma.extended.order.update({
      where: { id: orderId },
      data: {
        driverId,
        status: OrderStatus.DELIVERING
      },
      include: ORDER_INCLUDE
    });

    this.gateway.broadcast(order as any);
    return order as any;
  }

  private async ensureCustomer(customer?: CreateOrderDto['customer'], customerId?: string) {
    if (customerId) {
      return customerId;
    }

    if (!customer) {
      return undefined;
    }

    const email =
      customer.email ??
      `guest-${customer.phone ?? randomBytes(6).toString('hex')}@delivery.platform`;
    const password = randomBytes(24).toString('hex');

    const tenantId = TenantContext.getTenantId();
    if (!tenantId) throw new Error('Tenant Context missing during User Upsert');
    const user = await this.prisma.user.upsert({
      where: { email },
      update: { name: customer.name, phone: customer.phone ?? undefined },
      create: {
        name: customer.name,
        email,
        password,
        phone: customer.phone,
        tenants: {
          create: {
            tenantId,
            role: 'CUSTOMER'
          }
        }
      }
    });
    return user.id;
  }

  async testConcurrency() {
    const iterations = 100;
    const promises = [];
    const results = {
      total: iterations,
      successCount: 0,
      failures: [] as any[]
    };

    for (let i = 0; i < iterations; i++) {
      const expectedTenantId = `tenant-${i % 5}`; // 5 distinct tenants
      
      promises.push(
        new Promise<void>((resolve) => {
          TenantContext.run(expectedTenantId, async () => {
            try {
              // Introduce random async delay to force event loop context switching
              await new Promise((r) => setTimeout(r, Math.random() * 50));
              
              // Verify active context in AsyncLocalStorage
              const actualTenantId = TenantContext.getTenantId();
              
              if (actualTenantId !== expectedTenantId) {
                results.failures.push({
                  iteration: i,
                  expected: expectedTenantId,
                  actual: actualTenantId,
                  type: 'ContextLeak'
                });
              } else {
                results.successCount++;
              }
            } catch (err: any) {
              results.failures.push({
                iteration: i,
                error: err.message
              });
            } finally {
              resolve();
            }
          });
        })
      );
    }

    await Promise.all(promises);
    return results;
  }
}

