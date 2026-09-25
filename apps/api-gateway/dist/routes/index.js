import { Router } from 'express';
import { gatewayHealthController } from '../health/health.controller';
import { apiRateLimiter, authRateLimiter } from '../middleware/rate-limit.middleware';
import { bookingServiceProxy, commerceServiceProxy, communicationServiceProxy, customerServiceProxy, financeServiceProxy, identityServiceProxy, inventoryServiceProxy, organizationServiceProxy, paymentServiceProxy, peopleServiceProxy, platformServiceProxy, reportingServiceProxy, } from '../proxy/service-proxy';
const router = Router();
// Observability & Health
router.get('/health', (req, res) => gatewayHealthController.getHealth(req, res));
router.get('/ready', (req, res) => gatewayHealthController.getReady(req, res));
router.get('/metrics', (req, res) => gatewayHealthController.getMetrics(req, res));
// 1. Super Admin Explicit Routing
router.use('/api/v1/super-admin/auth', authRateLimiter, identityServiceProxy);
router.use('/api/v1/super-admin/plans', apiRateLimiter, platformServiceProxy);
router.use('/api/v1/super-admin/feature-flags', apiRateLimiter, platformServiceProxy);
router.use('/api/v1/super-admin/tenants', apiRateLimiter, platformServiceProxy);
router.use('/api/v1/super-admin/subscriptions', apiRateLimiter, platformServiceProxy);
router.use('/api/v1/super-admin/settings', apiRateLimiter, platformServiceProxy);
router.use('/api/v1/super-admin/notifications', apiRateLimiter, communicationServiceProxy);
router.use('/api/v1/super-admin/dashboard', apiRateLimiter, reportingServiceProxy);
router.use('/api/v1/super-admin/audit', apiRateLimiter, reportingServiceProxy);
// 2. Identity Domain Proxies
router.use('/api/v1/auth/tenant', authRateLimiter, identityServiceProxy);
router.use('/api/v1/auth', authRateLimiter, identityServiceProxy);
router.use('/api/v1/users', apiRateLimiter, identityServiceProxy);
router.use('/api/v1/roles', apiRateLimiter, identityServiceProxy);
router.use('/api/v1/permissions', apiRateLimiter, identityServiceProxy);
// 3. Organization Domain Proxies
router.use('/api/v1/tenants', apiRateLimiter, organizationServiceProxy);
router.use('/api/v1/branches', apiRateLimiter, organizationServiceProxy);
router.use('/api/v1/franchises', apiRateLimiter, organizationServiceProxy);
router.use('/api/v1/holidays', apiRateLimiter, organizationServiceProxy);
router.use('/api/v1/organizations', apiRateLimiter, organizationServiceProxy);
router.use('/api/v1/compliance', apiRateLimiter, organizationServiceProxy);
// 4. People & Staff Domain Proxies
router.use('/api/v1/staff/commissions', apiRateLimiter, financeServiceProxy);
router.use('/api/v1/staff', apiRateLimiter, peopleServiceProxy);
router.use('/api/v1/people', apiRateLimiter, peopleServiceProxy);
// 5. Customer Domain Proxies
router.use('/api/v1/customers', apiRateLimiter, customerServiceProxy);
// 6. Booking Domain Proxies
router.use('/api/v1/appointments', apiRateLimiter, bookingServiceProxy);
router.use('/api/v1/bookings', apiRateLimiter, bookingServiceProxy);
// 7. Commerce Domain Proxies
router.use('/api/v1/services', apiRateLimiter, commerceServiceProxy);
router.use('/api/v1/packages', apiRateLimiter, commerceServiceProxy);
router.use('/api/v1/memberships', apiRateLimiter, commerceServiceProxy);
router.use('/api/v1/billing/royalties', apiRateLimiter, financeServiceProxy);
router.use('/api/v1/billing', apiRateLimiter, commerceServiceProxy);
router.use('/api/v1/commerce', apiRateLimiter, commerceServiceProxy);
// 8. Payment Domain Proxies
router.use('/api/v1/payments', apiRateLimiter, paymentServiceProxy);
router.use('/api/v1/webhooks/payments', paymentServiceProxy);
// 9. Inventory Domain Proxies
router.use('/api/v1/inventory', apiRateLimiter, inventoryServiceProxy);
// 10. Finance Domain Proxies
router.use('/api/v1/finance', apiRateLimiter, financeServiceProxy);
// 11. Communication Domain Proxies
router.use('/api/v1/notifications', apiRateLimiter, communicationServiceProxy);
router.use('/api/v1/marketing', apiRateLimiter, communicationServiceProxy);
router.use('/api/v1/call-center', apiRateLimiter, communicationServiceProxy);
router.use('/api/v1/communications', apiRateLimiter, communicationServiceProxy);
// 12. Platform Domain Proxies
router.use('/api/v1/platform', apiRateLimiter, platformServiceProxy);
// 13. Reporting & Analytics Domain Proxies
router.use('/api/v1/dashboard', apiRateLimiter, reportingServiceProxy);
router.use('/api/v1/reports', apiRateLimiter, reportingServiceProxy);
router.use('/api/v1/audit', apiRateLimiter, reportingServiceProxy);
router.use('/api/v1/reporting', apiRateLimiter, reportingServiceProxy);
// 14. Support Ticket Domain Proxies
router.use('/api/v1/support', apiRateLimiter, platformServiceProxy);
export { router as gatewayRoutes };
