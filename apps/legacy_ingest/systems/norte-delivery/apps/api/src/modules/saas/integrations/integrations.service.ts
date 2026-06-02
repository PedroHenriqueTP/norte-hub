import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { IntegrationProvider } from '@prisma/client';

export class ConnectIntegrationDto {
    provider!: IntegrationProvider;
    code?: string; // OAuth Code
    merchantId?: string;
    clientId?: string;
    clientSecret?: string;
}

@Injectable()
export class IntegrationsService {
    constructor(private prisma: PrismaService) { }

    async getIntegrations(tenantId: string) {
        return this.prisma.integration.findMany({
            where: { tenantId }
        });
    }

    async connect(tenantId: string, dto: ConnectIntegrationDto) {
        // Logic specific per provider would go here (ex: exchange code for token)
        // For infrastructure, we store provided info for now.

        const existing = await this.prisma.integration.findUnique({
            where: {
                tenantId_provider: {
                    tenantId,
                    provider: dto.provider
                }
            }
        });

        if (existing) {
            return this.prisma.integration.update({
                where: { id: existing.id },
                data: {
                    isActive: true,
                    merchantId: dto.merchantId,
                    accessToken: dto.code || 'mock_token', // Mock for now if no real oauth
                    updatedAt: new Date()
                }
            });
        }

        return this.prisma.integration.create({
            data: {
                tenantId,
                provider: dto.provider,
                isActive: true,
                merchantId: dto.merchantId,
                accessToken: dto.code || 'mock_token'
            }
        });
    }

    async syncProduct(tenantId: string, product: any, action: 'CREATE' | 'UPDATE' | 'DELETE') {
        const integrations = await this.prisma.integration.findMany({
            where: { tenantId, isActive: true }
        });

        for (const integration of integrations) {
            console.log(`[Integration] Syncing product ${product.name} (${action}) to ${integration.provider}...`);
            // Mock API Call
            // if (integration.provider === 'IFOOD') await this.ifoodAdapter.updateProduct(...)
        }
    }

    async toggleStoreStatus(tenantId: string, isOpen: boolean) {
        const integrations = await this.prisma.integration.findMany({
            where: { tenantId, isActive: true }
        });

        const results = [];
        for (const integration of integrations) {
            console.log(`[Integration] Setting store status to ${isOpen ? 'OPEN' : 'CLOSED'} on ${integration.provider}`);
            // Mock API Call
            results.push({ provider: integration.provider, status: isOpen ? 'OPEN' : 'CLOSED', success: true });
        }
        return results;
    }

    async disconnect(tenantId: string, provider: IntegrationProvider) {
        return this.prisma.integration.update({
            where: {
                tenantId_provider: {
                    tenantId,
                    provider
                }
            },
            data: {
                isActive: false
            }
        });
    }
}
