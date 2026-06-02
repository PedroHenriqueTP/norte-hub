/*
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateWaitingListDto } from './dto/create-waiting-list.dto';
import { WaitingListService } from './waiting-list.service';

@Controller('waiting-list')
export class WaitingListController {
    constructor(private readonly service: WaitingListService) { }

    @Post()
    create(@Body() dto: CreateWaitingListDto) {
        return this.service.create(dto);
    }

    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Patch(':id/status')
    updateStatus(
        @Param('id') id: string,
        @Body('status') status: 'WAITING' | 'CALLED' | 'COMPLETED' | 'CANCELED'
    ) {
        return this.service.updateStatus(id, status);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}
*/
import { Controller } from '@nestjs/common';
@Controller('waiting-list')
export class WaitingListController {}

