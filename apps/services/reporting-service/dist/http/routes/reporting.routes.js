import { Router } from 'express';
import { dashboardRouter } from './dashboard.routes';
import { reportRouter } from './report.routes';
import { auditRouter } from './audit.routes';
import { superAdminRouter } from './super-admin.routes';
import { internalRouter } from './internal.routes';
import { DashboardController } from '../controllers/dashboard.controller';
import { AuditController } from '../controllers/audit.controller';
export const reportingRouter = Router();
// Legacy alias compatibility
reportingRouter.get('/dashboard/stats', DashboardController.getMetrics);
reportingRouter.get('/audit/logs', AuditController.getAuditLogs);
// Feature routers
reportingRouter.use(dashboardRouter);
reportingRouter.use(reportRouter);
reportingRouter.use(auditRouter);
reportingRouter.use(superAdminRouter);
reportingRouter.use('/internal', internalRouter);
