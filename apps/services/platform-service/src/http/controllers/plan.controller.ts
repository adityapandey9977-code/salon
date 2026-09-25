import { Request, Response, NextFunction } from 'express';
import { PlanService } from '../../application/services/plan.service';

const planService = new PlanService();

export class PlanController {
  static async listPlans(req: Request, res: Response, next: NextFunction) {
    try {
      const isActive = req.query.isActive !== undefined ? req.query.isActive === 'true' : undefined;
      const isPublic = req.query.isPublic !== undefined ? req.query.isPublic === 'true' : undefined;
      const plans = await planService.listPlans({ isActive, isPublic });
      res.json({ success: true, data: plans });
    } catch (err) {
      next(err);
    }
  }

  static async getPlanById(req: Request, res: Response, next: NextFunction) {
    try {
      const plan = await planService.getPlanById(req.params.id as string);
      res.json({ success: true, data: plan });
    } catch (err) {
      next(err);
    }
  }

  static async createPlan(req: Request, res: Response, next: NextFunction) {
    try {
      const basePrice =
        req.body.basePrice !== undefined
          ? Number(req.body.basePrice)
          : req.body.priceMonthly !== undefined
            ? Number(req.body.priceMonthly)
            : req.body.price !== undefined
              ? Number(req.body.price)
              : 0;
      const plan = await planService.createPlan({
        ...req.body,
        basePrice,
      });
      res.status(201).json({ success: true, data: plan });
    } catch (err) {
      next(err);
    }
  }

  static async updatePlan(req: Request, res: Response, next: NextFunction) {
    try {
      const basePrice =
        req.body.basePrice !== undefined
          ? Number(req.body.basePrice)
          : req.body.priceMonthly !== undefined
            ? Number(req.body.priceMonthly)
            : req.body.price !== undefined
              ? Number(req.body.price)
              : undefined;
      const plan = await planService.updatePlan(req.params.id as string, {
        ...req.body,
        basePrice,
      });
      res.json({ success: true, data: plan });
    } catch (err) {
      next(err);
    }
  }

  static async deletePlan(req: Request, res: Response, next: NextFunction) {
    try {
      const plan = await planService.deletePlan(req.params.id as string);
      res.json({ success: true, data: plan });
    } catch (err) {
      next(err);
    }
  }

  // Feature flags
  static async listFeatures(req: Request, res: Response, next: NextFunction) {
    try {
      const isActive = req.query.isActive !== undefined ? req.query.isActive === 'true' : undefined;
      const category = req.query.category as string | undefined;
      const features = await planService.listFeatures({ isActive, category });
      res.json({ success: true, data: features });
    } catch (err) {
      next(err);
    }
  }

  static async createFeature(req: Request, res: Response, next: NextFunction) {
    try {
      const feature = await planService.createFeature(req.body);
      res.status(201).json({ success: true, data: feature });
    } catch (err) {
      next(err);
    }
  }

  static async updateFeature(req: Request, res: Response, next: NextFunction) {
    try {
      const feature = await planService.updateFeature(req.params.id as string, req.body);
      res.json({ success: true, data: feature });
    } catch (err) {
      next(err);
    }
  }
}
