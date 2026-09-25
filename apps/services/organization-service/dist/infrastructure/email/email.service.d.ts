export interface SendTenantCredentialsEmailParams {
    toEmail: string;
    ownerName: string;
    salonName: string;
    slug: string;
    generatedPassword: string;
    loginUrl?: string;
}
export declare class EmailService {
    private transporter;
    constructor();
    private initTransporter;
    sendTenantCredentialsEmail(params: SendTenantCredentialsEmailParams): Promise<boolean>;
}
export declare const emailService: EmailService;
//# sourceMappingURL=email.service.d.ts.map