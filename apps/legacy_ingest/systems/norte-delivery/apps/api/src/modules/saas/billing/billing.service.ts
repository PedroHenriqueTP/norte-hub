import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { AppSlug } from '@prisma/client';

@Injectable()
export class BillingService {
    private readonly logger = new Logger(BillingService.name);

    constructor(private readonly prisma: PrismaService) { }

    async createCheckoutSession(tenantId: string, planId: string) {
        this.logger.log(`Creating checkout session for tenant ${tenantId} plan ${planId}`);
        return { url: `https://checkout.stripe.com/mock-session?tenantId=${tenantId}&planId=${planId}` };
    }

    async handleWebhook(payload: any) {
        if (!payload || !payload.event) {
            throw new BadRequestException('Payload inválido');
        }

        const { event, data } = payload;
        this.logger.log(`Handling billing webhook event: ${event}`);

        switch (event) {
            case 'payment_received':
            case 'invoice.paid':
            case 'checkout.session.completed': {
                const tenantId = data.tenantId;
                const userId = data.userId;
                const appSlug = (data.appSlug as AppSlug) || AppSlug.NORTE_BAR;
                const planLevel = data.planLevel || 'PRO';

                const expiresAt = new Date();
                expiresAt.setDate(expiresAt.getDate() + 30);

                await this.prisma.$transaction(async (tx) => {
                    const existing = await tx.subscription.findFirst({
                        where: tenantId ? { tenantId, appSlug } : { userId, appSlug }
                    });

                    if (existing) {
                        await tx.subscription.update({
                            where: { id: existing.id },
                            data: {
                                status: 'ACTIVE',
                                planLevel,
                                expiresAt
                            }
                        });
                    } else {
                        await tx.subscription.create({
                            data: {
                                tenantId,
                                userId,
                                appSlug,
                                planLevel,
                                status: 'ACTIVE',
                                expiresAt
                            }
                        });
                    }

                    if (tenantId) {
                        const features = planLevel === 'PRO'
                            ? [
                                { feature: 'DELIVERY_APP', enabled: true },
                                { feature: 'TABLES_LIMIT_999', enabled: true }
                              ]
                            : [
                                { feature: 'DELIVERY_APP', enabled: false },
                                { feature: 'TABLES_LIMIT_15', enabled: true }
                              ];

                        for (const f of features) {
                            await tx.tenantFeature.upsert({
                                where: {
                                    tenantId_feature: {
                                        tenantId,
                                        feature: f.feature
                                    }
                                },
                                update: { enabled: f.enabled },
                                create: {
                                    tenantId,
                                    feature: f.feature,
                                    enabled: f.enabled
                                }
                            });
                        }
                    }
                });
                break;
            }

            case 'payment_overdue':
            case 'invoice.payment_failed': {
                const tenantId = data.tenantId;
                const userId = data.userId;
                const appSlug = (data.appSlug as AppSlug) || AppSlug.NORTE_BAR;

                const subs = await this.prisma.subscription.findMany({
                    where: tenantId ? { tenantId, appSlug } : { userId, appSlug }
                });

                for (const sub of subs) {
                    await this.prisma.subscription.update({
                        where: { id: sub.id },
                        data: { status: 'PAST_DUE' }
                    });
                }
                break;
            }

            case 'subscription_deleted':
            case 'invoice.canceled': {
                const tenantId = data.tenantId;
                const userId = data.userId;
                const appSlug = (data.appSlug as AppSlug) || AppSlug.NORTE_BAR;

                const subs = await this.prisma.subscription.findMany({
                    where: tenantId ? { tenantId, appSlug } : { userId, appSlug }
                });

                for (const sub of subs) {
                    await this.prisma.subscription.update({
                        where: { id: sub.id },
                        data: { status: 'CANCELED' }
                    });
                }
                break;
            }

            default:
                this.logger.warn(`Unhandled webhook event: ${event}`);
        }

        return { received: true };
    }
}
