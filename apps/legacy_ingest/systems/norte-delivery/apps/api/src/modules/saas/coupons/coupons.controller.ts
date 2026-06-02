import { Controller, Get, Query, UseGuards, ParseFloatPipe, ParseIntPipe } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

@Controller('coupons')
@UseGuards(JwtAuthGuard)
export class CouponsController {
    constructor(private readonly couponsService: CouponsService) { }

    @Get('validate')
    async validate(
        @Query('code') code: string,
        @Query('total', ParseFloatPipe) total: number
    ) {
        return this.couponsService.validateCoupon(code, total);
    }
}
