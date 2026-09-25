import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { AppError } from '@salon-spa-saas/common-types';
import { reportingOpenApiSpec } from './docs/openapi';
import { HealthController } from './http/controllers/health.controller';
import { reportingRouter } from './http/routes/reporting.routes';
export function createApp() {
    const app = express();
    app.use(helmet());
    app.use(cors({ origin: true, credentials: true }));
    app.use(express.json());
    // Health and Observability
    app.get('/health', HealthController.health);
    app.get('/ready', HealthController.ready);
    app.get('/metrics', HealthController.metrics);
    // Docs
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(reportingOpenApiSpec));
    app.get('/openapi.json', (_req, res) => res.json(reportingOpenApiSpec));
    // Business Routes
    app.use('/api/v1', reportingRouter);
    // Error Handler
    app.use((err, _req, res, _next) => {
        if (err instanceof AppError) {
            res.status(err.statusCode).json({
                success: false,
                error: { code: err.name, message: err.message, details: err.details },
                timestamp: new Date().toISOString(),
            });
            return;
        }
        res.status(500).json({
            success: false,
            error: { code: 'INTERNAL_ERROR', message: err.message || 'Internal Server Error' },
            timestamp: new Date().toISOString(),
        });
    });
    return app;
}
