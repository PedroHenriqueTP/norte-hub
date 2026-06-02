import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@norte/database';
import { TenantContext } from '../tenant/tenant.context';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  get extended() {
    const baseClient = this;
    const exclusions = ['Tenant', 'Subscription', 'OrderItem', 'User', 'ProductRecipe', 'StockMovement'];
    return this.$extends({
      query: {
        $allModels: {
          async findUnique({ model, args, query }) {
            const tenantId = TenantContext.getTenantId();
            if (tenantId && !exclusions.includes(model as string)) {
              return (baseClient as any)[model].findFirst({
                where: {
                  ...args.where,
                  tenantId
                }
              });
            }
            return query(args);
          },
          async findMany({ model, args, query }) {
            const tenantId = TenantContext.getTenantId();
            if (tenantId && !exclusions.includes(model as string)) {
              (args as any).where = { ...args.where, tenantId };
            }
            return query(args);
          },
          async findFirst({ model, args, query }) {
            const tenantId = TenantContext.getTenantId();
            if (tenantId && !exclusions.includes(model as string)) {
              (args as any).where = { ...args.where, tenantId };
            }
            return query(args);
          },
          async create({ model, args, query }) {
            const tenantId = TenantContext.getTenantId();
            if (tenantId && !exclusions.includes(model as string)) {
              (args as any).data = { ...args.data, tenantId };
            }
            return query(args);
          }
        }
      }
    });
  }
}
