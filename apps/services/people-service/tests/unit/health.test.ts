import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { buildPeopleApp } from '../../src/app';

describe('People Service Health', () => {
  const app = buildPeopleApp();

  it('should return 200 on /health', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('OK');
    expect(res.body.service).toBe('people-service');
  });

  it('should return health status on /ready', async () => {
    const res = await request(app).get('/ready');
    expect([200, 503]).toContain(res.status);
    expect(res.body.service).toBe('people-service');
  });
});
