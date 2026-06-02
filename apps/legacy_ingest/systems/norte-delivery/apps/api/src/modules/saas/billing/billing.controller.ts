import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { BillingService } from './billing.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('billing')
export class BillingController {
    constructor(private readonly billingService: BillingService) { }

    @Post('checkout')
    @UseGuards(AuthGuard('jwt'))
    async createCheckout(@Req() req: any, @Body() body: { planId: string }) {
        const { tenantId } = req.user;
        return this.billingService.createCheckoutSession(tenantId, body.planId);
    }

    @Post('webhook')
    async webhook(@Body() payload: any) {
        return this.billingService.handleWebhook(payload);
    }
}
