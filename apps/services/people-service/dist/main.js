import { createLogger } from '@salon-spa-saas/logger';
import { buildPeopleApp } from './app';
import { config } from './config';
import { eventPublisher } from './infrastructure/messaging/publisher';
import { prisma } from './infrastructure/prisma/client';
import { redisConnectionManager } from './infrastructure/redis/redis-connection.manager';
const logger = createLogger('people-service-main');
async function bootstrap() {
    const app = buildPeopleApp();
    // Initialize background connections gracefully
    try {
        await redisConnectionManager.connect();
    }
    catch (err) {
        logger.warn({ error: err.message }, 'Redis initialization deferred, running in fallback mode');
    }
    try {
        await eventPublisher.connect();
    }
    catch (err) {
        logger.warn({ error: err.message }, 'RabbitMQ event publisher deferred');
    }
    const server = app.listen(config.PORT, () => {
        logger.info(`People Service running on port ${config.PORT} [${config.NODE_ENV}]`);
        logger.info(`OpenAPI Documentation available at http://localhost:${config.PORT}/docs`);
    });
    // Graceful Shutdown Handler
    const shutdown = async (signal) => {
        logger.info(`Received ${signal}. Starting graceful shutdown...`);
        server.close(async () => {
            logger.info('HTTP server closed');
            try {
                await redisConnectionManager.disconnect();
                await eventPublisher.close();
                await prisma.$disconnect();
                logger.info('Infrastructure connections closed cleanly');
            }
            catch (err) {
                logger.error({ err }, 'Error during graceful shutdown');
            }
            process.exit(0);
        });
        // Force exit after 10s if stuck
        setTimeout(() => {
            logger.error('Graceful shutdown timeout exceeded, forcing exit');
            process.exit(1);
        }, 10000);
    };
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
}
bootstrap().catch((err) => {
    logger.fatal({ err }, 'Fatal error during People Service bootstrap');
    process.exit(1);
});
