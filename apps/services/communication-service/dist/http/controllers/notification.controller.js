import { NotificationService } from '../../application/services/notification.service';
import { TemplateService } from '../../application/services/template.service';
const notifService = new NotificationService();
const templateService = new TemplateService();
export class NotificationController {
    static getTenantId(req) {
        const tenantId = req.user?.tenantId || req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId) {
            throw new Error('Tenant ID required');
        }
        return tenantId;
    }
    static async listNotifications(req, res, next) {
        try {
            const tenantId = NotificationController.getTenantId(req);
            const notifications = await notifService.listNotifications(tenantId, req.query);
            res.json({ success: true, data: notifications });
        }
        catch (err) {
            next(err);
        }
    }
    static async resolveNotification(req, res, next) {
        try {
            const tenantId = NotificationController.getTenantId(req);
            const resolved = await notifService.resolveNotification(tenantId, req.params.id);
            res.json({ success: true, data: resolved });
        }
        catch (err) {
            next(err);
        }
    }
    static async listAllLogs(req, res, next) {
        try {
            const logs = await notifService.listAllLogs(req.query);
            res.json({ success: true, data: logs });
        }
        catch (err) {
            next(err);
        }
    }
    static async simulateNotification(req, res, next) {
        try {
            const result = await notifService.sendNotification(req.body);
            res.status(201).json({ success: true, data: result });
        }
        catch (err) {
            next(err);
        }
    }
}
