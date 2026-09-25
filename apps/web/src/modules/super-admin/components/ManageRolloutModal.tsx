import { Button } from '@salon-spa-saas/ui';
import { AlertCircle, CheckCircle2, Sliders } from 'lucide-react';
import React, { useState } from 'react';
import { type SubscriptionPlan, useSuperAdminStore } from '../context/SuperAdminContext';
import { BaseModal } from './BaseModal';

interface ManageRolloutModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: SubscriptionPlan | null;
}

export const ManageRolloutModal: React.FC<ManageRolloutModalProps> = ({
  isOpen,
  onClose,
  plan,
}) => {
  const { updatePlanRollout } = useSuperAdminStore();
  const [rolloutPercentage, setRolloutPercentage] = useState(plan?.rolloutPercentage || 100);
  const [strategy, setStrategy] = useState(plan?.rolloutStrategy || 'Staged Rollout');
  const [grandfatherPricing, setGrandfatherPricing] = useState(true);

  React.useEffect(() => {
    if (plan) {
      setRolloutPercentage(plan.rolloutPercentage || 100);
      setStrategy(plan.rolloutStrategy?.split(' (')[0] || 'Staged Rollout');
    }
  }, [plan, isOpen]);

  if (!plan) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePlanRollout(plan.id, rolloutPercentage, strategy);
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Manage Rollout: ${plan.name}`}
      subtitle="Control deployment strategy, target tenant cohort allocation & price grandfathering"
      icon={<Sliders className="w-5 h-5" />}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-soft">
              Rollout Allocation Percentage
            </label>
            <span className="text-xs font-bold text-[#5A2EA6] px-2.5 py-0.5 rounded-full bg-[#F8F5FF]">
              {rolloutPercentage}% Target
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={rolloutPercentage}
            onChange={(e) => setRolloutPercentage(Number(e.target.value))}
            className="w-full accent-[#5A2EA6] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-muted mt-1 font-mono">
            <span>0% (Canary)</span>
            <span>50% (Beta Cohort)</span>
            <span>100% (General Availability)</span>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-soft mb-1.5">
            Deployment Strategy Mode
          </label>
          <select
            value={strategy}
            onChange={(e) => setStrategy(e.target.value)}
            className="w-full h-[40px] px-3.5 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
          >
            <option value="Immediate GA">Immediate GA (All Eligible Tenants)</option>
            <option value="Staged Rollout">Staged Rollout (Percentage Allocator)</option>
            <option value="New Tenants Only">New Tenant Signups Only</option>
            <option value="Franchise Opt-In">Franchise Opt-In Beta</option>
          </select>
        </div>

        <div className="p-3.5 rounded-xl bg-[#F8F5FF] border border-[#5A2EA6]/15 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-ink block">Grandfather Existing Tenants</span>
            <span className="text-[11px] text-muted">
              Keep existing subscribers on legacy rates until explicit migration
            </span>
          </div>
          <input
            type="checkbox"
            checked={grandfatherPricing}
            onChange={(e) => setGrandfatherPricing(e.target.checked)}
            className="w-4 h-4 accent-[#5A2EA6] cursor-pointer"
          />
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
            Update Rollout Strategy
          </Button>
        </div>
      </form>
    </BaseModal>
  );
};
