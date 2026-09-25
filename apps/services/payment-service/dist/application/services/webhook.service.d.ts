export declare class WebhookService {
    handleWebhook(providerName: string, rawBody: string | Buffer, signature: string): Promise<{
        status: string;
        eventId?: string;
    }>;
}
export declare const webhookService: WebhookService;
//# sourceMappingURL=webhook.service.d.ts.map