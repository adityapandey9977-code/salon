import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { AppError } from '@salon-spa-saas/common-types';
import { financeOpenApiSpec } from './docs/openapi';
import { HealthController } from './http/controllers/health.controller';
import { financeRoutes } from './http/routes/finance.routes';
import { payrollRoutes } from './http/routes/payroll.routes';
import { royaltyRoutes } from './http/routes/royalty.routes';
import { internalRoutes } from './http/routes/internal.routes';
import { FinanceController } from './http/controllers/finance.controller';
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
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(financeOpenApiSpec));
    app.get('/openapi.json', (_req, res) => res.json(financeOpenApiSpec));
    // Business Routes
    app.use('/api/v1/finance', financeRoutes);
    app.use('/api/v1/finance/payroll', payrollRoutes);
    app.use('/api/v1/billing/royalties', royaltyRoutes);
    app.get('/api/v1/staff/commissions', FinanceController.getStaffCommissions);
    // Internal Routes (Event consumers)
    app.use('/internal/v1/finance', internalRoutes);
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
