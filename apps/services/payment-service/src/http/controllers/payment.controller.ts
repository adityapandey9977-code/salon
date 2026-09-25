import type { NextFunction, Request, Response } from 'express';
import {
  CreatePaymentIntentRequestSchema,
  CreatePaymentLinkRequestSchema,
  RequestRefundRequestSchema,
  ReconcilePaymentsRequestSchema,
  VerifyPaymentTokenRequestSchema,
} from '@salon-spa-saas/contracts';
import { paymentService } from '../../application/services/payment.service';
import { reconciliationService } from '../../application/services/reconciliation.service';

export class PaymentController {
  public static async createIntent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.principal!.tenantId;
      const validated = CreatePaymentIntentRequestSchema.parse(req.body);

      const intent = await paymentService.createIntent(
        tenantId,
        {
          purpose: (validated.purpose as any) || 'INVOICE_PAYMENT',
          referenceType: validated.referenceType,
          referenceId: validated.referenceId,
          customerId: validated.customerId,
          amount: validated.amount,
          currency: validated.currency,
          provider: validated.provider,
          idempotencyKey: validated.idempotencyKey,
        },
        {
          principalType: req.principal!.principalType,
          userId: req.principal!.userId,
        },
      );

      res.status(201).json({ success: true, data: intent });
    } catch (err) {
      next(err);
    }
  }

  public static async getIntentById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.principal!.tenantId;
      const id = req.params.id as string;
      const intent = await paymentService.getIntentById(tenantId, id);
      res.status(200).json({ success: true, data: intent });
    } catch (err) {
      next(err);
    }
  }

  public static async verifyToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.principal!.tenantId;
      const validated = VerifyPaymentTokenRequestSchema.parse(req.body);

      const intent = await paymentService.getIntentById(tenantId, validated.paymentIntentId);

      const transaction = await paymentService.recordTransaction(
        tenantId,
        {
          paymentIntentId: validated.paymentIntentId,
          method: (validated.method as any) || 'CARD',
          amount: intent.amount,
          currency: intent.currency,
          status: 'CAPTURED',
          provider: intent.provider || 'MOCK',
          providerTransactionId: validated.providerTransactionId,
          providerOrderId: validated.providerOrderId || undefined,
          providerSignature: validated.signature || undefined,
        },
        {
          principalType: req.principal!.principalType,
          userId: req.principal!.userId,
        },
      );

      res.status(200).json({ success: true, data: transaction });
    } catch (err) {
      next(err);
    }
  }

  public static async createPaymentLink(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const tenantId = req.principal!.tenantId;
      const validated = CreatePaymentLinkRequestSchema.parse(req.body);

      const intent = await paymentService.getIntentById(tenantId, validated.paymentIntentId);

      const link = await paymentService.createPaymentLink(tenantId, {
        paymentIntentId: validated.paymentIntentId,
        amount: intent.amount,
        currency: intent.currency,
        description: `Payment for intent ${intent.id}`,
      });

      res.status(201).json({ success: true, data: link });
    } catch (err) {
      next(err);
    }
  }

  public static async refund(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.principal!.tenantId;
      const paymentTransactionId = req.params.id as string;
      const validated = RequestRefundRequestSchema.parse(req.body);

      const refund = await paymentService.refund(
        tenantId,
        {
          paymentTransactionId: validated.paymentTransactionId || paymentTransactionId,
          amount: validated.amount,
          reason: validated.reason,
        },
        {
          principalType: req.principal!.principalType,
          userId: req.principal!.userId,
        },
      );

      res.status(200).json({ success: true, data: refund });
    } catch (err) {
      next(err);
    }
  }

  public static async reconcile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.principal!.tenantId;
      const validated = ReconcilePaymentsRequestSchema.parse(req.body);

      const result = await reconciliationService.reconcile(
        tenantId,
        {
          provider: validated.provider,
          settlementDate: validated.settlementDate,
          totalAmount: validated.totalAmount,
          feeAmount: validated.feeAmount,
          taxAmount: validated.taxAmount,
          netAmount: validated.netAmount,
        },
        req.principal!.userId,
      );

      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  public static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.principal!.tenantId;
      const id = req.params.id as string;
      const intent = await paymentService.getIntentById(tenantId, id);
      res.status(200).json({ success: true, data: intent });
    } catch (err) {
      next(err);
    }
  }
}
