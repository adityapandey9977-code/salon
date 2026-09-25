import { AuthenticationError } from '@salon-spa-saas/common-types';
import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import { buildIdentityApp } from '../../src/app';
import { authService } from '../../src/application/services/auth.service';

describe('Identity Service HTTP Endpoints Integration', () => {
  const app = buildIdentityApp();

  it('GET /health should return 200 UP', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('UP');
    expect(res.body.service).toBe('identity-service');
  });

  it('POST /api/v1/auth/login with invalid payload returns 400 validation error', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'not-an-email', password: '123' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('POST /api/v1/auth/login with non-existent user returns 401 error', async () => {
    vi.spyOn(authService, 'login').mockRejectedValueOnce(
      new AuthenticationError('Invalid email or password'),
    );

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'nonexistent@digiflex.com', password: 'Password123!' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('AUTHENTICATION_ERROR');
  });

  it('GET /api/v1/auth/me without token returns 401', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('AUTHENTICATION_ERROR');
  });
});
