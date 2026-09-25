import { Router } from 'express';
import { PlanController } from '../controllers/plan.controller';
import { SuperAdminController } from '../controllers/super-admin.controller';
const router = Router();
// Plans
router.get('/plans', PlanController.listPlans);
router.post('/plans', PlanController.createPlan);
router.get('/plans/:id', PlanController.getPlanById);
router.patch('/plans/:id', PlanController.updatePlan);
router.delete('/plans/:id', PlanController.deletePlan);
// Feature Flags
router.get('/feature-flags', PlanController.listFeatures);
router.post('/feature-flags', PlanController.createFeature);
router.patch('/feature-flags/:id', PlanController.updateFeature);
// Tenants & Provisioning
router.get('/tenants', SuperAdminController.listProvisioningRequests);
router.post('/tenants', SuperAdminController.provisionTenant);
router.get('/tenants/:id', SuperAdminController.getTenantDetails);
router.patch('/tenants/:id/subscription', SuperAdminController.updateTenantSubscription);
// Subscriptions
router.get('/subscriptions', SuperAdminController.listSubscriptions);
// Platform Settings
router.get('/settings', SuperAdminController.getSettings);
router.patch('/settings', SuperAdminController.updateSettings);
// Custom Domains & CNAME
router.put('/tenants/:id/cname', SuperAdminController.setCname);
router.get('/tenants/:id/domains', SuperAdminController.listDomains);
router.post('/tenants/:id/domains', SuperAdminController.addDomain);
router.delete('/tenants/:id/domains/:domainId', SuperAdminController.deleteDomain);
// White-label Branding
router.get('/tenants/:id/branding', SuperAdminController.getBranding);
router.patch('/tenants/:id/branding', SuperAdminController.updateBranding);
// Tenant Feature Overrides
router.get('/tenants/:id/overrides', SuperAdminController.getOverrides);
router.post('/tenants/:id/overrides', SuperAdminController.setOverride);
router.delete('/tenants/:id/overrides/:featureId', SuperAdminController.deleteOverride);
export { router as superAdminRoutes };
