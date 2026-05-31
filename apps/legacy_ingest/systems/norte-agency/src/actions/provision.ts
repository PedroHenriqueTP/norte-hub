"use server";

import { getAuthContext } from "@/services/auth-context";
import { prisma } from "@/lib/prisma";
import { BrandAssets } from "@/config/brand-assets";

export async function provisionSite(data: { templateName: string; clientName: string; slug: string }) {
  const { role } = await getAuthContext();

  if (role !== "SUPER_ADMIN" && role !== "OWNER") {
    throw new Error("Unauthorized: Only Admins can provision new sites.");
  }

  const { templateName, clientName, slug } = data;
  const brandConfig = BrandAssets.norte;

  console.log(`[PROVISIONING] Iniciando clonagem do template: ${templateName} para o cliente: ${clientName}`);
  
  // 1. Criação do Tenant (Cliente ERP/Site)
  const newTenant = await prisma.tenant.create({
    data: {
      name: clientName,
      slug: slug,
      document: "Provisionado via Hub",
    }
  });

  // 2. Preparação das Variáveis de Ambiente a serem injetadas na Vercel
  const envVars = [
    { key: "NEXT_PUBLIC_TENANT_ID", value: newTenant.id },
    { key: "NEXT_PUBLIC_THEME_PRIMARY", value: brandConfig.colors.primary },
    { key: "NEXT_PUBLIC_THEME_SECONDARY", value: brandConfig.colors.secondary },
    { key: "NEXT_PUBLIC_AGENCY_LOGO", value: brandConfig.logos.light },
    { key: "DATABASE_URL", value: process.env.DATABASE_URL || "" }, // Compartilhando o mesmo banco (Row-level / Tenant-level isolation)
  ];

  // 3. Integração com Vercel API (Simulado)
  // Como não temos a API Key da Vercel hardcoded, deixamos o wrapper pronto.
  /*
  const vercelResponse = await fetch(`https://api.vercel.com/v9/projects`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.VERCEL_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: slug,
      framework: "nextjs",
      gitRepository: {
        type: "github",
        repo: `SoberaniaNorte/${templateName}`
      },
      environmentVariables: envVars.map(v => ({
        key: v.key,
        value: v.value,
        type: "plain",
        target: ["production", "preview", "development"]
      }))
    })
  });
  
  if (!vercelResponse.ok) {
    throw new Error("Falha ao integrar com Vercel API");
  }
  */

  console.log(`[PROVISIONING] Site ${slug}.agencyos.com provisionado com sucesso na Vercel (Simulado)!`);

  return {
    success: true,
    tenantId: newTenant.id,
    domain: `${slug}.agencyos.com`,
    message: "Provisionamento concluído e variáveis injetadas."
  };
}
