import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { FilesGateway } from './files.gateway';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class CloudService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly filesGateway: FilesGateway,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async createFileMetadata(data: {
    name: string;
    mimeType: string;
    size: number;
    url: string;
    path: string;
    userId: string;
    tenantId?: string;
  }) {
    const file = await this.prisma.cloudFile.create({
      data: {
        name: data.name,
        mimeType: data.mimeType,
        size: data.size,
        url: data.url,
        path: data.path,
        userId: data.userId,
        tenantId: data.tenantId || null
      }
    });

    this.eventEmitter.emit('file.uploaded', {
      fileId: file.id,
      userId: file.userId,
      tenantId: file.tenantId,
      url: file.url,
      mimeType: file.mimeType,
      name: file.name,
      size: file.size
    });

    this.filesGateway.broadcastFileUpdate(data.userId, 'created', file);
    return file;
  }

  async deleteFileMetadata(id: string, userId: string) {
    const file = await this.prisma.extended.cloudFile.findUnique({
      where: { id }
    });

    if (!file) {
      throw new NotFoundException('Arquivo não encontrado.');
    }

    await this.prisma.cloudFile.delete({
      where: { id }
    });

    this.filesGateway.broadcastFileUpdate(userId, 'deleted', { id });
    return { success: true };
  }

  async listFilesByPath(path: string, userId: string, tenantId?: string) {
    if (tenantId) {
      return this.prisma.cloudFile.findMany({
        where: {
          tenantId,
          path
        },
        orderBy: { createdAt: 'desc' }
      });
    }

    return this.prisma.cloudFile.findMany({
      where: {
        tenantId: null,
        userId,
        path
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async calculateTenantStorage(tenantId: string): Promise<number> {
    const result = await this.prisma.cloudFile.aggregate({
      where: { tenantId },
      _sum: { size: true }
    });
    return result._sum.size ?? 0;
  }

  async calculateUserStorage(userId: string): Promise<number> {
    const result = await this.prisma.cloudFile.aggregate({
      where: { tenantId: null, userId },
      _sum: { size: true }
    });
    return result._sum.size ?? 0;
  }

  async searchFiles(query: string, userId: string, tenantId?: string) {
    const baseWhere = tenantId
      ? { tenantId }
      : { tenantId: null, userId };

    return this.prisma.cloudFile.findMany({
      where: {
        ...baseWhere,
        OR: [
          { name: { contains: query, mode: 'insensitive' as const } },
          { summary: { contains: query, mode: 'insensitive' as const } } as any,
          { tags: { contains: query, mode: 'insensitive' as const } } as any
        ]
      },
      orderBy: { updatedAt: 'desc' }
    });
  }
}
