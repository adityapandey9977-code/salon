import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { AppError } from '@salon-spa-saas/common-types';
import { organizationOpenApiSpec } from './docs/openapi';
import { BranchController } from './http/controllers/branch.controller';
import { HealthController } from './http/controllers/health.controller';
import { TenantController } from './http/controllers/tenant.controller';
import { branchRouter } from './http/routes/branch.routes';
import complianceRouter from './http/routes/compliance.routes';
import { tenantRouter } from './http/routes/tenant.routes';
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
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(organizationOpenApiSpec));
    app.get('/openapi.json', (_req, res) => res.json(organizationOpenApiSpec));
    // Business Routes
    app.use('/api/v1/tenants', tenantRouter);
    app.use('/api/v1/branches', branchRouter);
    app.use('/api/v1/compliance', complianceRouter);
    app.get('/api/v1/franchises', BranchController.getFranchises);
    app.post('/api/v1/franchises', BranchController.createFranchise);
    app.get('/api/v1/franchises/:franchiseId', BranchController.getFranchiseById);
    app.patch('/api/v1/franchises/:franchiseId', BranchController.updateFranchise);
    app.put('/api/v1/franchises/:franchiseId', BranchController.updateFranchise);
    app.get('/api/v1/franchises/:franchiseId/branches', BranchController.getFranchiseBranches);
    app.get('/api/v1/holidays', BranchController.getHolidays);
    app.get('/api/v1/resources', BranchController.listResources);
    app.post('/api/v1/resources', BranchController.createResource);
    // Internal Service-to-Service routes
    app.get('/internal/v1/tenants/:id', TenantController.getInternalTenant);
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
