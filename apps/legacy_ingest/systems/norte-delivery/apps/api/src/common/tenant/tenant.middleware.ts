import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantContext } from './tenant.context';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const tenantHeader = req.headers['x-tenant-id'] as string;
    if (tenantHeader) {
      TenantContext.run(tenantHeader, () => next());
      return;
    }

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const payloadPart = token.split('.')[1];
        if (payloadPart) {
          const payload = JSON.parse(Buffer.from(payloadPart, 'base64').toString('utf8'));
          if (payload && payload.tenantId) {
            TenantContext.run(payload.tenantId, () => next());
            return;
          }
        }
      } catch (err) {}
    }

    next();
  }
}
