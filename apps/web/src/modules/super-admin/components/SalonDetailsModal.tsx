import { Button } from '@salon-spa-saas/ui';
import {
  Building2,
  Calendar,
  Globe,
  Layers,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import type React from 'react';
import type { Tenant } from '../context/SuperAdminContext';
import { BaseModal } from './BaseModal';

interface SalonDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  salon: Tenant | null;
}

export const SalonDetailsModal: React.FC<SalonDetailsModalProps> = ({ isOpen, onClose, salon }) => {
  if (!salon) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={salon.name}
      subtitle={`Tenant ID: ${salon.id} • ${salon.city} HQ`}
      icon={<Building2 className="w-5 h-5" />}
      maxWidth="lg"
    >
      <div className="space-y-4">
        {/* Quick Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-[#F8F5FF] border border-[#5A2EA6]/10">
            <span className="text-[10px] font-bold text-soft uppercase block">Account Status</span>
            <span className="text-xs font-bold text-emerald-700 block mt-1">{salon.status}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#F8F5FF] border border-[#5A2EA6]/10">
            <span className="text-[10px] font-bold text-soft uppercase block">Active Branches</span>
            <span className="text-xs font-bold text-[#5A2EA6] block mt-1 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 inline" /> {salon.branchesCount ?? 0} Branches
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#F8F5FF] border border-[#5A2EA6]/10">
            <span className="text-[10px] font-bold text-soft uppercase block">
              Active Plan Tier
            </span>
            <span className="text-xs font-bold text-ink block mt-1">{salon.activePlans}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#F8F5FF] border border-[#5A2EA6]/10">
            <span className="text-[10px] font-bold text-soft uppercase block">Monthly Revenue</span>
            <span className="text-xs font-bold text-[#5A2EA6] block mt-1">{salon.revenue}</span>
          </div>
        </div>

        {/* Tenant Owner Contact Card */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-[#F8F5FF] to-[#FCFAFF] border border-[#5A2EA6]/15 space-y-2">
          <h4 className="text-xs font-bold text-[#5A2EA6] uppercase tracking-wider flex items-center gap-1.5">
            <UserCheck className="w-4 h-4" /> Tenant Owner Contact Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-xs">
            <div>
              <span className="text-[10.5px] text-muted block">Owner Name:</span>
              <strong className="text-ink font-bold">{salon.ownerName || salon.name}</strong>
            </div>
            <div>
              <span className="text-[10.5px] text-muted block">Direct Email:</span>
              <strong className="text-ink font-semibold">
                {salon.ownerEmail || salon.contactEmail}
              </strong>
            </div>
            <div>
              <span className="text-[10.5px] text-muted block">Direct Phone:</span>
              <strong className="text-ink font-semibold">
                {salon.ownerPhone || salon.contactPhone}
              </strong>
            </div>
          </div>
        </div>

        {/* Detailed Fields & Branch Listing */}
        <div className="p-4 rounded-xl border border-line space-y-3 text-xs text-ink">
          <div className="flex justify-between py-1 border-b border-line/50">
            <span className="text-muted flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#5A2EA6]" /> Operating Region:
            </span>
            <strong className="font-semibold">
              {salon.city} ({salon.region})
            </strong>
          </div>
          <div className="flex justify-between py-1 border-b border-line/50">
            <span className="text-muted flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#5A2EA6]" /> Custom Domain CNAME:
            </span>
            <strong className="font-mono text-[11px] text-[#5A2EA6]">
              {salon.customDomain || 'Standard (.salonspasaas.com)'}
            </strong>
          </div>
          <div className="flex justify-between py-1 border-b border-line/50">
            <span className="text-muted flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#5A2EA6]" /> Created Date:
            </span>
            <strong className="font-semibold">{salon.createdAt}</strong>
          </div>

          {/* Managed Branches Breakdown */}
          <div className="pt-2">
            <span className="text-[11px] font-bold text-soft uppercase tracking-wider block mb-2">
              Managed Branches Breakdown ({salon.branchesCount ?? (salon.branchesList ? salon.branchesList.length : 0)})
            </span>
            {salon.branchesList && salon.branchesList.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {salon.branchesList.map((branch, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg border border-[#5A2EA6]/10 bg-[#F8F5FF] text-[11.5px] font-semibold text-ink flex items-center gap-2"
                  >
                    <Building2 className="w-3.5 h-3.5 text-[#5A2EA6]" />
                    <span className="truncate">{branch}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted italic bg-[#F8F5FF] p-3 rounded-lg border border-[#5A2EA6]/10">
                No branches created yet. Tenant owner / admin will configure branches after initial login.
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            onClick={onClose}
            className="h-[36px] px-4 rounded-xl text-xs font-semibold premium-btn-primary"
          >
            Close Details
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};
