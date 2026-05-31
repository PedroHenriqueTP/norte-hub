import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";

@Injectable()
export class FeatureFlagGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const tenantId = request.tenantId;
    const requiredModule = request.headers["x-required-module"];

    if (!requiredModule) {
      return true;
    }

    const feature = await this.prisma.tenantFeature.findUnique({
      where: {
        tenantId_moduleKey: {
          tenantId,
          moduleKey: requiredModule.toString().toUpperCase(),
        },
      },
    });

    if (!feature || !feature.isActive) {
      throw new ForbiddenException("Módulo não contratado ou bloqueado para este plano.");
    }

    return true;
  }
}
