import { Button, cn } from '@salon-spa-saas/ui';
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
  ClipboardCheck,
  Download,
  FileSpreadsheet,
  FileText,
  Filter,
  History,
  Layers,
  Package,
  RotateCcw,
  Scissors,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Truck,
} from 'lucide-react';
import React, { useState } from 'react';

interface ReportTemplate {
  id: string;
  name: string;
  category: 'Stock' | 'Procurement' | 'Consumption' | 'Expiry' | 'Transfers' | 'Stocktake';
  description: string;
  dimensions: string[];
  sampleData: Record<string, any>[];
}

interface InventoryAlert {
  id: string;
  type:
    | 'Low Stock'
    | 'Out of Stock'
    | 'Expiring Soon'
    | 'Expired'
    | 'High Wastage'
    | 'High Consumption Variance'
    | 'Stocktake Variance'
    | 'Pending Purchase Order'
    | 'Delayed Purchase Receipt'
    | 'Pending Transfer';
  branch: string;
  product: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  date: string;
  description: string;
  status: 'Active' | 'Investigating' | 'Resolved';
  actionLabel: string;
}

interface InventoryAuditLog {
  id: string;
  user: string;
  userRole: string;
  module:
    | 'Products'
    | 'Stock'
    | 'Wastage'
    | 'Stocktake'
    | 'Transfers'
    | 'Procurement'
    | 'Consumption';
  action: string;
  record: string;
  oldValue: string;
  newValue: string;
  timestamp: string;
  reason: string;
  approver: string;
}

