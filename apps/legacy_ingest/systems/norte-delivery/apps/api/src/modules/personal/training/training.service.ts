import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';

@Injectable()
export class TrainingService {
  constructor(private readonly prisma: PrismaService) {}

  private get db() { return this.prisma as any; }

  async createSession(userId: string, dto: { name: string; notes?: string }) {
    return this.db.trainingSession.create({
      data: { userId, name: dto.name, notes: dto.notes },
      include: { exercises: true }
    });
  }

  async listSessions(userId: string) {
    return this.db.trainingSession.findMany({
      where: { userId },
      include: { exercises: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getSession(id: string, userId: string) {
    return this.db.trainingSession.findFirst({
      where: { id, userId },
      include: { exercises: true }
    });
  }

  async completeSession(id: string, userId: string) {
    return this.db.trainingSession.updateMany({
      where: { id, userId },
      data: { completedAt: new Date() }
    });
  }

  async deleteSession(id: string, userId: string) {
    return this.db.trainingSession.deleteMany({ where: { id, userId } });
  }

  async addExercise(sessionId: string, userId: string, dto: {
    name: string;
    sets: number;
    reps: number;
    weightKg?: number;
    notes?: string;
  }) {
    const session = await this.db.trainingSession.findFirst({ where: { id: sessionId, userId } });
    if (!session) throw new Error('Session not found');
    return this.db.exerciseLog.create({
      data: {
        sessionId,
        name: dto.name,
        sets: dto.sets,
        reps: dto.reps,
        weightKg: dto.weightKg ?? 0,
        notes: dto.notes
      }
    });
  }

  async updateExercise(exerciseId: string, userId: string, dto: {
    sets?: number;
    reps?: number;
    weightKg?: number;
    notes?: string;
  }) {
    return this.db.exerciseLog.updateMany({
      where: { id: exerciseId, session: { userId } },
      data: dto
    });
  }

  async deleteExercise(exerciseId: string, userId: string) {
    return this.db.exerciseLog.deleteMany({
      where: { id: exerciseId, session: { userId } }
    });
  }

  async getStats(userId: string) {
    const sessions: any[] = await this.db.trainingSession.findMany({
      where: { userId },
      include: { exercises: true },
      orderBy: { createdAt: 'desc' }
    });

    const completed = sessions.filter((s: any) => s.completedAt);
    const totalVolume = sessions.reduce((sum: number, s: any) =>
      sum + s.exercises.reduce((es: number, e: any) => es + (e.sets * e.reps * e.weightKg), 0), 0
    );

    const exerciseMap: Record<string, { name: string; best: number }> = {};
    sessions.forEach((s: any) => {
      s.exercises.forEach((e: any) => {
        if (!exerciseMap[e.name] || e.weightKg > exerciseMap[e.name].best) {
          exerciseMap[e.name] = { name: e.name, best: e.weightKg };
        }
      });
    });

    return {
      totalSessions: sessions.length,
      completedSessions: completed.length,
      totalVolumeKg: Math.round(totalVolume),
      personalRecords: Object.values(exerciseMap).sort((a, b) => b.best - a.best).slice(0, 5)
    };
  }
}
