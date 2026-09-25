export interface SendResult {
    success: boolean;
    provider: string;
    providerMessageId?: string;
    errorCode?: string;
    errorMessage?: string;
}
export interface EmailProvider {
    sendEmail(to: string, subject: string, html: string): Promise<SendResult>;
}
export interface SmsProvider {
    sendSms(to: string, message: string): Promise<SendResult>;
}
export interface WhatsAppProvider {
    sendWhatsApp(to: string, message: string, templateName?: string): Promise<SendResult>;
}
export interface PushProvider {
    sendPush(token: string, title: string, body: string, data?: any): Promise<SendResult>;
}
export declare class NodemailerEmailProvider implements EmailProvider {
    private transporter;
    constructor();
    sendEmail(to: string, subject: string, html: string): Promise<SendResult>;
}
export declare class SimulatedSmsProvider implements SmsProvider {
    sendSms(to: string, message: string): Promise<SendResult>;
}
export declare class SimulatedWhatsAppProvider implements WhatsAppProvider {
    sendWhatsApp(to: string, message: string, templateName?: string): Promise<SendResult>;
}
export declare class SimulatedPushProvider implements PushProvider {
    sendPush(token: string, title: string, body: string, data?: any): Promise<SendResult>;
}
export declare const emailProvider: EmailProvider;
export declare const smsProvider: SmsProvider;
export declare const whatsAppProvider: WhatsAppProvider;
export declare const pushProvider: PushProvider;
//# sourceMappingURL=provider.adapters.d.ts.map