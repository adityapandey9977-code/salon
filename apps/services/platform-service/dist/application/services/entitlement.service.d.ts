import { SubscriptionRepository } from '../../infrastructure/repositories/subscription.repository';
import { PlanRepository } from '../../infrastructure/repositories/plan.repository';
import { PlatformReadStore } from '../../infrastructure/redis/platform-read.store';
import { EffectiveEntitlementsDto } from '../../domain/entities/platform.dto';
export declare class EntitlementService {
    private subscriptionRepo;
    private planRepo;
    private cache;
    constructor(subscriptionRepo?: SubscriptionRepository, planRepo?: PlanRepository, cache?: PlatformReadStore);
    getEffectiveEntitlements(tenantId: string): Promise<EffectiveEntitlementsDto>;
    invalidateEntitlements(tenantId: string): Promise<void>;
}
//# sourceMappingURL=entitlement.service.d.ts.map