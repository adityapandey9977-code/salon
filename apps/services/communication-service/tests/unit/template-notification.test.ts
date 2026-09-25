import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TemplateService } from '../../src/application/services/template.service';
import { NotificationService } from '../../src/application/services/notification.service';
import { Channel } from '../../src/infrastructure/prisma/generated-client';

describe('TemplateService - Placeholder Interpolation', () => {
  let templateService: TemplateService;
  let mockRepo: any;
  let mockCache: any;

  beforeEach(() => {
    mockCache = {
      getTemplate: vi.fn().mockResolvedValue(null),
      setTemplate: vi.fn().mockResolvedValue(undefined),
      invalidateTemplate: vi.fn().mockResolvedValue(undefined),
    };

    mockRepo = {
      findByCode: vi.fn(),
      listTemplates: vi.fn(),
      upsertTemplate: vi.fn(),
    };

    templateService = new TemplateService(mockRepo, mockCache);
  });

  it('should interpolate placeholders correctly into rendered output', () => {
    const raw = 'Hello {{clientName}}, your slot for {{serviceName}} is at {{time}}. Bill: INR {{amount}}';
    const vars = {
      clientName: 'Priya',
      serviceName: 'Hydra Facial',
      time: '3:30 PM',
      amount: 2500,
    };

    const rendered = templateService.renderTemplate(raw, vars);
    expect(rendered).toBe('Hello Priya, your slot for Hydra Facial is at 3:30 PM. Bill: INR 2500');
  });

  it('should handle missing variables by replacing with empty string', () => {
    const raw = 'Dear {{clientName}}, thank you!';
    const rendered = templateService.renderTemplate(raw, {});
    expect(rendered).toBe('Dear , thank you!');
  });
});

describe('NotificationService - Provider Dispatch & Event Emission', () => {
  let notifService: NotificationService;
  let mockNotifRepo: any;
  let mockTemplateService: any;

  beforeEach(() => {
    mockNotifRepo = {
      createNotification: vi.fn().mockImplementation((data) => ({ id: 'notif-1', ...data })),
      recordDeliveryAttempt: vi.fn().mockResolvedValue({ id: 'att-1' }),
      updateStatus: vi.fn().mockResolvedValue({ id: 'notif-1' }),
    };

    mockTemplateService = {
      getTemplate: vi.fn().mockResolvedValue({
        id: 'tpl-1',
        bodyTemplate: 'Confirmation for {{clientName}}',
      }),
      renderTemplate: vi.fn().mockReturnValue('Confirmation for Ananya'),
    };

    notifService = new NotificationService(mockNotifRepo, mockTemplateService);
  });

  it('should render template and record successful delivery attempt for WhatsApp channel', async () => {
    const result = await notifService.sendNotification({
      tenantId: 'tenant-1',
      recipientType: 'CUSTOMER',
      recipientId: '+919876543210',
      channel: Channel.WHATSAPP,
      templateCode: 'APPOINTMENT_CONFIRMED',
      variables: { clientName: 'Ananya' },
    });

    expect(mockTemplateService.getTemplate).toHaveBeenCalledWith('APPOINTMENT_CONFIRMED', Channel.WHATSAPP);
    expect(mockNotifRepo.createNotification).toHaveBeenCalled();
    expect(mockNotifRepo.recordDeliveryAttempt).toHaveBeenCalledWith(
      expect.objectContaining({
        provider: 'SIMULATED_WHATSAPP',
        status: 'SUCCESS',
      })
    );
    expect(result.status).toBe('DELIVERED');
  });
});
