export interface SendUserCredentialsEmailParams {
    toEmail: string;
    fullName: string;
    userType?: 'PLATFORM' | 'TENANT' | 'CUSTOMER';
    roleName?: string;
    generatedPassword: string;
    loginUrl?: string;
}
export interface SendPasswordResetEmailParams {
    toEmail: string;
    token: string;
    userType: 'USER' | 'TENANT' | 'PLATFORM';
}
export declare class EmailService {
    private transporter;
    constructor();
    private initTransporter;
    sendUserCredentialsEmail(params: SendUserCredentialsEmailParams): Promise<boolean>;
    sendPasswordResetEmail(params: SendPasswordResetEmailParams): Promise<boolean>;
}
export declare const emailService: EmailService;
//# sourceMappingURL=email.service.d.ts.map