export declare class WebhookRepository {
    logEvent(data: {
        provider: string;
        providerEventId: string;
        eventType: string;
        signatureVerified: boolean;
        payload?: any;
    }): Promise<{
        isDuplicate: boolean;
    }>;
}
export declare const webhookRepository: WebhookRepository;
//# sourceMappingURL=webhook.repository.d.ts.map