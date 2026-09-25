import { ConflictError, NotFoundError } from '@salon-spa-saas/common-types';
import type {
  CreateCustomerRequest,
  QueryCustomersRequest,
  UpdateCustomerRequest,
} from '@salon-spa-saas/contracts';
import { DOMAIN_EVENTS } from '@salon-spa-saas/events';
import type { CachedCustomer, CustomerSummaryDto } from '../../domain/entities/customer.dto';
import { normalizeEmail, normalizePhoneNumber } from '../../domain/normalization/phone-email';
import { customerEventPublisher } from '../../infrastructure/messaging/publisher';
import { customerReadStore } from '../../infrastructure/redis/customer-read.store';
import { customerRepository } from '../../infrastructure/repositories/customer.repository';

export class CustomerService {
  private generateCustomerCode(): string {
    const random = Math.floor(1000 + Math.random() * 9000);
    return `CUST-${Date.now().toString().slice(-4)}${random}`;
  }

  public async getCustomerDetail(tenantId: string, customerId: string): Promise<CachedCustomer> {
    // 1. Redis Cache Read
    const cached = await customerReadStore.getCustomer(tenantId, customerId);
    if (cached) {
      return cached;
    }

    // 2. Database Read
    const customer = await customerRepository.findById(tenantId, customerId);
    if (!customer) {
      throw new NotFoundError('Customer not found');
    }

    // 3. Cache Population
    await customerReadStore.setCustomer(tenantId, customer);
    return customer;
  }

  public async lookupByMobile(tenantId: string, mobile: string): Promise<CachedCustomer | null> {
    const normalized = normalizePhoneNumber(mobile);
    if (!normalized) return null;
    return customerRepository.findByNormalizedMobile(tenantId, normalized);
  }

  public async listCustomers(
    tenantId: string,
    query: QueryCustomersRequest,
  ): Promise<{ items: CustomerSummaryDto[]; total: number; page: number; limit: number }> {
    const normalizedMobile = query.mobilePhone ? normalizePhoneNumber(query.mobilePhone) : undefined;
    const normalizedEmail = query.email ? normalizeEmail(query.email) || undefined : undefined;
    const hasFranchise =
      query.hasFranchise === true ||
      query.hasFranchise === ('true' as any) ||
      (query.franchiseId ? true : undefined);

    return customerRepository.list(tenantId, {
      search: query.search,
      mobilePhone: normalizedMobile,
      email: normalizedEmail,
      status: query.status,
      branchId: query.branchId,
      franchiseId: query.franchiseId,
      hasFranchise: hasFranchise !== undefined ? hasFranchise : undefined,
      source: query.source,
      page: query.page,
      limit: query.limit,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    });
  }

  public async createCustomer(
    tenantId: string,
    input: CreateCustomerRequest,
    userId: string | null = null,
    correlationId?: string,
  ): Promise<CachedCustomer> {
    const normalizedMobile = normalizePhoneNumber(input.mobilePhone);
    const normalizedEmail = normalizeEmail(input.email);

    // Duplicate check on mobile
    const existing = await customerRepository.findByNormalizedMobile(tenantId, normalizedMobile);
    if (existing) {
      throw new ConflictError('A customer with this mobile phone number already exists');
    }

    const displayName = input.displayName || `${input.firstName} ${input.lastName || ''}`.trim();
    const customerCode = this.generateCustomerCode();

    const created = await customerRepository.create({
      tenantId,
      customerCode,
      firstName: input.firstName,
      lastName: input.lastName,
      displayName,
      mobilePhone: input.mobilePhone,
      normalizedMobile,
      email: input.email,
      normalizedEmail,
      alternatePhone: input.alternatePhone,
      gender: input.gender,
      dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : null,
      status: input.status,
      preferredBranchId: input.preferredBranchId,
      franchiseId: input.franchiseId,
      source: input.source,
      notes: input.notes,
      avatarUrl: input.avatarUrl || null,
      segment: (input as any).segment || 'New Client',
      address:
        input.address?.addressLine1 && input.address?.city
          ? {
              type: input.address.type || 'HOME',
              addressLine1: input.address.addressLine1,
              addressLine2: input.address.addressLine2 || null,
              city: input.address.city,
              state: input.address.state || '',
              postalCode: input.address.postalCode || '',
              country: input.address.country || 'IN',
              isDefault: input.address.isDefault ?? true,
            }
          : undefined,
      preferences: input.preferences as any,
      cautions: input.cautions as any,
    });

    // Populate Redis
    await customerReadStore.setCustomer(tenantId, created);

    // Publish Event
    await customerEventPublisher.publish({
      eventType: DOMAIN_EVENTS.CUSTOMER_CREATED,
      aggregateType: 'Customer',
      aggregateId: created.id,
      tenantId,
      userId,
      correlationId,
      payload: {
        tenantId,
        clientId: created.id,
        firstName: created.firstName,
        lastName: created.lastName || '',
        phone: created.mobilePhone,
        email: created.email || undefined,
        branchId: created.preferredBranchId || undefined,
        franchiseId: created.franchiseId || undefined,
      },
    });

    return created;
  }

