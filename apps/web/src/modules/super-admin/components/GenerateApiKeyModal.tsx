import { Button } from '@salon-spa-saas/ui';
import { Check, Copy, Key, ShieldCheck } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { BaseModal } from './BaseModal';

export interface ApiKeyItem {
  id?: string;
  name: string;
  created: string;
  lastUsed: string;
  token: string;
  scope?: string;
  status?: 'Active' | 'Revoked';
}

interface GenerateApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  editKey?: ApiKeyItem | null;
  onSave: (keyItem: ApiKeyItem) => void;
}

export const GenerateApiKeyModal: React.FC<GenerateApiKeyModalProps> = ({
  isOpen,
  onClose,
  editKey,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [scope, setScope] = useState('Full Read/Write Access');
  const [token, setToken] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (editKey) {
      setName(editKey.name);
      setToken(editKey.token);
      setScope(editKey.scope || 'Full Read/Write Access');
    } else {
      setName('');
      setScope('Full Read/Write Access');
      const randomSecret = `pk_live_${Math.random().toString(36).substring(2, 12)}${Math.random().toString(36).substring(2, 6)}`;
      setToken(randomSecret);
    }
  }, [editKey, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    onSave({
      name,
      token,
      scope,
      created: editKey
        ? editKey.created
        : new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
          }),
      lastUsed: editKey ? editKey.lastUsed : 'Just now',
      status: 'Active',
    });

    onClose();
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={editKey ? `Edit Key Scope: ${editKey.name}` : 'Generate Developer API Key'}
      subtitle="Issue global developer access tokens, secret API keys & webhook authentication headers"
      icon={<Key className="w-5 h-5" />}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-soft mb-1.5">
            Key Identifier / Label *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Production Webhook Verification Token"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-[40px] px-3.5 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-soft mb-1.5">
            API Authorization Scope
          </label>
          <select
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            className="w-full h-[40px] px-3.5 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
          >
            <option value="Full Read/Write Access">
              Full Read/Write Access (Super Admin Level)
            </option>
            <option value="Webhook Dispatch Listener Only">Webhook Dispatch Listener Only</option>
            <option value="Read-Only Telemetry Analytics">Read-Only Telemetry Analytics</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-soft mb-1.5">
            Generated API Secret Token Key
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={token}
              className="flex-1 h-[40px] px-3.5 rounded-xl border border-[#5A2EA6]/20 bg-slate-50 text-xs font-mono text-ink cursor-not-allowed"
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleCopy}
              className="h-[40px] px-3.5 rounded-xl text-xs font-semibold flex items-center gap-1.5"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              <span>{copied ? 'Copied!' : 'Copy Key'}</span>
            </Button>
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
            {editKey ? 'Save Key Settings' : 'Generate API Key'}
          </Button>
        </div>
      </form>
    </BaseModal>
  );
};