const mockReportCategories = [
  {
    id: 'stock',
    name: 'Stock Reports',
    icon: Layers,
    reports: [
      {
        id: 'rep-stock-01',
        name: 'Current Multi-Branch Stock Ledger',
        category: 'Stock' as const,
        description: 'Comprehensive inventory balance across all branches with FIFO valuations.',
        dimensions: [
          'Branch Location',
          'SKU Count',
          'Stock Units',
          'Valuation (Cost)',
          'Available Qty',
          'Reserved Qty',
        ],
        sampleData: [
          {
            'Branch Location': 'Indore Central Flagship',
            'SKU Count': '280 SKUs',
            'Stock Units': '4,620 pcs',
            'Valuation (Cost)': '₹9,85,000',
            'Available Qty': '4,550 pcs',
            'Reserved Qty': '70 pcs',
          },
          {
            'Branch Location': 'Vijay Nagar Boutique',
            'SKU Count': '245 SKUs',
            'Stock Units': '3,410 pcs',
            'Valuation (Cost)': '₹7,40,000',
            'Available Qty': '3,360 pcs',
            'Reserved Qty': '50 pcs',
          },
          {
            'Branch Location': 'Bhopal Arera Colony',
            'SKU Count': '210 SKUs',
            'Stock Units': '2,890 pcs',
            'Valuation (Cost)': '₹5,65,000',
            'Available Qty': '2,850 pcs',
            'Reserved Qty': '40 pcs',
          },
          {
            'Branch Location': 'Ujjain Mahakal Road',
            'SKU Count': '175 SKUs',
            'Stock Units': '2,120 pcs',
            'Valuation (Cost)': '₹3,20,000',
            'Available Qty': '2,100 pcs',
            'Reserved Qty': '20 pcs',
          },
          {
            'Branch Location': 'Gwalior City Centre',
            'SKU Count': '160 SKUs',
            'Stock Units': '1,810 pcs',
            'Valuation (Cost)': '₹2,40,000',
            'Available Qty': '1,800 pcs',
            'Reserved Qty': '10 pcs',
          },
        ],
      },
      {
        id: 'rep-stock-02',
        name: 'Stock Valuation & FIFO Assessment',
        category: 'Stock' as const,
        description: 'Audited inventory book value by master category and product lines.',
        dimensions: [
          'Category',
          'Active SKUs',
          'Total Units',
          'Average Unit Cost',
          'Total Valuation',
          'Portfolio Share',
        ],
        sampleData: [
          {
            Category: 'Hair Care & Retail',
            'Active SKUs': '140',
            'Total Units': '6,200 pcs',
            'Average Unit Cost': '₹1,240',
            'Total Valuation': '₹12,40,000',
            'Portfolio Share': '43.5%',
          },
          {
            Category: 'Colour & Chemical Consumables',
            'Active SKUs': '95',
            'Total Units': '4,800 pcs',
            'Average Unit Cost': '₹380',
            'Total Valuation': '₹7,20,000',
            'Portfolio Share': '25.3%',
          },
          {
            Category: 'Skin & Aesthetics Kits',
            'Active SKUs': '65',
            'Total Units': '2,450 pcs',
            'Average Unit Cost': '₹920',
            'Total Valuation': '₹5,75,000',
            'Portfolio Share': '20.2%',
          },
          {
            Category: 'Hair Treatments & Spa',
            'Active SKUs': '42',
            'Total Units': '1,400 pcs',
            'Average Unit Cost': '₹1,650',
            'Total Valuation': '₹3,15,000',
            'Portfolio Share': '11.0%',
          },
        ],
      },
    ],
  },
  {
    id: 'procurement',
    name: 'Procurement Reports',
    icon: Truck,
    reports: [
      {
        id: 'rep-proc-01',
        name: 'Vendor Purchase Spend & Fulfillment',
        category: 'Procurement' as const,
        description: 'Spend commitments by authorized salon brand suppliers and fulfillment rate.',
        dimensions: [
          'Supplier Name',
          'GSTIN',
          'Total POs',
          'Ordered Value',
          'Delivered Value',
          'Fulfillment Rate',
        ],
        sampleData: [
          {
            'Supplier Name': 'L’Oréal India Distribution Hub',
            GSTIN: '23AABCL1234F1ZX',
            'Total POs': '12 POs',
            'Ordered Value': '₹14,80,000',
            'Delivered Value': '₹14,80,000',
            'Fulfillment Rate': '100%',
          },
          {
            'Supplier Name': 'Luxury Beauty Brands LLP',
            GSTIN: '23AABCL9988H1ZR',
            'Total POs': '8 POs',
            'Ordered Value': '₹9,20,000',
            'Delivered Value': '₹8,80,000',
            'Fulfillment Rate': '95.6%',
          },
          {
            'Supplier Name': 'O3+ Direct Skin Care Supply',
            GSTIN: '23AABCO5566G1ZB',
            'Total POs': '6 POs',
            'Ordered Value': '₹6,40,000',
            'Delivered Value': '₹6,40,000',
            'Fulfillment Rate': '100%',
          },
        ],
      },
    ],
  },
  {
    id: 'consumption',
    name: 'Consumption Reports',
    icon: Scissors,
    reports: [
      {
        id: 'rep-csm-01',
        name: 'Service Recipe vs. Actual Consumption Variance',
        category: 'Consumption' as const,
        description:
          'Stylist backwash dispensing efficiency and chemical recipe variance analysis.',
        dimensions: [
          'Service Name',
          'Consumable Used',
          'Services Performed',
          'Expected BOM',
          'Actual Used',
          'Variance %',
          'Cost Impact',
        ],
        sampleData: [
          {
            'Service Name': 'Global Hair Colouring',
            'Consumable Used': 'Majirel Colour Tube',
            'Services Performed': '240',
            'Expected BOM': '12,000 ml',
            'Actual Used': '12,480 ml',
            'Variance %': '+4.0%',
            'Cost Impact': '₹3,264',
          },
          {
            'Service Name': 'Keratin Smoothing Treatment',
            'Consumable Used': 'Keratin Complex Infusion',
            'Services Performed': '65',
            'Expected BOM': '3,900 ml',
            'Actual Used': '4,450 ml',
            'Variance %': '+14.1%',
            'Cost Impact': '₹11,000',
          },
          {
            'Service Name': 'O3+ Seaweed Facial',
            'Consumable Used': 'Seaweed Single-Use Pods',
            'Services Performed': '110',
            'Expected BOM': '110 Kits',
            'Actual Used': '110 Kits',
            'Variance %': '0.0%',
            'Cost Impact': '₹0',
          },
        ],
      },
    ],
  },
  {
    id: 'expiry',
    name: 'Expiry Reports',
    icon: AlertTriangle,
    reports: [
      {
        id: 'rep-exp-01',
        name: 'Expiring Stock & Batch Risk Matrix',
        category: 'Expiry' as const,
        description: 'Batches approaching 30/60/90 day expiry thresholds across all branches.',
        dimensions: [
          'Product Name',
          'Batch Number',
          'Branch Location',
          'Stock Units',
          'Expiry Date',
          'Days to Expiry',
          'Valuation at Risk',
        ],
        sampleData: [
          {
            'Product Name': 'Majirel Hair Colour 6.13',
            'Batch Number': 'LOT-MAJ-871',
            'Branch Location': 'Vijay Nagar Boutique',
            'Stock Units': '18 tubes',
            'Expiry Date': '12 Sep 2026',
            'Days to Expiry': '25 Days',
            'Valuation at Risk': '₹6,120',
          },
          {
            'Product Name': 'Brazilian Blowout Spray',
            'Batch Number': 'LOT-BB-109',
            'Branch Location': 'Vijay Nagar Boutique',
            'Stock Units': '4 bottles',
            'Expiry Date': '01 Aug 2026',
            'Days to Expiry': '-17 Days (Expired)',
            'Valuation at Risk': '₹7,600',
          },
        ],
      },
    ],
  },
  {
    id: 'transfers',
    name: 'Transfer Reports',
    icon: RotateCcw,
    reports: [
      {
        id: 'rep-tr-01',
        name: 'Inter-Branch Stock Balancing Summary',
        category: 'Transfers' as const,
        description: 'Log of stock movements between network salon locations.',
        dimensions: [
          'Transfer ID',
          'Source Location',
          'Destination Location',
          'Dispatched Date',
          'Items Qty',
          'Transfer Valuation',
          'Status',
        ],
        sampleData: [
          {
            'Transfer ID': 'TR-2026-042',
            'Source Location': 'Indore Central',
            'Destination Location': 'Vijay Nagar',
            'Dispatched Date': '17 Aug 2026',
            'Items Qty': '24 pcs',
            'Transfer Valuation': '₹8,640',
            Status: 'In Transit',
          },
          {
            'Transfer ID': 'TR-2026-041',
            'Source Location': 'Indore Central',
            'Destination Location': 'Bhopal Arera Colony',
            'Dispatched Date': '15 Aug 2026',
            'Items Qty': '6 pcs',
            'Transfer Valuation': '₹5,700',
            Status: 'Received',
          },
        ],
      },
    ],
  },
  {
    id: 'stocktake',
    name: 'Stocktake Reports',
    icon: ClipboardCheck,
    reports: [
      {
        id: 'rep-stk-01',
        name: 'Monthly Physical Stocktake & Discrepancy Summary',
        category: 'Stocktake' as const,
        description: 'Consolidated cycle count discrepancy report with variance write-offs.',
        dimensions: [
          'Branch Name',
          'Audit Date',
          'Total SKUs',
          'Expected Book Qty',
          'Physical Count',
          'Net Variance',
          'Value Impact',
          'Compliance Status',
        ],
        sampleData: [
          {
            'Branch Name': 'Indore Central Flagship',
            'Audit Date': '12 Aug 2026',
            'Total SKUs': '280 SKUs',
            'Expected Book Qty': '4,640 pcs',
            'Physical Count': '4,620 pcs',
            'Net Variance': '-20 pcs (-0.43%)',
            'Value Impact': '-₹4,200',
            'Compliance Status': 'Compliant',
          },
          {
            'Branch Name': 'Vijay Nagar Boutique',
            'Audit Date': '10 Aug 2026',
            'Total SKUs': '245 SKUs',
            'Expected Book Qty': '3,435 pcs',
            'Physical Count': '3,410 pcs',
            'Net Variance': '-25 pcs (-0.72%)',
            'Value Impact': '-₹6,800',
            'Compliance Status': 'Compliant',
          },
          {
            'Branch Name': 'Bhopal Arera Colony',
            'Audit Date': '08 Aug 2026',
            'Total SKUs': '210 SKUs',
            'Expected Book Qty': '2,900 pcs',
            'Physical Count': '2,890 pcs',
            'Net Variance': '-10 pcs (-0.34%)',
            'Value Impact': '-₹2,850',
            'Compliance Status': 'Compliant',
          },
        ],
      },
    ],
  },
];

