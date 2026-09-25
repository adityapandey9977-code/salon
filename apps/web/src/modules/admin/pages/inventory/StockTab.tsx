import { Button, cn } from '@salon-spa-saas/ui';
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  Filter,
  History,
  Hourglass,
  Layers,
  MinusCircle,
  Package,
  Plus,
  PlusCircle,
  RotateCcw,
  Search,
  ShieldAlert,
  TrendingDown,
  TrendingUp,
  XCircle,
} from 'lucide-react';
import React, { useState } from 'react';
import { AddMasterSkuModal } from './AddMasterSkuModal';
import type { ProductItem } from './ProductsConsumablesTab';

// Mock Stock Record
interface StockRecord {
  id: string;
  productName: string;
  sku: string;
  branch: string;
  branchId: string;
  category: string;
  batchNumber: string;
  availableQty: number;
  reservedQty: number;
  damagedQty: number;
  totalQty: number;
  unit: string;
  costPrice: string;
  stockValue: string;
  expiryDate: string;
  daysToExpiry: number;
  status: 'Healthy' | 'Low Stock' | 'Out of Stock' | 'Expiring Soon' | 'Expired' | 'Blocked';
  ageBucket: '0-30 Days' | '31-60 Days' | '61-90 Days' | '91-180 Days' | '180+ Days';
  isSlowMoving: boolean;
}

// Mock Stock Movement Log
interface StockMovementLog {
  id: string;
  date: string;
  productName: string;
  branch: string;
  movementType:
    | 'Purchase Receipt'
    | 'Branch Transfer'
    | 'Service Consumption'
    | 'Retail Sale'
    | 'Retail Return'
    | 'Wastage'
    | 'Adjustment'
    | 'Stocktake Adjustment';
  quantityChange: number; // positive or negative
  unit: string;
  reference: string;
  user: string;
  runningBalance: number;
  status: 'Completed' | 'Pending Verification';
}

const mockStockRecords: StockRecord[] = [
  {
    id: 'STK-001',
    productName: "L'Oréal Professionnel Serie Expert Absolut Repair Shampoo",
    sku: 'SKU-LOR-001',
    branch: 'Indore Central Flagship',
    branchId: 'BR-01',
    category: 'Hair Care',
    batchNumber: 'LOT-LOR-2601',
    availableQty: 65,
    reservedQty: 5,
    damagedQty: 0,
    totalQty: 70,
    unit: 'Bottle',
    costPrice: '₹850',
    stockValue: '₹59,500',
    expiryDate: '15 Mar 2028',
    daysToExpiry: 574,
    status: 'Healthy',
    ageBucket: '0-30 Days',
    isSlowMoving: false,
  },
  {
    id: 'STK-002',
    productName: "L'Oréal Majirel Permanent Hair Colour Tube - 6.13",
    sku: 'SKU-MAJ-613',
    branch: 'Vijay Nagar Boutique',
    branchId: 'BR-02',
    category: 'Colour & Chemical',
    batchNumber: 'LOT-MAJ-871',
    availableQty: 4,
    reservedQty: 2,
    damagedQty: 0,
    totalQty: 6,
    unit: 'Tube',
    costPrice: '₹340',
    stockValue: '₹2,040',
    expiryDate: '12 Sep 2026',
    daysToExpiry: 25,
    status: 'Expiring Soon',
    ageBucket: '91-180 Days',
    isSlowMoving: false,
  },
  {
    id: 'STK-003',
    productName: 'O3+ Seaweed Facial Kit (Single Use Pods)',
    sku: 'SKU-O3-SEA01',
    branch: 'Bhopal Arera Colony',
    branchId: 'BR-03',
    category: 'Skin & Aesthetics',
    batchNumber: 'LOT-O3-8812',
    availableQty: 5,
    reservedQty: 1,
    damagedQty: 0,
    totalQty: 6,
    unit: 'Kit',
    costPrice: '₹950',
    stockValue: '₹5,700',
    expiryDate: '24 Jun 2027',
    daysToExpiry: 310,
    status: 'Low Stock',
    ageBucket: '31-60 Days',
    isSlowMoving: false,
  },
  {
    id: 'STK-004',
    productName: "Kérastase Elixir Ultime L'Huile Originale (100ml)",
    sku: 'SKU-KER-OIL01',
    branch: 'Indore Central Flagship',
    branchId: 'BR-01',
    category: 'Hair Care',
    batchNumber: 'LOT-KER-019',
    availableQty: 28,
    reservedQty: 2,
    damagedQty: 0,
    totalQty: 30,
    unit: 'Bottle',
    costPrice: '₹2,400',
    stockValue: '₹72,000',
    expiryDate: '18 Nov 2028',
    daysToExpiry: 822,
    status: 'Healthy',
    ageBucket: '0-30 Days',
    isSlowMoving: false,
  },
  {
    id: 'STK-005',
    productName: "L'Oréal Oxydant Crème Developer 20 Vol (6%) 1000ml",
    sku: 'SKU-LOR-DEV20',
    branch: 'Ujjain Mahakal Road',
    branchId: 'BR-04',
    category: 'Colour & Chemical',
    batchNumber: 'LOT-DEV-190',
    availableQty: 0,
    reservedQty: 0,
    damagedQty: 0,
    totalQty: 0,
    unit: 'Bottle',
    costPrice: '₹420',
    stockValue: '₹0',
    expiryDate: '10 Aug 2026',
    daysToExpiry: -8,
    status: 'Out of Stock',
    ageBucket: '180+ Days',
    isSlowMoving: true,
  },
  {
    id: 'STK-006',
    productName: 'Moroccanoil Luminous Hairspray Medium (330ml)',
    sku: 'SKU-MOR-SPR01',
    branch: 'Gwalior City Centre',
    branchId: 'BR-05',
    category: 'Hair Care',
    batchNumber: 'LOT-MOR-552',
    availableQty: 12,
    reservedQty: 0,
    damagedQty: 1,
    totalQty: 13,
    unit: 'Can',
    costPrice: '₹1,650',
    stockValue: '₹21,450',
    expiryDate: '04 Apr 2027',
    daysToExpiry: 229,
    status: 'Healthy',
    ageBucket: '61-90 Days',
    isSlowMoving: true,
  },
  {
    id: 'STK-007',
    productName: 'Brazilian Blowout Ionic Bonding Spray (100ml)',
    sku: 'SKU-BB-BOND',
    branch: 'Vijay Nagar Boutique',
    branchId: 'BR-02',
    category: 'Hair Treatments',
    batchNumber: 'LOT-BB-109',
    availableQty: 2,
    reservedQty: 0,
    damagedQty: 2,
    totalQty: 4,
    unit: 'Bottle',
    costPrice: '₹1,900',
    stockValue: '₹7,600',
    expiryDate: '01 Aug 2026',
    daysToExpiry: -17,
    status: 'Expired',
    ageBucket: '180+ Days',
    isSlowMoving: true,
  },
];

