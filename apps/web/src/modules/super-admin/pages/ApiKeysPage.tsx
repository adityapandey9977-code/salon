import { Button, cn } from '@salon-spa-saas/ui';
import { Check, Copy, Key, Pencil, Plus, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { type ApiKeyItem, GenerateApiKeyModal } from '../components/GenerateApiKeyModal';

const initialApiKeys: ApiKeyItem[] = [
  {
    name: 'Production Gateway API Key',
    created: 'Jan 12, 2026',
    lastUsed: '12 mins ago',
    token: 'pk_live_88491a92e104',
    scope: 'Full Read/Write Access',
    status: 'Active',
  },
  {
    name: 'Stripe Webhook Verification Token',
    created: 'Feb 05, 2026',
    lastUsed: '1 hr ago',
    token: 'whsec_99120e8c901',
    scope: 'Webhook Listener Only',
    status: 'Active',
  },
  {
    name: 'Twilio SMS Notification Dispatch',
    created: 'Mar 10, 2026',
    lastUsed: '5 mins ago',
    token: 'sk_twilio_4d2a11029',
    scope: 'Full Read/Write Access',
    status: 'Active',
  },
  {
    name: 'Development Staging API Key',
    created: 'Jul 20, 2026',
    lastUsed: 'Yesterday',
    token: 'pk_test_0f1299841',
    scope: 'Read-Only Telemetry',
    status: 'Active',
  },
];

export function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>(initialApiKeys);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<ApiKeyItem | null>(null);

  const handleSaveKey = (saved: ApiKeyItem) => {
    setApiKeys((prev) => {
      const idx = prev.findIndex((k) => k.name === saved.name);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [saved, ...prev];
    });
  };

  const handleRevokeKey = (keyName: string) => {
    if (confirm(`Are you sure you want to revoke API key "${keyName}"?`)) {
      setApiKeys((prev) => prev.filter((k) => k.name !== keyName));
    }
  };

  return (
    <div className="animate-in fade-in duration-300">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-[26px] text-ink font-semibold tracking-tight">API Keys</h1>
          <p className="text-[13px] text-muted mt-1">
            Manage global access developer tokens, secret API credentials and third-party webhook
            integrations.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingKey(null);
            setIsModalOpen(true);
          }}
          className="h-[40px] px-4 rounded-xl text-xs font-semibold premium-btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Generate New Key</span>
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
                Active Access Tokens
              </h3>
              <p className="text-[10px] text-white/80 mt-0.5">
                Global keys authorization control registry and API secret tokens
              </p>
            </div>
            <span className="text-[11px] font-bold text-white/90 bg-white/10 px-3 py-1 rounded-full border border-white/20">
              {apiKeys.length} Active Keys Issued
            </span>
          </div>
        </div>

        <div className="p-0 flex-1 bg-transparent">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6]">
                <tr>
                  {['Key Name', 'Auth Token', 'Created Date', 'Last Active', 'Actions'].map(
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
                {apiKeys.map((keyItem) => (
                  <tr
                    key={keyItem.name}
                    className="hover:bg-[#5A2EA6]/3 transition-colors duration-200"
                  >
                    <td className="p-4 pl-6 font-bold text-ink">
                      {keyItem.name}
                      <span className="block text-[10px] font-normal text-muted">
                        {keyItem.scope || 'Full Access'}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-[11px] text-soft">
                      {keyItem.token.substring(0, 10)}...
                      {keyItem.token.substring(keyItem.token.length - 4)}
                    </td>
                    <td className="p-4 font-semibold">{keyItem.created}</td>
                    <td className="p-4 font-semibold text-ink">{keyItem.lastUsed}</td>

                    {/* Relatable Icon Action Buttons */}
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Copy Secret Token Key */}
                        <button
                          onClick={() => {
                            navigator.clipboard?.writeText(keyItem.token);
                            alert(`API key "${keyItem.name}" secret token copied to clipboard!`);
                          }}
                          className="w-8 h-8 rounded-lg bg-[#5A2EA6]/5 hover:bg-[#5A2EA6]/15 text-[#5A2EA6] flex items-center justify-center transition-colors cursor-pointer border-0"
                          title="Copy Secret Token Key"
                        >
                          <Copy className="w-4 h-4" />
                        </button>

                        {/* Edit Key Parameters */}
                        <button
                          onClick={() => {
                            setEditingKey(keyItem);
                            setIsModalOpen(true);
                          }}
                          className="w-8 h-8 rounded-lg bg-[#5A2EA6]/5 hover:bg-[#5A2EA6]/15 text-[#5A2EA6] flex items-center justify-center transition-colors cursor-pointer border-0"
                          title="Edit Key Scope & Name"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        {/* Revoke API Key */}
                        <button
                          onClick={() => handleRevokeKey(keyItem.name)}
                          className="w-8 h-8 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center transition-colors cursor-pointer border-0"
                          title="Revoke API Key Access"
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

      {/* Generate / Edit Modal */}
      <GenerateApiKeyModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingKey(null);
        }}
        editKey={editingKey}
        onSave={handleSaveKey}
      />
    </div>
  );
}
