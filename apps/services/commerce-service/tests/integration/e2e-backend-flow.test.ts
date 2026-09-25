import jwt from 'jsonwebtoken';
import { describe, expect, it, vi } from 'vitest';
import { config } from '../../src/config';
import { catalogueService } from '../../src/application/services/catalogue.service';
import { billingService } from '../../src/application/services/billing.service';
import { serviceRepository } from '../../src/infrastructure/repositories/service.repository';
import { invoiceRepository } from '../../src/infrastructure/repositories/invoice.repository';
import { commerceEventPublisher } from '../../src/infrastructure/messaging/publisher';

describe('End-to-End Backend Lifecycle Flow', () => {
  const tenantId = '11111111-1111-1111-1111-111111111111';
  const branchId = '22222222-2222-2222-2222-222222222222';
  const customerId = '33333333-3333-3333-3333-333333333333';
  const serviceId = '44444444-4444-4444-4444-444444444444';
  const categoryId = '55555555-5555-5555-5555-555555555555';
  const appointmentId = '66666666-6666-6666-6666-666666666666';

  // 1. Tenant Direct Login Authority Token
  const tenantToken = jwt.sign(
    {
      tenantId,
      principalType: 'TENANT',
      scopeType: 'TENANT_OWNER',
    },
    config.JWT_SECRET,
  );

  it('should execute end-to-end salon commerce and billing flow', async () => {
    expect(tenantToken).toBeDefined();

    // 2. Create Service Category & Service
    vi.spyOn(serviceRepository, 'createCategory').mockResolvedValue({
      id: categoryId,
      tenantId,
      name: 'Hair Care',
      sortOrder: 1,
      isActive: true,
      createdAt: new Date().toISOString(),
    });

    const category = await catalogueService.createCategory(tenantId, { name: 'Hair Care' });
    expect(category.id).toBe(categoryId);

    // 3. Create Service Master
    vi.spyOn(serviceRepository, 'create').mockResolvedValue({
      id: serviceId,
      tenantId,
      categoryId,
      code: 'HAIR-01',
      name: 'Premium Haircut',
      durationMinutes: 45,
      bufferBeforeMinutes: 0,
      bufferAfterMinutes: 5,
      basePrice: 500,
      taxRate: 18,
      requiresConsultation: false,
      requiresPatchTest: false,
      isActive: true,
      isBookableOnline: true,
      createdAt: new Date().toISOString(),
    });

    const service = await catalogueService.createService(tenantId, {
      categoryId,
      code: 'HAIR-01',
      name: 'Premium Haircut',
      basePrice: 500,
      durationMinutes: 45,
    });
    expect(service.id).toBe(serviceId);

    // 4. Set Branch Specific Price
    const setBranchPriceSpy = vi.spyOn(serviceRepository, 'setBranchPrice').mockResolvedValue({
      id: 'price-1',
      tenantId,
      branchId,
      serviceId,
      price: 600,
      isActive: true,
    } as any);

    await catalogueService.setBranchPrice(tenantId, serviceId, { branchId, price: 600 });
    expect(setBranchPriceSpy).toHaveBeenCalled();

    // 5. Checkout & POS Invoice Creation
    const mockInvoice = {
      id: '77777777-7777-7777-7777-777777777777',
      tenantId,
      branchId,
      customerId,
      appointmentId,
      invoiceNumber: 'INV-123456-7890',
      subtotal: 600,
      discountTotal: 0,
      taxTotal: 108,
      grandTotal: 708,
      paidAmount: 0,
      balanceDue: 708,
      status: 'PENDING_PAYMENT',
      issuedAt: new Date().toISOString(),
      items: [
        {
          id: 'item-1',
          tenantId,
          invoiceId: '77777777-7777-7777-7777-777777777777',
          itemType: 'SERVICE',
          itemId: serviceId,
          unitPrice: 600,
          quantity: 1,
          discountAmount: 0,
          taxRate: 18,
          taxAmount: 108,
          lineTotal: 708,
          createdAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    vi.spyOn(invoiceRepository, 'create').mockResolvedValue(mockInvoice as any);
    const publishSpy = vi.spyOn(commerceEventPublisher, 'publish').mockResolvedValue();

    const { invoice } = await billingService.checkout(
      tenantId,
      {
        branchId,
        customerId,
        appointmentId,
        items: [
          {
            itemType: 'SERVICE',
            itemId: serviceId,
            unitPrice: 600,
            quantity: 1,
          },
        ],
      },
      { principalType: 'TENANT' } as any,
    );

    expect(invoice.id).toBe(mockInvoice.id);
    expect(invoice.grandTotal).toBe(708);
    expect(invoice.status).toBe('PENDING_PAYMENT');
    expect(publishSpy).toHaveBeenCalled();
  });
});
