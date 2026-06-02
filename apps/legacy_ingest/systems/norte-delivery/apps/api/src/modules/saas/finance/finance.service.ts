import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { Prisma, TransactionType, PaymentMethod } from '@prisma/client';

import { TenantContext } from '../../../common/tenant/tenant.context';

@Injectable()
export class FinanceService {
  constructor(private readonly prisma: PrismaService) { }

  async recordOrderTransaction(params: {
    orderId: string;
    amount: Prisma.Decimal;
    paymentMethod?: PaymentMethod;
    feeAmount?: Prisma.Decimal;
  }) {
    const fee = params.feeAmount ?? new Prisma.Decimal(0);
    const netAmount = params.amount.minus(fee);
    const tenantId = TenantContext.getTenantId();

    if (!tenantId) {
      throw new Error('Tenant Context missing for Transaction');
    }

    return this.prisma.transaction.create({
      data: {
        orderId: params.orderId,
        amount: params.amount,
        type: TransactionType.INCOME,
        paymentMethod: params.paymentMethod,
        netAmount,
        feeAmount: fee.isZero() ? undefined : fee,
        description: `Venda Pedido ${params.orderId}`,
        tenantId
      }
    });
  }

  async recordMarketplaceFee(params: {
    source: string;
    amount: Prisma.Decimal;
    orderId?: string;
    description?: string;
  }) {
    const tenantId = TenantContext.getTenantId();
    if (!tenantId) throw new Error('Tenant Context missing');

    return this.prisma.transaction.create({
      data: {
        orderId: params.orderId,
        amount: params.amount,
        type: TransactionType.EXPENSE,
        description: params.description ?? `Taxa ${params.source}`,
        netAmount: params.amount.neg(),
        feeAmount: params.amount,
        tenantId
      }
    });
  }


  async getTransactions(tenantId: string) {
    return this.prisma.transaction.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
  }

  async getDailyBalance(tenantId: string) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const transactions = await this.prisma.transaction.findMany({
      where: {
        tenantId,
        createdAt: {
          gte: startOfDay,
          lte: endOfDay
        }
      }
    });

    const balance: {
      totalIncome: Prisma.Decimal;
      totalExpense: Prisma.Decimal;
      byMethod: Record<string, Prisma.Decimal>;
    } = {
      totalIncome: new Prisma.Decimal(0),
      totalExpense: new Prisma.Decimal(0),
      byMethod: {
        [PaymentMethod.CASH]: new Prisma.Decimal(0),
        [PaymentMethod.CREDIT_CARD]: new Prisma.Decimal(0),
        [PaymentMethod.DEBIT_CARD]: new Prisma.Decimal(0),
        [PaymentMethod.PIX]: new Prisma.Decimal(0),
        [PaymentMethod.VOUCHER]: new Prisma.Decimal(0),
      }
    };

    transactions.forEach(t => {
      if (t.type === TransactionType.INCOME) {
        balance.totalIncome = balance.totalIncome.plus(t.amount);
        if (t.paymentMethod) {
          const current = balance.byMethod[t.paymentMethod] || new Prisma.Decimal(0);
          balance.byMethod[t.paymentMethod] = current.plus(t.amount);
        }
      } else if (t.type === TransactionType.EXPENSE) {
        balance.totalExpense = balance.totalExpense.plus(t.amount);
      }
    });

    return {
      totalIncome: balance.totalIncome.toNumber(),
      totalExpense: balance.totalExpense.toNumber(),
      finalBalance: balance.totalIncome.minus(balance.totalExpense).toNumber(),
      byMethod: Object.fromEntries(
        Object.entries(balance.byMethod).map(([k, v]) => [k, v.toNumber()])
      )
    };
  }

  async recordManualTransaction(params: {
    amount: Prisma.Decimal;
    type: TransactionType; // Allow specifying type (IN/OUT)
    paymentMethod?: PaymentMethod;
    description: string;
    category?: string;
    occurredAt?: Date;
    attachmentUrl?: string;
    authorId?: string;
  }) {
    const tenantId = TenantContext.getTenantId();
    if (!tenantId) throw new Error('Tenant Context missing');

    const netAmount = params.type === TransactionType.EXPENSE
      ? params.amount.neg()
      : params.amount;

    return this.prisma.transaction.create({
      data: {
        amount: params.amount,
        type: params.type,
        paymentMethod: params.paymentMethod,
        netAmount: netAmount,
        description: params.description,
        category: params.category,
        occurredAt: params.occurredAt || new Date(),
        attachmentUrl: params.attachmentUrl,
        authorId: params.authorId,
        tenantId
      }
    });
  }

  async emitInvoice(tenantId: string, orderId: string) {
    // 1. Check if invoice exists
    const existing = await this.prisma.invoice.findUnique({
      where: { orderId }
    });

    if (existing) {
      if (existing.status === 'ERROR') {
        // Retry logic could go here
      }
      return existing;
    }

    // 2. Mock Emission ( Simulate Sefaz/Broker )
    const mockNumber = Math.floor(Math.random() * 10000).toString().padStart(6, '0');
    const mockSeries = '1';

    // 3. Create Record
    return this.prisma.invoice.create({
      data: {
        tenantId,
        orderId,
        status: 'AUTHORIZED', // Immediate success for demo
        number: mockNumber,
        series: mockSeries,
        issuedAt: new Date(),
        pdfUrl: `https://fake-sefaz.com/nfe/${mockNumber}.pdf`,
        xmlUrl: `https://fake-sefaz.com/nfe/${mockNumber}.xml`
      }
    });
  }
}
