import { Button } from '@salon-spa-saas/ui';
import { Plug, Plus, Power, RefreshCw, Settings, ShieldCheck } from 'lucide-react';
import React, { useState } from 'react';
import {
  ConfigureIntegrationModal,
  type IntegrationService,
} from '../components/ConfigureIntegrationModal';

const initialIntegrations: IntegrationService[] = [
  {
    name: 'Stripe Payment Gateway',
    desc: 'Process payments, store cards and authorize refunds globally.',
    status: 'Connected',
    code: 'stripe',
    apiKey: 'pk_live_stripe_9921',
    webhookSecret: 'whsec_stripe_8812',
    environment: 'Production',
  },
  {
    name: 'Twilio SMS Notification Dispatch',
    desc: 'Automatically send bookings confirmations and verification codes.',
    status: 'Connected',
    code: 'twilio',
    apiKey: 'sk_twilio_7712',
    webhookSecret: 'whsec_twilio_3312',
    environment: 'Production',
  },
  {
    name: 'SendGrid Email Automation Engine',
    desc: 'Dispatch invoices, loyalty points notifications and promotions.',
    status: 'Connected',
    code: 'sendgrid',
    apiKey: 'SG_live_9901',
    environment: 'Production',
  },
  {
    name: 'Google Calendar Sync Connector',
    desc: 'Enable stylists to synchronize booking lists to personal roster apps.',
    status: 'Inactive',
    code: 'google',
    apiKey: '',
    environment: 'Staging',
  },
];

export function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<IntegrationService[]>(initialIntegrations);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<IntegrationService | null>(null);

  const handleSaveService = (saved: IntegrationService) => {
    setIntegrations((prev) => {
      const idx = prev.findIndex((i) => i.name === saved.name || i.code === saved.code);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [...prev, saved];
    });
  };

  const handleToggleStatus = (serviceName: string) => {
    setIntegrations((prev) =>
      prev.map((item) =>
        item.name === serviceName
          ? { ...item, status: item.status === 'Connected' ? 'Inactive' : 'Connected' }
          : item,
      ),
    );
  };

  return (
    <div className="animate-in fade-in duration-300">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-[26px] text-ink font-semibold tracking-tight">
            Integrations
          </h1>
          <p className="text-[13px] text-muted mt-1">
            Configure global platform-level third-party system integrations, payment gateways &
            webhook listeners.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingService(null);
            setIsModalOpen(true);
          }}
          className="h-[40px] px-4 rounded-xl text-xs font-semibold premium-btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Connect New Service</span>
        </Button>
      </div>

      {/* Cards Container */}
      <div className="premium-branch-card rounded-[24px] overflow-hidden bg-transparent flex flex-col justify-between">
        <div className="premium-card-header px-5 py-3.5 relative min-h-[64px] flex items-center justify-between z-10">
          <div className="premium-card-header-glow" />
          <div className="header-shine" />
          <div className="z-10 w-full flex justify-between items-center">
            <div>
              <h3 className="font-serif text-[15px] text-white font-bold tracking-tight">
                Connected Core Services
              </h3>
              <p className="text-[10px] text-white/80 mt-0.5">
                Integrations gateway and operational API parameters
              </p>
            </div>
            <span className="text-[11px] font-bold text-white/90 bg-white/10 px-3 py-1 rounded-full border border-white/20">
              {integrations.filter((i) => i.status === 'Connected').length} Services Online
            </span>
          </div>
        </div>

        <div className="p-6 bg-white flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.map((item) => (
              <div
                key={item.name}
                className="flex flex-col gap-3 p-4.5 border border-[#5A2EA6]/15 rounded-2xl hover:shadow-sm hover:border-[#5A2EA6]/30 transition duration-200 bg-[#FCFAFF]"
              >
                <div className="flex justify-between items-center">
                  <span className="text-ink font-serif font-bold text-[14px] flex items-center gap-2">
                    <Plug className="w-4 h-4 text-[#5A2EA6]" />
                    {item.name}
                  </span>
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[9.5px] font-bold ${
                      item.status === 'Connected'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <p className="text-[11.5px] text-muted leading-relaxed flex-1 font-medium">
                  {item.desc}
                </p>

                {/* Relatable Icon Actions Bar */}
                <div className="pt-3 border-t border-[#5A2EA6]/10 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-soft">
                    {item.apiKey ? `Key: ${item.apiKey.substring(0, 10)}...` : 'Key Not Set'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {/* Ping Endpoint Connection */}
                    <button
                      onClick={() =>
                        alert(
                          `Ping request sent to ${item.name}! Connection status: HTTP 200 OK (14ms response time)`,
                        )
                      }
                      className="w-8 h-8 rounded-lg bg-[#5A2EA6]/5 hover:bg-[#5A2EA6]/15 text-[#5A2EA6] flex items-center justify-center transition-colors cursor-pointer border-0"
                      title="Test Connection Ping"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>

                    {/* Configure Service */}
                    <button
                      onClick={() => {
                        setEditingService(item);
                        setIsModalOpen(true);
                      }}
                      className="w-8 h-8 rounded-lg bg-[#5A2EA6]/5 hover:bg-[#5A2EA6]/15 text-[#5A2EA6] flex items-center justify-center transition-colors cursor-pointer border-0"
                      title="Configure API & Webhook Credentials"
                    >
                      <Settings className="w-3.5 h-3.5" />
                    </button>

                    {/* Toggle Status */}
                    <button
                      onClick={() => handleToggleStatus(item.name)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer border-0 ${
                        item.status === 'Connected'
                          ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                          : 'bg-rose-50 hover:bg-rose-100 text-rose-600'
                      }`}
                      title="Toggle Connected / Inactive Status"
                    >
                      <Power className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Configure Modal */}
      <ConfigureIntegrationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingService(null);
        }}
        service={editingService}
        onSave={handleSaveService}
      />
    </div>
  );
}
