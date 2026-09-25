import { EntitlementService } from '../../application/services/entitlement.service';
import { DomainService } from '../../application/services/domain.service';
import { SubscriptionService } from '../../application/services/subscription.service';
const entitlementService = new EntitlementService();
const domainService = new DomainService();
const subscriptionService = new SubscriptionService();
export class InternalController {
    static async getEffectiveEntitlements(req, res, next) {
        try {
            const tenantId = req.params.tenantId;
            const entitlements = await entitlementService.getEffectiveEntitlements(tenantId);
            res.json({ success: true, data: entitlements });
        }
        catch (err) {
            next(err);
        }
    }
    static async resolveDomain(req, res, next) {
        try {
            const hostname = req.params.hostname;
            const resolution = await domainService.resolveDomain(hostname);
            res.json({ success: true, data: resolution });
        }
        catch (err) {
            next(err);
        }
    }
    static async getSubscription(req, res, next) {
        try {
            const tenantId = req.params.tenantId;
            const subscription = await subscriptionService.getSubscriptionByTenantId(tenantId);
            res.json({ success: true, data: subscription });
        }
        catch (err) {
            next(err);
        }
    }
}
