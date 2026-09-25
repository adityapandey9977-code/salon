import { ProvisioningRepository } from '../../infrastructure/repositories/provisioning.repository';
import { PlanRepository } from '../../infrastructure/repositories/plan.repository';
import { SubscriptionRepository } from '../../infrastructure/repositories/subscription.repository';
import { DomainRepository } from '../../infrastructure/repositories/domain.repository';
import { PlatformReadStore } from '../../infrastructure/redis/platform-read.store';
import { eventBus } from '../../infrastructure/messaging/publisher';
import { config } from '../../config';
import { NotFoundError, BadRequestError } from '@salon-spa-saas/common-types';
import { createEventEnvelope } from '@salon-spa-saas/events';
import { ProvisioningStatus, SubscriptionStatus, DomainType } from '../../infrastructure/prisma/generated-client';

export class ProvisioningService {
  constructor(
    private provRepo: ProvisioningRepository = new ProvisioningRepository(),
    private planRepo: PlanRepository = new PlanRepository(),
    private subRepo: SubscriptionRepository = new SubscriptionRepository(),
    private domainRepo: DomainRepository = new DomainRepository(),
    private cache: PlatformReadStore = new PlatformReadStore()
  ) {}

  async listRequests(filter?: { status?: ProvisioningStatus; skip?: number; take?: number }) {
    return this.provRepo.list(filter);
  }

  async getRequestById(id: string) {
    const req = await this.provRepo.findById(id);
    if (!req) throw new NotFoundError(`Provisioning request ${id} not found`);
    return req;
  }

  async provisionTenant(data: {
    requestedByUserId?: string;
    planId: string;
    salonName: string;
    loginEmail: string;
    loginPassword?: string;
    subdomain?: string;
    ownerPhone?: string;
  }) {
    // 1. Validate SaaS Plan
    const plan = await this.planRepo.findPlanById(data.planId);
    if (!plan || !plan.isActive) {
      throw new BadRequestError(`Invalid or inactive subscription plan: ${data.planId}`);
    }

    // 2. Create Provisioning Request in Platform DB
    const provReq = await this.provRepo.create({
      requestedByUserId: data.requestedByUserId,
      planId: data.planId,
      salonName: data.salonName,
      loginEmail: data.loginEmail,
      subdomain: data.subdomain,
      ownerPhone: data.ownerPhone,
    });

    const startEvent = createEventEnvelope({
      eventType: 'TENANT_PROVISIONING_STARTED.v1',
      aggregateType: 'TenantProvisioningRequest',
      aggregateId: provReq.id,
      payload: {
        provisioningRequestId: provReq.id,
        salonName: data.salonName,
        loginEmail: data.loginEmail,
        planId: data.planId,
      },
    });
    await eventBus.publish(startEvent);

    let organizationTenantId: string | null = null;
    const defaultPassword = data.loginPassword || 'Salon@2026';

    try {
      // 3. Call Organization Service to create Tenant
      await this.provRepo.updateStatus(provReq.id, {
        status: ProvisioningStatus.CREATING_ORGANIZATION,
      });

      const orgRes = await fetch(
        `${config.ORGANIZATION_SERVICE_URL}/api/v1/tenants`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-internal-token': config.SERVICE_INTERNAL_SECRET,
          },
          body: JSON.stringify({
            salonName: data.salonName,
            slug: data.subdomain || data.salonName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            businessEmail: data.loginEmail,
            businessPhone: data.ownerPhone || '9876543210',
            autoCreateBranch: true,
            initialBranchName: 'Main Branch',
          }),
        }
      );

      if (!orgRes.ok) {
        const errorText = await orgRes.text();
        throw new Error(`Organization service error: ${errorText}`);
      }

      const orgResData: any = await orgRes.json();
      const orgData = orgResData?.data || orgResData;
      organizationTenantId = orgData.id || orgData.tenantId;

      if (!organizationTenantId) {
        throw new Error('Organization service did not return valid tenant ID');
      }

      // 4. Call Identity Service to create TenantCredential
      await this.provRepo.updateStatus(provReq.id, {
        status: ProvisioningStatus.CREATING_CREDENTIAL,
        organizationTenantId,
      });

