import { TemplateRepository } from '../../infrastructure/repositories/template.repository';
import { CommunicationReadStore } from '../../infrastructure/redis/communication-read.store';
import { Channel } from '../../infrastructure/prisma/generated-client';
export declare class TemplateService {
    private templateRepo;
    private cache;
    constructor(templateRepo?: TemplateRepository, cache?: CommunicationReadStore);
    listTemplates(tenantId?: string): Promise<{
        tenantId: string | null;
        code: string;
        id: string;
        name: string;
        channel: import("../../infrastructure/prisma/generated-client").$Enums.Channel;
        subjectTemplate: string | null;
        bodyTemplate: string;
        language: string;
        isActive: boolean;
        version: number;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getTemplate(code: string, channel: Channel, language?: string): Promise<any>;
    upsertTemplate(data: any): Promise<{
        tenantId: string | null;
        code: string;
        id: string;
        name: string;
        channel: import("../../infrastructure/prisma/generated-client").$Enums.Channel;
        subjectTemplate: string | null;
        bodyTemplate: string;
        language: string;
        isActive: boolean;
        version: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    /**
     * Render template by substituting placeholders like {{clientName}}, {{time}}, {{serviceName}}
     */
    renderTemplate(templateBody: string, variables: Record<string, any>): string;
}
//# sourceMappingURL=template.service.d.ts.map