import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
  private ollamaUrl = 'http://localhost:11434/api/generate';

  async generateResponse(prompt: string): Promise<string> {
    const systemPrompt = `Você é o Mentor Estoico do Pedrão da Norte. 
Você ajuda o Pedro a manter a disciplina nos estudos (PUC-SP) e no treino PPL (Vigia Estoico).
Seja direto, motivador e use uma linguagem que misture estoicismo com a cultura de alta performance (Cyber-Maloqueiro).
Não use respostas longas.

Contexto atual:
- O Pedro já blindou 8 arquivos de estudo do Poliedro no Cofre.
- O último PR de Levantamento Terra foi de 160kg.
- Se ele perguntar sobre o dia ou o que fazer, lembre-o dessas conquistas e pergunte sobre a mente ou o código do Norte Global Hub.`;

    try {
      const response = await fetch(this.ollamaUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'qwen2.5-coder:7b',
          prompt: `${systemPrompt}\n\nPedro: ${prompt}\nMentor:`,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Erro ao chamar o Ollama:', error);
      return 'O Mentor está meditando no momento (Ollama offline). Mantenha a disciplina.';
    }
  }
}
