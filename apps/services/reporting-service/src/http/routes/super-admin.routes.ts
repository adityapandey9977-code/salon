import { Router } from 'express';
import { SuperAdminController } from '../controllers/super-admin.controller';

export const superAdminRouter: Router = Router();

superAdminRouter.get('/super-admin/dashboard/kpis', SuperAdminController.getKpis);
superAdminRouter.get('/super-admin/dashboard/mrr-telemetry', SuperAdminController.getMrrTelemetry);
superAdminRouter.get('/super-admin/dashboard/tenant-health', SuperAdminController.getTenantHealth);
superAdminRouter.get('/super-admin/dashboard/system-metrics', SuperAdminController.getSystemMetrics);
superAdminRouter.get('/super-admin/audit', SuperAdminController.getAudit);
superAdminRouter.post('/super-admin/audit/export', SuperAdminController.exportAudit);
superAdminRouter.post('/super-admin/audit/log', SuperAdminController.createAuditLog);
superAdminRouter.post('/super-admin/audit', SuperAdminController.createAuditLog);
