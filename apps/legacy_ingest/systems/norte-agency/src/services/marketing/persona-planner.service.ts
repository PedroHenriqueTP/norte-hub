import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

/**
 * ðŸ‘¤ TentÃ¡culo 18: Persona Planner (The Creator Engine)
 * Gera roteiros virais e autÃªnticos combinando tendÃªncias da internet (via OrÃ¡culo)
 * com o perfil Ãºnico do Arquiteto (2,10m, PUC-SP, Dev & Fitness).
 */
export class PersonaPlannerService {
  
  // O "DNA" da Marca Pessoal
  private static readonly PERSONA_DNA = `
    Nome: PedrÃ£o
    CaracterÃ­sticas FÃ­sicas: 2,10m de altura, fisionomia atlÃ©tica (foco em hipertrofia e isometria).
    ProfissÃ£o: Arquiteto de Software, Especialista em systems Multi-tenant.
    AcadÃªmico: Estudante de CiÃªncia de Dados na PUC-SP.
    Filosofia: Estoicismo. ResiliÃªncia extrema, foco em construir sistemas autÃ´nomos.
    Empresa: CEO da AgÃªncia Cogitare e Criador do Norte Global Hub.
  `;

  /**
   * Gera roteiros baseados em tendÃªncias do OrÃ¡culo (Scraper)
   */
  static async generateViralScripts(trendTopic: string) {
    console.log(`[PERSONA PLANNER] Gerando matriz de conteÃºdo para a tendÃªncia: ${trendTopic}`);

    const scriptSchema = z.object({
      shorts15s: z.string().describe("Roteiro dinÃ¢mico de 15 segundos para Reels/TikTok (Gancho RÃ¡pido)"),
      shorts30s: z.string().describe("Roteiro de 30 segundos (Problema + SoluÃ§Ã£o no Norte Hub)"),
      shorts60s: z.string().describe("Roteiro profundo de 60 segundos (Storytelling + Autoridade TÃ©cnica)"),
      visualHook: z.string().describe("SugestÃ£o de cenÃ¡rio ou aÃ§Ã£o visual para o vÃ­deo (Ex: Digitando cÃ³digo enquanto bebe cafÃ©, treinando pesado)")
    });

    try {
      const { object } = await generateObject({
        model: openai("gpt-4o-mini"), // Velocidade mÃ¡xima
        schema: scriptSchema,
        prompt: `
          VocÃª Ã© um estrategista de conteÃºdo focado no perfil "Dev-Life" e "Lifestyle SaudÃ¡vel".
          Considere a seguinte Persona:
          ${this.PERSONA_DNA}
          
          Trend Detectada pelo Scraper: "${trendTopic}"
          
          Crie 3 opÃ§Ãµes de roteiros para vÃ­deos curtos que unam a rotina intensa de cÃ³digo, a altura incomum dele (elemento de curiosidade) e a filosofia de vida, amarrando tudo ao poder de construir ecossistemas systems como a Norte.
        `,
      });

      console.log("[PERSONA PLANNER] Scripts gerados com sucesso!");
      return object;

    } catch (error) {
      console.error("[PERSONA PLANNER] Falha na geraÃ§Ã£o de I.A., usando fallback.", error);
      // Fallback para quando nÃ£o houver chave de API configurada
      return {
        shorts15s: "Gancho: VocÃª acha que programar cansa? Imagina fazer isso com 2,10m. ResoluÃ§Ã£o: Mostra a rotina de alongamento e o setup ergonÃ´mico conectado ao Norte Hub.",
        shorts30s: "Conta como o estoicismo te ajuda a lidar com bugs na PUC-SP e como vocÃª usa a SecretÃ¡ria I.A. para nÃ£o perder prazos de entrega.",
        shorts60s: "Mini-Doc: 'Um dia na vida do Gigante do systems'. Mostra treino PPL pela manhÃ£, aulas na PUC, e finaliza mostrando o dashboard do Norte Enterprise processando milhares de pagamentos.",
        visualHook: "Inicia o vÃ­deo gravando de baixo para cima para enfatizar os 2,10m, com cÃ³digo fluindo na tela atrÃ¡s de vocÃª."
      };
    }
  }
}

