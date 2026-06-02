import { Module } from '@nestjs/common';
import { HubController } from './hub.controller';
import { ChatController } from './chat.controller';
import { NorteOrchestratorService } from './norte-orchestrator.service';
import { EncryptionService } from './encryption.service';
import { ChatService } from './chat.service';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [HubController, ChatController],
  providers: [NorteOrchestratorService, EncryptionService, ChatService],
})
export class HubModule {}
