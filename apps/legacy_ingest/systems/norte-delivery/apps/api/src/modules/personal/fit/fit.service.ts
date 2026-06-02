import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { TenantContext } from '../../../common/tenant/tenant.context';

@Injectable()
export class FitService {
  constructor(private prisma: PrismaService) {}

  async getWorkoutPlans() {
    return this.prisma.extended.workoutPlan.findMany();
  }

  async createWorkoutPlan(data: { title: string; description?: string; exercises: any }) {
    const tenantId = TenantContext.getTenantId();
    if (!tenantId) throw new Error('Tenant context missing');
    return this.prisma.extended.workoutPlan.create({
      data: {
        title: data.title,
        description: data.description,
        exercises: data.exercises,
        tenantId
      }
    });
  }

  async getEnrollments() {
    return this.prisma.extended.enrollment.findMany({
      include: {
        workoutPlan: true
      }
    });
  }

  async createEnrollment(data: { studentName: string; studentEmail: string; workoutPlanId?: string; status: string }) {
    const tenantId = TenantContext.getTenantId();
    if (!tenantId) throw new Error('Tenant context missing');
    return this.prisma.extended.enrollment.create({
      data: {
        studentName: data.studentName,
        studentEmail: data.studentEmail,
        workoutPlanId: data.workoutPlanId,
        status: data.status,
        tenantId
      }
    });
  }
}
