import { Controller, Get, Post, Body } from '@nestjs/common';
import { FitService } from './fit.service';

@Controller('api/personal/norte-fit')
export class FitController {
  constructor(private readonly fitService: FitService) {}

  @Get('workout-plans')
  getWorkoutPlans() {
    return this.fitService.getWorkoutPlans();
  }

  @Post('workout-plans')
  createWorkoutPlan(@Body() body: { title: string; description?: string; exercises: any }) {
    return this.fitService.createWorkoutPlan(body);
  }

  @Get('enrollments')
  getEnrollments() {
    return this.fitService.getEnrollments();
  }

  @Post('enrollments')
  createEnrollment(
    @Body()
    body: {
      studentName: string;
      studentEmail: string;
      workoutPlanId?: string;
      status: string;
    },
  ) {
    return this.fitService.createEnrollment(body);
  }
}
