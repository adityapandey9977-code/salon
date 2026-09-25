import { Router } from 'express';
import { AuditController } from '../controllers/audit.controller';
export const auditRouter = Router();
auditRouter.get('/audit', AuditController.getAuditLogs);
auditRouter.post('/audit/export', AuditController.exportAuditLogs);
auditRouter.post('/audit/log', AuditController.createAuditLog);
auditRouter.post('/audit', AuditController.createAuditLog);
