import { config } from '../../config';
import { PrismaClient } from './generated-client';

declare global {
  // eslint-disable-next-line no-var
  var __bookingPrisma: PrismaClient | undefined;
}

export const prisma =
  global.__bookingPrisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: config.BOOKING_DATABASE_URL,
      },
    },
    log: config.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (config.NODE_ENV !== 'production') {
  global.__bookingPrisma = prisma;
}
