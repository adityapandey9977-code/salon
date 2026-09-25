import { Request, Response, NextFunction } from 'express';
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
  static async listProvisioningRequests(req: Request, res: Response, next: NextFunction) {
    try {
      const status = req.query.status as any;
      const skip = req.query.skip ? parseInt(req.query.skip as string, 10) : undefined;
      const take = req.query.take ? parseInt(req.query.take as string, 10) : undefined;
      const result = await provService.listRequests({ status, skip, take });
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async provisionTenant(req: Request, res: Response, next: NextFunction) {
    try {
      const requestedByUserId = (req as any).user?.id || (req as any).auth?.userId;
      const result = await provService.provisionTenant({
        requestedByUserId,
        ...req.body,
      });
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getTenantDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = req.params.id as string;
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
    } catch (err) {
      next(err);
    }
  }

  // Subscriptions
  static async listSubscriptions(req: Request, res: Response, next: NextFunction) {
    try {
      const status = req.query.status as any;
      const planId = req.query.planId as string | undefined;
      const skip = req.query.skip ? parseInt(req.query.skip as string, 10) : undefined;
      const take = req.query.take ? parseInt(req.query.take as string, 10) : undefined;
      const result = await subService.listSubscriptions({ status, planId, skip, take });
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async updateTenantSubscription(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = req.params.id as string;
      const updated = await subService.updateSubscription(tenantId, req.body);
      res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }

  // Settings
  static async getSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const settings = await configRepo.getAll();
      const settingsMap = settings.reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
      }, {} as Record<string, string>);
      res.json({ success: true, data: settingsMap });
    } catch (err) {
      next(err);
    }
  }

  static async updateSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const settings = req.body;
      await configRepo.setMany(settings);
      res.json({ success: true, message: 'Settings updated successfully' });
    } catch (err) {
      next(err);
    }
  }

  // Domains
  static async listDomains(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = req.params.id as string;
      const domains = await domainService.listDomains(tenantId);
      res.json({ success: true, data: domains });
    } catch (err) {
      next(err);
    }
  }

  static async addDomain(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = req.params.id as string;
      const domain = await domainService.addDomain({
        tenantId,
        ...req.body,
      });
      res.status(201).json({ success: true, data: domain });
    } catch (err) {
      next(err);
    }
  }

  static async deleteDomain(req: Request, res: Response, next: NextFunction) {
    try {
      const domainId = req.params.domainId as string;
      const deleted = await domainService.deleteDomain(domainId);
      res.json({ success: true, data: deleted });
    } catch (err) {
      next(err);
    }
  }

  static async setCname(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = req.params.id as string;
      const { hostname, domainType } = req.body;
      const domain = await domainService.addDomain({
        tenantId,
        hostname,
        domainType,
        isPrimary: true,
      });
      res.json({ success: true, data: domain });
    } catch (err) {
      next(err);
    }
  }

  // Branding
  static async getBranding(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = req.params.id as string;
      const branding = await domainService.getBranding(tenantId);
      res.json({ success: true, data: branding });
    } catch (err) {
      next(err);
    }
  }

  static async updateBranding(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = req.params.id as string;
      const updated = await domainService.updateBranding(tenantId, req.body);
      res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }

  // Feature Overrides
  static async getOverrides(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = req.params.id as string;
      const overrides = await subService.getOverrides(tenantId);
      res.json({ success: true, data: overrides });
    } catch (err) {
      next(err);
    }
  }

  static async setOverride(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = req.params.id as string;
      const override = await subService.setOverride(tenantId, req.body);
      res.json({ success: true, data: override });
    } catch (err) {
      next(err);
    }
  }

  static async deleteOverride(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = req.params.id as string;
      const featureId = req.params.featureId as string;
      const deleted = await subService.removeOverride(tenantId, featureId);
      res.json({ success: true, data: deleted });
    } catch (err) {
      next(err);
    }
  }
}
