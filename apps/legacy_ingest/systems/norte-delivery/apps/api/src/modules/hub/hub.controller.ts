import { Controller, Get, Param } from '@nestjs/common';
import { NorteOrchestratorService } from './norte-orchestrator.service';

@Controller('status')
export class HubController {
  constructor(private orchestrator: NorteOrchestratorService) {}

  @Get('daily-overview')
  async getDailyOverview() {
    return this.orchestrator.getDailyOverview('user-id-placeholder');
  }

  @Get('vault')
  async getVaultStatus() {
    return this.orchestrator.getVaultStatus();
  }
}
