import { createApp } from './app';
import { config } from './config';
import { prisma } from './infrastructure/prisma/client';
import { eventSubscriber } from './infrastructure/messaging/subscriber';

async function bootstrap() {
  const app = createApp();

  // Connect RabbitMQ subscriber asynchronously
  await eventSubscriber.start();

  const server = app.listen(config.PORT, () => {
    console.log(`Reporting Service listening on port ${config.PORT}`);
    console.log(`OpenAPI docs available at http://localhost:${config.PORT}/docs`);
  });

  const shutdown = async (signal: string) => {
    console.log(`Received ${signal}, shutting down gracefully...`);
    server.close(async () => {
      await eventSubscriber.close();
      await prisma.$disconnect();
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

bootstrap().catch((err) => {
  console.error('Fatal error starting Reporting Service:', err);
  process.exit(1);
});
