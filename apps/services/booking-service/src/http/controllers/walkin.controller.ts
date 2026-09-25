import type { NextFunction, Request, Response } from 'express';
import { bookingService } from '../../application/services/booking.service';

export class WalkinController {
  public static async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.principal!.tenantId;
      const branchId = req.query.branchId as string;
      const walkins = await bookingService.getWalkins(tenantId, branchId);
      res.status(200).json({ success: true, data: walkins });
    } catch (err) {
      next(err);
    }
  }

  public static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.principal!.tenantId;
      const { branchId, customerId, items, notes } = req.body;

      const walkin = await bookingService.createWalkin(
        tenantId,
        { branchId, customerId, items, notes },
        {
          principalType: req.principal!.principalType,
          userId: req.principal!.userId,
        },
      );

      res.status(201).json({ success: true, data: walkin });
    } catch (err) {
      next(err);
    }
  }

  public static async seat(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.principal!.tenantId;
      const id = req.params.id as string;
      const { staffId } = req.body;
      const seated = await bookingService.seatWalkin(
        tenantId,
        id,
        staffId,
        {
          principalType: req.principal!.principalType,
          userId: req.principal!.userId,
        },
      );
      res.status(200).json({ success: true, data: seated });
    } catch (err) {
      next(err);
    }
  }
}
