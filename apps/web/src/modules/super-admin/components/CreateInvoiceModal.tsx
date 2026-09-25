import { Button } from '@salon-spa-saas/ui';
import { Download, FileText } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { useSuperAdminStore } from '../context/SuperAdminContext';
import { generateInvoicePDF } from '../utils/pdfGenerator';
import { BaseModal } from './BaseModal';

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({ isOpen, onClose }) => {
  const { addInvoice, tenants } = useSuperAdminStore();
  const [formData, setFormData] = useState({
    salon: tenants[0]?.name || 'Blush & Bloom Indrapuri',
    numericAmount: 12500,
    status: 'Paid' as 'Paid' | 'Pending',
    billingPeriod: 'August 2026',
    autoDownload: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.salon) return;

    const invoiceId = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const dateStr = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });

    addInvoice({
      salon: formData.salon,
      numericAmount: formData.numericAmount,
      status: formData.status,
      billingPeriod: formData.billingPeriod,
    });

    if (formData.autoDownload) {
      generateInvoicePDF({
        invoiceId,
        salon: formData.salon,
        amount: `₹${formData.numericAmount.toLocaleString('en-IN')}`,
        status: formData.status,
        date: dateStr,
        subtotal: formData.numericAmount,
        tax: Math.round(formData.numericAmount * 0.18),
        total: Math.round(formData.numericAmount * 1.18),
      });
    }

    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Platform Invoice"
      subtitle="Issue a manual tax invoice or subscription billing statement for a tenant"
      icon={<FileText className="w-5 h-5" />}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-soft mb-1.5">
            Select Salon / Tenant *
          </label>
          <select
            value={formData.salon}
            onChange={(e) => setFormData({ ...formData, salon: e.target.value })}
            className="w-full h-[40px] px-3.5 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
          >
            {tenants.map((t) => (
              <option key={t.id} value={t.name}>
                {t.name} ({t.city})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-soft mb-1.5">
              Base Amount (₹) *
            </label>
            <input
              type="number"
              required
              min="100"
              value={formData.numericAmount}
              onChange={(e) => setFormData({ ...formData, numericAmount: Number(e.target.value) })}
              className="w-full h-[40px] px-3.5 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-soft mb-1.5">
              Payment Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full h-[40px] px-3.5 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
            >
              <option value="Paid">Paid (Completed)</option>
              <option value="Pending">Pending (Unpaid)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-soft mb-1.5">
            Billing Cycle Period
          </label>
          <input
            type="text"
            placeholder="August 2026"
            value={formData.billingPeriod}
            onChange={(e) => setFormData({ ...formData, billingPeriod: e.target.value })}
            className="w-full h-[40px] px-3.5 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
          />
        </div>

        <div className="p-3.5 rounded-xl bg-[#F8F5FF] border border-[#5A2EA6]/15 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-[#5A2EA6]" />
            <span className="text-xs font-semibold text-ink">Auto-Download PDF Invoice</span>
          </div>
          <input
            type="checkbox"
            checked={formData.autoDownload}
            onChange={(e) => setFormData({ ...formData, autoDownload: e.target.checked })}
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
            Generate Invoice
          </Button>
        </div>
      </form>
    </BaseModal>
  );
};