const mockMovements: StockMovementLog[] = [
  {
    id: 'MOV-8801',
    date: '18 Aug 2026, 02:45 PM',
    productName: "L'Oréal Professionnel Absolut Repair Shampoo (500ml)",
    branch: 'Indore Central Flagship',
    movementType: 'Retail Sale',
    quantityChange: -1,
    unit: 'Bottle',
    reference: 'INV-2026-0812 (POS Bill)',
    user: 'Deepak Verma (Cashier)',
    runningBalance: 65,
    status: 'Completed',
  },
  {
    id: 'MOV-8802',
    date: '18 Aug 2026, 11:30 AM',
    productName: "L'Oréal Majirel Colour Tube - 6.13",
    branch: 'Vijay Nagar Boutique',
    movementType: 'Service Consumption',
    quantityChange: -1,
    unit: 'Tube',
    reference: 'APT-9041 (Global Hair Colour)',
    user: 'Rohan Sharma (Stylist)',
    runningBalance: 4,
    status: 'Completed',
  },
  {
    id: 'MOV-8803',
    date: '17 Aug 2026, 04:15 PM',
    productName: "L'Oréal Oxydant Developer 20 Vol 1000ml",
    branch: 'Indore Central Flagship',
    movementType: 'Purchase Receipt',
    quantityChange: 24,
    unit: 'Bottle',
    reference: 'GRN-2026-109 (PO-LOR-441)',
    user: 'Sunil Rao (Storekeeper)',
    runningBalance: 32,
    status: 'Completed',
  },
  {
    id: 'MOV-8804',
    date: '17 Aug 2026, 01:20 PM',
    productName: 'O3+ Seaweed Facial Kit (Single Use Pods)',
    branch: 'Bhopal Arera Colony',
    movementType: 'Branch Transfer',
    quantityChange: +6,
    unit: 'Kit',
    reference: 'TR-2026-042 (From Indore Central)',
    user: 'Kavita Nair (Branch Manager)',
    runningBalance: 5,
    status: 'Completed',
  },
  {
    id: 'MOV-8805',
    date: '16 Aug 2026, 06:00 PM',
    productName: 'Moroccanoil Treatment Original (100ml)',
    branch: 'Vijay Nagar Boutique',
    movementType: 'Wastage',
    quantityChange: -1,
    unit: 'Bottle',
    reference: 'ADJ-2026-019 (Broken on Display)',
    user: 'Kunal Sen (Floor Mgr)',
    runningBalance: 12,
    status: 'Completed',
  },
  {
    id: 'MOV-8806',
    date: '15 Aug 2026, 07:30 PM',
    productName: 'Kérastase Elixir Ultime Hair Oil (100ml)',
    branch: 'Indore Central Flagship',
    movementType: 'Retail Return',
    quantityChange: +1,
    unit: 'Bottle',
    reference: 'RET-2026-004 (Unopened Return)',
    user: 'Deepak Verma (Cashier)',
    runningBalance: 28,
    status: 'Completed',
  },
  {
    id: 'MOV-8807',
    date: '14 Aug 2026, 09:00 PM',
    productName: "L'Oréal Majirel Colour Tube - 6.13",
    branch: 'Ujjain Mahakal Road',
    movementType: 'Stocktake Adjustment',
    quantityChange: -2,
    unit: 'Tube',
    reference: 'STK-AUDIT-AUG26 (Variance Reconciled)',
    user: 'Aditya Pandey (Admin)',
    runningBalance: 8,
    status: 'Completed',
  },
];

