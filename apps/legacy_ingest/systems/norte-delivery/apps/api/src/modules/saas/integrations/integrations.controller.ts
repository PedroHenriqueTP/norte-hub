import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { IntegrationsService, ConnectIntegrationDto } from './integrations.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { IntegrationProvider } from '@prisma/client';

@Controller('integrations')
@UseGuards(JwtAuthGuard)
export class IntegrationsController {
    constructor(private readonly integrationsService: IntegrationsService) { }

    @Get()
    async findAll(@Request() req: any) {
        return this.integrationsService.getIntegrations(req.user.tenantId);
    }

    @Post('connect')
    async connect(@Request() req: any, @Body() dto: ConnectIntegrationDto) {
        return this.integrationsService.connect(req.user.tenantId, dto);
    }

    @Post('store-status')
    async toggleStoreStatus(@Request() req: any, @Body() body: { isOpen: boolean }) {
        return this.integrationsService.toggleStoreStatus(req.user.tenantId, body.isOpen);
    }

    @Delete(':provider')
    async disconnect(@Request() req: any, @Param('provider') provider: IntegrationProvider) {
        return this.integrationsService.disconnect(req.user.tenantId, provider);
    }
}
