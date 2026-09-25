import { config } from '../../config';
import { PrismaClient } from './generated-client';

declare global {
  // eslint-disable-next-line no-var
  var __orgPrisma: PrismaClient | undefined;
}

export const prisma =
  global.__orgPrisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: config.ORGANIZATION_DATABASE_URL,
      },
    },
    log: config.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (config.NODE_ENV !== 'production') {
  global.__orgPrisma = prisma;
}
