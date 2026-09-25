import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { peopleOpenApiSpec } from './docs/openapi';
import { attendanceRoutes } from './http/routes/attendance.routes';
import { healthRoutes } from './http/routes/health.routes';
import { internalRoutes } from './http/routes/internal.routes';
import { leaveRoutes } from './http/routes/leave.routes';
import { rosterRoutes } from './http/routes/roster.routes';
import { shiftRoutes } from './http/routes/shift.routes';
import { staffRoutes } from './http/routes/staff.routes';
import { correlationMiddleware } from './middleware/correlation.middleware';
import { errorHandler } from './middleware/error.middleware';
export function buildPeopleApp() {
    const app = express();
    // Security & Parsers
    app.use(helmet());
    app.use(cors({ origin: true, credentials: true }));
    app.use(express.json({ limit: '1mb' }));
    app.use(express.urlencoded({ extended: true }));
    // Correlation & Request ID tracking
    app.use(correlationMiddleware);
    // Observability: Health, Readiness, Metrics
    app.use('/', healthRoutes);
    // Swagger Documentation
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(peopleOpenApiSpec));
    // People & Staff Domain Endpoints
    app.use('/api/v1/staff/shifts', shiftRoutes);
    app.use('/api/v1/staff/roster', rosterRoutes);
    app.use('/api/v1/staff/leave', leaveRoutes);
    app.use('/api/v1/staff', attendanceRoutes);
    app.use('/api/v1/staff', staffRoutes);
    // /api/v1/people alias routes
    app.use('/api/v1/people/shifts', shiftRoutes);
    app.use('/api/v1/people/roster', rosterRoutes);
    app.use('/api/v1/people/leave', leaveRoutes);
    app.use('/api/v1/people', attendanceRoutes);
    app.use('/api/v1/people', staffRoutes);
    // Direct branch-team alias route: /api/v1/branches/:branchId/staff
    app.use('/api/v1/branches/:branchId/staff', staffRoutes);
    // Internal Service-to-Service APIs
    app.use('/internal/v1', internalRoutes);
    // Centralized Error Handling
    app.use(errorHandler);
    return app;
}
