import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
    constructor(private readonly service: DashboardService) { }

    @Get()
    getStats() {
        return this.service.getStats();
    }

    @Get('systems')
    // @UseGuards(RolesGuard) // Todo: Implement RolesGuard
    getsystemsMetrics() {
        return this.service.getsystemsMetrics();
    }
}

