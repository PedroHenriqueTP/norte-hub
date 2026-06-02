/*
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { CreateWaitingListDto } from './dto/create-waiting-list.dto';
import { TenantContext } from '../../../common/tenant/tenant.context';

@Injectable()
export class WaitingListService {
    constructor(private readonly prisma: PrismaService) { }

    async create(dto: CreateWaitingListDto) {
        const tenantId = TenantContext.getTenantId();
        if (!tenantId) throw new Error('Tenant Context missing');

        let userId: string | undefined = dto.userId;

        if (!userId && (dto.email || dto.phone)) {
            const existingUser = await this.prisma.user.findFirst({
                where: {
                    OR: [
                        { email: dto.email || undefined },
                        { phone: dto.phone || undefined }
                    ],
                    tenantId 
                }
            });

            if (existingUser) {
                userId = existingUser.id;
            }
        }

        return this.prisma.extended.waitingList.create({
            data: {
                name: dto.name,
                phone: dto.phone,
                email: dto.email,
                partySize: dto.partySize,
                status: 'WAITING',
                tenantId,
                userId
            }
        });
    }

    async findAll() {
        return this.prisma.extended.waitingList.findMany({
            orderBy: { createdAt: 'asc' }, // FIFO
            where: {
                status: { in: ['WAITING', 'CALLED'] } // Only show active
            }
        });
    }

    async updateStatus(id: string, status: 'WAITING' | 'CALLED' | 'COMPLETED' | 'CANCELED') {
        return this.prisma.extended.waitingList.update({
            where: { id },
            data: { status }
        });
    }

    async remove(id: string) {
        return this.prisma.extended.waitingList.delete({
            where: { id }
        });
    }
}
*/
import { Injectable } from '@nestjs/common';
@Injectable()
export class WaitingListService {}