      const identRes = await fetch(
        `${config.IDENTITY_SERVICE_URL}/internal/v1/tenant-credentials`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-internal-token': config.SERVICE_INTERNAL_SECRET,
          },
          body: JSON.stringify({
            tenantId: organizationTenantId,
            email: data.loginEmail,
            password: defaultPassword,
          }),
        }
      );

      if (!identRes.ok) {
        const errText = await identRes.text();
        throw new Error(`Identity service error: ${errText}`);
      }

      // 5. Create Tenant Subscription in Platform DB
      await this.provRepo.updateStatus(provReq.id, {
        status: ProvisioningStatus.CREATING_SUBSCRIPTION,
      });

      const now = new Date();
      const trialEndsAt = new Date(now.getTime() + plan.trialDays * 24 * 60 * 60 * 1000);
      const currentPeriodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      const subscription = await this.subRepo.create({
        tenantId: organizationTenantId,
        planId: plan.id,
        status: SubscriptionStatus.TRIALING,
        startsAt: now,
        trialEndsAt,
        currentPeriodStart: now,
        currentPeriodEnd,
      });

      // 6. Optional domain configuration
      await this.provRepo.updateStatus(provReq.id, {
        status: ProvisioningStatus.CONFIGURING_ENTITLEMENTS,
      });

      if (data.subdomain) {
        const hostname = `${data.subdomain.toLowerCase().trim()}.digiflexsalon.com`;
        try {
          await this.domainRepo.createDomain({
            tenantId: organizationTenantId,
            hostname,
            domainType: DomainType.ADMIN,
            isPrimary: true,
          });
        } catch (domErr: any) {
          console.warn('[Provisioning] Subdomain creation warning:', domErr?.message);
        }
      }

      // Initialize default branding
      await this.domainRepo.upsertBranding({
        tenantId: organizationTenantId,
        brandName: data.salonName,
      });

      // 7. Mark Provisioning as COMPLETED
      const completed = await this.provRepo.updateStatus(provReq.id, {
        status: ProvisioningStatus.COMPLETED,
        completedAt: new Date(),
      });

      // Invalidate caches
      await this.cache.invalidateEntitlements(organizationTenantId);

      // 8. Publish TENANT_PROVISIONED.v1 event
      const provEvent = createEventEnvelope({
        eventType: 'TENANT_PROVISIONED.v1',
        aggregateType: 'Tenant',
        aggregateId: organizationTenantId,
        tenantId: organizationTenantId,
        payload: {
          provisioningRequestId: provReq.id,
          tenantId: organizationTenantId,
          salonName: data.salonName,
          loginEmail: data.loginEmail,
          planId: plan.id,
          planCode: plan.code,
          trialEndsAt,
          subscriptionId: subscription.id,
        },
      });
      await eventBus.publish(provEvent);

      return {
        provisioningRequestId: provReq.id,
        tenantId: organizationTenantId,
        salonName: data.salonName,
        loginEmail: data.loginEmail,
        status: ProvisioningStatus.COMPLETED,
        subscription,
      };
    } catch (err: any) {
      const failureStep = (await this.provRepo.findById(provReq.id))?.status || 'UNKNOWN';
      const failureReason = err.response?.data?.message || err.message || 'Unknown provisioning error';

      await this.provRepo.updateStatus(provReq.id, {
        status: ProvisioningStatus.FAILED,
        failureStep: String(failureStep),
        failureReason,
      });

      const failEvent = createEventEnvelope({
        eventType: 'TENANT_PROVISIONING_FAILED.v1',
        aggregateType: 'TenantProvisioningRequest',
        aggregateId: provReq.id,
        payload: {
          provisioningRequestId: provReq.id,
          salonName: data.salonName,
          loginEmail: data.loginEmail,
          failureStep,
          failureReason,
        },
      });
      await eventBus.publish(failEvent);

      throw new BadRequestError(`Tenant provisioning failed at step ${failureStep}: ${failureReason}`);
    }
  }
}
