import { BadRequestError } from '@salon-spa-saas/common-types';
import { DOMAIN_EVENTS } from '@salon-spa-saas/events';
import { PaymentProviderFactory } from '../../infrastructure/providers/provider.factory';
import { paymentEventPublisher } from '../../infrastructure/messaging/publisher';
import { webhookRepository } from '../../infrastructure/repositories/webhook.repository';
import { prisma } from '../../infrastructure/prisma/client';

export class WebhookService {
  public async handleWebhook(
    providerName: string,
    rawBody: string | Buffer,
    signature: string,
  ): Promise<{ status: string; eventId?: string }> {
    const provider = PaymentProviderFactory.getProvider(providerName);

    // 1. Verify Signature
    const verification = await provider.verifyWebhook(rawBody, signature);
    if (!verification.isValid) {
      throw new BadRequestError(verification.error || 'Webhook verification failed');
    }

    const eventId = verification.eventId || `evt_${Date.now()}`;

    // 2. Deduplicate Webhook Event in DB
    const { isDuplicate } = await webhookRepository.logEvent({
      provider: providerName,
      providerEventId: eventId,
      eventType: verification.eventType || 'unknown',
      signatureVerified: true,
      payload: typeof rawBody === 'string' ? JSON.parse(rawBody) : rawBody.toString(),
    });

    if (isDuplicate) {
      return { status: 'DUPLICATE_IGNORED', eventId };
    }

    // 3. Process payment success if matching intent
    if (verification.paymentIntentId && verification.status === 'SUCCESS') {
      const intent = await prisma.paymentIntent.findFirst({
        where: {
          OR: [
            { id: verification.paymentIntentId },
            { providerIntentId: verification.paymentIntentId },
          ],
        },
      });

      if (intent) {
        await prisma.$transaction(async (tx) => {
          await tx.paymentTransaction.create({
            data: {
              tenantId: intent.tenantId,
              paymentIntentId: intent.id,
              method: 'CARD',
              amount: intent.amount,
              currency: intent.currency,
              status: 'CAPTURED',
              provider: providerName,
              providerTransactionId: verification.providerTransactionId,
              paidAt: new Date(),
            },
          });

          await tx.paymentIntent.update({
            where: { id: intent.id },
            data: { status: 'CAPTURED' },
          });
        });

        // Publish event
        await paymentEventPublisher.publish({
          eventType: DOMAIN_EVENTS.PAYMENT_COMPLETED,
          aggregateType: 'Payment',
          aggregateId: intent.id,
          tenantId: intent.tenantId,
          payload: {
            paymentId: intent.id,
            invoiceId: intent.referenceType === 'INVOICE' ? intent.referenceId : undefined,
            appointmentId: intent.referenceType === 'APPOINTMENT' ? intent.referenceId : undefined,
            amount: Number(intent.amount),
            currency: intent.currency,
            method: 'ONLINE',
            gatewayTransactionId: verification.providerTransactionId,
            paidAt: new Date().toISOString(),
          },
        });
      }
    }

    return { status: 'PROCESSED', eventId };
  }
}

export const webhookService = new WebhookService();