const mockAlerts: InventoryAlert[] = [
  {
    id: 'ALT-INV-001',
    type: 'Out of Stock',
    branch: 'Vijay Nagar Boutique',
    product: "L'Oréal Dia Richesse 6.13",
    severity: 'Critical',
    date: '18 Aug 2026',
    description: 'Zero units on shelf. 4 weekend client appointments mapped to this colour shade.',
    status: 'Active',
    actionLabel: 'Trigger Inter-Branch Transfer',
  },
  {
    id: 'ALT-INV-002',
    type: 'Expiring Soon',
    branch: 'Vijay Nagar Boutique',
    product: "L'Oréal Majirel Colour Tube (Lot 871)",
    severity: 'High',
    date: '18 Aug 2026',
    description:
      '18 tubes expiring in 25 days (Valuation ₹6,120). Recommend immediate stock transfer.',
    status: 'Active',
    actionLabel: 'Transfer to High-Volume Flagship',
  },
  {
    id: 'ALT-INV-003',
    type: 'High Consumption Variance',
    branch: 'Bhopal Arera Colony',
    product: 'Keratin Complex Smoothing Infusion',
    severity: 'Medium',
    date: '17 Aug 2026',
    description:
      '25% over-dispensing detected (+15ml variance per service). Stylist training flagged.',
    status: 'Active',
    actionLabel: 'Review Stylist Dispensing',
  },
  {
    id: 'ALT-INV-004',
    type: 'Stocktake Variance',
    branch: 'Ujjain Mahakal Road',
    product: 'Monthly Physical Cycle Count',
    severity: 'High',
    date: '14 Aug 2026',
    description: 'Discrepancy of -15 units (Valuation -₹4,100) awaiting Head Office authorization.',
    status: 'Active',
    actionLabel: 'Review & Authorize Adjustment',
  },
];

