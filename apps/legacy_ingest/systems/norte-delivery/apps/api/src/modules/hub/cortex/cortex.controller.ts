import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CortexService } from './cortex.service';
import { AuthGuard } from '@nestjs/passport';
import { SubscriptionGuard } from '../../../common/guards/subscription.guard';
import { RequireSubscription } from '../../../common/decorators/subscription.decorator';
import { AppSlug } from '@prisma/client';

@Controller('api/hub/cortex')
@UseGuards(AuthGuard('jwt'), SubscriptionGuard)
export class CortexController {
  constructor(private readonly cortexService: CortexService) {}

  @Post('analyze-file')
  @RequireSubscription(AppSlug.NORTE_CLOUD)
  async analyzeFile(
    @Body() body: { fileMetadata: { name: string; mimeType: string; size: number }; fileContent?: string }
  ) {
    return this.cortexService.analyzeCloudFile(body.fileMetadata, body.fileContent);
  }

  @Post('diet-insight')
  @RequireSubscription(AppSlug.NORTE_FIT)
  async dietInsight(@Body() body: { dietLogs: any[] }) {
    return this.cortexService.generateNutritionalInsight(body.dietLogs);
  }
}
