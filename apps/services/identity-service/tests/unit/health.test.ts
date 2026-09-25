import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { buildIdentityApp } from '../../src/app';

describe('Identity Service Health', () => {
  it('should return 200 on /health', async () => {
    const app = buildIdentityApp();
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('UP');
    expect(res.body.service).toBe('identity-service');
  });
});
