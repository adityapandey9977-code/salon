import jwt from 'jsonwebtoken';
import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import { createApp } from '../../src/app';
import { config } from '../../src/config';
import { paymentRepository } from '../../src/infrastructure/repositories/payment.repository';
import { webhookRepository } from '../../src/infrastructure/repositories/webhook.repository';

describe('Payment Service Integration Tests', () => {
  const app = createApp();
  const tenantId = '00000000-0000-0000-0000-000000000001';
  const token = jwt.sign(
    {
      sub: '00000000-0000-0000-0000-000000000099',
      tenantId,
      principalType: 'USER',
      permissions: [
        'payment.read',
        'payment.create',
        'payment.refund',
        'payment.reconcile',
      ],
    },
    config.JWT_SECRET,
  );

  const mockIntent = {
    id: '00000000-0000-0000-0000-000000000010',
    tenantId,
    purpose: 'INVOICE_PAYMENT',
    amount: 1500,
    currency: 'INR',
    status: 'CREATED',
    provider: 'MOCK',
    providerIntentId: 'mock_intent_123',
    idempotencyKey: 'idem-test-001',
    transactions: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  it('should create a payment intent successfully with idempotency', async () => {
    vi.spyOn(paymentRepository, 'findIntentByIdempotencyKey').mockResolvedValue(null);
    vi.spyOn(paymentRepository, 'createIntent').mockResolvedValue(mockIntent as any);

    const res = await request(app)
      .post('/api/v1/payments/intents')
      .set('Authorization', `Bearer ${token}`)
      .send({
        purpose: 'INVOICE_PAYMENT',
        amount: 1500,
        currency: 'INR',
        idempotencyKey: 'idem-test-001',
        provider: 'MOCK',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(mockIntent.id);
    expect(res.body.data.amount).toBe(1500);
  });

  it('should verify payment token and capture transaction', async () => {
    vi.spyOn(paymentRepository, 'findIntentById').mockResolvedValue(mockIntent as any);
    vi.spyOn(paymentRepository, 'recordTransaction').mockResolvedValue({
      id: '00000000-0000-0000-0000-000000000020',
      tenantId,
      paymentIntentId: mockIntent.id,
      method: 'CARD',
      amount: 1500,
      currency: 'INR',
      status: 'CAPTURED',
      provider: 'MOCK',
      paidAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    } as any);

    const res = await request(app)
      .post('/api/v1/payments/verify-token')
      .set('Authorization', `Bearer ${token}`)
      .send({
        paymentIntentId: mockIntent.id,
        method: 'CARD',
        amount: 1500,
        currency: 'INR',
        provider: 'MOCK',
        providerTransactionId: 'txn_mock_123',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('CAPTURED');
  });

  it('should process webhook correctly', async () => {
    vi.spyOn(webhookRepository, 'logEvent').mockResolvedValue({ isDuplicate: false });

    const res = await request(app)
      .post('/api/v1/webhooks/payments/mock')
      .set('x-mock-signature', 'valid_sig')
      .send({
        event: 'payment.captured',
        event_id: 'evt_12345',
        amount: 1500,
        transaction_id: 'txn_999',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
