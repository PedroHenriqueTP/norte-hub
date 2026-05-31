import { Module } from "@nestjs/common";
import { WebhooksService } from "./webhooks.service";
import { WebhooksController } from "./webhooks.controller";
import { PrismaService } from "../database/prisma.service";
import { BookshelfService } from "../bookshelf/bookshelf.service";
import { NlpRouterService } from "../processor/nlp-router.service";
import { ConnectionsService } from "../connections/connections.service";

@Module({
  controllers: [WebhooksController],
  providers: [
    WebhooksService,
    PrismaService,
    BookshelfService,
    NlpRouterService,
    ConnectionsService,
  ],
})
export class WebhooksModule {}
