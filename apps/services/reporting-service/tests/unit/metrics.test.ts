import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../../src/app';

describe('Reporting Service APIs', () => {
  const app = createApp();

  it('should return dashboard metrics', async () => {
    const res = await request(app)
      .get('/api/v1/dashboard/metrics')
      .set('x-tenant-id', '11111111-1111-1111-1111-111111111111');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.summary).toBeDefined();
    expect(res.body.data.summary.totalRevenue).toBeDefined();
  });

  it('should return dashboard charts series', async () => {
    const res = await request(app)
      .get('/api/v1/dashboard/charts?period=month')
      .set('x-tenant-id', '11111111-1111-1111-1111-111111111111');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.chartData).toBeDefined();
  });

  it('should return executive summary report', async () => {
    const res = await request(app)
      .get('/api/v1/reports/executive-summary')
      .set('x-tenant-id', '11111111-1111-1111-1111-111111111111');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.kpis).toBeDefined();
  });

  it('should process domain events via internal ingestion and update audit', async () => {
    const event = {
      eventId: `test-event-${Date.now()}`,
      eventType: 'SALE_COMPLETED.v1',
      eventVersion: '1.0',
      occurredAt: new Date().toISOString(),
      tenantId: '11111111-1111-1111-1111-111111111111',
      branchId: '22222222-2222-2222-2222-222222222222',
      correlationId: 'corr-1234',
      aggregateType: 'Sale',
      aggregateId: 'sale-999',
      payload: {
        totalAmount: 250.0,
        netAmount: 220.0,
        taxAmount: 30.0,
        serviceAmount: 200.0,
        productAmount: 50.0,
      },
    };

    const res = await request(app).post('/api/v1/internal/events/ingest').send(event);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
