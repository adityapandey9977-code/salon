import { prisma } from '../prisma/client';
import { Channel } from '../prisma/generated-client';

export class TemplateRepository {
  async findByCode(code: string, channel: Channel, language = 'en') {
    return prisma.notificationTemplate.findUnique({
      where: {
        code_channel_language: {
          code: code.toUpperCase().trim(),
          channel,
          language,
        },
      },
    });
  }

  async listTemplates(tenantId?: string) {
    return prisma.notificationTemplate.findMany({
      where: tenantId ? { OR: [{ tenantId: null }, { tenantId }] } : undefined,
      orderBy: { code: 'asc' },
    });
  }

  async upsertTemplate(data: {
    tenantId?: string;
    code: string;
    channel: Channel;
    name: string;
    subjectTemplate?: string;
    bodyTemplate: string;
    language?: string;
  }) {
    const lang = data.language || 'en';
    const code = data.code.toUpperCase().trim();

    return prisma.notificationTemplate.upsert({
      where: {
        code_channel_language: {
          code,
          channel: data.channel,
          language: lang,
        },
      },
      create: {
        tenantId: data.tenantId,
        code,
        channel: data.channel,
        name: data.name,
        subjectTemplate: data.subjectTemplate,
        bodyTemplate: data.bodyTemplate,
        language: lang,
      },
      update: {
        name: data.name,
        subjectTemplate: data.subjectTemplate,
        bodyTemplate: data.bodyTemplate,
        version: { increment: 1 },
      },
    });
  }
}
