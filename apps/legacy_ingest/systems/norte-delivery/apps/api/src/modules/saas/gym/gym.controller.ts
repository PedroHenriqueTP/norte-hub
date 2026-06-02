import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { GymService } from './gym.service';
import { AuthGuard } from '@nestjs/passport';
import { SubscriptionGuard } from '../../../common/guards/subscription.guard';
import { RequireSubscription } from '../../../common/decorators/subscription.decorator';
import { AppSlug } from '@prisma/client';

@Controller('api/systems/norte-gym')
@UseGuards(AuthGuard('jwt'), SubscriptionGuard)
@RequireSubscription(AppSlug.NORTE_GYM)
export class GymController {
  constructor(private readonly gymService: GymService) {}

  @Post('workout-plans')
  async createWorkoutPlan(@Body() dto: { title: string; description?: string; exercises: any }) {
    return this.gymService.createWorkoutPlan(dto);
  }

  @Get('workout-plans')
  async findAllWorkoutPlans() {
    return this.gymService.findAllWorkoutPlans();
  }

  @Get('workout-plans/:id')
  async findOneWorkoutPlan(@Param('id') id: string) {
    return this.gymService.findOneWorkoutPlan(id);
  }

  @Post('enrollments')
  async createEnrollment(@Body() dto: { studentName: string; studentEmail: string; workoutPlanId?: string; endDate?: string }) {
    return this.gymService.createEnrollment({
      ...dto,
      endDate: dto.endDate ? new Date(dto.endDate) : undefined
    });
  }

  @Get('enrollments')
  async findAllEnrollments() {
    return this.gymService.findAllEnrollments();
  }

  @Post('checkins')
  async createCheckIn(@Body() dto: { studentName: string; studentEmail: string; status: string }) {
    return this.gymService.createCheckIn(dto);
  }

  @Get('checkins')
  async findAllCheckIns() {
    return this.gymService.findAllCheckIns();
  }

  @Post('memberships')
  async createMembership(@Body() dto: { studentName: string; studentEmail: string; price: number; endDate: string }) {
    return this.gymService.createMembership({
      ...dto,
      endDate: new Date(dto.endDate)
    });
  }

  @Get('memberships')
  async findAllMemberships() {
    return this.gymService.findAllMemberships();
  }

  @Get('kpis')
  async getKpis() {
    return this.gymService.getKpis();
  }
}
