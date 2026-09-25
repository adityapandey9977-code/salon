import { createLogger } from '@salon-spa-saas/logger';
import { config } from '../../config';
import { redisConnectionManager } from './redis-connection.manager';
const logger = createLogger('customer-read-store');
export class CustomerReadStore {
    static instance;
    static getInstance() {
        if (!CustomerReadStore.instance) {
            CustomerReadStore.instance = new CustomerReadStore();
        }
        return CustomerReadStore.instance;
    }
    // Key Builders
    getCustomerDetailKey(tenantId, customerId) {
        return `tenant:${tenantId}:customer:${customerId}`;
    }
    getCustomerMobileKey(tenantId, normalizedMobile) {
        return `tenant:${tenantId}:customer:mobile:${normalizedMobile}`;
    }
    getCustomerEmailKey(tenantId, normalizedEmail) {
        return `tenant:${tenantId}:customer:email:${normalizedEmail}`;
    }
    getCustomerPreferencesKey(tenantId, customerId) {
        return `tenant:${tenantId}:customer:${customerId}:preferences`;
    }
    async getCustomer(tenantId, customerId) {
        const client = redisConnectionManager.getClient();
        if (!client || !redisConnectionManager.isReady())
            return null;
        try {
            const data = await client.get(this.getCustomerDetailKey(tenantId, customerId));
            if (!data)
                return null;
            return JSON.parse(data);
        }
        catch (err) {
            logger.warn({ err }, 'Failed to read customer from Redis');
            return null;
        }
    }
    async setCustomer(tenantId, customer, ttlSeconds = config.CUSTOMER_CACHE_TTL) {
        const client = redisConnectionManager.getClient();
        if (!client || !redisConnectionManager.isReady())
            return;
        try {
            const key = this.getCustomerDetailKey(tenantId, customer.id);
            await client.setex(key, ttlSeconds, JSON.stringify(customer));
        }
        catch (err) {
            logger.warn({ err }, 'Failed to cache customer in Redis');
        }
    }
    async invalidateCustomer(tenantId, customerId) {
        const client = redisConnectionManager.getClient();
        if (!client || !redisConnectionManager.isReady())
            return;
        try {
            const keys = [
                this.getCustomerDetailKey(tenantId, customerId),
                this.getCustomerPreferencesKey(tenantId, customerId),
            ];
            await client.del(...keys);
        }
        catch (err) {
            logger.warn({ err }, 'Failed to invalidate customer cache');
        }
    }
}
export const customerReadStore = CustomerReadStore.getInstance();
