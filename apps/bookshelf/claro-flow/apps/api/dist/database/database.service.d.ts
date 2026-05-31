import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
export declare class DatabaseService implements OnModuleInit, OnModuleDestroy {
    readonly client: import("db").PrismaClient<import("db").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
}
