import type { NextFunction, Request, Response } from 'express';
import { waitlistRepository } from '../../infrastructure/repositories/waitlist.repository';

export class WaitlistController {
  public static async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.principal!.tenantId;
      const { branchId, preferredDate, status } = req.query;
      const entries = await waitlistRepository.list(tenantId, {
        branchId: branchId as string,
        preferredDate: preferredDate as string,
        status: status as string,
      });
      res.status(200).json({ success: true, data: entries });
    } catch (err) {
      next(err);
    }
  }

  public static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.principal!.tenantId;
      const {
        branchId,
        customerId,
        serviceId,
        preferredStaffId,
        preferredDate,
        preferredStartTime,
        preferredEndTime,
      } = req.body;

      const entry = await waitlistRepository.create({
        tenantId,
        branchId,
        customerId,
        serviceId,
        preferredStaffId,
        preferredDate,
        preferredStartTime,
        preferredEndTime,
      });

      res.status(201).json({ success: true, data: entry });
    } catch (err) {
      next(err);
    }
  }

  public static async updateStatus(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const tenantId = req.principal!.tenantId;
      const id = req.params.id as string;
      const { status } = req.body;
      const entry = await waitlistRepository.updateStatus(tenantId, id, status);
      res.status(200).json({ success: true, data: entry });
    } catch (err) {
      next(err);
    }
  }
}
