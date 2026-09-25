import cors from 'cors';
import express, { type Application } from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { gatewayOpenApiSpec } from './docs/openapi';
import { correlationMiddleware } from './middleware/correlation.middleware';
import { gatewayErrorHandler } from './middleware/error.middleware';
import { gatewayRoutes } from './routes';

export function buildGatewayApp(): Application {
  const app = express();

  // Security Headers & CORS
  app.use(
    helmet({
      contentSecurityPolicy: false,
      hsts:
        process.env.NODE_ENV === 'production'
          ? { maxAge: 31536000, includeSubDomains: true }
          : { maxAge: 0 },
    }),
  );
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // Correlation IDs
  app.use(correlationMiddleware);

  // Documentation
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(gatewayOpenApiSpec));

  // Ingress Routes & Proxies
  app.use('/', gatewayRoutes);

  // Centralized Error Handling
  app.use(gatewayErrorHandler);

  return app;
}
