# Integração WhatsApp - Guia de Implementação

## Visão Geral

O sistema está preparado para integração com WhatsApp através de APIs como Twilio, Evolution API ou outras soluções similares.

## Estrutura Atual

O sistema já possui:
- ✅ Modelo de mensagens (`models/Message.ts`)
- ✅ API para salvar mensagens (`/api/messages`)
- ✅ Interface de mensagens no painel admin
- ✅ Criação automática de leads via WhatsApp
- ✅ Botão flutuante WhatsApp no site

## Implementação Passo a Passo

### 1. Escolher Provedor de API WhatsApp

Opções populares:
- **Twilio WhatsApp API** (recomendado para produção)
- **Evolution API** (open source)
- **ChatAPI**
- **Wati.io**

### 2. Configurar Webhook

Quando uma mensagem chega no WhatsApp, ela deve ser enviada para:

```
POST /api/messages
```

Exemplo de payload:

```json
{
  "from": "5511999999999",
  "to": "5511888888888",
  "content": "Olá, gostaria de agendar um horário",
  "type": "whatsapp",
  "direction": "incoming"
}
```

### 3. Criar Rota de Webhook

Crie `app/api/webhooks/whatsapp/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Message from '@/models/Message';
import Lead from '@/models/Lead';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar webhook (verificar assinatura do provedor)
    // const isValid = validateWebhookSignature(request, body);
    // if (!isValid) return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });

    const { from, to, message } = body;

    await connectDB();

    // Buscar ou criar lead
    let lead = await Lead.findOne({ phone: from });
    if (!lead) {
      lead = await Lead.create({
        name: from,
        phone: from,
        email: '',
        source: 'whatsapp',
        status: 'new',
      });
    }

    // Salvar mensagem
    await Message.create({
      from,
      to,
      content: message,
      type: 'whatsapp',
      direction: 'incoming',
      leadId: lead._id,
    });

    // Resposta automática (opcional)
    const autoReply = generateAutoReply(message);
    if (autoReply) {
      // Enviar resposta via API do WhatsApp
      await sendWhatsAppMessage(to, from, autoReply);
      
      // Salvar mensagem de resposta
      await Message.create({
        from: to,
        to: from,
        content: autoReply,
        type: 'whatsapp',
        direction: 'outgoing',
        leadId: lead._id,
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Erro no webhook WhatsApp:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

function generateAutoReply(message: string): string | null {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('olá') || lowerMessage.includes('oi')) {
    return 'Olá! Bem-vindo ao nosso estúdio. Como posso ajudar?';
  }
  
  if (lowerMessage.includes('preço') || lowerMessage.includes('valor')) {
    return 'Para informações sobre preços, acesse nosso site ou agende uma consulta!';
  }
  
  if (lowerMessage.includes('agendar') || lowerMessage.includes('horário')) {
    return 'Para agendar, envie seu nome e data preferida. Entraremos em contato em breve!';
  }
  
  return null; // Sem resposta automática
}

async function sendWhatsAppMessage(from: string, to: string, message: string) {
  // Implementar envio via API do WhatsApp escolhida
  // Exemplo com Twilio:
  /*
  const twilio = require('twilio');
  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  
  await client.messages.create({
    from: `whatsapp:${from}`,
    to: `whatsapp:${to}`,
    body: message,
  });
  */
}
```

### 4. Configurar Variáveis de Ambiente

Adicione ao `.env`:

```env
# WhatsApp API
WHATSAPP_API_KEY=sua-chave-api
WHATSAPP_API_URL=https://api.whatsapp.com
WHATSAPP_PHONE_NUMBER=5511999999999

# Twilio (exemplo)
TWILIO_ACCOUNT_SID=seu-account-sid
TWILIO_AUTH_TOKEN=seu-auth-token
TWILIO_WHATSAPP_NUMBER=whatsapp:+5511999999999
```

### 5. Interrupção Manual do Chatbot

No painel admin (`/admin/mensagens`), o administrador pode:
- Ver todas as conversas
- Enviar mensagens manuais
- Interromper o fluxo automático

Quando uma mensagem manual é enviada, o sistema pode:
- Marcar o lead como "em atendimento"
- Desativar respostas automáticas temporariamente
- Notificar o admin sobre novas mensagens

### 6. Melhorias Futuras

- [ ] Chatbot com IA (OpenAI, Google Dialogflow)
- [ ] Agendamento automático via WhatsApp
- [ ] Envio de lembretes de agendamento
- [ ] Integração com calendário
- [ ] Análise de sentimento das mensagens

## Exemplo de Fluxo Completo

1. Cliente envia mensagem no WhatsApp
2. Webhook recebe e salva mensagem
3. Sistema busca/cria lead automaticamente
4. Chatbot responde automaticamente (se configurado)
5. Admin vê mensagem no painel
6. Admin pode intervir e responder manualmente
7. Todas as mensagens ficam salvas no histórico

## Segurança

- ✅ Validar assinatura do webhook
- ✅ Rate limiting nas APIs
- ✅ Sanitizar inputs
- ✅ Autenticação nas rotas admin
- ✅ Logs de todas as interações

## Testes

Para testar localmente, você pode usar:
- **ngrok** para expor webhook localmente
- **Postman** para simular webhooks
- **WhatsApp Business API Sandbox** (Twilio)