const mockAuditLogs: InventoryAuditLog[] = [
  {
    id: 'AUD-INV-9901',
    user: 'Aditya Pandey',
    userRole: 'Brand Owner',
    module: 'Stocktake',
    action: 'Stocktake Variance Sign-Off',
    record: 'STK-AUDIT-AUG26-02 (Vijay Nagar)',
    oldValue: 'Book Stock: 3,435 pcs',
    newValue: 'Adjusted Stock: 3,410 pcs (-25 pcs)',
    timestamp: '16 Aug 2026, 04:30 PM',
    reason: 'Approved write-off for 1 damaged shampoo and 4 backwash colour tubes.',
    approver: 'Aditya Pandey (Brand Owner)',
  },
  {
    id: 'AUD-INV-9902',
    user: 'Aditya Pandey',
    userRole: 'Brand Owner',
    module: 'Procurement',
    action: 'PO Official Authorization',
    record: 'PO-2026-0814 (L’Oréal Hub)',
    oldValue: 'Status: Pending Approval',
    newValue: 'Status: Ordered (₹1,34,520)',
    timestamp: '14 Aug 2026, 02:15 PM',
    reason: 'Monthly inventory replenishment cycle approved.',
    approver: 'Aditya Pandey (Brand Owner)',
  },
  {
    id: 'AUD-INV-9903',
    user: 'Kunal Sen',
    userRole: 'Floor Manager',
    module: 'Wastage',
    action: 'Wastage Loss Logged',
    record: 'ADJ-2026-019 (Moroccanoil)',
    oldValue: 'Stock: 13 pcs',
    newValue: 'Stock: 12 pcs (-1 pc)',
    timestamp: '16 Aug 2026, 06:00 PM',
    reason: 'Display glass breakage on retail floor.',
    approver: 'Aditya Pandey (Brand Owner)',
  },
  {
    id: 'AUD-INV-9904',
    user: 'Rohan Sharma',
    userRole: 'Master Stylist',
    module: 'Products',
    action: 'Service BOM Formula Update',
    record: 'REC-001 (Global Hair Colouring)',
    oldValue: 'BOM v2.1 (Developer 70ml)',
    newValue: 'BOM v2.2 (Developer 75ml)',
    timestamp: '10 Aug 2026, 05:20 PM',
    reason: 'Recalibrated developer ratio for thick hair lengths.',
    approver: 'Vikram Malhotra (Technical Director)',
  },
];

