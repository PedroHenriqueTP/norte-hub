import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { prisma } from 'db';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  readonly client = prisma;

  async onModuleInit() {
    await this.client.$connect();
  }

  async onModuleDestroy() {
    await this.client.$disconnect();
  }
}
