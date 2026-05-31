"use server";

import fs from "fs/promises";
import path from "path";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { getAuthContext } from "@/services/auth-context";
import { BrandAssets } from "@/config/brand-assets";

const presentationSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  slides: z.array(z.object({
    title: z.string(),
    content: z.array(z.string()),
    notes: z.string().optional()
  }))
});

export async function generatePresentationData(topic: string, includeROI: boolean) {
  const { role } = await getAuthContext();

  if (role !== "SUPER_ADMIN" && role !== "OWNER") {
    throw new Error("Unauthorized to generate pitches.");
  }

  // Lendo o DNA do Projeto
  const dnaPath = path.join(process.cwd(), "PROJETO_DNA.md");
  let dnaContent = "";
  try {
    dnaContent = await fs.readFile(dnaPath, "utf-8");
  } catch (err) {
    console.warn("PROJETO_DNA.md não encontrado, usando contexto base.");
    dnaContent = "AgencyOS: Hub de sites rápidos, integrações de vendas e automações via IA.";
  }

  // Buscando Dados Reais do Motor Fintech para embasar o ROI
  let businessMetrics = "Sem métricas reais disponíveis no momento.";
  if (includeROI) {
    try {
      const { getConsolidatedBilling } = await import("@/actions/billing");
      const { globalMetrics, tenants } = await getConsolidatedBilling();
      const avgLeadsPerTenant = tenants.length ? Math.round(globalMetrics.totalLeads / tenants.length) : 0;
      
      businessMetrics = `Atualmente processamos ${globalMetrics.totalLeads} leads em nosso Hub.
      A média de captura por marketplace é de ${avgLeadsPerTenant} leads.
      Nossa receita de MRR gerenciada já ultrapassa R$ ${globalMetrics.totalRevenue}.
      Use estes dados exatos para provar ao cliente que nosso sistema gera tráfego, vendas reais e que o ROI compensa o investimento em nossos portais.`;
    } catch (e) {
      console.error("Falha ao buscar métricas de billing para o pitch", e);
    }
  }

  // Gerando o roteiro via IA
  const prompt = `Você é um Executivo de Vendas Enterprise criando um Pitch Deck.
  Tópico principal pedido pelo cliente: ${topic}
  O cliente quer saber sobre ROI/Métricas: ${includeROI ? "Sim, foque em números e prove o ROI usando os seguintes dados reais da nossa operação: " + businessMetrics : "Não, foque apenas no design e conversão."}
  
  Use o seguinte contexto da nossa empresa para basear seus argumentos:
  ${dnaContent.substring(0, 1000)} // limitando contexto para velocidade
  
  Crie uma apresentação com 4 a 6 slides curtos e de alto impacto. Retorne o objeto estruturado.`;

  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: presentationSchema,
    prompt: prompt,
  });

  return {
    success: true,
    presentationData: object,
    brandConfig: BrandAssets.norte
  };
}
