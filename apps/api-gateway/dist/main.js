import { createLogger } from '@salon-spa-saas/logger';
import { buildGatewayApp } from './app';
import { gatewayConfig } from './config';
import { GatewayRedisManager } from './security/redis-gateway';
const logger = createLogger('api-gateway');
async function bootstrap() {
    const app = buildGatewayApp();
    const server = app.listen(gatewayConfig.PORT, '0.0.0.0', () => {
        logger.info(`API Gateway active on http://0.0.0.0:${gatewayConfig.PORT}`);
        logger.info(`Unified Gateway Swagger UI: http://0.0.0.0:${gatewayConfig.PORT}/docs`);
        logger.info(`Proxying Auth & Identity traffic to: ${gatewayConfig.IDENTITY_SERVICE_URL}`);
    });
    async function shutdown(signal) {
        logger.info(`Received ${signal}, shutting down API Gateway gracefully...`);
        server.close(async () => {
            await GatewayRedisManager.getInstance().disconnect();
            logger.info('API Gateway stopped');
            process.exit(0);
        });
    }
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
}
bootstrap().catch((err) => {
    logger.error({ err }, 'Failed to bootstrap API Gateway');
    process.exit(1);
});
