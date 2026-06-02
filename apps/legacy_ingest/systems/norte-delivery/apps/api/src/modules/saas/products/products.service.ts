import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { IntegrationsService } from '../integrations/integrations.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
    constructor(
        private prisma: PrismaService,
        private integrationsService: IntegrationsService
    ) { }

    async findAll(tenantId: string) {
        return this.prisma.product.findMany({
            where: { tenantId },
            include: { category: true }
        });
    }

    async findOne(tenantId: string, id: string) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                recipes: {
                    include: {
                        ingredient: true
                    }
                }
            }
        });
        if (!product || product.tenantId !== tenantId) throw new NotFoundException('Product not found');
        return product;
    }

    async create(tenantId: string, data: any) {
        // Handle Category: If string is name, find or create. If valid UUID, use it.
        // Fix: Default to 'Geral' if empty
        let categoryId = data.categoryId;
        if (!categoryId || categoryId.trim() === '') {
            categoryId = 'Geral';
        }

        if (categoryId && !categoryId.includes('-')) {
            // Treat as name
            const categoryName = categoryId.charAt(0).toUpperCase() + categoryId.slice(1); // Capitalize
            const existingCategory = await this.prisma.category.findFirst({
                where: { tenantId, name: { equals: categoryName, mode: 'insensitive' } }
            });

            if (existingCategory) {
                categoryId = existingCategory.id;
            } else {
                const newCategory = await this.prisma.category.create({
                    data: {
                        name: categoryName,
                        tenantId
                    }
                });
                categoryId = newCategory.id;
            }
        }

        const product = await this.prisma.product.create({
            data: {
                ...data,
                price: new Prisma.Decimal(data.price), // Ensure Decimal
                categoryId,
                tenantId
            }
        });

        // Sync creation with external platforms
        await this.integrationsService.syncProduct(tenantId, product, 'CREATE');

        return product;
    }

    async update(tenantId: string, id: string, data: any) {
        const existing = await this.prisma.product.findUnique({ where: { id } });
        if (!existing || existing.tenantId !== tenantId) throw new NotFoundException('Product not found');

        // Handle Category (Same logic - could be extracted to private method)
        let categoryId = data.categoryId;

        // Fix: Default to 'Geral' if empty AND present in data payload (update might not send it)
        if (categoryId !== undefined) {
            if (!categoryId || categoryId.trim() === '') {
                categoryId = 'Geral';
            }
        }

        if (categoryId && !categoryId.includes('-')) {
            const categoryName = categoryId.charAt(0).toUpperCase() + categoryId.slice(1);
            const existingCategory = await this.prisma.category.findFirst({
                where: { tenantId, name: { equals: categoryName, mode: 'insensitive' } }
            });

            if (existingCategory) {
                categoryId = existingCategory.id;
            } else {
                const newCategory = await this.prisma.category.create({
                    data: { name: categoryName, tenantId }
                });
                categoryId = newCategory.id;
            }
        }

        const product = await this.prisma.product.update({
            where: { id },
            data: {
                ...data,
                price: data.price ? new Prisma.Decimal(data.price) : undefined,
                categoryId: categoryId || undefined
            }
        });

        // Sync update with external platforms
        await this.integrationsService.syncProduct(tenantId, product, 'UPDATE');

        return product;
    }

    async remove(tenantId: string, id: string) {
        const existing = await this.prisma.product.findUnique({ where: { id } });
        if (!existing || existing.tenantId !== tenantId) throw new NotFoundException('Product not found');

        // Soft delete or hard delete? Usually hard delete for MVPs if no orders
        // But let's assume we just deactivate for sync
        const product = await this.prisma.product.delete({ where: { id } });

        await this.integrationsService.syncProduct(tenantId, existing, 'DELETE');

        return product;
    }
}
