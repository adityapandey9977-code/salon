import { PrismaClient } from './generated-client';
import { config } from '../../config';

const globalForPrisma = globalThis as unknown as {
  prismaPlatform: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prismaPlatform ??
  new PrismaClient({
    datasources: {
      db: {
        url: config.PLATFORM_DATABASE_URL,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prismaPlatform = prisma;
}

