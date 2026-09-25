import { Button } from '@salon-spa-saas/ui';
import { Building, Layers, Mail, MapPin, Phone, UserCheck } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { useSuperAdminStore } from '../context/SuperAdminContext';
import { BaseModal } from './BaseModal';

interface ProvisionSalonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProvisionSalonModal: React.FC<ProvisionSalonModalProps> = ({ isOpen, onClose }) => {
  const { addTenant, subscriptionPlans, addInvoice } = useSuperAdminStore();
  const [formData, setFormData] = useState({
    name: '',
    city: 'Bhopal',
    region: 'Central India',
    selectedPlan: 'Standard Tier Plan',
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
    branchesCount: 1,
    roomCount: '4',
    chairCount: '8',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.ownerName) return;

    const selectedPlanObj = subscriptionPlans.find(
      (p) => p.name.toLowerCase() === formData.selectedPlan.toLowerCase() || p.id === formData.selectedPlan,
    ) || subscriptionPlans[0];

    const planPrice = selectedPlanObj?.numericPrice || 2500;
    const planName = selectedPlanObj?.name || formData.selectedPlan;

    addTenant({
      name: formData.name,
      city: formData.city,
      region: formData.region,
      activePlans: planName,
      ownerName: formData.ownerName,
      ownerEmail: formData.ownerEmail || 'owner@salon.com',
      ownerPhone: formData.ownerPhone || '+91 98000 00000',
      contactEmail: formData.ownerEmail || 'owner@salon.com',
      contactPhone: formData.ownerPhone || '+91 98000 00000',
      branchesCount: 1,
      branchesList: [`${formData.name} - Flagship Branch`],
      status: 'Active',
      revenue: `₹${(planPrice / 100000).toFixed(1)}L /mo`,
    });

    const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    addInvoice({
      invoiceId: invoiceNumber,
      salon: formData.name,
      numericAmount: planPrice,
      amount: `₹${planPrice.toLocaleString('en-IN')}`,
      status: 'Paid',
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      }),
      billingPeriod: `${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} (${planName})`,
    });

    onClose();
    setFormData({
      name: '',
      city: 'Bhopal',
      region: 'Central India',
      selectedPlan: 'Standard Tier Plan',
      ownerName: '',
      ownerEmail: '',
      ownerPhone: '',
      branchesCount: 1,
      roomCount: '4',
      chairCount: '8',
    });
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Provision New Tenant / Salon"
      subtitle="Register a new salon tenant account and assign master tenant owner credentials"
      icon={<Building className="w-5 h-5" />}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-soft mb-1.5">
              Salon / Tenant Brand Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Cut & Polish Salons"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full h-[40px] px-3.5 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-soft mb-1.5">
              Headquarters City Location *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Bhopal"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full h-[40px] px-3.5 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-soft mb-1.5">
              Tenant Owner Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Suresh Kumar"
              value={formData.ownerName}
              onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
              className="w-full h-[40px] px-3.5 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-soft mb-1.5">
              Owner Primary Email
            </label>
            <input
              type="email"
              placeholder="owner@salon.com"
              value={formData.ownerEmail}
              onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
              className="w-full h-[40px] px-3.5 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-soft mb-1.5">
              Owner Phone Contact
            </label>
            <input
              type="text"
              placeholder="+91 98000 00000"
              value={formData.ownerPhone}
              onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
              className="w-full h-[40px] px-3.5 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-soft mb-1.5">
              Subscription Plan Tier
            </label>
            <select
              value={formData.selectedPlan}
              onChange={(e) => setFormData({ ...formData, selectedPlan: e.target.value })}
              className="w-full h-[40px] px-3.5 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
            >
              {subscriptionPlans.map((plan) => (
                <option key={plan.id} value={plan.name}>
                  {plan.name} ({plan.price})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-soft mb-1.5">
              Operating Region
            </label>
            <select
              value={formData.region}
              onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              className="w-full h-[40px] px-3.5 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
            >
              <option value="Central India">Central India</option>
              <option value="West India">West India</option>
              <option value="North India">North India</option>
              <option value="South India">South India</option>
              <option value="International">International</option>
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
            Provision Tenant Account
          </Button>
        </div>
      </form>
    </BaseModal>
  );
};
