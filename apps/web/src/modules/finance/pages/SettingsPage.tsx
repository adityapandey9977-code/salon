import { useToast } from '@salon-spa-saas/ui';
import {
  Award,
  Building2,
  Check,
  CheckCircle,
  CheckCircle2,
  Coins,
  CreditCard,
  DollarSign,
  FileSpreadsheet,
  FileText,
  Globe,
  Landmark,
  Lock,
  MapPin,
  Save,
  Settings,
  ShieldCheck,
  Sliders,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import React, { useState } from 'react';
import { useFinanceBranch } from '../context/FinanceBranchContext';

export function SettingsPage() {
  const { toast } = useToast();
  const {
    branches,
    selectedBranchId,
    setSelectedBranchId,
    selectedBranch,
    isAllBranches,
    userRole,
  } = useFinanceBranch();

  const [activeTab, setActiveTab] = useState<
    'finance' | 'commission' | 'payroll' | 'components' | 'tax' | 'payments' | 'settlement' | 'rbac'
  >('finance');

  // 1. FINANCE SETTINGS STATE
  const [financeConfig, setFinanceConfig] = useState({
    currency: 'INR (₹)',
    fyCycle: 'April 1 - March 31',
    receiptPrefix: 'REC-',
    invoicePrefix: 'INV-',
    autoVoidWindow: '24 Hours',
    roundOffMethod: 'Nearest Rupee',
  });

  // 2. COMMISSION RULES STATE
  const [commissionConfig, setCommissionConfig] = useState({
    serviceCommissionRate: '10.0',
    retailCommissionRate: '12.0',
    packageCommissionRate: '8.0',
    targetBonusAmount: '5000',
    targetSalesThreshold: '450000',
    ruleStructure: 'Tiered Slabs',
  });

  // 3. PAYROLL SETTINGS STATE
  const [payrollConfig, setPayrollConfig] = useState({
    disbursalDay: '1st of Every Month',
    payCyclePeriod: 'Monthly (1st to 31st)',
    overtimeMultiplier: '1.5x Hourly Rate',
    lopCalculationBasis: '1 / 30th of Base Salary',
    autoApproveThreshold: '₹50,000.00',
  });

  // 4. SALARY COMPONENTS CONFIG (10 PRD Components)
  const [salaryComponents] = useState([
    { name: '1. Basic Pay', type: 'Earnings', calc: 'Fixed (Base Monthly Pay)', status: 'Active' },
    { name: '2. HRA (House Rent)', type: 'Earnings', calc: '40% of Basic Pay', status: 'Active' },
    {
      name: '3. Travel Allowance',
      type: 'Earnings',
      calc: 'Fixed Monthly Conveyance',
      status: 'Active',
    },
    {
      name: '4. Incentive Commission',
      type: 'Earnings',
      calc: 'Computed via Commission Engine',
      status: 'Active',
    },
    {
      name: '5. Target Bonus',
      type: 'Earnings',
      calc: 'Milestone Bonus on Target',
      status: 'Active',
    },
    {
      name: '6. PF (Provident Fund)',
      type: 'Deductions',
      calc: '12% of Basic Pay (Statutory)',
      status: 'Active',
    },
    {
      name: '7. ESI Insurance',
      type: 'Deductions',
      calc: '0.75% of Gross Pay (Statutory)',
      status: 'Active',
    },
    {
      name: '8. Professional Tax (PT)',
      type: 'Deductions',
      calc: 'State Specific Slab (₹200/mo)',
      status: 'Active',
    },
    {
      name: '9. TDS Income Tax (192)',
      type: 'Deductions',
      calc: 'Computed as per Income Tax Slabs',
      status: 'Active',
    },
    {
      name: '10. Staff Loan / Advance',
      type: 'Deductions',
      calc: 'Monthly EMI Adjustment',
      status: 'Active',
    },
  ]);

  // 5. TAX CONFIGURATION STATE
  const [taxConfig, setTaxConfig] = useState({
    gstRate: '18.0',
    cgstRate: '9.0',
    sgstRate: '9.0',
    serviceSac: '999721 (Salon & Spa Services)',
    productHsn: '3305 / 3304 (Retail Cosmetics)',
    tdsProfessionalRate: '10.0',
    panMandatoryThreshold: '₹50,000.00',
    form16AutoGenerate: 'Enabled',
  });

  // 6. PAYMENT METHODS STATE
  const [paymentMethods, setPaymentMethods] = useState([
    {
      name: 'Cash Collections',
      category: 'Physical Cash',
      gateway: 'Internal Cash Drawer',
      status: 'Enabled',
    },
    {
      name: 'Card (Credit/Debit)',
      category: 'Card POS',
      gateway: 'PineLabs POS Terminal',
      status: 'Enabled',
    },
    {
      name: 'UPI (QR & Intent)',
      category: 'Digital UPI',
      gateway: 'Razorpay / PhonePe QR',
      status: 'Enabled',
    },
    {
      name: 'Digital Salon Wallet',
      category: 'Prepaid Wallet',
      gateway: 'Internal Wallet Engine',
      status: 'Enabled',
    },
    {
      name: 'Gift Voucher Card',
      category: 'Prepaid Card',
      gateway: 'Internal Gift Card Engine',
      status: 'Enabled',
    },
    {
      name: 'Direct Bank Transfer',
      category: 'Bank Deposit',
      gateway: 'HDFC Corporate Banking',
      status: 'Enabled',
    },
  ]);

  // 7. SETTLEMENT RULES STATE
  const [settlementConfig, setSettlementConfig] = useState({
    closingCutoffTime: '10:00 PM Daily',
    drawerVarianceTolerance: '₹500.00',
    autoBankPayoutTrigger: '₹50,000.00',
    payoutFrequency: 'Daily T+1 Settlement',
    reconciliationMode: 'Automated 3-Way Match',
  });

  const handleSaveSettings = (sectionName: string) => {
    toast(`Finance Settings Saved: Updated ${sectionName} for ${selectedBranch.shortName}.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-ink tracking-tight">
              Finance, Tax &amp; Accounting Settings
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
              {isAllBranches ? (
                <Globe className="w-3 h-3 text-purple-700" />
              ) : (
                <Building2 className="w-3 h-3 text-purple-700" />
              )}
              {isAllBranches ? 'Chain Enterprise Master' : `${selectedBranch.shortName}`}
            </span>
          </div>
          <p className="text-xs text-soft mt-1">
            Configure Chart of Accounts, GST SAC/HSN codes, tiered stylist commission rules, 10
            salary components, and payment gateways.
          </p>
        </div>
      </div>

      {/* TABS */}
      <div className="flex overflow-x-auto gap-2 border-b border-line pb-2 no-scrollbar">
        {[
          { id: 'finance', label: 'General Finance' },
          { id: 'commission', label: 'Commission Rules' },
          { id: 'payroll', label: 'Payroll Rules' },
          { id: 'components', label: '10 Salary Components' },
          { id: 'tax', label: 'GST & Statutory Tax' },
          { id: 'payments', label: 'Payment Gateways' },
          { id: 'settlement', label: 'Settlement & Drawer' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-white text-soft hover:text-ink border border-line'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: GENERAL FINANCE */}
      {activeTab === 'finance' && (
        <div className="bg-white p-5 rounded-2xl border border-line shadow-sm space-y-4 max-w-3xl">
          <h3 className="font-bold text-sm text-ink">General Ledger &amp; Currency Rules</h3>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-soft uppercase mb-1">
                Base Currency
              </label>
              <input
                type="text"
                disabled
                value={financeConfig.currency}
                className="w-full p-2.5 bg-pine/5 border border-line rounded-xl font-bold text-ink"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-soft uppercase mb-1">
                Financial Year Cycle
              </label>
              <input
                type="text"
                value={financeConfig.fyCycle}
                onChange={(e) => setFinanceConfig({ ...financeConfig, fyCycle: e.target.value })}
                className="w-full p-2.5 bg-white border border-line rounded-xl font-semibold text-ink"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-soft uppercase mb-1">
                Receipt Number Prefix
              </label>
              <input
                type="text"
                value={financeConfig.receiptPrefix}
                onChange={(e) =>
                  setFinanceConfig({ ...financeConfig, receiptPrefix: e.target.value })
                }
                className="w-full p-2.5 bg-white border border-line rounded-xl font-mono text-purple-900 font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-soft uppercase mb-1">
                Invoice Number Prefix
              </label>
              <input
                type="text"
                value={financeConfig.invoicePrefix}
                onChange={(e) =>
                  setFinanceConfig({ ...financeConfig, invoicePrefix: e.target.value })
                }
                className="w-full p-2.5 bg-white border border-line rounded-xl font-mono text-purple-900 font-bold"
              />
            </div>
          </div>
          <button
            onClick={() => handleSaveSettings('General Finance')}
            className="px-5 py-2 bg-[#5A2EA6] hover:bg-[#482387] text-white text-xs font-bold rounded-xl shadow cursor-pointer border-0"
          >
            Save General Finance
          </button>
        </div>
      )}

      {/* TAB 2: COMMISSION RULES */}
      {activeTab === 'commission' && (
        <div className="bg-white p-5 rounded-2xl border border-line shadow-sm space-y-4 max-w-3xl">
          <h3 className="font-bold text-sm text-ink">Stylist Commission Engine Parameters</h3>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-soft uppercase mb-1">
                Service Commission Base Rate (%)
              </label>
              <input
                type="text"
                value={commissionConfig.serviceCommissionRate}
                onChange={(e) =>
                  setCommissionConfig({
                    ...commissionConfig,
                    serviceCommissionRate: e.target.value,
                  })
                }
                className="w-full p-2.5 bg-white border border-line rounded-xl font-bold text-purple-900"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-soft uppercase mb-1">
                Retail Product Commission Rate (%)
              </label>
              <input
                type="text"
                value={commissionConfig.retailCommissionRate}
                onChange={(e) =>
                  setCommissionConfig({ ...commissionConfig, retailCommissionRate: e.target.value })
                }
                className="w-full p-2.5 bg-white border border-line rounded-xl font-bold text-emerald-800"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-soft uppercase mb-1">
                Package Sales Incentive (%)
              </label>
              <input
                type="text"
                value={commissionConfig.packageCommissionRate}
                onChange={(e) =>
                  setCommissionConfig({
                    ...commissionConfig,
                    packageCommissionRate: e.target.value,
                  })
                }
                className="w-full p-2.5 bg-white border border-line rounded-xl font-bold text-ink"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-soft uppercase mb-1">
                Monthly Target Bonus (₹)
              </label>
              <input
                type="text"
                value={commissionConfig.targetBonusAmount}
                onChange={(e) =>
                  setCommissionConfig({ ...commissionConfig, targetBonusAmount: e.target.value })
                }
                className="w-full p-2.5 bg-white border border-line rounded-xl font-bold text-ink"
              />
            </div>
          </div>
          <button
            onClick={() => handleSaveSettings('Commission Rules')}
            className="px-5 py-2 bg-[#5A2EA6] hover:bg-[#482387] text-white text-xs font-bold rounded-xl shadow cursor-pointer border-0"
          >
            Save Commission Rules
          </button>
        </div>
      )}

      {/* TAB 4: 10 SALARY COMPONENTS */}
      {activeTab === 'components' && (
        <div className="bg-white p-5 rounded-2xl border border-line shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-sm text-ink">10 Standard Salary Components Structure</h3>
            <p className="text-xs text-soft">
              Statutory earnings and deduction mappings for monthly payroll
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-pine/5 text-soft uppercase tracking-wider font-semibold border-b border-line">
                  <th className="p-2.5">Component Name</th>
                  <th className="p-2.5">Category</th>
                  <th className="p-2.5">Calculation Rule</th>
                  <th className="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/40">
                {salaryComponents.map((c, idx) => (
                  <tr key={idx} className="hover:bg-purple-50/30">
                    <td className="p-2.5 font-bold text-ink">{c.name}</td>
                    <td className="p-2.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          c.type === 'Earnings'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {c.type}
                      </span>
                    </td>
                    <td className="p-2.5 font-medium text-soft">{c.calc}</td>
                    <td className="p-2.5 font-bold text-emerald-700">{c.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: GST TAX */}
      {activeTab === 'tax' && (
        <div className="bg-white p-5 rounded-2xl border border-line shadow-sm space-y-4 max-w-3xl">
          <h3 className="font-bold text-sm text-ink">
            Indian GST &amp; Statutory Tax Configuration
          </h3>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-soft uppercase mb-1">
                Standard GST Rate (%)
              </label>
              <input
                type="text"
                value={taxConfig.gstRate}
                onChange={(e) => setTaxConfig({ ...taxConfig, gstRate: e.target.value })}
                className="w-full p-2.5 bg-white border border-line rounded-xl font-bold text-purple-900"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-soft uppercase mb-1">
                Service SAC Code
              </label>
              <input
                type="text"
                value={taxConfig.serviceSac}
                onChange={(e) => setTaxConfig({ ...taxConfig, serviceSac: e.target.value })}
                className="w-full p-2.5 bg-white border border-line rounded-xl font-mono text-ink font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-soft uppercase mb-1">
                Retail Product HSN Code
              </label>
              <input
                type="text"
                value={taxConfig.productHsn}
                onChange={(e) => setTaxConfig({ ...taxConfig, productHsn: e.target.value })}
                className="w-full p-2.5 bg-white border border-line rounded-xl font-mono text-ink font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-soft uppercase mb-1">
                TDS Professional Services Rate (%)
              </label>
              <input
                type="text"
                value={taxConfig.tdsProfessionalRate}
                onChange={(e) =>
                  setTaxConfig({ ...taxConfig, tdsProfessionalRate: e.target.value })
                }
                className="w-full p-2.5 bg-white border border-line rounded-xl font-bold text-ink"
              />
            </div>
          </div>
          <button
            onClick={() => handleSaveSettings('GST Tax')}
            className="px-5 py-2 bg-[#5A2EA6] hover:bg-[#482387] text-white text-xs font-bold rounded-xl shadow cursor-pointer border-0"
          >
            Save Tax Configuration
          </button>
        </div>
      )}

      {/* TAB 6: PAYMENTS */}
      {activeTab === 'payments' && (
        <div className="bg-white p-5 rounded-2xl border border-line shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-sm text-ink">Accepted Payment Tenders &amp; Gateways</h3>
            <p className="text-xs text-soft">
              Multi-tender collection setup across POS, UPI QR, and online gateways
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-pine/5 text-soft uppercase tracking-wider font-semibold border-b border-line">
                  <th className="p-2.5">Payment Method</th>
                  <th className="p-2.5">Category</th>
                  <th className="p-2.5">Gateway Provider</th>
                  <th className="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/40">
                {paymentMethods.map((m, idx) => (
                  <tr key={idx} className="hover:bg-purple-50/30">
                    <td className="p-2.5 font-bold text-ink">{m.name}</td>
                    <td className="p-2.5 text-soft">{m.category}</td>
                    <td className="p-2.5 font-semibold text-purple-900">{m.gateway}</td>
                    <td className="p-2.5 font-bold text-emerald-700">{m.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 7: SETTLEMENT & DRAWER */}
      {activeTab === 'settlement' && (
        <div className="bg-white p-5 rounded-2xl border border-line shadow-sm space-y-4 max-w-3xl">
          <h3 className="font-bold text-sm text-ink">
            Cash Drawer Closeout &amp; Settlement Tolerance
          </h3>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-soft uppercase mb-1">
                Daily EOD Closing Cutoff
              </label>
              <input
                type="text"
                value={settlementConfig.closingCutoffTime}
                onChange={(e) =>
                  setSettlementConfig({ ...settlementConfig, closingCutoffTime: e.target.value })
                }
                className="w-full p-2.5 bg-white border border-line rounded-xl font-semibold text-ink"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-soft uppercase mb-1">
                Drawer Variance Tolerance (₹)
              </label>
              <input
                type="text"
                value={settlementConfig.drawerVarianceTolerance}
                onChange={(e) =>
                  setSettlementConfig({
                    ...settlementConfig,
                    drawerVarianceTolerance: e.target.value,
                  })
                }
                className="w-full p-2.5 bg-white border border-line rounded-xl font-bold text-amber-800"
              />
            </div>
          </div>
          <button
            onClick={() => handleSaveSettings('Settlement Rules')}
            className="px-5 py-2 bg-[#5A2EA6] hover:bg-[#482387] text-white text-xs font-bold rounded-xl shadow cursor-pointer border-0"
          >
            Save Settlement Rules
          </button>
        </div>
      )}
    </div>
  );
}
