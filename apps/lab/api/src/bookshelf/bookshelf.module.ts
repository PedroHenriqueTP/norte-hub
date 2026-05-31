import { Module } from "@nestjs/common";
import { BookshelfService } from "./bookshelf.service";
import { BookshelfController } from "./bookshelf.controller";
import { PrismaService } from "../database/prisma.service";

@Module({
  controllers: [BookshelfController],
  providers: [BookshelfService, PrismaService],
  exports: [BookshelfService],
})
export class BookshelfModule {}
