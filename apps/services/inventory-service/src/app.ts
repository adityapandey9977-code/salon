import cors from 'cors';
import express, { type Application, type Request, type Response, type NextFunction } from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { AppError } from '@salon-spa-saas/common-types';
import { inventoryOpenApiSpec } from './docs/openapi';
import { HealthController } from './http/controllers/health.controller';
import { inventoryRoutes } from './http/routes/inventory.routes';
import { internalRoutes } from './http/routes/internal.routes';

export function createApp(): Application {
  const app: Application = express();

  app.use(helmet());
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());

  // Observability & Health
  app.get('/health', HealthController.health);
  app.get('/ready', HealthController.ready);
  app.get('/metrics', HealthController.metrics);

  // Docs
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(inventoryOpenApiSpec));
  app.get('/openapi.json', (_req: Request, res: Response) => res.json(inventoryOpenApiSpec));

  // Business Routes
  app.use('/api/v1/inventory', inventoryRoutes);

  // Internal Routes (Service recipe consumption / POS stock deduction)
  app.use('/internal/v1/inventory', internalRoutes);

  // Global Error Handler
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof AppError) {
      res.status(err.statusCode).json({
        success: false,
        error: { code: err.name, message: err.message, details: (err as any).details },
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
