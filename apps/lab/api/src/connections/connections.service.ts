import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { VaultCrypto } from "../../../packages/crypto/vault";

@Injectable()
export class ConnectionsService {
  constructor(private prisma: PrismaService) {}

  async saveConnection(tenantId: string, provider: string, rawToken: string) {
    const secret = process.env.VAULT_SECRET_KEY || "global-system-fallback-secret";
    const { encryptedKey, iv } = VaultCrypto.encrypt(rawToken, secret);

    return this.prisma.oAuthVault.create({
      data: {
        provider,
        encryptedKey,
        iv,
        tenantId,
      },
    });
  }
}
