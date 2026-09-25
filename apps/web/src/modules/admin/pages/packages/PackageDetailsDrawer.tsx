import { Avatar, Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  AlertCircle,
  Archive,
  Building2,
  CheckCircle2,
  Clock,
  Copy,
  DollarSign,
  Edit2,
  Layers,
  Package,
  Scissors,
  Share2,
  ShieldCheck,
  Sparkles,
  Tag,
  TrendingUp,
  X,
} from 'lucide-react';
import React from 'react';
import { createPortal } from 'react-dom';
import type { FullPackageRecord } from './CreatePackageModal';

interface PackageDetailsDrawerProps {
  pkg: FullPackageRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (pkg: FullPackageRecord) => void;
  onToggleStatus: (pkg: FullPackageRecord) => void;
}

export function PackageDetailsDrawer({
  pkg,
  isOpen,
  onClose,
  onEdit,
  onToggleStatus,
}: PackageDetailsDrawerProps) {
  const { toast } = useToast();

  if (!isOpen || !pkg) return null;

  const outstandingValue = pkg.activeCount * (pkg.sellingPrice * 0.6);

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex justify-end bg-[#3B2647]/50 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl h-full shadow-[0_25px_70px_rgba(90,46,166,0.25)] border-l border-purple-100 flex flex-col animate-in slide-in-from-right duration-300 text-xs">
        {/* Drawer Header */}
        <div className="px-6 py-4.5 border-b border-purple-50 flex items-center justify-between bg-white shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-xs text-[#5A2EA6] bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-100">
                {pkg.code}
              </span>
              <span
                className={cn(
                  'px-2.5 py-0.5 rounded-full text-[10px] font-bold',
                  pkg.status === 'Active'
                    ? 'bg-emerald-100 text-emerald-800'
                    : pkg.status === 'Draft'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-700',
                )}
              >
                {pkg.status}
              </span>
            </div>
            <h3 className="font-serif text-[18px] text-ink font-bold tracking-tight mt-1">
              {pkg.name}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-ink hover:bg-slate-100 transition-colors border-0 bg-transparent cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto custom-scroll flex-1 space-y-5">
          {/* 1. Commercial Summary Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 bg-purple-50/70 rounded-xl border border-purple-100 text-center">
              <span className="text-[10px] text-muted uppercase font-bold block">
                Selling Price
              </span>
              <strong className="text-base font-bold font-serif text-[#5A2EA6] mt-0.5 block">
                ₹{pkg.sellingPrice.toLocaleString('en-IN')}
              </strong>
            </div>
            <div className="p-3 bg-[#FCFAFF] rounded-xl border border-purple-100 text-center">
              <span className="text-[10px] text-muted uppercase font-bold block">Total Sold</span>
              <strong className="text-base font-bold font-serif text-ink mt-0.5 block">
                {pkg.totalSold} Units
              </strong>
            </div>
            <div className="p-3 bg-[#FCFAFF] rounded-xl border border-purple-100 text-center">
              <span className="text-[10px] text-muted uppercase font-bold block">
                Active In-Market
              </span>
              <strong className="text-base font-bold font-serif text-emerald-700 mt-0.5 block">
                {pkg.activeCount} Units
              </strong>
            </div>
            <div className="p-3 bg-[#FCFAFF] rounded-xl border border-purple-100 text-center">
              <span className="text-[10px] text-muted uppercase font-bold block">Redeemed</span>
              <strong className="text-base font-bold font-serif text-soft mt-0.5 block">
                {pkg.redeemedCount} Units
              </strong>
            </div>
          </div>

          {/* 2. Package Overview */}
          <div className="p-4 rounded-2xl bg-[#FCFAFF] border border-purple-100/80 space-y-2">
            <h4 className="text-xs font-bold text-ink uppercase tracking-wider">
              Package Scope &amp; Category
            </h4>
            <p className="text-xs text-muted leading-relaxed">{pkg.description}</p>
            <div className="flex items-center gap-3 text-xs pt-1">
              <span className="text-soft">
                Category: <strong>{pkg.category}</strong>
              </span>
              <span className="text-soft">
                Validity: <strong>{pkg.validityMonths} Months</strong>
              </span>
            </div>
          </div>

          {/* 3. Package Service Protocols Breakdown */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold text-ink uppercase tracking-wider">
                Included Service Protocols ({pkg.services.length})
              </h4>
              <span className="text-xs text-[#5A2EA6] font-bold">
                Nominal Value: ₹{pkg.totalIndividualValue.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="space-y-2">
              {pkg.services.map((srv, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-white rounded-xl border border-purple-100 flex items-center justify-between"
                >
                  <div>
                    <strong className="text-ink text-xs block">{srv.serviceName}</strong>
                    <span className="text-[10px] text-muted">
                      {srv.category} · ₹{srv.individualPrice}/session
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded bg-purple-50 text-[#5A2EA6] font-bold text-[10px] block">
                      {srv.sessions} Total Sessions
                    </span>
                    <span className="text-[10px] text-soft font-serif mt-0.5 block">
                      ₹{(srv.sessions * srv.individualPrice).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Commercial Savings Breakdown */}
          <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 space-y-2">
            <h4 className="font-bold text-purple-900 text-xs uppercase tracking-wider">
              Savings &amp; Financial Ledger
            </h4>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-muted">
                <span>Total Individual Value:</span>
                <span className="text-ink font-semibold">
                  ₹{pkg.totalIndividualValue.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Package Selling Price:</span>
                <strong className="text-ink font-serif">
                  ₹{pkg.sellingPrice.toLocaleString('en-IN')}
                </strong>
              </div>
              <div className="flex justify-between text-muted">
                <span>Guest Savings Rate:</span>
                <strong className="text-emerald-700 font-bold">
                  ₹{pkg.savingsAmount.toLocaleString('en-IN')} ({pkg.savingsPercentage}% Off)
                </strong>
              </div>
              <div className="flex justify-between text-muted pt-1 border-t border-purple-100">
                <span className="font-bold text-ink">Outstanding Liability Value:</span>
                <strong className="text-[#5A2EA6] font-serif text-sm">
                  ₹{outstandingValue.toLocaleString('en-IN')}
                </strong>
              </div>
            </div>
          </div>

          {/* 5. Policy Rules */}
          <div className="p-4 rounded-2xl bg-white border border-purple-100 space-y-2">
            <h4 className="font-bold text-ink text-xs uppercase tracking-wider">
              Operational Redemption Policies
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[11.5px]">
              <span className="text-soft">
                Branch Scope: <strong>{pkg.branchAvailability.join(', ')}</strong>
              </span>
              <span className="text-soft">
                Transferable:{' '}
                <strong>{pkg.isTransferable ? 'Yes (Family Tier)' : 'Non-Transferable'}</strong>
              </span>
              <span className="text-soft">
                Partial Redemption:{' '}
                <strong>{pkg.allowPartialRedemption ? 'Allowed' : 'Single Session'}</strong>
              </span>
              <span className="text-soft">
                Refund Policy:{' '}
                <strong>{pkg.isRefundable ? 'Pro-Rata Basis' : 'Non-Refundable'}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Drawer Action Bar */}
        <div className="px-6 py-4 border-t border-purple-50 bg-white shrink-0 flex items-center justify-between">
          <button
            onClick={() => onToggleStatus(pkg)}
            className="h-9 px-3.5 rounded-xl text-xs font-bold text-soft bg-slate-100 hover:bg-slate-200 cursor-pointer border-0"
          >
            {pkg.status === 'Active' ? 'Deactivate Package' : 'Activate Package'}
          </button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => {
                toast(`Duplicated package "${pkg.name}".`);
              }}
              className="h-9 px-3.5 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/10 bg-white"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Duplicate</span>
            </Button>

            <Button
              onClick={() => {
                onClose();
                onEdit(pkg);
              }}
              className="h-9 px-4 rounded-xl text-xs font-bold bg-[#5A2EA6] hover:bg-[#4a2489] text-white"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Package</span>
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default PackageDetailsDrawer;
