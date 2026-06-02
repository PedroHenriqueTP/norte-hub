import { Controller, Get, Post, Patch, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { TrainingService } from './training.service';
import { AuthGuard } from '@nestjs/passport';
import { SubscriptionGuard } from '../../../common/guards/subscription.guard';
import { RequireSubscription } from '../../../common/decorators/subscription.decorator';
import { AppSlug } from '@prisma/client';

@Controller('api/personal/norte-training')
@UseGuards(AuthGuard('jwt'), SubscriptionGuard)
@RequireSubscription(AppSlug.NORTE_TRAINING)
export class TrainingController {
  constructor(private readonly trainingService: TrainingService) {}

  @Get('stats')
  async getStats(@Req() req: any) {
    return this.trainingService.getStats(req.user.userId);
  }

  @Post('sessions')
  async createSession(@Req() req: any, @Body() dto: { name: string; notes?: string }) {
    return this.trainingService.createSession(req.user.userId, dto);
  }

  @Get('sessions')
  async listSessions(@Req() req: any) {
    return this.trainingService.listSessions(req.user.userId);
  }

  @Get('sessions/:id')
  async getSession(@Req() req: any, @Param('id') id: string) {
    return this.trainingService.getSession(id, req.user.userId);
  }

  @Patch('sessions/:id/complete')
  async completeSession(@Req() req: any, @Param('id') id: string) {
    return this.trainingService.completeSession(id, req.user.userId);
  }

  @Delete('sessions/:id')
  async deleteSession(@Req() req: any, @Param('id') id: string) {
    return this.trainingService.deleteSession(id, req.user.userId);
  }

  @Post('sessions/:id/exercises')
  async addExercise(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: { name: string; sets: number; reps: number; weightKg?: number; notes?: string }
  ) {
    return this.trainingService.addExercise(id, req.user.userId, dto);
  }

  @Patch('exercises/:id')
  async updateExercise(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: { sets?: number; reps?: number; weightKg?: number; notes?: string }
  ) {
    return this.trainingService.updateExercise(id, req.user.userId, dto);
  }

  @Delete('exercises/:id')
  async deleteExercise(@Req() req: any, @Param('id') id: string) {
    return this.trainingService.deleteExercise(id, req.user.userId);
  }
}
