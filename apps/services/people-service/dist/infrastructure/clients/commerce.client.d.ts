export interface ServiceValidationResult {
    isValid: boolean;
    serviceName?: string;
}
export declare class CommerceClient {
    private static instance;
    private constructor();
    static getInstance(): CommerceClient;
    validateServiceId(_tenantId: string, _serviceId: string): Promise<ServiceValidationResult>;
}
export declare const commerceClient: CommerceClient;
//# sourceMappingURL=commerce.client.d.ts.map