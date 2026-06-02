import { Injectable } from '@nestjs/common';
import { OrdersService } from '../saas/orders/orders.service';
import { FinanceService } from '../saas/finance/finance.service';
import { TablesService } from '../saas/tables/tables.service';
import { TenantContext } from '../../common/tenant/tenant.context';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly financeService: FinanceService,
    private readonly tablesService: TablesService
  ) {}

  async getStats() {
    const tenantId = TenantContext.getTenantId();
    if (!tenantId) throw new Error('Tenant Context required');

    const allOrders = await this.ordersService.findAll();
    const activeDelivery = allOrders.filter(
      (o: any) => o.status !== OrderStatus.CANCELED && o.status !== OrderStatus.COMPLETED
    );

    const allTables = await this.tablesService.findAll(tenantId);
    const occupiedTables = allTables.filter((t: any) => t.status === 'Ocupada');

    const dailyBalance = await this.financeService.getDailyBalance(tenantId);

    const recentOrders = allOrders.slice(0, 5).map((o: any) => ({
      id: o.externalId || o.id.substring(0, 6),
      client: o.user?.name || 'Cliente',
      status: o.status,
      total: `R$ ${Number(o.total).toFixed(2)}`,
      time: 'Now',
      bg: this.getStatusColor(o.status)
    }));

    return {
      delivery: { active: activeDelivery.length },
      tables: { occupied: occupiedTables.length, total: allTables.length },
      reservations: { today: 0 },
      finance: { today: dailyBalance.totalIncome },
      recentOrders
    };
  }

  async getsystemsMetrics() {
    return {
      mrr: 15490.0,
      activeTenants: 12,
      totalUsers: 3450,
      churnRate: 2.1,
      recentSignups: [
        { name: 'Pizzaria do Luigi', plan: 'ENTERPRISE', date: 'Hoje' },
        { name: 'Sushi House', plan: 'PRO', date: 'Ontem' },
        { name: 'Burger King (Franquia)', plan: 'ENTERPRISE', date: '2 dias atrás' }
      ]
    };
  }

  private getStatusColor(status: OrderStatus) {
    switch (status) {
      case OrderStatus.PENDING:
        return 'bg-gray-100 text-gray-600';
      case OrderStatus.PREPARING:
        return 'bg-yellow-100 text-yellow-800';
      case OrderStatus.READY:
        return 'bg-blue-100 text-blue-800';
      case OrderStatus.DELIVERING:
        return 'bg-orange-100 text-orange-800';
      case OrderStatus.COMPLETED:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  }
}
