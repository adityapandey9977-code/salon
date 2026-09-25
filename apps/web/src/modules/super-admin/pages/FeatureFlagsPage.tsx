import { Button, cn } from '@salon-spa-saas/ui';
import { CheckCircle2, Plus, Power, Settings, Sliders, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { CreateFeatureFlagModal, type FeatureFlagItem } from '../components/CreateFeatureFlagModal';

const initialFeatureFlags: FeatureFlagItem[] = [
  {
    flag: 'enable-appointment-scheduler-v2',
    description: 'Advanced visual weekly grid scheduler with drag-n-drop',
    status: 'Enabled',
    audience: '100% of Tenants',
  },
  {
    flag: 'enable-membership-loyalty-tiers',
    description: 'Bronze, Gold and Platinum loyalty rewards calculation engine',
    status: 'Enabled',
    audience: '100% of Tenants',
  },
  {
    flag: 'enable-automated-whatsapp-broadcasts',
    description: 'Twilio API integration for client bookings dispatch',
    status: 'Beta',
    audience: 'Selected Beta Tenants',
  },
  {
    flag: 'enable-staff-commission-analytics',
    description: 'Internal reports calculator for stylist audits',
    status: 'Disabled',
    audience: 'Internal Dev Staff',
  },
];

export function FeatureFlagsPage() {
  const [flags, setFlags] = useState<FeatureFlagItem[]>(initialFeatureFlags);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFlag, setEditingFlag] = useState<FeatureFlagItem | null>(null);

  const handleSaveFlag = (saved: FeatureFlagItem) => {
    setFlags((prev) => {
      const idx = prev.findIndex((f) => f.flag === saved.flag);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [saved, ...prev];
    });
  };

  const handleToggleStatus = (flagKey: string) => {
    setFlags((prev) =>
      prev.map((f) => {
        if (f.flag === flagKey) {
          const nextStatus =
            f.status === 'Enabled' ? 'Beta' : f.status === 'Beta' ? 'Disabled' : 'Enabled';
          return { ...f, status: nextStatus };
        }
        return f;
      }),
    );
  };

  const handleDeleteFlag = (flagKey: string) => {
    if (confirm(`Are you sure you want to delete feature flag "${flagKey}"?`)) {
      setFlags((prev) => prev.filter((f) => f.flag !== flagKey));
    }
  };

  return (
    <div className="animate-in fade-in duration-300">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-[26px] text-ink font-semibold tracking-tight">
            Feature Flags
          </h1>
          <p className="text-[13px] text-muted mt-1">
            Configure global feature toggles and gradual beta rollouts for tenants according to PRD
            guidelines.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingFlag(null);
            setIsModalOpen(true);
          }}
          className="h-[40px] px-4 rounded-xl text-xs font-semibold premium-btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Feature Flag</span>
        </Button>
      </div>

      {/* Directory Table */}
      <div className="premium-branch-card rounded-[24px] overflow-hidden bg-transparent flex flex-col justify-between">
        <div className="premium-card-header px-5 py-3.5 relative min-h-[64px] flex items-center justify-between z-10">
          <div className="premium-card-header-glow" />
          <div className="header-shine" />
          <div className="z-10 w-full flex justify-between items-center">
            <div>
              <h3 className="font-serif text-[15px] text-white font-bold tracking-tight">
                System Feature Toggles
              </h3>
              <p className="text-[10px] text-white/80 mt-0.5">
                Manage live code-level flags and customer eligibility
              </p>
            </div>
            <span className="text-[11px] font-bold text-white/90 bg-white/10 px-3 py-1 rounded-full border border-white/20">
              {flags.length} Feature Toggles Active
            </span>
          </div>
        </div>

        <div className="p-0 flex-1 bg-transparent">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6]">
                <tr>
                  {['Feature Key / Flag', 'Description', 'Rollout Scope', 'Status', 'Actions'].map(
                    (h, i) => (
                      <th
                        key={h}
                        className={cn(
                          'p-4 font-bold text-[10px] tracking-wider uppercase',
                          i === 0 ? 'pl-6' : i === 4 ? 'pr-6 text-right' : '',
                        )}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#5A2EA6]/5 text-[#6d5b73]">
                {flags.map((ff) => (
                  <tr key={ff.flag} className="hover:bg-[#5A2EA6]/3 transition-colors duration-200">
                    <td className="p-4 pl-6 font-mono text-[11.5px] font-bold text-ink">
                      {ff.flag}
                    </td>
                    <td className="p-4 font-medium text-soft max-w-sm">{ff.description}</td>
                    <td className="p-4 font-semibold">{ff.audience}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleStatus(ff.flag)}
                        className={cn(
                          'inline-block px-2.5 py-1 rounded-full text-[9px] font-bold border-0 cursor-pointer transition-transform hover:scale-105',
                          ff.status === 'Enabled'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ff.status === 'Beta'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700',
                        )}
                        title="Click to cycle status: Enabled -> Beta -> Disabled"
                      >
                        {ff.status}
                      </button>
                    </td>

                    {/* Relatable Icon Actions */}
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Configure Flag Scope */}
                        <button
                          onClick={() => {
                            setEditingFlag(ff);
                            setIsModalOpen(true);
                          }}
                          className="w-8 h-8 rounded-lg bg-[#5A2EA6]/5 hover:bg-[#5A2EA6]/15 text-[#5A2EA6] flex items-center justify-center transition-colors cursor-pointer border-0"
                          title="Configure Rollout Scope & Status"
                        >
                          <Settings className="w-4 h-4" />
                        </button>

                        {/* Quick Toggle Status */}
                        <button
                          onClick={() => handleToggleStatus(ff.flag)}
                          className="w-8 h-8 rounded-lg bg-[#5A2EA6]/5 hover:bg-[#5A2EA6]/15 text-[#5A2EA6] flex items-center justify-center transition-colors cursor-pointer border-0"
                          title="Cycle Toggle Status (Enabled/Beta/Disabled)"
                        >
                          <Power className="w-4 h-4" />
                        </button>

                        {/* Delete Flag */}
                        <button
                          onClick={() => handleDeleteFlag(ff.flag)}
                          className="w-8 h-8 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center transition-colors cursor-pointer border-0"
                          title="Delete Feature Flag"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      <CreateFeatureFlagModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingFlag(null);
        }}
        editFlag={editingFlag}
        onSave={handleSaveFlag}
      />
    </div>
  );
}
