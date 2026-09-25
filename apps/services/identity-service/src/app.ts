import cors from 'cors';
import express, { type Application } from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { identityOpenApiSpec } from './docs/openapi';
import { authRoutes } from './http/routes/auth.routes';
import { healthRoutes } from './http/routes/health.routes';
import { internalRoutes } from './http/routes/internal.routes';
import { permissionRoutes } from './http/routes/permission.routes';
import { roleRoutes } from './http/routes/role.routes';
import { superAdminAuthRoutes } from './http/routes/super-admin-auth.routes';
import { tenantAuthRoutes } from './http/routes/tenant-auth.routes';
import { userRoutes } from './http/routes/user.routes';
import { correlationMiddleware } from './middleware/correlation.middleware';
import { errorHandler } from './middleware/error.middleware';

export function buildIdentityApp(): Application {
  const app = express();

  // Global Security & Parsers
  app.use(helmet());
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Correlation & Trace propagation
  app.use(correlationMiddleware);

  // Health, Readiness & Prometheus Metrics
  app.use('/', healthRoutes);

  // Swagger OpenAPI Documentation
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(identityOpenApiSpec));

  // Identity Service Public / Authenticated APIs
  app.use('/api/v1/super-admin/auth', superAdminAuthRoutes);
  app.use('/api/v1/auth/tenant', tenantAuthRoutes);
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/users', userRoutes);
  app.use('/api/v1/roles', roleRoutes);
  app.use('/api/v1/permissions', permissionRoutes);

  // Internal Service-to-Service APIs
  app.use('/internal/v1/auth', internalRoutes);
  app.use('/internal/v1', internalRoutes);

  // Centralized Error Handling
  app.use(errorHandler);

  return app;
}
