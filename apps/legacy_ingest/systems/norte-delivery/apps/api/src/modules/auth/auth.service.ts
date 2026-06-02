import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../common/prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('Email já cadastrado.');
    }
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const result = await this.prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({
        data: {
          name: dto.organizationName,
          slug: dto.organizationName.toLowerCase().replace(/ /g, '-'),
          plan: 'FREE'
        }
      });
      const user = await tx.user.create({
        data: {
          name: dto.name,
          email: dto.email,
          password: hashedPassword,
          tenants: {
            create: {
              tenantId: tenant.id,
              role: Role.OWNER
            }
          }
        }
      });
      const trialEndsAt = new Date();
      trialEndsAt.setDate(trialEndsAt.getDate() + 7);
      await tx.subscription.create({
        data: {
          tenantId: tenant.id,
          userId: user.id,
          appSlug: 'NORTE_BAR',
          planLevel: 'trial',
          status: 'TRIALING',
          expiresAt: trialEndsAt
        }
      });
      return { tenant, user };
    });
    return {
      message: 'Organização criada com sucesso!',
      tenantId: result.tenant.id,
      userId: result.user.id
    };
  }

  async login(dto: LoginDto) {
    const safeEmail = dto.email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({ where: { email: safeEmail } });
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }
    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }
    const userTenants = await this.prisma.userTenant.findMany({
      where: { userId: user.id }
    });
    const defaultTenant = userTenants[0];
    const role = defaultTenant ? defaultTenant.role : 'CUSTOMER';
    const tenantId = defaultTenant ? defaultTenant.tenantId : undefined;
    const payload = {
      sub: user.id,
      email: user.email,
      role,
      tenantId
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role,
        tenantId
      }
    };
  }

  async seedAdmin() {
    const email = 'admin@delivery.com';
    const hashedPassword = await bcrypt.hash('123456', 10);
    const tenant = await this.prisma.tenant.upsert({
      where: { slug: 'default-restaurant' },
      update: {},
      create: {
        name: 'Restaurante Modelo',
        slug: 'default-restaurant',
        plan: 'ENTERPRISE'
      }
    });
    let user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          name: 'Admin User',
          email,
          password: hashedPassword,
          tenants: {
            create: {
              tenantId: tenant.id,
              role: 'OWNER'
            }
          }
        }
      });
    } else {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword }
      });
      await this.prisma.userTenant.upsert({
        where: {
          userId_tenantId: {
            userId: user.id,
            tenantId: tenant.id
          }
        },
        update: { role: 'OWNER' },
        create: {
          userId: user.id,
          tenantId: tenant.id,
          role: 'OWNER'
        }
      });
    }
    return { message: 'Admin seeded', email, password: '123456' };
  }
}
