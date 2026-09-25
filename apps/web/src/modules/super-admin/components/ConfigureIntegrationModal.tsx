import { Button } from '@salon-spa-saas/ui';
import { CheckCircle2, Globe, Key, Plug, ShieldCheck } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { BaseModal } from './BaseModal';

export interface IntegrationService {
  name: string;
  desc: string;
  status: 'Connected' | 'Inactive';
  code: string;
  apiKey?: string;
  webhookSecret?: string;
  environment?: string;
}

interface ConfigureIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: IntegrationService | null;
  onSave: (service: IntegrationService) => void;
}

export const ConfigureIntegrationModal: React.FC<ConfigureIntegrationModalProps> = ({
  isOpen,
  onClose,
  service,
  onSave,
}) => {
  const [formData, setFormData] = useState<IntegrationService>({
    name: '',
    desc: '',
    status: 'Connected',
    code: 'custom',
    apiKey: '',
    webhookSecret: '',
    environment: 'Production',
  });

  useEffect(() => {
    if (service) {
      setFormData(service);
    } else {
      setFormData({
        name: '',
        desc: '',
        status: 'Connected',
        code: 'custom',
        apiKey: '',
        webhookSecret: '',
        environment: 'Production',
      });
    }
  }, [service, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    onSave(formData);
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={service ? `Configure Service: ${service.name}` : 'Connect New Integration Service'}
      subtitle="Configure third-party API credentials, webhook secret keys & environment endpoints"
      icon={<Plug className="w-5 h-5" />}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-soft mb-1.5">
              Service Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Razorpay Payment Gateway"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full h-[40px] px-3.5 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-soft mb-1.5">
              Integration Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full h-[40px] px-3.5 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
            >
              <option value="Connected">Connected (Active Gateway)</option>
              <option value="Inactive">Inactive (Disabled)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-soft mb-1.5">
            Service Description *
          </label>
          <input
            type="text"
            required
            placeholder="Describe what this integration processes..."
            value={formData.desc}
            onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
            className="w-full h-[40px] px-3.5 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-soft mb-1.5">
              API Public Key / Token
            </label>
            <input
              type="password"
              placeholder="pk_live_..."
              value={formData.apiKey || ''}
              onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
              className="w-full h-[40px] px-3.5 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-mono text-ink focus:outline-none focus:border-[#5A2EA6]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-soft mb-1.5">
              Webhook Secret Signing Key
            </label>
            <input
              type="password"
              placeholder="whsec_..."
              value={formData.webhookSecret || ''}
              onChange={(e) => setFormData({ ...formData, webhookSecret: e.target.value })}
              className="w-full h-[40px] px-3.5 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-mono text-ink focus:outline-none focus:border-[#5A2EA6]"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#5A2EA6]/10">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="h-[38px] px-4 rounded-xl text-xs font-semibold"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="h-[38px] px-5 rounded-xl text-xs font-semibold premium-btn-primary"
          >
            Save Integration Settings
          </Button>
        </div>
      </form>
    </BaseModal>
  );
};
