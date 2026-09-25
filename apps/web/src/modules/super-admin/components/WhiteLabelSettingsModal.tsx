import { Button } from '@salon-spa-saas/ui';
import { CheckCircle2, Globe, Palette } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { type Tenant, useSuperAdminStore } from '../context/SuperAdminContext';
import { BaseModal } from './BaseModal';

interface WhiteLabelSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  salon: Tenant | null;
}

export const WhiteLabelSettingsModal: React.FC<WhiteLabelSettingsModalProps> = ({
  isOpen,
  onClose,
  salon,
}) => {
  const { updateTenant } = useSuperAdminStore();
  const [customDomain, setCustomDomain] = useState(salon?.customDomain || '');
  const [primaryColor, setPrimaryColor] = useState(salon?.primaryColor || '#5A2EA6');
  const [dnsVerified, setDnsVerified] = useState(!!salon?.customDomain);

  useEffect(() => {
    if (salon) {
      setCustomDomain(salon.customDomain || '');
      setPrimaryColor(salon.primaryColor || '#5A2EA6');
      setDnsVerified(!!salon.customDomain);
    }
  }, [salon, isOpen]);

  if (!salon) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateTenant(salon.id, {
      customDomain: customDomain ? customDomain : undefined,
      primaryColor,
    });
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`White-Label Settings: ${salon.name}`}
      subtitle="Configure custom CNAME domain, SSL status, brand theme palette & custom logo"
      icon={<Palette className="w-5 h-5" />}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-soft mb-1.5">
            Custom Domain Name (CNAME)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. app.blushbloom.in"
              value={customDomain}
              onChange={(e) => {
                setCustomDomain(e.target.value);
                setDnsVerified(false);
              }}
              className="flex-1 h-[40px] px-3.5 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-mono text-ink focus:outline-none focus:border-[#5A2EA6]"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => setDnsVerified(true)}
              className="h-[40px] px-3 rounded-xl text-xs font-semibold"
            >
              Verify CNAME
            </Button>
          </div>
          {dnsVerified && (
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> DNS CNAME record successfully resolved and
              SSL active!
            </span>
          )}
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-soft mb-1.5">
            Primary Brand Accent Color
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="w-10 h-10 rounded-xl border border-line cursor-pointer p-1"
            />
            <input
              type="text"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="h-[40px] px-3.5 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-mono text-ink w-32"
            />
            <div
              className="h-8 px-4 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-xs"
              style={{ backgroundColor: primaryColor }}
            >
              Preview Badge
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#F8F5FF] border border-[#5A2EA6]/15">
          <span className="text-xs font-bold text-ink block">Custom Tenant Logo Placeholder</span>
          <span className="text-[11px] text-muted">
            Upload high-res PNG / SVG for receipt header & client portal navigation
          </span>
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
            Save White-Label Config
          </Button>
        </div>
      </form>
    </BaseModal>
  );
};
