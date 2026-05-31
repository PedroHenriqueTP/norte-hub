import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { VaultCrypto, EncryptedPayload } from "../../../packages/crypto/vault";

@Injectable()
export class BookshelfService {
  constructor(private prisma: PrismaService) {}

  private getSecretKey(): string {
    return process.env.VAULT_SECRET_KEY || "global-system-fallback-secret";
  }

  async instantiateProduct(tenantId: string, solutionKey: string, config: Record<string, string>) {
    const product = await this.prisma.bookshelfProduct.findUnique({
      where: { solutionKey },
    });

    if (!product) {
      throw new NotFoundException(`Bookshelf product with key '${solutionKey}' not found`);
    }

    const secret = this.getSecretKey();
    const configVault: Record<string, EncryptedPayload> = {};

    for (const [key, value] of Object.entries(config)) {
      configVault[key] = VaultCrypto.encrypt(value, secret);
    }

    return this.prisma.bookshelfLicense.upsert({
      where: {
        tenantId_productId: {
          tenantId,
          productId: product.id,
        },
      },
      update: {
        configVault: configVault as any,
        status: "ACTIVE",
      },
      create: {
        tenantId,
        productId: product.id,
        configVault: configVault as any,
        status: "ACTIVE",
      },
      include: {
        product: true,
      },
    });
  }

  async getLicenses(tenantId: string) {
    return this.prisma.bookshelfLicense.findMany({
      where: { tenantId },
      include: { product: true },
    });
  }

  async getLicense(tenantId: string, solutionKey: string) {
    const product = await this.prisma.bookshelfProduct.findUnique({
      where: { solutionKey },
    });

    if (!product) {
      throw new NotFoundException(`Bookshelf product with key '${solutionKey}' not found`);
    }

    const license = await this.prisma.bookshelfLicense.findUnique({
      where: {
        tenantId_productId: {
          tenantId,
          productId: product.id,
        },
      },
      include: {
        product: true,
      },
    });

    if (!license) {
      throw new NotFoundException(`License for product '${solutionKey}' not found for this tenant`);
    }

    return license;
  }

  async decryptConfig(tenantId: string, solutionKey: string): Promise<Record<string, string>> {
    const license = await this.getLicense(tenantId, solutionKey);
    const configVault = license.configVault as Record<string, EncryptedPayload>;
    const secret = this.getSecretKey();
    const decryptedConfig: Record<string, string> = {};

    for (const [key, payload] of Object.entries(configVault)) {
      if (payload && payload.encryptedKey && payload.iv) {
        decryptedConfig[key] = VaultCrypto.decrypt(payload.encryptedKey, payload.iv, secret);
      }
    }

    return decryptedConfig;
  }

  async updateLicenseStatus(tenantId: string, solutionKey: string, status: "ACTIVE" | "SUSPENDED" | "MAINTENANCE") {
    const product = await this.prisma.bookshelfProduct.findUnique({
      where: { solutionKey },
    });

    if (!product) {
      throw new NotFoundException(`Bookshelf product with key '${solutionKey}' not found`);
    }

    return this.prisma.bookshelfLicense.update({
      where: {
        tenantId_productId: {
          tenantId,
          productId: product.id,
        },
      },
      data: { status },
    });
  }
}
