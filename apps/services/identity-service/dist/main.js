import { createLogger } from '@salon-spa-saas/logger';
import { buildIdentityApp } from './app';
import { config } from './config';
import { disconnectPrisma } from './infrastructure/prisma/client';
import { redisConnectionManager } from './infrastructure/redis/redis-connection.manager';
const logger = createLogger('identity-service');
async function bootstrap() {
    const app = buildIdentityApp();
    // Connect to Redis in background with resilient fallback
    redisConnectionManager.connect().catch((err) => {
        logger.warn({ error: err.message }, 'Redis initial connection failed, will use DB fallback');
    });
    const server = app.listen(config.PORT, () => {
        logger.info(`Identity Service listening on http://localhost:${config.PORT}`);
        logger.info(`OpenAPI Documentation available at http://localhost:${config.PORT}/docs`);
    });
    async function shutdown(signal) {
        logger.info(`Received ${signal}, shutting down gracefully...`);
        server.close(async () => {
            await redisConnectionManager.disconnect();
            await disconnectPrisma();
            logger.info('Identity Service gracefully stopped');
            process.exit(0);
        });
    }
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
}
bootstrap().catch((err) => {
    logger.error({ err }, 'Failed to start Identity Service');
    process.exit(1);
});
