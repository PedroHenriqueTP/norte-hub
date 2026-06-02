import { ChatService } from './chat.service';

async function main() {
  const chatService = new ChatService();
  
  console.log('[MENTOR_SISTEMA]: Enviando sinal para o Ollama...');
  
  const prompt = 'Acabei de registrar um Levantamento Terra de 160kg e comi 80g de proteína. Qual é a ordem para hoje?';
  const response = await chatService.generateResponse(prompt);
  
  console.log('[MENTOR_SISTEMA]: Resposta recebida com sucesso!');
  console.log(`[PEDRO]: ${prompt}`);
  console.log(`[MENTOR]: ${response}`);
}

main().catch(console.error);
