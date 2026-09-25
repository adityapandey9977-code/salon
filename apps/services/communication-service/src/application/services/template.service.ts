import { TemplateRepository } from '../../infrastructure/repositories/template.repository';
import { CommunicationReadStore } from '../../infrastructure/redis/communication-read.store';
import { Channel } from '../../infrastructure/prisma/generated-client';
import { NotFoundError } from '@salon-spa-saas/common-types';

export class TemplateService {
  constructor(
    private templateRepo: TemplateRepository = new TemplateRepository(),
    private cache: CommunicationReadStore = new CommunicationReadStore()
  ) {}

  async listTemplates(tenantId?: string) {
    return this.templateRepo.listTemplates(tenantId);
  }

  async getTemplate(code: string, channel: Channel, language = 'en') {
    const cached = await this.cache.getTemplate(code, channel, language);
    if (cached) return cached;

    const tpl = await this.templateRepo.findByCode(code, channel, language);
    if (tpl) {
      await this.cache.setTemplate(code, channel, language, tpl);
    }
    return tpl;
  }

  async upsertTemplate(data: any) {
    const tpl = await this.templateRepo.upsertTemplate(data);
    await this.cache.invalidateTemplate(data.code, data.channel, data.language || 'en');
    return tpl;
  }

  /**
   * Render template by substituting placeholders like {{clientName}}, {{time}}, {{serviceName}}
   */
  renderTemplate(templateBody: string, variables: Record<string, any>): string {
    let rendered = templateBody;
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      rendered = rendered.replace(regex, String(value ?? ''));
    }
    rendered = rendered.replace(/{{\s*[\w\.]+\s*}}/g, '');
    return rendered;
  }
}
