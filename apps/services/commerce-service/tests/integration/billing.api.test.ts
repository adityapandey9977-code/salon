import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createApp } from '../../src/app';
import { billingService } from '../../src/application/services/billing.service';

vi.mock('../../src/application/services/billing.service', () => ({
  billingService: {
    calculateTax: vi.fn(),
    checkout: vi.fn(),
    listInvoices: vi.fn(),
    getInvoiceById: vi.fn(),
    requestRefund: vi.fn(),
  },
}));

describe('Billing & POS API Endpoints', () => {
  const app = createApp();
  const tenantId = '11111111-1111-1111-1111-111111111111';
  const branchId = '33333333-3333-3333-3333-333333333333';
  const invoiceId = '44444444-4444-4444-4444-444444444444';
  const serviceId = '22222222-2222-2222-2222-222222222222';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('POST /api/v1/billing/checkout should generate an invoice', async () => {
    vi.mocked(billingService.checkout).mockResolvedValueOnce({
      invoice: {
        id: invoiceId,
        tenantId,
        branchId,
        customerId: null,
        appointmentId: null,
        invoiceNumber: 'INV-1001',
        subtotal: 1000,
        discountTotal: 0,
        taxTotal: 180,
        grandTotal: 1180,
        paidAmount: 1180,
        balanceDue: 0,
        status: 'PAID',
        issuedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        items: [],
      },
    });

    const res = await request(app)
      .post('/api/v1/billing/checkout')
      .set('x-tenant-id', tenantId)
      .set('x-principal-type', 'TENANT')
      .send({
        branchId,
        paymentMethod: 'CASH',
        items: [
          {
            itemType: 'SERVICE',
            itemId: serviceId,
            quantity: 1,
            unitPrice: 1000,
          },
        ],
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.invoiceNumber).toBe('INV-1001');
    expect(res.body.data.grandTotal).toBe(1180);
  });
});
