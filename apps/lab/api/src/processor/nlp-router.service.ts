import { Injectable } from "@nestjs/common";
import { ConnectionsService } from "../connections/connections.service";

interface ProcessedPayload {
  source: string;
  processedAt: string;
  content: string;
}

@Injectable()
export class NlpRouterService {
  constructor(private connectionsService: ConnectionsService) {}

  async processRawInput(tenantId: string, productId: string, rawText: string) {
    const cleanText = rawText
      .replace(/(?:https?|ftp):\/\/[\n\S]+/g, "")
      .replace(/[\w\.-]+@[\w\.-]+\.\w{2,4}/g, "")
      .trim();

    const structuredPayload: ProcessedPayload = {
      source: "Gemini",
      processedAt: new Date().toISOString(),
      content: `### [Origem: Gemini]\n\n${cleanText}`,
    };

    await this.dispatchToStorage(tenantId, productId, structuredPayload);

    return {
      success: true,
      moduleId: "mod_" + Math.random().toString(36).substring(2, 9),
    };
  }

  private async dispatchToStorage(tenantId: string, productId: string, payload: ProcessedPayload): Promise<void> {
    return Promise.resolve();
  }
}
