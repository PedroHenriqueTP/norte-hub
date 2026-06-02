import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomersService } from './customers.service';

@Controller('customers')
export class CustomersController {
    constructor(private readonly service: CustomersService) { }

    @Post()
    create(@Body() dto: CreateCustomerDto) {
        return this.service.create(dto);
    }

    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }
}
