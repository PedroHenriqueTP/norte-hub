import { Controller, Get, Post, Patch, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { ClockService } from './clock.service';
import { AuthGuard } from '@nestjs/passport';
import { SubscriptionGuard } from '../../../common/guards/subscription.guard';
import { RequireSubscription } from '../../../common/decorators/subscription.decorator';
import { AppSlug } from '@prisma/client';

@Controller('api/personal/norte-clock')
@UseGuards(AuthGuard('jwt'), SubscriptionGuard)
@RequireSubscription(AppSlug.NORTE_CLOCK)
export class ClockController {
  constructor(private readonly clockService: ClockService) {}

  @Get('summary')
  async getDailySummary(@Req() req: any) {
    return this.clockService.getDailySummary(req.user.userId);
  }

  @Post('blocks')
  async createBlock(
    @Req() req: any,
    @Body() dto: { title: string; description?: string; type: string; duration: number }
  ) {
    return this.clockService.createTimeBlock(req.user.userId, dto);
  }

  @Get('blocks')
  async listBlocks(@Req() req: any) {
    return this.clockService.listTimeBlocks(req.user.userId);
  }

  @Patch('blocks/:id/complete')
  async completeBlock(@Req() req: any, @Param('id') id: string, @Body() body: { timeSpent: number }) {
    return this.clockService.completeTimeBlock(id, req.user.userId, body.timeSpent);
  }

  @Delete('blocks/:id')
  async deleteBlock(@Req() req: any, @Param('id') id: string) {
    return this.clockService.deleteTimeBlock(id, req.user.userId);
  }

  @Post('alarms')
  async createAlarm(
    @Req() req: any,
    @Body() dto: { title: string; time: string; days: string; soundUrl?: string }
  ) {
    return this.clockService.createAlarm(req.user.userId, dto);
  }

  @Get('alarms')
  async listAlarms(@Req() req: any) {
    return this.clockService.listAlarms(req.user.userId);
  }

  @Patch('alarms/:id/toggle')
  async toggleAlarm(@Req() req: any, @Param('id') id: string, @Body() body: { isActive: boolean }) {
    return this.clockService.toggleAlarm(id, req.user.userId, body.isActive);
  }

  @Delete('alarms/:id')
  async deleteAlarm(@Req() req: any, @Param('id') id: string) {
    return this.clockService.deleteAlarm(id, req.user.userId);
  }
}
