import { prisma } from "@/lib/prisma";

export type RebrandConfig = {
  brandName: string;
  primaryColor: string;
  fontFamily: string;
};

/**
 * 🎨 Tentáculo 20: Global Rebranding Engine
 * Extrai a configuração amorfa do Neon DB e propaga para toda a interface.
 */
export class RebrandingService {
  
  static async getConfig(): Promise<RebrandConfig> {
    const configs = await prisma.systemConfig.findMany();
    
    // Converte array de key/value para objeto
    const configMap = configs.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);

    return {
      brandName: configMap["BRAND_NAME"] || "Norte Global",
      primaryColor: configMap["PRIMARY_COLOR"] || "#8b5cf6", // Violet default
      fontFamily: configMap["FONT_FAMILY"] || "Inter",
    };
  }

  static async setBrand(name: string, colorHex: string, font: string) {
    await prisma.$transaction([
      prisma.systemConfig.upsert({
        where: { key: "BRAND_NAME" },
        update: { value: name },
        create: { key: "BRAND_NAME", value: name }
      }),
      prisma.systemConfig.upsert({
        where: { key: "PRIMARY_COLOR" },
        update: { value: colorHex },
        create: { key: "PRIMARY_COLOR", value: colorHex }
      }),
      prisma.systemConfig.upsert({
        where: { key: "FONT_FAMILY" },
        update: { value: font },
        create: { key: "FONT_FAMILY", value: font }
      })
    ]);

    return { success: true };
  }
}
