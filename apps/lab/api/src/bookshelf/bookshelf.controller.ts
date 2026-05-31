import { Controller, Post, Get, Put, Body, UseInterceptors, Req } from "@nestjs/common";
import { BookshelfService } from "./bookshelf.service";
import { TenantInterceptor } from "../common/interceptors/tenant.interceptor";

@Controller("bookshelf")
@UseInterceptors(TenantInterceptor)
export class BookshelfController {
  constructor(private bookshelfService: BookshelfService) {}

  @Post("instantiate")
  async instantiate(
    @Req() req: any,
    @Body("solutionKey") solutionKey: string,
    @Body("config") config: Record<string, string>
  ) {
    const tenantId = req.tenantId;
    return this.bookshelfService.instantiateProduct(tenantId, solutionKey, config);
  }

  @Get("licenses")
  async getLicenses(@Req() req: any) {
    const tenantId = req.tenantId;
    return this.bookshelfService.getLicenses(tenantId);
  }

  @Post("decrypt-config")
  async decryptConfig(
    @Req() req: any,
    @Body("solutionKey") solutionKey: string
  ) {
    const tenantId = req.tenantId;
    return this.bookshelfService.decryptConfig(tenantId, solutionKey);
  }

  @Put("status")
  async updateStatus(
    @Req() req: any,
    @Body("solutionKey") solutionKey: string,
    @Body("status") status: "ACTIVE" | "SUSPENDED" | "MAINTENANCE"
  ) {
    const tenantId = req.tenantId;
    return this.bookshelfService.updateLicenseStatus(tenantId, solutionKey, status);
  }
}
