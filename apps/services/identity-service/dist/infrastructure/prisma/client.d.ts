import { PrismaClient } from './generated-client';
declare global {
    var __identityPrisma: PrismaClient | undefined;
}
export declare const prisma: PrismaClient<import("./generated-client").Prisma.PrismaClientOptions, never, import("./generated-client/runtime/library").DefaultArgs>;
export declare function disconnectPrisma(): Promise<void>;
//# sourceMappingURL=client.d.ts.map