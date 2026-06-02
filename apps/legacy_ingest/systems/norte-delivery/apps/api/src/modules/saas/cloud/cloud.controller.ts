import { Controller, Get, Post, Delete, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { CloudService } from './cloud.service';
import { AuthGuard } from '@nestjs/passport';
import { SubscriptionGuard } from '../../../common/guards/subscription.guard';
import { RequireSubscription } from '../../../common/decorators/subscription.decorator';
import { AppSlug } from '@prisma/client';

@Controller('api/systems/norte-cloud')
@UseGuards(AuthGuard('jwt'), SubscriptionGuard)
@RequireSubscription(AppSlug.NORTE_CLOUD)
export class SystemsCloudController {
  constructor(private readonly cloudService: CloudService) {}

  @Post('files')
  async uploadFile(@Req() req: any, @Body() body: { name: string; mimeType: string; size: number; url: string; path: string }) {
    return this.cloudService.createFileMetadata({
      ...body,
      userId: req.user.userId,
      tenantId: req.user.tenantId
    });
  }

  @Get('files')
  async listFiles(@Req() req: any, @Query('path') path: string) {
    return this.cloudService.listFilesByPath(path || '', req.user.userId, req.user.tenantId);
  }

  @Delete('files/:id')
  async deleteFile(@Req() req: any, @Param('id') id: string) {
    return this.cloudService.deleteFileMetadata(id, req.user.userId);
  }

  @Get('storage/usage')
  async getStorageUsage(@Req() req: any) {
    const bytesUsed = await this.cloudService.calculateTenantStorage(req.user.tenantId);
    return { bytesUsed };
  }

  @Get('search')
  async searchFiles(@Req() req: any, @Query('q') q: string) {
    if (!q?.trim()) return [];
    return this.cloudService.searchFiles(q.trim(), req.user.userId, req.user.tenantId);
  }
}

@Controller('api/personal/norte-cloud')
@UseGuards(AuthGuard('jwt'), SubscriptionGuard)
@RequireSubscription(AppSlug.NORTE_CLOUD)
export class PersonalCloudController {
  constructor(private readonly cloudService: CloudService) {}

  @Post('files')
  async uploadPersonalFile(@Req() req: any, @Body() body: { name: string; mimeType: string; size: number; url: string; path: string }) {
    return this.cloudService.createFileMetadata({
      ...body,
      userId: req.user.userId,
      tenantId: undefined
    });
  }

  @Get('files')
  async listPersonalFiles(@Req() req: any, @Query('path') path: string) {
    return this.cloudService.listFilesByPath(path || '', req.user.userId, undefined);
  }

  @Delete('files/:id')
  async deletePersonalFile(@Req() req: any, @Param('id') id: string) {
    return this.cloudService.deleteFileMetadata(id, req.user.userId);
  }

  @Get('storage/usage')
  async getPersonalStorageUsage(@Req() req: any) {
    const bytesUsed = await this.cloudService.calculateUserStorage(req.user.userId);
    return { bytesUsed };
  }

  @Get('search')
  async searchPersonalFiles(@Req() req: any, @Query('q') q: string) {
    if (!q?.trim()) return [];
    return this.cloudService.searchFiles(q.trim(), req.user.userId, undefined);
  }
}