export interface StockTabProps {
  defaultBranch?: string;
  lockBranch?: boolean;
}

export function StockTab({ defaultBranch = 'all', lockBranch = false }: StockTabProps = {}) {
  const [stockList, setStockList] = useState<StockRecord[]>(mockStockRecords);
  const [movementsList, setMovementsList] = useState<StockMovementLog[]>(mockMovements);
  const [activeSubTab, setActiveSubTab] = useState<'central' | 'movements' | 'batches' | 'ageing'>(
    'central',
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState(defaultBranch);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedExpiryFilter, setSelectedExpiryFilter] = useState('all');
  const [selectedAgeBucket, setSelectedAgeBucket] = useState('all');
  const [isAddStockOpen, setIsAddStockOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveInwardStock = (
    product: ProductItem,
    branchAllocations: Record<string, number>,
  ) => {
    const newRecords: StockRecord[] = [];
    const newMovements: StockMovementLog[] = [];

    Object.entries(branchAllocations).forEach(([branchName, qty], idx) => {
      if (qty > 0) {
        const branchId = `BR-0${(idx % 6) + 1}`;
        newRecords.push({
          id: `STK-${Date.now().toString().slice(-4)}-${idx}`,
          productName: product.name,
          sku: product.sku,
          branch: branchName,
          branchId,
          category: product.category,
          batchNumber: product.batches[0]?.batchNumber || 'LOT-2026-01',
          availableQty: qty,
          reservedQty: 0,
          damagedQty: 0,
          totalQty: qty,
          unit: product.unit.split(' ')[0] || 'Unit',
          costPrice: product.costPrice,
          stockValue: `₹${((Number.parseFloat(product.costPrice.replace(/[^\d.]/g, '')) || 0) * qty).toLocaleString('en-IN')}`,
          expiryDate: product.batches[0]?.expiryDate || '15 Mar 2028',
          daysToExpiry: 720,
          status: 'Healthy',
          ageBucket: '0-30 Days',
          isSlowMoving: false,
        });

        newMovements.push({
          id: `MOV-${Date.now().toString().slice(-4)}-${idx}`,
          date: 'Just Now',
          productName: product.name,
          branch: branchName,
          movementType: 'Purchase Receipt',
          quantityChange: qty,
          unit: product.unit.split(' ')[0] || 'Unit',
          reference: `GRN-INTAKE (${product.sku})`,
          user: 'Master Admin HQ',
          runningBalance: qty,
          status: 'Completed',
        });
      }
    });

    setStockList((prev) => [...newRecords, ...prev]);
    setMovementsList((prev) => [...newMovements, ...prev]);
    showToast(
      `Inwarded ${product.currentStock} units of "${product.name}" across ${newRecords.length} salon branches.`,
    );
  };

  // Filter Central Stock
  const filteredStock = stockList.filter((s) => {
    if (selectedBranch !== 'all' && s.branchId !== selectedBranch) return false;
    if (selectedCategory !== 'all' && s.category !== selectedCategory) return false;
    if (selectedStatus !== 'all' && s.status !== selectedStatus) return false;
    if (
      activeSubTab === 'ageing' &&
      selectedAgeBucket !== 'all' &&
      s.ageBucket !== selectedAgeBucket
    )
      return false;
    if (activeSubTab === 'batches' && selectedExpiryFilter !== 'all') {
      if (selectedExpiryFilter === '7' && s.daysToExpiry > 7) return false;
      if (selectedExpiryFilter === '15' && s.daysToExpiry > 15) return false;
      if (selectedExpiryFilter === '30' && s.daysToExpiry > 30) return false;
      if (selectedExpiryFilter === '60' && s.daysToExpiry > 60) return false;
      if (selectedExpiryFilter === '90' && s.daysToExpiry > 90) return false;
      if (selectedExpiryFilter === 'Expired' && s.daysToExpiry >= 0) return false;
    }
    if (searchTerm) {
      const match = `${s.productName} ${s.sku} ${s.batchNumber} ${s.branch}`.toLowerCase();
      return match.includes(searchTerm.toLowerCase());
    }
    return true;
  });

  // Filter Movements
  const filteredMovements = movementsList.filter((m) => {
    if (searchTerm) {
      const match = `${m.productName} ${m.reference} ${m.user} ${m.movementType}`.toLowerCase();
      return match.includes(searchTerm.toLowerCase());
    }
    return true;
  });

  const getStatusBadge = (st: StockRecord['status']) => {
    switch (st) {
      case 'Healthy':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Low Stock':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Out of Stock':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'Expiring Soon':
        return 'bg-orange-50 text-orange-800 border-orange-200';
      case 'Expired':
        return 'bg-red-100 text-red-900 border-red-300';
      case 'Blocked':
        return 'bg-purple-50 text-[#5A2EA6] border-purple-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
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

      {/* 1. Sub-Tab Controller */}
      <div className="bg-white rounded-2xl p-4 border border-[#5A2EA6]/15 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-[#F8F5FF] p-1 rounded-xl border border-[#5A2EA6]/20">
          <button
            onClick={() => setActiveSubTab('central')}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border-0 flex items-center gap-2',
              activeSubTab === 'central'
                ? 'bg-[#5A2EA6] text-white shadow-xs'
                : 'text-soft hover:text-ink',
            )}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Central Stock Ledger</span>
          </button>

          <button
            onClick={() => setActiveSubTab('movements')}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border-0 flex items-center gap-2',
              activeSubTab === 'movements'
                ? 'bg-[#5A2EA6] text-white shadow-xs'
                : 'text-soft hover:text-ink',
            )}
          >
            <History className="w-3.5 h-3.5" />
            <span>Stock Movement Timeline</span>
          </button>

          <button
            onClick={() => setActiveSubTab('batches')}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border-0 flex items-center gap-2',
              activeSubTab === 'batches'
                ? 'bg-[#5A2EA6] text-white shadow-xs'
                : 'text-soft hover:text-ink',
            )}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Batch &amp; Expiry Monitoring</span>
          </button>

          <button
            onClick={() => setActiveSubTab('ageing')}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border-0 flex items-center gap-2',
              activeSubTab === 'ageing'
                ? 'bg-[#5A2EA6] text-white shadow-xs'
                : 'text-soft hover:text-ink',
            )}
          >
            <Hourglass className="w-3.5 h-3.5" />
            <span>Stock Ageing Analysis</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => showToast(`Exporting ${activeSubTab} stock data (CSV)...`)}
            className="h-[36px] px-3 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <span>Export View</span>
          </Button>

          <Button
            onClick={() => setIsAddStockOpen(true)}
            className="h-[36px] px-3.5 rounded-xl text-xs font-bold premium-btn-primary flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add SKU &amp; Ingest Stock</span>
          </Button>
        </div>
      </div>

      {/* 2. Global Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#5A2EA6]/15 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search */}
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search product, SKU, batch..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#5A2EA6]/20 rounded-xl text-xs font-semibold text-ink placeholder:text-muted outline-none focus:border-[#5A2EA6]"
            />
          </div>

          {/* Branch Filter */}
          {!lockBranch && (
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl py-1.5 px-3 text-xs font-bold text-ink outline-none cursor-pointer"
            >
              <option value="all">All Branches</option>
              <option value="BR-01">Indore Central Flagship</option>
              <option value="BR-02">Vijay Nagar Boutique</option>
              <option value="BR-03">Bhopal Arera Colony</option>
              <option value="BR-04">Ujjain Mahakal Road</option>
              <option value="BR-05">Gwalior City Centre</option>
            </select>
          )}

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl py-1.5 px-3 text-xs font-bold text-ink outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="Hair Care">Hair Care</option>
            <option value="Colour & Chemical">Colour &amp; Chemical</option>
            <option value="Skin & Aesthetics">Skin &amp; Aesthetics</option>
            <option value="Hair Treatments">Hair Treatments</option>
          </select>

          {/* Dynamic sub-tab filters */}
          {activeSubTab === 'central' && (
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl py-1.5 px-3 text-xs font-bold text-ink outline-none cursor-pointer"
            >
              <option value="all">All Stock Statuses</option>
              <option value="Healthy">Healthy</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
              <option value="Expiring Soon">Expiring Soon</option>
              <option value="Expired">Expired</option>
            </select>
          )}

          {activeSubTab === 'batches' && (
            <select
              value={selectedExpiryFilter}
              onChange={(e) => setSelectedExpiryFilter(e.target.value)}
              className="bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl py-1.5 px-3 text-xs font-bold text-ink outline-none cursor-pointer"
            >
              <option value="all">All Expiry Windows</option>
              <option value="7">Within 7 Days</option>
              <option value="15">Within 15 Days</option>
              <option value="30">Within 30 Days</option>
              <option value="60">Within 60 Days</option>
              <option value="90">Within 90 Days</option>
              <option value="Expired">Already Expired</option>
            </select>
          )}

          {activeSubTab === 'ageing' && (
            <select
              value={selectedAgeBucket}
              onChange={(e) => setSelectedAgeBucket(e.target.value)}
              className="bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl py-1.5 px-3 text-xs font-bold text-ink outline-none cursor-pointer"
            >
              <option value="all">All Age Buckets</option>
              <option value="0-30 Days">0–30 Days (Fast Moving)</option>
              <option value="31-60 Days">31–60 Days (Normal)</option>
              <option value="61-90 Days">61–90 Days (Moderate)</option>
              <option value="91-180 Days">91–180 Days (Slow Moving)</option>
              <option value="180+ Days">180+ Days (Dead Stock Risk)</option>
            </select>
          )}
        </div>

        <span className="text-xs text-soft font-semibold">
          {activeSubTab === 'movements' ? filteredMovements.length : filteredStock.length} Records
          Found
        </span>
      </div>

      {/* 3. SUB-VIEW TABLES */}
      {activeSubTab === 'central' && (
        /* SECTION 7: CENTRAL STOCK TABLE */
        <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#5A2EA6]/10 flex flex-wrap items-center justify-between gap-3 bg-[#FCFAFF]">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#5A2EA6]" />
                <h3 className="font-serif font-bold text-ink text-base">
                  {lockBranch
                    ? `${defaultBranch} · Physical Stock Ledger`
                    : 'Multi-Branch Central Stock Ledger'}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-extrabold whitespace-nowrap">
                  Live Stock Sync
                </span>
              </div>
              <p className="text-[11px] text-muted mt-0.5">
                {lockBranch
                  ? `Real-time stock balance with available, reserved, and damaged unit counts for ${defaultBranch}`
                  : 'Real-time stock balance across branches with available, reserved, and damaged unit counts'}
              </p>
            </div>
            <span className="text-xs text-soft font-semibold">FIFO Cost Basis</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] tracking-wider uppercase whitespace-nowrap">
                  <th className="p-3.5 pl-5">Product &amp; SKU</th>
                  {!lockBranch && <th className="p-3.5">Branch Location</th>}
                  <th className="p-3.5">Batch No.</th>
                  <th className="p-3.5 text-center">Available</th>
                  <th className="p-3.5 text-center">Reserved</th>
                  <th className="p-3.5 text-center">Damaged</th>
                  <th className="p-3.5 text-center">Total Qty</th>
                  <th className="p-3.5 text-right">Cost Price</th>
                  <th className="p-3.5 text-right">Stock Value</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 pr-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#5A2EA6]/5 font-medium text-slate-700">
                {filteredStock.map((s) => (
                  <tr key={s.id} className="hover:bg-[#5A2EA6]/3 transition-colors">
                    {/* Product */}
                    <td className="p-3.5 pl-5 max-w-[260px]">
                      <strong
                        className="font-bold text-ink block text-xs truncate"
                        title={s.productName}
                      >
                        {s.productName}
                      </strong>
                      <span className="text-[10px] text-[#5A2EA6] font-semibold">
                        {s.sku} · {s.category}
                      </span>
                    </td>

                    {/* Branch */}
                    {!lockBranch && (
                      <td className="p-3.5 whitespace-nowrap">
                        <span className="font-bold text-slate-900 block text-xs">{s.branch}</span>
                        <span className="text-[10px] text-soft">{s.branchId}</span>
                      </td>
                    )}

                    {/* Batch */}
                    <td className="p-3.5 whitespace-nowrap font-mono text-slate-800 font-bold text-[11px]">
                      {s.batchNumber}
                    </td>

                    {/* Available */}
                    <td className="p-3.5 text-center whitespace-nowrap">
                      <strong className="text-emerald-700 font-bold">{s.availableQty}</strong>{' '}
                      {s.unit}s
                    </td>

                    {/* Reserved */}
                    <td className="p-3.5 text-center whitespace-nowrap text-soft">
                      {s.reservedQty} {s.unit}s
                    </td>

                    {/* Damaged */}
                    <td className="p-3.5 text-center whitespace-nowrap">
                      {s.damagedQty > 0 ? (
                        <span className="text-rose-700 font-bold">
                          {s.damagedQty} {s.unit}s
                        </span>
                      ) : (
                        <span className="text-muted">0</span>
                      )}
                    </td>

                    {/* Total */}
                    <td className="p-3.5 text-center whitespace-nowrap font-extrabold text-ink bg-purple-50/10">
                      {s.totalQty} {s.unit}s
                    </td>

                    {/* Cost */}
                    <td className="p-3.5 text-right whitespace-nowrap font-mono text-slate-700">
                      {s.costPrice}
                    </td>

                    {/* Stock Value */}
                    <td className="p-3.5 text-right whitespace-nowrap font-extrabold font-serif text-[#5A2EA6] text-xs">
                      {s.stockValue}
                    </td>

                    {/* Status */}
                    <td className="p-3.5 text-center whitespace-nowrap">
                      <span
                        className={cn(
                          'inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap',
                          getStatusBadge(s.status),
                        )}
                      >
                        {s.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 pr-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          onClick={() => showToast(`Audit details opened for ${s.productName}`)}
                          className="h-[30px] px-2.5 rounded-lg text-[11px] font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5"
                        >
                          Audit SKU
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'movements' && (
        /* SECTION 8: STOCK MOVEMENT TIMELINE */
        <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#5A2EA6]/10 flex flex-wrap items-center justify-between gap-3 bg-[#FCFAFF]">
            <div>
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-[#5A2EA6]" />
                <h3 className="font-serif font-bold text-ink text-base">
                  Running Stock Movement Ledger
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-extrabold whitespace-nowrap">
                  Immutable Movement Journal
                </span>
              </div>
              <p className="text-[11px] text-muted mt-0.5">
                Every goods receipt, retail checkout, service BOM draw, wastage posting, and
                transfer adjustment
              </p>
            </div>
            <span className="text-xs text-soft font-semibold">Running Balance Audit</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] tracking-wider uppercase whitespace-nowrap">
                  <th className="p-3.5 pl-5">Timestamp &amp; Movement ID</th>
                  <th className="p-3.5">Product</th>
                  {!lockBranch && <th className="p-3.5">Branch</th>}
                  <th className="p-3.5">Movement Type</th>
                  <th className="p-3.5 text-right">Quantity Delta</th>
                  <th className="p-3.5 text-right">Running Stock Balance</th>
                  <th className="p-3.5">Reference Document</th>
                  <th className="p-3.5">Operator</th>
                  <th className="p-3.5 pr-5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#5A2EA6]/5 font-medium text-slate-700">
                {filteredMovements.map((m) => (
                  <tr key={m.id} className="hover:bg-[#5A2EA6]/3 transition-colors">
                    {/* Timestamp */}
                    <td className="p-3.5 pl-5 whitespace-nowrap">
                      <strong className="font-bold text-ink block text-xs">{m.id}</strong>
                      <span className="text-[10px] text-muted">{m.date}</span>
                    </td>

                    {/* Product */}
                    <td className="p-3.5 max-w-[240px]">
                      <span
                        className="font-semibold text-slate-900 block truncate"
                        title={m.productName}
                      >
                        {m.productName}
                      </span>
                    </td>

                    {/* Branch */}
                    {!lockBranch && (
                      <td className="p-3.5 whitespace-nowrap font-medium text-slate-800">
                        {m.branch}
                      </td>
                    )}

                    {/* Movement Type */}
                    <td className="p-3.5 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-50 text-[#5A2EA6] border border-purple-100 whitespace-nowrap">
                        {m.movementType}
                      </span>
                    </td>

                    {/* Quantity Delta */}
                    <td className="p-3.5 text-right whitespace-nowrap font-extrabold text-xs">
                      {m.quantityChange > 0 ? (
                        <span className="text-emerald-700 flex items-center justify-end gap-0.5">
                          <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />+{m.quantityChange}{' '}
                          {m.unit}s
                        </span>
                      ) : (
                        <span className="text-rose-700 flex items-center justify-end gap-0.5">
                          <MinusCircle className="w-3.5 h-3.5 text-rose-600" />
                          {m.quantityChange} {m.unit}s
                        </span>
                      )}
                    </td>

                    {/* Running Balance */}
                    <td className="p-3.5 text-right font-extrabold text-ink whitespace-nowrap bg-purple-50/20">
                      {m.runningBalance} {m.unit}s
                    </td>

                    {/* Reference */}
                    <td className="p-3.5 whitespace-nowrap font-mono text-[11px] text-[#5A2EA6]">
                      {m.reference}
                    </td>

                    {/* User */}
                    <td className="p-3.5 whitespace-nowrap text-slate-700 font-medium">{m.user}</td>

                    {/* Status */}
                    <td className="p-3.5 pr-5 text-center whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 whitespace-nowrap">
                        <CheckCircle2 className="w-3 h-3" /> {m.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'batches' && (
        /* SECTION 9: BATCH & EXPIRY TRACKER */
        <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#5A2EA6]/10 flex flex-wrap items-center justify-between gap-3 bg-[#FCFAFF]">
            <div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#5A2EA6]" />
                <h3 className="font-serif font-bold text-ink text-base">
                  Batch &amp; Expiration Risk Matrix
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-extrabold whitespace-nowrap">
                  Pre-Expiry Mitigation
                </span>
              </div>
              <p className="text-[11px] text-muted mt-0.5">
                Proactive shelf monitoring with days-to-expiry gauges to prevent salon chemical
                &amp; product spoilage
              </p>
            </div>
            <span className="text-xs text-soft font-semibold">FIFO Rotation Enforced</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] tracking-wider uppercase whitespace-nowrap">
                  <th className="p-3.5 pl-5">Product &amp; SKU</th>
                  <th className="p-3.5">Batch Number</th>
                  {!lockBranch && <th className="p-3.5">Branch Location</th>}
                  <th className="p-3.5 text-center">Batch Quantity</th>
                  <th className="p-3.5">Expiry Date</th>
                  <th className="p-3.5 text-center">Days to Expiry</th>
                  <th className="p-3.5 text-right">At-Risk Value</th>
                  <th className="p-3.5 text-center">Batch Status</th>
                  <th className="p-3.5 pr-5 text-right">Directives</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#5A2EA6]/5 font-medium text-slate-700">
                {filteredStock.map((s) => (
                  <tr key={s.id} className="hover:bg-[#5A2EA6]/3 transition-colors">
                    <td className="p-3.5 pl-5 max-w-[260px]">
                      <strong
                        className="font-bold text-ink block text-xs truncate"
                        title={s.productName}
                      >
                        {s.productName}
                      </strong>
                      <span className="text-[10px] text-muted">{s.sku}</span>
                    </td>

                    <td className="p-3.5 whitespace-nowrap font-mono font-bold text-ink">
                      {s.batchNumber}
                    </td>

                    {!lockBranch && (
                      <td className="p-3.5 whitespace-nowrap font-medium text-slate-800">
                        {s.branch}
                      </td>
                    )}

                    <td className="p-3.5 text-center whitespace-nowrap font-bold text-ink">
                      {s.totalQty} {s.unit}s
                    </td>

                    <td className="p-3.5 whitespace-nowrap text-slate-700 font-semibold">
                      {s.expiryDate}
                    </td>

                    {/* Days Gauge */}
                    <td className="p-3.5 text-center whitespace-nowrap">
                      <span
                        className={cn(
                          'inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap',
                          s.daysToExpiry < 0
                            ? 'bg-red-100 text-red-900 border-red-300'
                            : s.daysToExpiry <= 30
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200',
                        )}
                      >
                        {s.daysToExpiry < 0
                          ? `${Math.abs(s.daysToExpiry)} Days Overdue`
                          : `${s.daysToExpiry} Days Left`}
                      </span>
                    </td>

                    <td className="p-3.5 text-right font-extrabold text-[#5A2EA6] bg-purple-50/20 whitespace-nowrap">
                      {s.stockValue}
                    </td>

                    <td className="p-3.5 text-center whitespace-nowrap">
                      <span
                        className={cn(
                          'inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap',
                          getStatusBadge(s.status),
                        )}
                      >
                        {s.status}
                      </span>
                    </td>

                    <td className="p-3.5 pr-5 text-right whitespace-nowrap">
                      {s.status === 'Expired' ? (
                        <Button
                          variant="outline"
                          onClick={() =>
                            showToast(`Initiated quarantine write-off for ${s.batchNumber}...`)
                          }
                          className="h-[30px] px-2.5 rounded-lg text-[11px] font-bold border-red-300 text-red-700 hover:bg-red-50"
                        >
                          Quarantine / Write-Off
                        </Button>
                      ) : s.status === 'Expiring Soon' ? (
                        <Button
                          variant="outline"
                          onClick={() =>
                            showToast(`Recommended inter-branch transfer for ${s.productName}...`)
                          }
                          className="h-[30px] px-2.5 rounded-lg text-[11px] font-bold border-amber-300 text-amber-800 hover:bg-amber-50"
                        >
                          Transfer to High-Vol
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          onClick={() => showToast(`Batch verification OK for ${s.batchNumber}`)}
                          className="h-[30px] px-2.5 rounded-lg text-[11px] font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5"
                        >
                          Verify Batch
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'ageing' && (
        /* SECTION 23: STOCK AGEING ANALYSIS */
        <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#5A2EA6]/10 flex flex-wrap items-center justify-between gap-3 bg-[#FCFAFF]">
            <div>
              <div className="flex items-center gap-2">
                <Hourglass className="w-4 h-4 text-[#5A2EA6]" />
                <h3 className="font-serif font-bold text-ink text-base">
                  Inventory Ageing &amp; Velocity Analysis
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-extrabold whitespace-nowrap">
                  5 Age Buckets
                </span>
              </div>
              <p className="text-[11px] text-muted mt-0.5">
                Identifies slow-moving products and dead stock commitments to optimize working
                capital
              </p>
            </div>
            <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              88% Fast-Moving Fresh Inventory
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] tracking-wider uppercase whitespace-nowrap">
                  <th className="p-3.5 pl-5">Product &amp; SKU</th>
                  {!lockBranch && <th className="p-3.5">Branch Location</th>}
                  <th className="p-3.5">Batch</th>
                  <th className="p-3.5 text-center">Holding Qty</th>
                  <th className="p-3.5 text-right">Holding Value</th>
                  <th className="p-3.5 text-center">Ageing Bracket</th>
                  <th className="p-3.5">Expiry Date</th>
                  <th className="p-3.5 text-center">Velocity Classification</th>
                  <th className="p-3.5 pr-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#5A2EA6]/5 font-medium text-slate-700">
                {filteredStock.map((s) => (
                  <tr key={s.id} className="hover:bg-[#5A2EA6]/3 transition-colors">
                    <td className="p-3.5 pl-5 max-w-[260px]">
                      <strong
                        className="font-bold text-ink block text-xs truncate"
                        title={s.productName}
                      >
                        {s.productName}
                      </strong>
                      <span className="text-[10px] text-muted">
                        {s.sku} · {s.category}
                      </span>
                    </td>

                    {!lockBranch && (
                      <td className="p-3.5 whitespace-nowrap font-medium text-slate-800">
                        {s.branch}
                      </td>
                    )}

                    <td className="p-3.5 whitespace-nowrap font-mono text-slate-700">
                      {s.batchNumber}
                    </td>

                    <td className="p-3.5 text-center whitespace-nowrap font-bold text-ink">
                      {s.totalQty} {s.unit}s
                    </td>

                    <td className="p-3.5 text-right font-extrabold text-[#5A2EA6] bg-purple-50/20 whitespace-nowrap">
                      {s.stockValue}
                    </td>

                    <td className="p-3.5 text-center whitespace-nowrap font-bold">
                      <span
                        className={cn(
                          'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border whitespace-nowrap',
                          s.ageBucket === '0-30 Days'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : s.ageBucket === '31-60 Days'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : s.ageBucket === '61-90 Days'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : 'bg-red-50 text-red-800 border-red-200',
                        )}
                      >
                        {s.ageBucket}
                      </span>
                    </td>

                    <td className="p-3.5 whitespace-nowrap text-slate-700">{s.expiryDate}</td>

                    <td className="p-3.5 text-center whitespace-nowrap">
                      {s.isSlowMoving ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 whitespace-nowrap">
                          <AlertTriangle className="w-2.5 h-2.5" /> Slow Moving SKU
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 whitespace-nowrap">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Active Velocity
                        </span>
                      )}
                    </td>

                    <td className="p-3.5 pr-5 text-right whitespace-nowrap">
                      <Button
                        variant="outline"
                        onClick={() =>
                          showToast(
                            `Applied promotional bundle recommendation for ${s.productName}...`,
                          )
                        }
                        className="h-[30px] px-2.5 rounded-lg text-[11px] font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5"
                      >
                        {s.isSlowMoving ? 'Promote / Discount' : 'Inspect'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD MASTER SKU & STOCK INTAKE MODAL */}
      <AddMasterSkuModal
        isOpen={isAddStockOpen}
        onClose={() => setIsAddStockOpen(false)}
        onSave={handleSaveInwardStock}
        defaultType="Retail Product"
      />
    </div>
  );
}
