import { Button } from '@salon-spa-saas/ui';
import { ShieldCheck, Sliders, ToggleLeft } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { BaseModal } from './BaseModal';

export interface FeatureFlagItem {
  flag: string;
  description: string;
  status: 'Enabled' | 'Beta' | 'Disabled';
  audience: string;
}

interface CreateFeatureFlagModalProps {
  isOpen: boolean;
  onClose: () => void;
  editFlag?: FeatureFlagItem | null;
  onSave: (flagItem: FeatureFlagItem) => void;
}

export const CreateFeatureFlagModal: React.FC<CreateFeatureFlagModalProps> = ({
  isOpen,
  onClose,
  editFlag,
  onSave,
}) => {
  const [flag, setFlag] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'Enabled' | 'Beta' | 'Disabled'>('Enabled');
  const [audience, setAudience] = useState('100% of Tenants');

  useEffect(() => {
    if (editFlag) {
      setFlag(editFlag.flag);
      setDescription(editFlag.description);
      setStatus(editFlag.status);
      setAudience(editFlag.audience);
    } else {
      setFlag('');
      setDescription('');
      setStatus('Enabled');
      setAudience('100% of Tenants');
    }
  }, [editFlag, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!flag || !description) return;

    onSave({
      flag: flag.toLowerCase().replace(/\s+/g, '-'),
      description,
      status,
      audience,
    });

    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={editFlag ? `Configure Flag: ${editFlag.flag}` : 'Create Live Feature Flag'}
      subtitle="Configure global code feature toggles, gradual canary releases & tenant beta eligibility"
      icon={<Sliders className="w-5 h-5" />}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-soft mb-1.5">
            Feature Key Identifier *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. enable-ai-smart-scheduler"
            value={flag}
            onChange={(e) => setFlag(e.target.value)}
            className="w-full h-[40px] px-3.5 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-mono text-ink focus:outline-none focus:border-[#5A2EA6]"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-soft mb-1.5">
            Feature Explanation & Scope *
          </label>
          <textarea
            rows={2}
            required
            placeholder="Describe what functionality this feature flag toggles..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-soft mb-1.5">
              Rollout Target Scope
            </label>
            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="w-full h-[40px] px-3.5 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
            >
              <option value="100% of Tenants">100% of Tenants (General Availability)</option>
              <option value="Selected Beta Tenants">Selected Beta Tenants Only</option>
              <option value="Enterprise Tier Only">Enterprise Tier Only</option>
              <option value="Internal Dev Staff">Internal Dev Staff Only</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-soft mb-1.5">
              Toggle Environment Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full h-[40px] px-3.5 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
            >
              <option value="Enabled">Enabled (Live for Audience)</option>
              <option value="Beta">Beta (Opt-In Testing)</option>
              <option value="Disabled">Disabled (Off)</option>
            </select>
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
            {editFlag ? 'Save Flag Configuration' : 'Create Feature Flag'}
          </Button>
        </div>
      </form>
    </BaseModal>
  );
};
