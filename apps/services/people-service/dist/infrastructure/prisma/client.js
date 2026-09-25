import { createLogger } from '@salon-spa-saas/logger';
import { PrismaClient } from './generated-client';
const logger = createLogger('people-prisma');
export const prisma = global.__peoplePrisma ||
    new PrismaClient({
        log: process.env.NODE_ENV === 'development'
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
    prisma.$on?.('query', (e) => {
        logger.debug({ query: e.query, params: e.params, duration: `${e.duration}ms` }, 'Prisma Query');
    });
}
