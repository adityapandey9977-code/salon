import { prisma } from '../prisma/client';

export class WebhookRepository {
  public async logEvent(data: {
    provider: string;
    providerEventId: string;
    eventType: string;
    signatureVerified: boolean;
    payload?: any;
  }): Promise<{ isDuplicate: boolean }> {
    try {
      await prisma.providerWebhookEvent.create({
        data: {
          provider: data.provider,
          providerEventId: data.providerEventId,
          eventType: data.eventType,
          signatureVerified: data.signatureVerified,
          payload: data.payload,
          status: 'PROCESSED',
          processedAt: new Date(),
        },
      });
      return { isDuplicate: false };
    } catch {
      // Duplicate event id
      return { isDuplicate: true };
    }
  }
}

export const webhookRepository = new WebhookRepository();
