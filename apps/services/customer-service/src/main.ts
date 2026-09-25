import { createLogger } from '@salon-spa-saas/logger';
import { createApp } from './app';
import { config } from './config';
import { customerEventPublisher } from './infrastructure/messaging/publisher';
import { prisma } from './infrastructure/prisma/client';
import { redisConnectionManager } from './infrastructure/redis/redis-connection.manager';

const logger = createLogger('customer-service');

async function bootstrap() {
  const app = createApp();

  const server = app.listen(config.PORT, () => {
    logger.info({ port: config.PORT, env: config.NODE_ENV }, 'Customer Service started successfully');
  });

  const shutdown = async (signal: string) => {
    logger.info({ signal }, 'Graceful shutdown initiated');
    server.close(async () => {
      await customerEventPublisher.close().catch(() => {});
      await redisConnectionManager.close().catch(() => {});
      await prisma.$disconnect().catch(() => {});
      logger.info('Customer Service shutdown completed');
      process.exit(0);
    });

    setTimeout(() => {
      logger.error('Forced shutdown due to timeout');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

bootstrap().catch((err) => {
  logger.fatal({ err }, 'Failed to start Customer Service');
  process.exit(1);
});
