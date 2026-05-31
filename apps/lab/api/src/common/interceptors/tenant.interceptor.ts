import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadRequestException } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class TenantInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const tenantId = request.headers["x-tenant-id"];

    if (!tenantId) {
      throw new BadRequestException("Multi-tenant isolation breach: Missing x-tenant-id header");
    }

    request.tenantId = tenantId;
    return next.handle();
  }
}
