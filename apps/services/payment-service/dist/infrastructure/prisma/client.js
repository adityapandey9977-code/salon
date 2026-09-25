import { config } from '../../config';
import { PrismaClient } from './generated-client';
export const prisma = global.__paymentPrisma ||
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
