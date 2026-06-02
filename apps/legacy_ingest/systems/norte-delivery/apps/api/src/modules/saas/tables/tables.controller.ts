
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { TablesService } from './tables.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { SubscriptionGuard } from '../../../common/guards/subscription.guard';

@Controller('tables')
@UseGuards(JwtAuthGuard) // Removed SubscriptionGuard temporarily for debugging
export class TablesController {
    constructor(private readonly tablesService: TablesService) { }

    @Post()
    async create(@Request() req: any, @Body() createTableDto: { name: string; capacity: number }) {
        console.log('DEBUG: Create Table HIT');
        console.log('User:', req.user);

        if (!req.user || !req.user.tenantId) {
            console.error('DEBUG: Missing User/Tenant');
            throw new BadRequestException('Usuario sem tenant');
        }

        try {
            return await this.tablesService.create(req.user.tenantId, createTableDto);
        } catch (e: any) {
            console.error('DEBUG: Service threw:', e);
            throw new BadRequestException(e.message);
        }
    }

    @Get()
    findAll(@Request() req: any) {
        return this.tablesService.findAll(req.user.tenantId);
    }

    @Patch(':id')
    update(@Request() req: any, @Param('id') id: string, @Body() updateTableDto: { name?: string; capacity?: number; status?: string }) {
        return this.tablesService.update(req.user.tenantId, +id, updateTableDto);
    }

    @Delete(':id')
    remove(@Request() req: any, @Param('id') id: string) {
        return this.tablesService.remove(req.user.tenantId, +id);
    }

    @Post(':id/open')
    open(@Request() req: any, @Param('id') id: string, @Body() body: { clientName: string; userId?: string }) {
        return this.tablesService.openTable(req.user.tenantId, +id, body.clientName, body.userId);
    }

    @Post(':id/close')
    close(@Request() req: any, @Param('id') id: string, @Body() body: { paymentMethod: 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX' | 'CASH'; amount: number }) {
        return this.tablesService.closeTable(req.user.tenantId, +id, body.paymentMethod, body.amount);
    }
}
