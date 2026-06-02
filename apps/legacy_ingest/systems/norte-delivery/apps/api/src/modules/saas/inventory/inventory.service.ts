import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { TenantContext } from '../../../common/tenant/tenant.context';

@Injectable()
export class InventoryService {
    constructor(private prisma: PrismaService) { }

    // --- INGREDIENTS ---

    async createIngredient(data: { name: string; unit: string; totalQuantity?: number; totalCost?: number; yield?: number; unitCost?: number }) {
        const tenantId = TenantContext.getTenantId();
        if (!tenantId) throw new Error('Tenant Context required');

        // Logic: If unitCost not provided, calculate.
        // But for MVP, we trust what comes from frontend or default to 0.
        // In the future we can enforce consistency here.

        return this.prisma.extended.ingredient.create({
            data: {
                tenantId,
                name: data.name,
                unit: data.unit,
                totalQuantity: data.totalQuantity || 0,
                totalCost: data.totalCost || 0,
                yield: data.yield || 0,
                unitCost: data.unitCost || 0,
                // Legacy fields sync
                costPrice: data.unitCost || 0,
                currentStock: data.totalQuantity || 0
            }
        });
    }

    async findAllIngredients() {
        const tenantId = TenantContext.getTenantId();
        if (!tenantId) throw new Error('Tenant Context required');

        return this.prisma.extended.ingredient.findMany({
            where: { tenantId },
            orderBy: { name: 'asc' }
        });
    }

    async updateIngredient(id: string, data: { name?: string; unit?: string; costPrice?: number }) {
        const tenantId = TenantContext.getTenantId();
        if (!tenantId) throw new Error('Tenant Context required');

        return this.prisma.extended.ingredient.update({
            where: { id, tenantId },
            data
        });
    }

    // --- STOCK MOVEMENTS ---

    async addStockMovement(data: { ingredientId: string; type: 'IN' | 'OUT' | 'LOSS'; quantity: number; cost?: number; description?: string }) {
        const tenantId = TenantContext.getTenantId();
        if (!tenantId) throw new Error('Tenant Context required');

        return this.prisma.$transaction(async (tx) => {
            // 1. Create Movement
            const movement = await tx.stockMovement.create({
                data: {
                    ingredientId: data.ingredientId,
                    type: data.type,
                    quantity: data.quantity,
                    cost: data.cost,
                    description: data.description
                }
            });

            // 2. Update Ingredient Stock & Cost
            const ingredient = await tx.ingredient.findUnique({ where: { id: data.ingredientId } });
            if (!ingredient) throw new NotFoundException('Ingrediente não encontrado');

            let newStock = Number(ingredient.currentStock);
            let newCost = Number(ingredient.costPrice);

            if (data.type === 'IN') {
                newStock += data.quantity;

                // Weighted Average Cost Calculation
                if (data.cost) {
                    const totalValueCurrent = Number(ingredient.currentStock) * Number(ingredient.costPrice);
                    const totalValueNew = data.quantity * data.cost;
                    newCost = (totalValueCurrent + totalValueNew) / newStock;
                }
            } else {
                newStock -= data.quantity;
            }

            await tx.ingredient.update({
                where: { id: data.ingredientId },
                data: {
                    currentStock: newStock,
                    costPrice: newCost
                }
            });

            return movement;
        });
    }

    // --- RECIPES ---

    async addIngredientToProduct(productId: string, ingredientId: string, quantity: number) {
        return this.prisma.extended.productRecipe.create({
            data: {
                productId,
                ingredientId,
                quantity
            }
        });
    }

    async removeIngredientFromProduct(productId: string, ingredientId: string) {
        // Find the unique ID first or use deleteMany with composite filter if supported efficiently
        // Prisma supports deleteMany with composite unique constraints in where clause? No, usually deleteMany with non-unique.
        // Better to find first.
        const recipe = await this.prisma.extended.productRecipe.findUnique({
            where: { productId_ingredientId: { productId, ingredientId } }
        });

        if (recipe) {
            return this.prisma.extended.productRecipe.delete({
                where: { id: recipe.id }
            });
        }
    }
}
