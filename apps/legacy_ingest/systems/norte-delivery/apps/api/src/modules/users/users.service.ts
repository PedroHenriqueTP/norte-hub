import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

export class CreateUserDto {
  name!: string;
  email!: string;
  password!: string;
  role!: Role;
  tenantId!: string;
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('Email já cadastrado.');
    }
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        tenants: {
          create: {
            tenantId: dto.tenantId,
            role: dto.role
          }
        }
      }
    });
    const { password, ...result } = user;
    return result;
  }

  async findAll(tenantId: string) {
    const userTenants = await this.prisma.userTenant.findMany({
      where: { tenantId },
      include: {
        user: true
      }
    });
    return userTenants.map((ut) => ({
      id: ut.user.id,
      name: ut.user.name,
      email: ut.user.email,
      role: ut.role,
      createdAt: ut.user.createdAt
    }));
  }
}
