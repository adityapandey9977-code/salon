import type { NextFunction, Request, Response } from 'express';
import { paymentService } from '../../application/services/payment.service';

export class InternalPaymentController {
  public static async bookingDeposit(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const tenantId = req.principal!.tenantId;
      const { appointmentId, customerId, amount, currency, idempotencyKey } = req.body;

      const intent = await paymentService.createIntent(
        tenantId,
        {
          purpose: 'BOOKING_DEPOSIT',
          referenceType: 'APPOINTMENT',
          referenceId: appointmentId,
          customerId,
          amount,
          currency: currency || 'INR',
          idempotencyKey,
        },
        {
          principalType: 'SYSTEM',
        },
      );

      res.status(201).json({
        success: true,
        data: {
          paymentIntentId: intent.id,
          status: intent.status,
          providerReference: intent.providerIntentId,
        },
      });
    } catch (err) {
      next(err);
    }
  }
}
