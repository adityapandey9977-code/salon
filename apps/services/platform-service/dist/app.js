import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { AppError } from '@salon-spa-saas/common-types';
import { platformOpenApiSpec } from './docs/openapi';
import { HealthController } from './http/controllers/health.controller';
import { superAdminRoutes } from './http/routes/super-admin.routes';
import { internalRoutes } from './http/routes/internal.routes';
import { supportRoutes } from './http/routes/support.routes';
export function createApp() {
    const app = express();
    app.use(helmet());
    app.use(cors({ origin: true, credentials: true }));
    app.use(express.json());
    // Observability & Health
    app.get('/health', HealthController.health);
    app.get('/ready', HealthController.ready);
    app.get('/metrics', HealthController.metrics);
    // Docs
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(platformOpenApiSpec));
    app.get('/openapi.json', (_req, res) => res.json(platformOpenApiSpec));
    // Business Routes (Super Admin & Control Plane)
    app.use('/api/v1/super-admin', superAdminRoutes);
    app.use('/api/v1/platform', superAdminRoutes);
    // Support Ticket Routes
    app.use('/api/v1/support', supportRoutes);
    // Internal Service-to-Service routes
    app.use('/internal/v1', internalRoutes);
    // Global Error Handler
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
