import { Request, Response, NextFunction } from 'express';
import { EntitlementService } from '../../application/services/entitlement.service';
import { DomainService } from '../../application/services/domain.service';
import { SubscriptionService } from '../../application/services/subscription.service';

const entitlementService = new EntitlementService();
const domainService = new DomainService();
const subscriptionService = new SubscriptionService();

export class InternalController {
  static async getEffectiveEntitlements(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = req.params.tenantId as string;
      const entitlements = await entitlementService.getEffectiveEntitlements(tenantId);
      res.json({ success: true, data: entitlements });
    } catch (err) {
      next(err);
    }
  }

  static async resolveDomain(req: Request, res: Response, next: NextFunction) {
    try {
      const hostname = req.params.hostname as string;
      const resolution = await domainService.resolveDomain(hostname);
      res.json({ success: true, data: resolution });
    } catch (err) {
      next(err);
    }
  }

  static async getSubscription(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = req.params.tenantId as string;
      const subscription = await subscriptionService.getSubscriptionByTenantId(tenantId);
      res.json({ success: true, data: subscription });
    } catch (err) {
      next(err);
    }
  }
}
