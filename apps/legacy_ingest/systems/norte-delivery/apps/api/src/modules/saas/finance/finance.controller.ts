import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { PaymentMethod, TransactionType, Prisma } from '@prisma/client';

@Controller('finance')
@UseGuards(JwtAuthGuard)
export class FinanceController {
    constructor(private readonly financeService: FinanceService) { }

    @Get()
    async getSummary(@Request() req: any) {
        // Mock summary for now, or implement a real aggregation service method
        // Ideally should call this.financeService.getDailySummary(req.user.tenantId)
        return {
            totalRevenue: 12450.00,
            averageTicket: 85.20,
            netProfit: 3890.00
        };
    }

    @Get('daily-balance')
    async getDailyBalance(@Request() req: any) {
        return this.financeService.getDailyBalance(req.user.tenantId);
    }

    @Get('transactions')
    async getTransactions(@Request() req: any) {
        // Return list of latest transactions
        return this.financeService.getTransactions(req.user.tenantId);
    }



    @Post('transactions')
    async createTransaction(@Request() req: any, @Body() body: {
        amount: number;
        type: TransactionType;
        paymentMethod?: string;
        description: string;
        category?: string;
        occurredAt?: string;
        attachmentUrl?: string;
    }) {
        return this.financeService.recordManualTransaction({
            amount: new Prisma.Decimal(body.amount),
            type: body.type,
            paymentMethod: body.paymentMethod as PaymentMethod,
            description: body.description,
            category: body.category,
            occurredAt: body.occurredAt ? new Date(body.occurredAt) : undefined,
            attachmentUrl: body.attachmentUrl,
            authorId: req.user.id, // Audit Logging

        });
    }

    @Post('invoices')
    async createInvoice(@Request() req: any, @Body() body: { orderId: string }) {
        return this.financeService.emitInvoice(req.user.tenantId, body.orderId);
    }
}
