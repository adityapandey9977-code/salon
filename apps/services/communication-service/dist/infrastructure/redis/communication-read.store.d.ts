export declare class CommunicationReadStore {
    private redis;
    private isConnecting;
    private getClient;
    getTemplate(code: string, channel: string, language?: string): Promise<any | null>;
    setTemplate(code: string, channel: string, language: string, data: any, ttlSeconds?: number): Promise<void>;
    invalidateTemplate(code: string, channel: string, language?: string): Promise<void>;
    checkAndMarkProcessed(eventId: string, ttlSeconds?: number): Promise<boolean>;
}
export declare const communicationReadStore: CommunicationReadStore;
//# sourceMappingURL=communication-read.store.d.ts.map