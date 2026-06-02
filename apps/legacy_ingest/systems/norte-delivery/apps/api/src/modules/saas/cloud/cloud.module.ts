import { Module } from '@nestjs/common';
import { SystemsCloudController, PersonalCloudController } from './cloud.controller';
import { CloudService } from './cloud.service';
import { FilesGateway } from './files.gateway';
import { PrismaModule } from '../../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SystemsCloudController, PersonalCloudController],
  providers: [CloudService, FilesGateway],
  exports: [CloudService, FilesGateway]
})
export class CloudModule {}
