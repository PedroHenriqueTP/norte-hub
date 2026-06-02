
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';

@Injectable()
export class TablesService {
    constructor(private prisma: PrismaService) { }

    async create(tenantId: string, data: { name: string; capacity: number }) {
        try {
            console.log('TablesService.create accessing DB...', { tenantId, data });
            return await this.prisma.table.create({
                data: {
                    name: data.name,
                    capacity: data.capacity,
                    tenantId
                }
            });
        } catch (error: any) {
            console.error('Error creating table:', error);
            throw new BadRequestException(`Erro ao criar mesa: ${error.message}`);
        }
    }

    async findAll(tenantId: string) {
        // Fetch tables with their active orders (if any)
        const tables = await this.prisma.table.findMany({
            where: { tenantId },
            orderBy: { id: 'asc' },
            include: {
                orders: {
                    where: {
                        status: { in: ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERING'] }
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                    include: {
                        items: true
                    }
                }
            }
        });

        // Transform for frontend simplicity
        return tables.map(t => {
            const activeOrder = t.orders[0];
            return {
                ...t,
                status: activeOrder ? 'Ocupada' : 'Livre',
                client: activeOrder?.notes?.split('|')[0] || '',
                total: activeOrder?.total || 0,
                activeOrderId: activeOrder?.id,
                items: activeOrder?.items || [],
                time: activeOrder ? this.calculateTimeDiff(activeOrder.createdAt) : ''
            };
        });
    }

    private calculateTimeDiff(date: Date) {
        const diffMs = new Date().getTime() - new Date(date).getTime();
        const minutes = Math.floor(diffMs / 60000);
        const hours = Math.floor(minutes / 60);
        if (hours > 0) return `${hours}h ${minutes % 60}m`;
        return `${minutes}m`;
    }

    async update(tenantId: string, id: number, data: { name?: string; capacity?: number; status?: string }) {
        const table = await this.prisma.table.findFirst({
            where: { id, tenantId }
        });

        if (!table) throw new NotFoundException('Mesa não encontrada');

        return this.prisma.table.update({
            where: { id },
            data
        });
    }

    async remove(tenantId: string, id: number) {
        // Use deleteMany to ensure tenant safety safely
        const result = await this.prisma.table.deleteMany({
            where: { id, tenantId }
        });

        if (result.count === 0) throw new NotFoundException('Mesa não encontrada');
        return result;
    }

    async openTable(tenantId: string, id: number, clientName: string, userId?: string) {
        // 1. Check if table is already occupied
        const table = await this.prisma.table.findFirst({
            where: { id, tenantId },
            include: {
                orders: {
                    where: { status: { notIn: ['COMPLETED', 'CANCELED'] } }
                }
            }
        });

        if (!table) throw new NotFoundException('Mesa não encontrada');
        if (table.orders.length > 0) throw new BadRequestException('Mesa já está ocupada');

        // 2. Create Order linked to Table
        return this.prisma.order.create({
            data: {
                tenantId,
                tableId: id,
                status: 'PENDING',
                source: 'POS',
                notes: clientName,
                userId: userId || undefined, // Link if provided
                subtotal: 0,
                total: 0,
                deliveryFee: 0,
                discount: 0
            }
        });
    }

    async closeTable(tenantId: string, id: number, paymentMethod: 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX' | 'CASH', amount: number) {
        // 1. Find active order
        const table = await this.prisma.table.findFirst({
            where: { id, tenantId },
            include: {
                orders: {
                    where: { status: { notIn: ['COMPLETED', 'CANCELED'] } },
                    take: 1
                }
            }
        });

        if (!table || table.orders.length === 0) throw new BadRequestException('Mesa não possui conta aberta');
        const order = table.orders[0];

        // 2. Execute Transaction in a transaction (Active Record pattern)
        return this.prisma.$transaction(async (tx) => {
            // Create Financial Transaction
            await tx.transaction.create({
                data: {
                    tenantId,
                    amount: amount,
                    type: 'INCOME',
                    paymentMethod,
                    description: `Pagamento Mesa ${table.name} - Pedido #${order.incrementalId}`,
                    orderId: order.id
                }
            });

            // Update Order to Completed
            await tx.order.update({
                where: { id: order.id },
                data: {
                    status: 'COMPLETED',
                    total: amount // Update total to paid amount (simplified)
                }
            });

            // Update Table Status
            return tx.table.update({
                where: { id },
                data: { status: 'Livre' }
            });
        });
    }
}
