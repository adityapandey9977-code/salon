import { config } from '../../config';
import { PrismaClient } from './generated-client';

declare global {
  // eslint-disable-next-line no-var
  var __paymentPrisma: PrismaClient | undefined;
}

export const prisma =
  global.__paymentPrisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: config.PAYMENT_DATABASE_URL,
      },
    },
    log: config.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (config.NODE_ENV !== 'production') {
  global.__paymentPrisma = prisma;
}
