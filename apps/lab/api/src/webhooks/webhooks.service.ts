import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { BookshelfService } from "../bookshelf/bookshelf.service";
import { NlpRouterService } from "../processor/nlp-router.service";

@Injectable()
export class WebhooksService {
  constructor(
    private prisma: PrismaService,
    private bookshelfService: BookshelfService,
    private nlpRouterService: NlpRouterService
  ) {}

  async dispatch(solutionKey: string, licenseId: string, payload: any) {
    const license = await this.prisma.bookshelfLicense.findUnique({
      where: { id: licenseId },
      include: { product: true },
    });

    if (!license) {
      throw new NotFoundException(`License with ID '${licenseId}' not found`);
    }

    if (license.product.solutionKey !== solutionKey) {
      throw new BadRequestException(`License ID does not match solution key '${solutionKey}'`);
    }

    if (license.status !== "ACTIVE") {
      throw new BadRequestException(`License status is '${license.status}', not ACTIVE`);
    }

    const decryptedConfig = await this.bookshelfService.decryptConfig(license.tenantId, solutionKey);

    let result;
    switch (solutionKey) {
      case "CLARO_FLOW":
        result = await this.processClaroFlow(license, decryptedConfig, payload);
        break;
      case "OCTADESK_BRIDGE":
        result = await this.processOctadeskBridge(license, decryptedConfig, payload);
        break;
      default:
        throw new BadRequestException(`No webhook handler registered for solution key '${solutionKey}'`);
    }

    return {
      success: true,
      processedAt: new Date().toISOString(),
      result,
    };
  }

  private async processClaroFlow(license: any, config: Record<string, string>, payload: any) {
    const textContent = payload.text || payload.message || JSON.stringify(payload);
    
    const nlpResult = await this.nlpRouterService.processRawInput(license.tenantId, license.productId, textContent);

    const destinationUrl = config.CALLBACK_URL;
    if (destinationUrl) {
      // Implement http forward if needed in the future
    }

    return {
      nlpResult,
      forwarded: !!destinationUrl,
    };
  }

  private async processOctadeskBridge(license: any, config: Record<string, string>, payload: any) {
    const contactName = payload.name || payload.contact?.name || "Unknown Contact";
    const contactEmail = payload.email || payload.contact?.email || "";
    
    return {
      contactName,
      contactEmail,
      status: "processed",
    };
  }
}
