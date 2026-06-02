import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { TenantContext } from '../../../common/tenant/tenant.context';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCustomerDto) {
    const tenantId = TenantContext.getTenantId();
    const email = dto.email || `guest-${dto.phone || randomBytes(4).toString('hex')}@delivery.param`;

    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictException('Cliente já existe com este email.');

    const password = await bcrypt.hash(randomBytes(10).toString('hex'), 10);

    return this.prisma.user.create({
      data: {
        name: dto.name,
        email,
        phone: dto.phone,
        address: dto.address,
        password,
        tenants: {
          create: {
            tenantId: tenantId!,
            role: 'CUSTOMER'
          }
        }
      }
    });
  }

  async findAll() {
    const tenantId = TenantContext.getTenantId();
    const userTenants = await this.prisma.userTenant.findMany({
      where: {
        tenantId,
        role: 'CUSTOMER'
      },
      include: {
        user: {
          include: {
            _count: {
              select: { orders: true }
            }
          }
        }
      },
      orderBy: {
        user: {
          name: 'asc'
        }
      }
    });

    return userTenants.map((ut) => ({
      id: ut.user.id,
      name: ut.user.name,
      email: ut.user.email,
      phone: ut.user.phone,
      address: ut.user.address,
      createdAt: ut.user.createdAt,
      _count: ut.user._count
    }));
  }

  async findOne(id: string) {
    return this.prisma.extended.user.findUnique({
      where: { id },
      include: {
        orders: {
          take: 5,
          orderBy: { createdAt: 'desc' }
        },
        addresses: true
      }
    });
  }
}
