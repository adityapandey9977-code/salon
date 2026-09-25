import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { openApiSpec } from './docs/openapi';
import { apiRoutes } from './http/routes';
import { correlationMiddleware } from './middleware/correlation.middleware';
import { errorHandler } from './middleware/error-handler.middleware';
export function createApp() {
    const app = express();
    app.use(helmet({ contentSecurityPolicy: false }));
    app.use(cors({ origin: true, credentials: true }));
    app.use(express.json());
    app.use(correlationMiddleware);
    // OpenAPI Swagger Docs
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));
    app.get('/openapi.json', (_req, res) => {
        res.json(openApiSpec);
    });
    // API Routes
    app.use('/', apiRoutes);
    // Centralized Error Handler
    app.use(errorHandler);
    return app;
}
