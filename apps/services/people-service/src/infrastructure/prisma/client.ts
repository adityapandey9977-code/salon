import { createLogger } from '@salon-spa-saas/logger';
import { PrismaClient } from './generated-client';

const logger = createLogger('people-prisma');

declare global {
  // eslint-disable-next-line no-var
  var __peoplePrisma: PrismaClient | undefined;
}

export const prisma: PrismaClient =
  global.__peoplePrisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? [
            { emit: 'event', level: 'query' },
            { emit: 'stdout', level: 'error' },
            { emit: 'stdout', level: 'warn' },
          ]
        : [{ emit: 'stdout', level: 'error' }],
  });

if (process.env.NODE_ENV !== 'production') {
  global.__peoplePrisma = prisma;
}

if (process.env.NODE_ENV === 'development') {
  (prisma as any).$on?.('query', (e: any) => {
    logger.debug({ query: e.query, params: e.params, duration: `${e.duration}ms` }, 'Prisma Query');
  });
}