  public async updateCustomer(
    tenantId: string,
    customerId: string,
    input: UpdateCustomerRequest,
    userId: string | null = null,
    correlationId?: string,
  ): Promise<CachedCustomer> {
    const updateData: any = {};
    if (input.firstName !== undefined) updateData.firstName = input.firstName;
    if (input.lastName !== undefined) updateData.lastName = input.lastName;
    if (input.displayName !== undefined) updateData.displayName = input.displayName;
    if (input.email !== undefined) {
      updateData.email = input.email;
      updateData.normalizedEmail = normalizeEmail(input.email);
    }
    if (input.mobilePhone !== undefined) {
      updateData.mobilePhone = input.mobilePhone;
      updateData.normalizedMobile = normalizePhoneNumber(input.mobilePhone);
    }
    if (input.alternatePhone !== undefined) updateData.alternatePhone = input.alternatePhone;
    if (input.gender !== undefined) updateData.gender = input.gender;
    if (input.dateOfBirth !== undefined) {
      updateData.dateOfBirth = input.dateOfBirth ? new Date(input.dateOfBirth) : null;
    }
    if (input.status !== undefined) updateData.status = input.status;
    if (input.preferredBranchId !== undefined) updateData.preferredBranchId = input.preferredBranchId;
    if (input.franchiseId !== undefined) updateData.franchiseId = input.franchiseId;
    if (input.source !== undefined) updateData.source = input.source;
    if (input.notes !== undefined) updateData.notes = input.notes;
    if (input.avatarUrl !== undefined) updateData.avatarUrl = input.avatarUrl;
    if (input.segment !== undefined) updateData.segment = input.segment;

    if (input.address) {
      await customerRepository.upsertAddress(tenantId, customerId, input.address);
    }

    const updated = await customerRepository.update(tenantId, customerId, updateData);

    // Invalidate Redis
    await customerReadStore.invalidateCustomer(tenantId, customerId);
    await customerReadStore.setCustomer(tenantId, updated);

    // Publish Event
    await customerEventPublisher.publish({
      eventType: DOMAIN_EVENTS.CUSTOMER_UPDATED,
      aggregateType: 'Customer',
      aggregateId: customerId,
      tenantId,
      userId,
      correlationId,
      payload: {
        tenantId,
        customerId,
        updatedFields: Object.keys(updateData),
        updatedAt: updated.updatedAt,
      },
    });

    return updated;
  }

  public async softDeleteCustomer(
    tenantId: string,
    customerId: string,
    userId: string | null = null,
    reason?: string,
    correlationId?: string,
  ): Promise<void> {
    await customerRepository.softDelete(tenantId, customerId, userId, reason);

    // Invalidate Redis
    await customerReadStore.invalidateCustomer(tenantId, customerId);

    // Publish Event
    await customerEventPublisher.publish({
      eventType: DOMAIN_EVENTS.CUSTOMER_DELETED,
      aggregateType: 'Customer',
      aggregateId: customerId,
      tenantId,
      userId,
      correlationId,
      payload: {
        tenantId,
        customerId,
        deletedAt: new Date().toISOString(),
        reason,
      },
    });
  }

  public async recordVisit(
    tenantId: string,
    customerId: string,
    amount: number,
    visitDate?: string | Date,
  ): Promise<CachedCustomer> {
    const parsedDate = visitDate ? new Date(visitDate) : new Date();
    const updated = await customerRepository.recordVisit(tenantId, customerId, amount, parsedDate);

    // Invalidate Redis
    await customerReadStore.invalidateCustomer(tenantId, customerId);
    await customerReadStore.setCustomer(tenantId, updated);

    // Publish Event
    await customerEventPublisher.publish({
      eventType: DOMAIN_EVENTS.CUSTOMER_UPDATED,
      aggregateType: 'Customer',
      aggregateId: customerId,
      tenantId,
      payload: {
        tenantId,
        customerId,
        action: 'VISIT_RECORDED',
        totalVisits: updated.totalVisits,
        totalSpent: updated.totalSpent,
        lastVisitAt: updated.lastVisitAt,
        updatedAt: updated.updatedAt,
      },
    });

    return updated;
  }

  public async getDormantCustomers(tenantId: string): Promise<CustomerSummaryDto[]> {
    return customerRepository.findDormant(tenantId);
  }
}

export const customerService = new CustomerService();
