import type { NextFunction, Request, Response } from 'express';
import { BadRequestError } from '@salon-spa-saas/common-types';
import { availabilityService } from '../../application/services/availability.service';

export class AvailabilityController {
  public static async getAvailability(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const tenantId = req.principal!.tenantId;
      const { branchId, serviceId, date, staffId, duration } = req.query;

      if (!branchId || !date) {
        throw new BadRequestError('branchId and date query parameters are required');
      }

      const slots = await availabilityService.getAvailableSlots({
        tenantId,
        branchId: branchId as string,
        serviceId: serviceId as string | undefined,
        date: date as string,
        staffId: staffId as string | undefined,
        durationMinutes: duration ? Number(duration) : undefined,
      });

      res.status(200).json({ success: true, data: slots });
    } catch (err) {
      next(err);
    }
  }
}