export function InventoryReportsTab() {
  const [activeSubTab, setActiveSubTab] = useState<'reports' | 'alerts' | 'audit'>('reports');
  const [selectedCategory, setSelectedCategory] = useState<string>('stock');
  const [selectedReportId, setSelectedReportId] = useState<string>('rep-stock-01');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('This Month');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const currentCategory =
    mockReportCategories.find((c) => c.id === selectedCategory) || mockReportCategories[0];
  const currentReport =
    currentCategory.reports.find((r) => r.id === selectedReportId) || currentCategory.reports[0];

  const handleExport = (format: string) => {
    showToast(`Exporting ${currentReport.name} in ${format} format...`);
  };

  const getSeverityBadge = (sev: InventoryAlert['severity']) => {
    switch (sev) {
      case 'Critical':
        return 'bg-red-100 text-red-900 border-red-300';
      case 'High':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'Medium':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-blue-50 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2D1552] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-purple-400/30 text-xs font-semibold animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Master Sub-Tab Switcher */}
      <div className="bg-white rounded-2xl p-4 border border-[#5A2EA6]/15 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-[#F8F5FF] p-1 rounded-xl border border-[#5A2EA6]/20">
          <button
            onClick={() => setActiveSubTab('reports')}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border-0 flex items-center gap-2',
              activeSubTab === 'reports'
                ? 'bg-[#5A2EA6] text-white shadow-xs'
                : 'text-soft hover:text-ink',
            )}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Inventory Reports Generator</span>
          </button>

          <button
            onClick={() => setActiveSubTab('alerts')}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border-0 flex items-center gap-2',
              activeSubTab === 'alerts'
                ? 'bg-[#5A2EA6] text-white shadow-xs'
                : 'text-soft hover:text-ink',
            )}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Inventory Risk Alerts</span>
            <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[9px] font-extrabold ml-0.5 whitespace-nowrap inline-flex items-center">
              {mockAlerts.filter((a) => a.status === 'Active').length} Active
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('audit')}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border-0 flex items-center gap-2',
              activeSubTab === 'audit'
                ? 'bg-[#5A2EA6] text-white shadow-xs'
                : 'text-soft hover:text-ink',
            )}
          >
            <History className="w-3.5 h-3.5" />
            <span>Immutable Inventory Audit Trail</span>
          </button>
        </div>

        {activeSubTab === 'reports' && (
          /* Multi-Format Export Buttons */
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => handleExport('CSV')}
              className="h-[36px] px-3 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#5A2EA6]" />
              <span>CSV</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => handleExport('Excel')}
              className="h-[36px] px-3 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Excel</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => handleExport('PDF')}
              className="h-[36px] px-3 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5 text-rose-600" />
              <span>PDF Walkthrough</span>
            </Button>
          </div>
        )}
      </div>

      {/* 2. SUB-VIEWS */}
      {activeSubTab === 'reports' && (
        /* SECTION 26: INVENTORY REPORTS GENERATOR */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Category List & Selector */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-2">
            <span className="text-[10px] text-muted font-bold uppercase tracking-wider block px-1">
              Report Categories (6)
            </span>

            <div className="space-y-1.5">
              {mockReportCategories.map((cat) => {
                const IconComponent = cat.icon;
                const isCatActive = selectedCategory === cat.id;

                return (
                  <div
                    key={cat.id}
                    className={cn(
                      'rounded-2xl p-3 border transition cursor-pointer',
                      isCatActive
                        ? 'bg-[#F8F5FF] border-[#5A2EA6] shadow-xs'
                        : 'bg-white border-[#5A2EA6]/10 hover:border-[#5A2EA6]/30',
                    )}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setSelectedReportId(cat.reports[0].id);
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            'w-7 h-7 rounded-lg grid place-items-center shrink-0',
                            isCatActive ? 'bg-[#5A2EA6] text-white' : 'bg-purple-50 text-[#5A2EA6]',
                          )}
                        >
                          <IconComponent className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-bold text-xs text-ink truncate">{cat.name}</span>
                      </div>
                      <span className="text-[9px] font-bold text-muted bg-white px-2 py-0.5 rounded-full border border-slate-100 shrink-0">
                        {cat.reports.length} Template{cat.reports.length > 1 ? 's' : ''}
                      </span>
                    </div>

                    {/* Nested Reports */}
                    {isCatActive && (
                      <div className="pt-2 mt-1 border-t border-purple-100/60 space-y-1">
                        {cat.reports.map((rep) => (
                          <button
                            key={rep.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedReportId(rep.id);
                            }}
                            className={cn(
                              'w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer border-0 flex items-center justify-between',
                              selectedReportId === rep.id
                                ? 'bg-[#5A2EA6] text-white font-bold shadow-xs'
                                : 'text-slate-700 hover:bg-purple-50',
                            )}
                          >
                            <span className="truncate">{rep.name}</span>
                            <ArrowRight className="w-3 h-3 shrink-0 ml-1 opacity-70" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Data Preview Canvas */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-4">
            <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
              {/* Header */}
              <div className="p-4 border-b border-[#5A2EA6]/10 flex flex-wrap items-center justify-between gap-3 bg-[#FCFAFF]">
                <div>
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-[#5A2EA6]" />
                    <h3 className="font-serif font-bold text-ink text-base">
                      {currentReport.name}
                    </h3>
                  </div>
                  <p className="text-[11px] text-muted mt-0.5">{currentReport.description}</p>
                </div>

                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                  Preview Generated
                </span>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] tracking-wider uppercase whitespace-nowrap">
                      {currentReport.dimensions.map((dim, i) => {
                        const isNum =
                          i > 0 &&
                          (dim.toLowerCase().includes('value') ||
                            dim.toLowerCase().includes('cost') ||
                            dim.toLowerCase().includes('rate') ||
                            dim.toLowerCase().includes('amount') ||
                            dim.toLowerCase().includes('pos') ||
                            dim.toLowerCase().includes('qty') ||
                            dim.toLowerCase().includes('units') ||
                            dim.toLowerCase().includes('count') ||
                            dim.toLowerCase().includes('share') ||
                            dim.toLowerCase().includes('impact') ||
                            dim.toLowerCase().includes('performed') ||
                            dim.includes('%'));

                        return (
                          <th
                            key={dim}
                            className={cn(
                              'p-3.5',
                              i === 0 ? 'pl-5 text-left' : '',
                              isNum ? 'text-right' : 'text-left',
                              i === currentReport.dimensions.length - 1 ? 'pr-5 text-right' : '',
                            )}
                          >
                            {dim}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#5A2EA6]/5 font-medium text-slate-700">
                    {currentReport.sampleData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-[#5A2EA6]/3 transition-colors">
                        {currentReport.dimensions.map((dim, cIdx) => {
                          const isNum =
                            cIdx > 0 &&
                            (dim.toLowerCase().includes('value') ||
                              dim.toLowerCase().includes('cost') ||
                              dim.toLowerCase().includes('rate') ||
                              dim.toLowerCase().includes('amount') ||
                              dim.toLowerCase().includes('pos') ||
                              dim.toLowerCase().includes('qty') ||
                              dim.toLowerCase().includes('units') ||
                              dim.toLowerCase().includes('count') ||
                              dim.toLowerCase().includes('share') ||
                              dim.toLowerCase().includes('impact') ||
                              dim.toLowerCase().includes('performed') ||
                              dim.includes('%'));

                          const val = (row as Record<string, any>)[dim];
                          const isValuation =
                            dim.toLowerCase().includes('valuation') ||
                            dim.toLowerCase().includes('value');

                          return (
                            <td
                              key={dim}
                              className={cn(
                                'p-3.5 whitespace-nowrap',
                                cIdx === 0 ? 'pl-5 font-bold text-ink text-left' : '',
                                isNum ? 'text-right' : 'text-left',
                                isValuation ? 'font-bold text-ink' : '',
                                cIdx === currentReport.dimensions.length - 1
                                  ? 'pr-5 text-right font-extrabold text-[#5A2EA6]'
                                  : '',
                              )}
                            >
                              {val}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footer Summary */}
              <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-soft">
                <span>
                  Parameters: <strong>{selectedDateRange}</strong> · Branch:{' '}
                  <strong>{selectedBranch}</strong>
                </span>
                <span className="text-[#5A2EA6] font-bold">100% Calculated &amp; Reconciled</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'alerts' && (
        /* SECTION 27: INVENTORY RISK ALERTS */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockAlerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-white rounded-2xl p-4 border border-[#5A2EA6]/15 shadow-xs flex flex-col justify-between hover:shadow-md transition"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span
                      className={cn(
                        'px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border whitespace-nowrap inline-flex items-center',
                        getSeverityBadge(alert.severity),
                      )}
                    >
                      {alert.severity} Risk
                    </span>
                    <span className="text-[10px] text-muted">{alert.date}</span>
                  </div>

                  <strong className="text-sm font-bold text-ink block leading-tight mb-1">
                    {alert.type}
                  </strong>
                  <span className="text-xs font-semibold text-[#5A2EA6] block mb-2">
                    {alert.branch}
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed mb-3">{alert.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-soft">{alert.product}</span>
                  <Button
                    variant="outline"
                    onClick={() => showToast(`Triggered: ${alert.actionLabel}`)}
                    className="h-[28px] px-2.5 rounded-lg text-[10px] font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5"
                  >
                    {alert.actionLabel}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'audit' && (
        /* SECTION 28: INVENTORY AUDIT TRAIL */
        <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#5A2EA6]/10 flex flex-wrap items-center justify-between gap-3 bg-[#FCFAFF]">
            <div>
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-[#5A2EA6]" />
                <h3 className="font-serif font-bold text-ink text-base">
                  Immutable Inventory Activity Audit Trail
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-extrabold whitespace-nowrap">
                  {mockAuditLogs.length} Audited Events
                </span>
              </div>
              <p className="text-[11px] text-muted mt-0.5">
                Statutory audit log of product updates, stock adjustments, wastage write-offs, and
                transfer approvals
              </p>
            </div>
            <span className="text-xs text-soft font-semibold">RBAC Traceability</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] tracking-wider uppercase whitespace-nowrap">
                  <th className="p-3.5 pl-5">Audit ID &amp; Timestamp</th>
                  <th className="p-3.5">User &amp; Role</th>
                  <th className="p-3.5">Module &amp; Action</th>
                  <th className="p-3.5">Target Record</th>
                  <th className="p-3.5">Old Value &rarr; New Value</th>
                  <th className="p-3.5">Justification Reason</th>
                  <th className="p-3.5 pr-5">Approver</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#5A2EA6]/5 font-medium text-slate-700">
                {mockAuditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#5A2EA6]/3 transition-colors">
                    <td className="p-3.5 pl-5 whitespace-nowrap">
                      <strong className="font-bold text-ink block text-xs">{log.id}</strong>
                      <span className="text-[10px] text-muted">{log.timestamp}</span>
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      <strong className="font-bold text-slate-900 block">{log.user}</strong>
                      <span className="text-[10px] text-soft">{log.userRole}</span>
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-50 text-[#5A2EA6] border border-purple-100 whitespace-nowrap shadow-3xs">
                        {log.module}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-800 mt-0.5 block">
                        {log.action}
                      </span>
                    </td>

                    <td className="p-3.5 font-mono text-slate-900 font-bold whitespace-nowrap">
                      {log.record}
                    </td>

                    <td className="p-3.5 text-[11px] whitespace-nowrap">
                      <span className="text-slate-400 block line-through">{log.oldValue}</span>
                      <strong className="text-emerald-700 font-bold block">{log.newValue}</strong>
                    </td>

                    <td className="p-3.5 text-slate-600 max-w-[220px]">
                      <span className="block truncate" title={log.reason}>
                        {log.reason}
                      </span>
                    </td>

                    <td className="p-3.5 pr-5 text-indigo-700 font-bold text-[11px] whitespace-nowrap">
                      {log.approver}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
