import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import { createApp } from '../../src/app';
import { prisma } from '../../src/infrastructure/prisma/client';
import { emailService } from '../../src/infrastructure/email/email.service';

describe('Tenant API & Organization Service', () => {
  it('should list tenants via GET /api/v1/tenants', async () => {
    const mockTenants = [
      {
        id: '11111111-1111-1111-1111-111111111111',
        code: 'SALON-BLSH-1001',
        slug: 'blush-bloom-salons',
        salonName: 'Blush & Bloom Salons',
        legalName: 'Blush & Bloom LLP',
        tradeName: 'Blush & Bloom Salons',
        displayName: 'Blush & Bloom',
        businessEmail: 'contact@blushbloom.in',
        businessPhone: '+91 98765 43210',
        gstin: null,
        pan: null,
        addressLine1: 'Indrapuri Main Road',
        addressLine2: null,
        city: 'Bhopal',
        state: 'Madhya Pradesh',
        postalCode: '462001',
        country: 'IN',
        currency: 'INR',
        timezone: 'Asia/Kolkata',
        status: 'ACTIVE',
        subscriptionReferenceId: null,
        createdAt: new Date('2026-01-15T00:00:00Z'),
        updatedAt: new Date('2026-01-15T00:00:00Z'),
        branches: [
          { id: 'b1', name: 'Indrapuri Branch' },
          { id: 'b2', name: 'Arera Colony Branch' },
        ],
      },
    ];

    vi.spyOn(prisma.organizationTenant, 'findMany').mockResolvedValue(mockTenants as any);

    const app = createApp();
    const res = await request(app).get('/api/v1/tenants');

    expect(res.status).toBe(200);
    const body = res.body;
    expect(body.success).toBe(true);
    expect(body.data).toHaveLength(1);
    expect(body.data[0].name).toBe('Blush & Bloom Salons');
    expect(body.data[0].branchesCount).toBe(2);
    expect(body.data[0].city).toBe('Bhopal');
  });

  it('should accept relaxed frontend payload in POST /api/v1/tenants and derive fields', async () => {
    const createdMock = {
      id: '22222222-2222-2222-2222-222222222222',
      code: 'SALON-NOVA-5544',
      slug: 'nova-luxury-salon',
      salonName: 'Nova Luxury Salon',
      legalName: 'Vikram Malhotra',
      tradeName: 'Nova Luxury Salon',
      displayName: 'Nova Luxury Salon',
      businessEmail: 'vikram@nova.in',
      businessPhone: '+91 98765 43210',
      gstin: null,
      pan: null,
      addressLine1: 'Bhopal Central Location',
      addressLine2: null,
      city: 'Bhopal',
      state: 'Central India',
      postalCode: '462001',
      country: 'IN',
      currency: 'INR',
      timezone: 'Asia/Kolkata',
      status: 'ACTIVE',
      subscriptionReferenceId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.spyOn(prisma.organizationTenant, 'create').mockResolvedValue(createdMock as any);
    vi.spyOn(prisma.branch, 'create').mockResolvedValue({
      id: 'br-1',
      name: 'Nova Luxury Salon',
    } as any);
    vi.spyOn(emailService, 'sendTenantCredentialsEmail').mockResolvedValue(true);

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({ success: true }),
      text: async () => JSON.stringify({ success: true }),
    } as any);

    const app = createApp();
    const res = await request(app)
      .post('/api/v1/tenants')
      .send({
        name: 'Nova Luxury Salon',
        city: 'Bhopal',
        region: 'Central India',
        ownerName: 'Vikram Malhotra',
        ownerEmail: 'vikram@nova.in',
        ownerPhone: '+91 98765 43210',
        selectedPlan: 'Enterprise Plan',
        branchesCount: 1,
      });

    expect(res.status).toBe(201);
    const body = res.body;
    expect(body.success).toBe(true);
    expect(body.data.name).toBe('Nova Luxury Salon');
    expect(body.data.ownerEmail).toBe('vikram@nova.in');
    expect(body.data.branchesCount).toBe(1);
    expect(body.data.branchesList).toEqual(['Nova Luxury Salon']);
    expect(body.data.initialPassword).toBeDefined();
    expect(body.data.initialPassword).toMatch(/^Salon@\d+!$/);
  });
});
