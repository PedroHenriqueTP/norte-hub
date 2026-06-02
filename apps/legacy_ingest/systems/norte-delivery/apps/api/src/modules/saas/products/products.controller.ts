import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Get()
    findAll(@Request() req: any) {
        return this.productsService.findAll(req.user.tenantId);
    }

    @Get(':id')
    findOne(@Request() req: any, @Param('id') id: string) {
        return this.productsService.findOne(req.user.tenantId, id);
    }

    @Post()
    create(@Request() req: any, @Body() body: any) {
        return this.productsService.create(req.user.tenantId, body);
    }

    @Put(':id')
    update(@Request() req: any, @Param('id') id: string, @Body() body: any) {
        return this.productsService.update(req.user.tenantId, id, body);
    }

    @Delete(':id')
    remove(@Request() req: any, @Param('id') id: string) {
        return this.productsService.remove(req.user.tenantId, id);
    }
}
