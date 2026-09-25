import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { paymentOpenApiSpec } from './docs/openapi';
import { HealthController } from './http/controllers/health.controller';
import { correlationMiddleware } from './http/middleware/correlation.middleware';
import { errorHandler } from './http/middleware/error-handler.middleware';
import { internalPaymentRouter } from './http/routes/internal-payment.routes';
import { paymentRouter } from './http/routes/payment.routes';
import { webhookRouter } from './http/routes/webhook.routes';
export function createApp() {
    const app = express();
    app.use(helmet());
    app.use(cors());
    app.use(express.json());
    app.use(correlationMiddleware);
    // Health, Readiness & Metrics
    app.get('/health', HealthController.health);
    app.get('/ready', HealthController.ready);
    app.get('/metrics', HealthController.metrics);
    // API Documentation
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(paymentOpenApiSpec));
    app.get('/openapi.json', (_req, res) => res.json(paymentOpenApiSpec));
    // Business API Routes
    app.use('/api/v1/payments', paymentRouter);
    app.use('/api/v1/webhooks/payments', webhookRouter);
    app.use('/internal/v1/payments', internalPaymentRouter);
    // Global Error Handler
    app.use(errorHandler);
    return app;
}
