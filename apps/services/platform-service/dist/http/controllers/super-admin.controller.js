import { ProvisioningService } from '../../application/services/provisioning.service';
import { SubscriptionService } from '../../application/services/subscription.service';
import { DomainService } from '../../application/services/domain.service';
import { ConfigRepository } from '../../infrastructure/repositories/config.repository';
const provService = new ProvisioningService();
const subService = new SubscriptionService();
const domainService = new DomainService();
const configRepo = new ConfigRepository();
export class SuperAdminController {
    // Provisioning & Tenants
    static async listProvisioningRequests(req, res, next) {
        try {
            const status = req.query.status;
            const skip = req.query.skip ? parseInt(req.query.skip, 10) : undefined;
            const take = req.query.take ? parseInt(req.query.take, 10) : undefined;
            const result = await provService.listRequests({ status, skip, take });
            res.json({ success: true, data: result });
        }
        catch (err) {
            next(err);
        }
    }
    static async provisionTenant(req, res, next) {
        try {
            const requestedByUserId = req.user?.id || req.auth?.userId;
            const result = await provService.provisionTenant({
                requestedByUserId,
                ...req.body,
            });
            res.status(201).json({ success: true, data: result });
        }
        catch (err) {
            next(err);
        }
    }
    static async getTenantDetails(req, res, next) {
        try {
            const tenantId = req.params.id;
            const subscription = await subService.getSubscriptionByTenantId(tenantId);
            const domains = await domainService.listDomains(tenantId);
            const branding = await domainService.getBranding(tenantId);
            res.json({
                success: true,
                data: {
                    tenantId,
                    subscription,
                    domains,
                    branding,
                },
            });
        }
        catch (err) {
            next(err);
        }
    }
    // Subscriptions
    static async listSubscriptions(req, res, next) {
        try {
            const status = req.query.status;
            const planId = req.query.planId;
            const skip = req.query.skip ? parseInt(req.query.skip, 10) : undefined;
            const take = req.query.take ? parseInt(req.query.take, 10) : undefined;
            const result = await subService.listSubscriptions({ status, planId, skip, take });
            res.json({ success: true, data: result });
        }
        catch (err) {
            next(err);
        }
    }
    static async updateTenantSubscription(req, res, next) {
        try {
            const tenantId = req.params.id;
            const updated = await subService.updateSubscription(tenantId, req.body);
            res.json({ success: true, data: updated });
        }
        catch (err) {
            next(err);
        }
    }
    // Settings
    static async getSettings(req, res, next) {
        try {
            const settings = await configRepo.getAll();
            const settingsMap = settings.reduce((acc, curr) => {
                acc[curr.key] = curr.value;
                return acc;
            }, {});
            res.json({ success: true, data: settingsMap });
        }
        catch (err) {
            next(err);
        }
    }
    static async updateSettings(req, res, next) {
        try {
            const settings = req.body;
            await configRepo.setMany(settings);
            res.json({ success: true, message: 'Settings updated successfully' });
        }
        catch (err) {
            next(err);
        }
    }
    // Domains
    static async listDomains(req, res, next) {
        try {
            const tenantId = req.params.id;
            const domains = await domainService.listDomains(tenantId);
            res.json({ success: true, data: domains });
        }
        catch (err) {
            next(err);
        }
    }
    static async addDomain(req, res, next) {
        try {
            const tenantId = req.params.id;
            const domain = await domainService.addDomain({
                tenantId,
                ...req.body,
            });
            res.status(201).json({ success: true, data: domain });
        }
        catch (err) {
            next(err);
        }
    }
    static async deleteDomain(req, res, next) {
        try {
            const domainId = req.params.domainId;
            const deleted = await domainService.deleteDomain(domainId);
            res.json({ success: true, data: deleted });
        }
        catch (err) {
            next(err);
        }
    }
    static async setCname(req, res, next) {
        try {
            const tenantId = req.params.id;
            const { hostname, domainType } = req.body;
            const domain = await domainService.addDomain({
                tenantId,
                hostname,
                domainType,
                isPrimary: true,
            });
            res.json({ success: true, data: domain });
        }
        catch (err) {
            next(err);
        }
    }
    // Branding
    static async getBranding(req, res, next) {
        try {
            const tenantId = req.params.id;
            const branding = await domainService.getBranding(tenantId);
            res.json({ success: true, data: branding });
        }
        catch (err) {
            next(err);
        }
    }
    static async updateBranding(req, res, next) {
        try {
            const tenantId = req.params.id;
            const updated = await domainService.updateBranding(tenantId, req.body);
            res.json({ success: true, data: updated });
        }
        catch (err) {
            next(err);
        }
    }
    // Feature Overrides
    static async getOverrides(req, res, next) {
        try {
            const tenantId = req.params.id;
            const overrides = await subService.getOverrides(tenantId);
            res.json({ success: true, data: overrides });
        }
        catch (err) {
            next(err);
        }
    }
    static async setOverride(req, res, next) {
        try {
            const tenantId = req.params.id;
            const override = await subService.setOverride(tenantId, req.body);
            res.json({ success: true, data: override });
        }
        catch (err) {
            next(err);
        }
    }
    static async deleteOverride(req, res, next) {
        try {
            const tenantId = req.params.id;
            const featureId = req.params.featureId;
            const deleted = await subService.removeOverride(tenantId, featureId);
            res.json({ success: true, data: deleted });
        }
        catch (err) {
            next(err);
        }
    }
}
