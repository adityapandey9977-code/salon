import { config } from '../../config';
import { PrismaClient } from './generated-client';

declare global {
  // eslint-disable-next-line no-var
  var __financePrisma: PrismaClient | undefined;
}

export const prisma =
  global.__financePrisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: config.FINANCE_DATABASE_URL,
      },
    },
    log: config.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (config.NODE_ENV !== 'production') {
  global.__financePrisma = prisma;
}
