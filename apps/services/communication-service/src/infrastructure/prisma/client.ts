import { config } from '../../config';
import { PrismaClient } from './generated-client';

declare global {
  // eslint-disable-next-line no-var
  var __communicationPrisma: PrismaClient | undefined;
}

export const prisma =
  global.__communicationPrisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: config.COMMUNICATION_DATABASE_URL,
      },
    },
    log: config.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (config.NODE_ENV !== 'production') {
  global.__communicationPrisma = prisma;
}
