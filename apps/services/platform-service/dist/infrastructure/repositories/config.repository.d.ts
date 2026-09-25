export declare class ConfigRepository {
    get(key: string): Promise<string | null>;
    getAll(): Promise<{
        value: string;
        description: string | null;
        updatedAt: Date;
        key: string;
    }[]>;
    set(key: string, value: string, description?: string): Promise<{
        value: string;
        description: string | null;
        updatedAt: Date;
        key: string;
    }>;
    setMany(settings: Record<string, string>): Promise<{
        value: string;
        description: string | null;
        updatedAt: Date;
        key: string;
    }[]>;
}
//# sourceMappingURL=config.repository.d.ts.map