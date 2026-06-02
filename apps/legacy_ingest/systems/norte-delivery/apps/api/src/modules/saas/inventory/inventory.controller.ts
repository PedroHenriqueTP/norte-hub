import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { InventoryService } from './inventory.service';

@Controller('inventory')
export class InventoryController {
    constructor(private readonly service: InventoryService) { }

    @Post('ingredients')
    createIngredient(@Body() dto: { name: string; unit: string; totalQuantity?: number; totalCost?: number; yield?: number; unitCost?: number }) {
        return this.service.createIngredient(dto);
    }

    @Get('ingredients')
    findAllIngredients() {
        return this.service.findAllIngredients();
    }

    @Put('ingredients/:id')
    updateIngredient(@Param('id') id: string, @Body() dto: { name?: string; unit?: string; costPrice?: number }) {
        return this.service.updateIngredient(id, dto);
    }

    @Post('movements')
    addMovement(@Body() dto: { ingredientId: string; type: 'IN' | 'OUT' | 'LOSS'; quantity: number; cost?: number; description?: string }) {
        return this.service.addStockMovement(dto);
    }

    @Post('products/:productId/ingredients')
    addRecipeItem(@Param('productId') productId: string, @Body() dto: { ingredientId: string; quantity: number }) {
        return this.service.addIngredientToProduct(productId, dto.ingredientId, dto.quantity);
    }

    @Delete('products/:productId/ingredients/:ingredientId')
    removeRecipeItem(@Param('productId') productId: string, @Param('ingredientId') ingredientId: string) {
        return this.service.removeIngredientFromProduct(productId, ingredientId);
    }
}
