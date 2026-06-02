import { Injectable, OnModuleInit, OnModuleDestroy, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@norte/database';
import { TenantContext } from '../tenant/tenant.context';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private _extendedClient: any;

  constructor() {
    super();
    const baseClient = this;
    const exclusions = ['Tenant', 'Subscription', 'OrderItem', 'User', 'ProductRecipe', 'StockMovement'];

    this._extendedClient = this.$extends({
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
          },
          async update({ model, args, query }) {
            const tenantId = TenantContext.getTenantId();
            if (tenantId && !exclusions.includes(model as string)) {
              const count = await (baseClient as any)[model].count({
                where: { ...args.where, tenantId }
              });
              if (count === 0) {
                throw new BadRequestException(`Access denied or record not found in ${model}`);
              }
            }
            return query(args);
          },
          async delete({ model, args, query }) {
            const tenantId = TenantContext.getTenantId();
            if (tenantId && !exclusions.includes(model as string)) {
              const count = await (baseClient as any)[model].count({
                where: { ...args.where, tenantId }
              });
              if (count === 0) {
                throw new BadRequestException(`Access denied or record not found in ${model}`);
              }
            }
            return query(args);
          },
          async updateMany({ model, args, query }) {
            const tenantId = TenantContext.getTenantId();
            if (tenantId && !exclusions.includes(model as string)) {
              (args as any).where = { ...args.where, tenantId };
            }
            return query(args);
          },
          async deleteMany({ model, args, query }) {
            const tenantId = TenantContext.getTenantId();
            if (tenantId && !exclusions.includes(model as string)) {
              (args as any).where = { ...args.where, tenantId };
            }
            return query(args);
          }
        }
      }
    });

    // Wrap the service instance with a Proxy to transparently delegate calls to the extended client
    return new Proxy(this, {
      get(target, prop) {
        // Lifecycle methods and essential client connection methods should run on target
        if (
          prop === 'onModuleInit' ||
          prop === 'onModuleDestroy' ||
          prop === '$connect' ||
          prop === '$disconnect' ||
          prop === 'constructor' ||
          prop === '_extendedClient'
        ) {
          return target[prop as keyof PrismaService];
        }
        return target._extendedClient[prop];
      }
    }) as any;
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  // Backwards compatibility helper in case any file directly accesses .extended
  get extended() {
    return this._extendedClient;
  }
}
