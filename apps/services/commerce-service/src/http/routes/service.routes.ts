import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { requirePermission } from '../../middleware/permission.middleware';
import { serviceController } from '../controllers/service.controller';

const router: Router = Router();

router.use(authMiddleware);

// Categories
router.get(
  '/categories',
  requirePermission('service.read'),
  serviceController.listCategories.bind(serviceController),
);
router.post(
  '/categories',
  requirePermission('service.manage'),
  serviceController.createCategory.bind(serviceController),
);
router.patch(
  '/categories/:id',
  requirePermission('service.manage'),
  serviceController.updateCategory.bind(serviceController),
);
router.delete(
  '/categories/:id',
  requirePermission('service.manage'),
  serviceController.deleteCategory.bind(serviceController),
);

// Skills Registry (placed before :id wildcards)
router.get(
  '/skills',
  requirePermission('service.read'),
  serviceController.listSkills.bind(serviceController),
);
router.post(
  '/skills/seed',
  requirePermission('service.manage'),
  serviceController.seedSkills.bind(serviceController),
);
router.post(
  '/skills',
  requirePermission('service.manage'),
  serviceController.createSkill.bind(serviceController),
);
router.patch(
  '/skills/:id',
  requirePermission('service.manage'),
  serviceController.updateSkill.bind(serviceController),
);
router.delete(
  '/skills/:id',
  requirePermission('service.manage'),
  serviceController.deleteSkill.bind(serviceController),
);

// Pricing and Recipe routes (placed before :id wildcards)
router.get(
  '/pricing',
  requirePermission('service.read'),
  serviceController.listServices.bind(serviceController),
);

// Services CRUD
router.get(
  '/',
  requirePermission('service.read'),
  serviceController.listServices.bind(serviceController),
);
router.post(
  '/',
  requirePermission('service.manage'),
  serviceController.createService.bind(serviceController),
);
router.get(
  '/:id',
  requirePermission('service.read'),
  serviceController.getServiceById.bind(serviceController),
);
router.patch(
  '/:id',
  requirePermission('service.manage'),
  serviceController.updateService.bind(serviceController),
);
router.delete(
  '/:id',
  requirePermission('service.manage'),
  serviceController.deleteService.bind(serviceController),
);

// Pricing & Recipes on specific service
router.put(
  '/:id/pricing',
  requirePermission('service.price.manage'),
  serviceController.setBranchPrice.bind(serviceController),
);
router.post(
  '/:id/recipe',
  requirePermission('service.recipe.manage'),
  serviceController.setRecipe.bind(serviceController),
);

export const serviceRoutes: Router = router;
