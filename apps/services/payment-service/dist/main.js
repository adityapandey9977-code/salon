import { createApp } from './app';
import { config } from './config';
import { paymentEventPublisher } from './infrastructure/messaging/publisher';
import { prisma } from './infrastructure/prisma/client';
import { redis } from './infrastructure/redis/client';
async function bootstrap() {
    const app = createApp();
    const server = app.listen(config.PORT, () => {
        console.log(`Payment Service listening on port ${config.PORT}`);
        console.log(`OpenAPI docs available at http://localhost:${config.PORT}/docs`);
    });
    const shutdown = async (signal) => {
        console.log(`Received ${signal}, shutting down gracefully...`);
        server.close(async () => {
            await prisma.$disconnect();
            await redis.quit();
            await paymentEventPublisher.close();
            process.exit(0);
        });
    };
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
}
bootstrap().catch((err) => {
    console.error('Fatal error starting Payment Service:', err);
    process.exit(1);
});
