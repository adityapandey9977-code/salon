import { TemplateRepository } from '../../infrastructure/repositories/template.repository';
import { CommunicationReadStore } from '../../infrastructure/redis/communication-read.store';
export class TemplateService {
    templateRepo;
    cache;
    constructor(templateRepo = new TemplateRepository(), cache = new CommunicationReadStore()) {
        this.templateRepo = templateRepo;
        this.cache = cache;
    }
    async listTemplates(tenantId) {
        return this.templateRepo.listTemplates(tenantId);
    }
    async getTemplate(code, channel, language = 'en') {
        const cached = await this.cache.getTemplate(code, channel, language);
        if (cached)
            return cached;
        const tpl = await this.templateRepo.findByCode(code, channel, language);
        if (tpl) {
            await this.cache.setTemplate(code, channel, language, tpl);
        }
        return tpl;
    }
    async upsertTemplate(data) {
        const tpl = await this.templateRepo.upsertTemplate(data);
        await this.cache.invalidateTemplate(data.code, data.channel, data.language || 'en');
        return tpl;
    }
    /**
     * Render template by substituting placeholders like {{clientName}}, {{time}}, {{serviceName}}
     */
    renderTemplate(templateBody, variables) {
        let rendered = templateBody;
        for (const [key, value] of Object.entries(variables)) {
            const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
            rendered = rendered.replace(regex, String(value ?? ''));
        }
        rendered = rendered.replace(/{{\s*[\w\.]+\s*}}/g, '');
        return rendered;
    }
}
