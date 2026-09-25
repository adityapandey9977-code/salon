import { Request, Response, NextFunction } from 'express';
import { NotificationService } from '../../application/services/notification.service';
import { TemplateService } from '../../application/services/template.service';

const notifService = new NotificationService();
const templateService = new TemplateService();

export class NotificationController {
  private static getTenantId(req: Request): string {
    const tenantId = (req as any).user?.tenantId || (req as any).auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) {
      throw new Error('Tenant ID required');
    }
    return tenantId;
  }

  static async listNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = NotificationController.getTenantId(req);
      const notifications = await notifService.listNotifications(tenantId, req.query);
      res.json({ success: true, data: notifications });
    } catch (err) {
      next(err);
    }
  }

  static async resolveNotification(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = NotificationController.getTenantId(req);
      const resolved = await notifService.resolveNotification(tenantId, req.params.id as string);
      res.json({ success: true, data: resolved });
    } catch (err) {
      next(err);
    }
  }

  static async listAllLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const logs = await notifService.listAllLogs(req.query);
      res.json({ success: true, data: logs });
    } catch (err) {
      next(err);
    }
  }

  static async simulateNotification(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await notifService.sendNotification(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
}
