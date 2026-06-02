import { Controller, Post, Body } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('hub')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('chat')
  async chat(@Body('prompt') prompt: string) {
    const response = await this.chatService.generateResponse(prompt);
    return { response };
  }
}
