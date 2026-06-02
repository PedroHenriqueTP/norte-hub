import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { TenantContext } from '../../../common/tenant/tenant.context';
import { GymGateway } from './gym.gateway';

@Injectable()
export class GymService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gymGateway: GymGateway
  ) {}

  async createWorkoutPlan(dto: { title: string; description?: string; exercises: any }) {
    const tenantId = TenantContext.getTenantId();
    return this.prisma.workoutPlan.create({
      data: {
        title: dto.title,
        description: dto.description,
        exercises: dto.exercises,
        tenantId: tenantId!
      }
    });
  }

  async findAllWorkoutPlans() {
    const tenantId = TenantContext.getTenantId();
    return this.prisma.workoutPlan.findMany({
      where: { tenantId: tenantId! }
    });
  }

  async findOneWorkoutPlan(id: string) {
    const plan = await this.prisma.extended.workoutPlan.findUnique({
      where: { id }
    });
    if (!plan) throw new NotFoundException('Ficha de treino não encontrada.');
    return plan;
  }

  async createEnrollment(dto: { studentName: string; studentEmail: string; workoutPlanId?: string; endDate?: Date }) {
    const tenantId = TenantContext.getTenantId();
    return this.prisma.enrollment.create({
      data: {
        studentName: dto.studentName,
        studentEmail: dto.studentEmail,
        status: 'ACTIVE',
        workoutPlanId: dto.workoutPlanId,
        endDate: dto.endDate,
        tenantId: tenantId!
      }
    });
  }

  async findAllEnrollments() {
    const tenantId = TenantContext.getTenantId();
    return this.prisma.enrollment.findMany({
      where: { tenantId: tenantId! },
      include: { workoutPlan: true }
    });
  }

  async createCheckIn(dto: { studentName: string; studentEmail: string; status: string }) {
    const tenantId = TenantContext.getTenantId();
    const checkIn = await this.prisma.gymCheckIn.create({
      data: {
        studentName: dto.studentName,
        studentEmail: dto.studentEmail,
        status: dto.status,
        tenantId: tenantId!
      }
    });
    this.gymGateway.broadcastCheckIn(tenantId!, checkIn);
    return checkIn;
  }

  async findAllCheckIns() {
    const tenantId = TenantContext.getTenantId();
    return this.prisma.gymCheckIn.findMany({
      where: { tenantId: tenantId! }
    });
  }

  async createMembership(dto: { studentName: string; studentEmail: string; price: number; endDate: Date }) {
    const tenantId = TenantContext.getTenantId();
    return this.prisma.gymMembership.create({
      data: {
        studentName: dto.studentName,
        studentEmail: dto.studentEmail,
        price: dto.price,
        status: 'ACTIVE',
        endDate: dto.endDate,
        tenantId: tenantId!
      }
    });
  }

  async findAllMemberships() {
    const tenantId = TenantContext.getTenantId();
    return this.prisma.gymMembership.findMany({
      where: { tenantId: tenantId! }
    });
  }

  async getKpis() {
    const tenantId = TenantContext.getTenantId();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const [activeMembers, allMemberships, todayCheckIns, totalEnrollments] = await Promise.all([
      this.prisma.gymMembership.count({ where: { tenantId: tenantId!, status: 'ACTIVE' } }),
      this.prisma.gymMembership.findMany({ where: { tenantId: tenantId!, status: 'ACTIVE' } }),
      this.prisma.gymCheckIn.count({
        where: { tenantId: tenantId!, createdAt: { gte: today, lt: tomorrow } } as any
      }),
      this.prisma.enrollment.count({ where: { tenantId: tenantId!, status: 'ACTIVE' } })
    ]);

    const mrr = allMemberships.reduce((sum, m) => sum + Number(m.price || 0), 0);

    return { activeMembers, mrr, todayCheckIns, totalEnrollments };
  }
}
