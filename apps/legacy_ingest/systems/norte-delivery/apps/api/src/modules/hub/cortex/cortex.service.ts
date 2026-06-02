import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { FilesGateway } from '../../saas/cloud/files.gateway';

@Injectable()
export class CortexService implements OnModuleInit {
  private ai!: GoogleGenAI;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly filesGateway: FilesGateway
  ) {}

  onModuleInit() {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY') || 'mock-key';
    this.ai = new GoogleGenAI({ apiKey });
  }

  async generateCortexResponse(prompt: string, context?: string): Promise<string> {
    const finalPrompt = context ? `${context}\n\nUser query: ${prompt}` : prompt;
    const model = this.configService.get<string>('GEMINI_MODEL') || 'gemini-2.5-pro';
    const response = await this.ai.models.generateContent({
      model,
      contents: finalPrompt
    });
    return response.text || '';
  }

  async analyzeCloudFile(fileMetadata: { name: string; mimeType: string; size: number }, fileContent?: string) {
    const model = this.configService.get<string>('GEMINI_MODEL') || 'gemini-2.5-pro';
    const systemPrompt = `Voce e o Norte Cortex, um motor de analise de arquivos. Analise os metadados e o conteudo do arquivo fornecidos abaixo e retorne um objeto JSON contendo: { "summary": "Um resumo conciso e profissional do arquivo em portugues.", "tags": ["tag1", "tag2", "tag3"] } Mantenha o retorno estritamente em formato JSON valido, sem markdown ou marcacoes extras.`;
    const contentPrompt = `Nome: ${fileMetadata.name}\nTipo: ${fileMetadata.mimeType}\nTamanho: ${fileMetadata.size} bytes\nConteudo: ${fileContent || 'Metadados basicos do arquivo.'}`;

    const response = await this.ai.models.generateContent({
      model,
      contents: `${systemPrompt}\n\n${contentPrompt}`
    });

    const text = response.text || '{}';
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    try {
      return JSON.parse(cleanJson);
    } catch {
      return {
        summary: 'Arquivo indexado com sucesso.',
        tags: ['cloud', fileMetadata.mimeType.split('/')[0]]
      };
    }
  }

  async generateNutritionalInsight(dietLogs: any[]) {
    const model = this.configService.get<string>('GEMINI_MODEL') || 'gemini-2.5-pro';
    const systemPrompt = `Voce e um nutricionista especialista do Norte Fit. Analise o historico de alimentacao fornecido e retorne recomendacoes personalizadas de refeicoes limpas e ajustes de macros. Retorne a resposta estritamente em formato JSON valido: { "insights": ["insight 1", "insight 2"], "recommendedMeals": [ { "name": "Nome da Refeicao", "carbs": 30, "protein": 25, "fat": 10, "calories": 310 } ] } Nao adicione markdown ou formatacao extra.`;
    const logsPrompt = `Historico de alimentacao: ${JSON.stringify(dietLogs)}`;

    const response = await this.ai.models.generateContent({
      model,
      contents: `${systemPrompt}\n\n${logsPrompt}`
    });

    const text = response.text || '{}';
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    try {
      return JSON.parse(cleanJson);
    } catch {
      return {
        insights: ['Mantenha uma dieta equilibrada.'],
        recommendedMeals: []
      };
    }
  }

  @OnEvent('file.uploaded', { async: true })
  async handleFileUploaded(payload: {
    fileId: string;
    userId: string;
    tenantId: string | null;
    url: string;
    mimeType: string;
    name: string;
    size: number;
  }) {
    try {
      const insight = await this.analyzeCloudFile({
        name: payload.name,
        mimeType: payload.mimeType,
        size: payload.size
      });

      const updatedFile = await this.prisma.cloudFile.update({
        where: { id: payload.fileId },
        data: {
          summary: insight.summary,
          tags: insight.tags ? insight.tags.join(',') : ''
        } as any
      });

      this.filesGateway.broadcastFileUpdate(payload.userId, 'updated', updatedFile);
    } catch (err) {
      console.error(err);
    }
  }
}
