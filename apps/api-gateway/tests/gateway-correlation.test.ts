import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { buildGatewayApp } from '../src/app';

describe('API Gateway Correlation and Tracing', () => {
  const app = buildGatewayApp();

  it('should generate x-correlation-id if not provided', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.headers['x-correlation-id']).toBeDefined();
    expect(res.headers['x-request-id']).toBeDefined();
  });

  it('should propagate incoming x-correlation-id', async () => {
    const customCorrelationId = 'custom-trace-uuid-12345';
    const res = await request(app).get('/health').set('x-correlation-id', customCorrelationId);

    expect(res.status).toBe(200);
    expect(res.headers['x-correlation-id']).toBe(customCorrelationId);
  });
});
