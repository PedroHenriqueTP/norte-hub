import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';

@Injectable()
export class ClockService {
  constructor(private readonly prisma: PrismaService) {}

  private get db() {
    return this.prisma as any;
  }

  async createTimeBlock(userId: string, dto: {
    title: string;
    description?: string;
    type: string;
    duration: number;
  }) {
    return this.db.timeBlock.create({
      data: {
        userId,
        title: dto.title,
        description: dto.description,
        type: dto.type,
        duration: dto.duration,
        timeSpent: 0,
        completed: false
      }
    });
  }

  async listTimeBlocks(userId: string) {
    return this.db.timeBlock.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async completeTimeBlock(id: string, userId: string, timeSpent: number) {
    return this.db.timeBlock.updateMany({
      where: { id, userId },
      data: { completed: true, timeSpent }
    });
  }

  async deleteTimeBlock(id: string, userId: string) {
    return this.db.timeBlock.deleteMany({ where: { id, userId } });
  }

  async createAlarm(userId: string, dto: {
    title: string;
    time: string;
    days: string;
    soundUrl?: string;
  }) {
    return this.db.routineAlarm.create({
      data: {
        userId,
        title: dto.title,
        time: dto.time,
        days: dto.days,
        soundUrl: dto.soundUrl,
        isActive: true
      }
    });
  }

  async listAlarms(userId: string) {
    return this.db.routineAlarm.findMany({
      where: { userId },
      orderBy: { time: 'asc' }
    });
  }

  async toggleAlarm(id: string, userId: string, isActive: boolean) {
    return this.db.routineAlarm.updateMany({
      where: { id, userId },
      data: { isActive }
    });
  }

  async deleteAlarm(id: string, userId: string) {
    return this.db.routineAlarm.deleteMany({ where: { id, userId } });
  }

  async getDailySummary(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const [blocks, alarms]: [any[], any[]] = await Promise.all([
      this.db.timeBlock.findMany({
        where: { userId, createdAt: { gte: today, lt: tomorrow } }
      }),
      this.db.routineAlarm.findMany({
        where: { userId, isActive: true }
      })
    ]);

    const totalFocusSeconds = blocks
      .filter((b: any) => b.completed)
      .reduce((sum: number, b: any) => sum + b.timeSpent, 0);

    return {
      totalBlocks: blocks.length,
      completedBlocks: blocks.filter((b: any) => b.completed).length,
      totalFocusMinutes: Math.floor(totalFocusSeconds / 60),
      activeAlarms: alarms.length
    };
  }
}
