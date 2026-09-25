import { Channel } from '../prisma/generated-client';
export declare class TemplateRepository {
    findByCode(code: string, channel: Channel, language?: string): Promise<{
        tenantId: string | null;
        code: string;
        id: string;
        name: string;
        channel: import("../prisma/generated-client").$Enums.Channel;
        subjectTemplate: string | null;
        bodyTemplate: string;
        language: string;
        isActive: boolean;
        version: number;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    listTemplates(tenantId?: string): Promise<{
        tenantId: string | null;
        code: string;
        id: string;
        name: string;
        channel: import("../prisma/generated-client").$Enums.Channel;
        subjectTemplate: string | null;
        bodyTemplate: string;
        language: string;
        isActive: boolean;
        version: number;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    upsertTemplate(data: {
        tenantId?: string;
        code: string;
        channel: Channel;
        name: string;
        subjectTemplate?: string;
        bodyTemplate: string;
        language?: string;
    }): Promise<{
        tenantId: string | null;
        code: string;
        id: string;
        name: string;
        channel: import("../prisma/generated-client").$Enums.Channel;
        subjectTemplate: string | null;
        bodyTemplate: string;
        language: string;
        isActive: boolean;
        version: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
//# sourceMappingURL=template.repository.d.ts.map