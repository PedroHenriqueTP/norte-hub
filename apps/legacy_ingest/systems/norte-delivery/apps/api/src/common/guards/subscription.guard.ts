import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../prisma/prisma.service';
import { AppSlug } from '@prisma/client';
import { REQUIRE_SUBSCRIPTION_KEY, REQUIRE_FEATURE_KEY } from '../decorators/subscription.decorator';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requireSubscription = this.reflector.getAllAndOverride<AppSlug>(
      REQUIRE_SUBSCRIPTION_KEY,
      [context.getHandler(), context.getClass()]
    );

    const requireFeature = this.reflector.getAllAndOverride<string>(
      REQUIRE_FEATURE_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (!requireSubscription && !requireFeature) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Usuário não autenticado.');
    }

    if (requireSubscription) {
      const isB2C = ([
        AppSlug.NORTE_FIT,
        AppSlug.NORTE_TRAINING,
        AppSlug.NORTE_CLOCK,
        AppSlug.NORTE_AGENDA,
        AppSlug.NORTE_MAIL,
        AppSlug.NORTE_CLOUD
      ] as AppSlug[]).includes(requireSubscription) && !user.tenantId;

      let subscription;

      if (isB2C || !user.tenantId) {
        subscription = await this.prisma.subscription.findFirst({
          where: { userId: user.id || user.userId, appSlug: requireSubscription }
        });

        if (!subscription && requireSubscription === AppSlug.NORTE_FIT) {
          return true;
        }
      } else {
        if (!user.tenantId) {
          throw new ForbiddenException('Inquilino/Tenant não especificado.');
        }

        subscription = await this.prisma.subscription.findFirst({
          where: { tenantId: user.tenantId, appSlug: requireSubscription }
        });
      }

      if (!subscription) {
        throw new ForbiddenException('Nenhuma assinatura ativa encontrada para este serviço.');
      }

      const now = new Date();
      const isExpired = subscription.expiresAt && new Date(subscription.expiresAt) < now;

      if (isExpired && subscription.status !== 'PAST_DUE') {
        throw new ForbiddenException('Sua assinatura expirou. Por favor, regularize seu plano.');
      }

      if (subscription.status === 'ACTIVE' || subscription.status === 'TRIALING') {
        return true;
      }

      if (subscription.status === 'PAST_DUE') {
        const isMutation = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method);
        if (isMutation) {
          throw new ForbiddenException('Pagamento pendente. Edições e novos cadastros estão bloqueados.');
        }
        return true;
      }

      throw new ForbiddenException('Sua assinatura não está ativa.');
    }

    if (requireFeature) {
      if (!user.tenantId) {
        throw new ForbiddenException('Inquilino/Tenant não especificado.');
      }

      const featureFlag = await this.prisma.tenantFeature.findUnique({
        where: {
          tenantId_feature: {
            tenantId: user.tenantId,
            feature: requireFeature
          }
        }
      });

      if (!featureFlag || !featureFlag.enabled) {
        throw new ForbiddenException(`O recurso '${requireFeature}' não está habilitado no seu plano.`);
      }
    }

    return true;
  }
}
