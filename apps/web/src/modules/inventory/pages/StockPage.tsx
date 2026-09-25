import { useToast } from '@salon-spa-saas/ui';
import {
  AlertTriangle,
  ArrowLeftRight,
  Barcode,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  Download,
  Globe,
  Layers,
  MapPin,
  Package,
  Plus,
  Search,
  Sparkles,
  TrendingUp,
  Truck,
  Warehouse,
  X,
} from 'lucide-react';
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useInventoryBranch } from '../context/InventoryBranchContext';

export function StockPage() {
  const { toast } = useToast();
  const {
    branches,
    selectedBranchId,
    setSelectedBranchId,
    selectedBranch,
    isAllBranches,
    userRole,
  } = useInventoryBranch();

  const [filterStatus, setFilterStatus] = useState<
    'all' | 'normal' | 'low' | 'expiring' | 'overstock'
  >('all');
  const [activeTab, setActiveTab] = useState<'stock' | 'batches'>('stock');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [transferModalItem, setTransferModalItem] = useState<any>(null);

  // Transfer Modal State
  const [transferTargetBranch, setTransferTargetBranch] = useState('mumbai');
  const [transferQty, setTransferQty] = useState(5);

  // Current Multi-Branch Stock Items
  const [stockItems] = useState([
    {
      id: 'STK-01',
      product: 'L’Oréal Developer 20Vol (1000ml)',
      sku: 'LOR-DEV-20V',
      branchId: 'mumbai',
      branchName: 'Bandra West (Mumbai)',
      available: 14,
      reserved: 2,
      unit: 'Bottles (1000ml)',
      batch: 'BAT-9940',
      mfgDate: '2024-05-10',
      expiry: '2027-04-15',
      location: 'Aisle 3 - Shelf B',
      status: 'normal',
      supplier: 'L’Oréal India Ltd',
      purchasePrice: '₹850',
      networkStock: { mumbai: 14, delhi: 22, bangalore: 10, hyderabad: 8, centralHub: 45 },
    },
    {
      id: 'STK-02',
      product: 'Kérastase Nutritive Mask (500ml)',
      sku: 'KER-NUT-500',
      branchId: 'mumbai',
      branchName: 'Bandra West (Mumbai)',
      available: 2,
      reserved: 1,
      unit: 'Tubs (500ml)',
      batch: 'BAT-8820',
      mfgDate: '2024-02-01',
      expiry: '2026-08-28',
      location: 'Aisle 1 - Bin C',
      status: 'expiring',
      supplier: 'Luxury Beauty Distributors',
      purchasePrice: '₹2,400',
      networkStock: { mumbai: 2, delhi: 18, bangalore: 6, hyderabad: 4, centralHub: 12 },
    },
    {
      id: 'STK-03',
      product: 'Olaplex No. 1 Bond Multiplier (525ml)',
      sku: 'OLA-NO1-525',
      branchId: 'bangalore',
      branchName: 'Indiranagar (Bangalore)',
      available: 1,
      reserved: 0,
      unit: 'Bottles (525ml)',
      batch: 'BAT-7710',
      mfgDate: '2024-03-15',
      expiry: '2027-01-10',
      location: 'Aisle 2 - Cabinet A',
      status: 'low',
      supplier: 'Olaplex India Pvt Ltd',
      purchasePrice: '₹6,500',
      networkStock: { mumbai: 6, delhi: 8, bangalore: 1, hyderabad: 3, centralHub: 24 },
    },
    {
      id: 'STK-04',
      product: 'Majirel Hair Color Cream 7.1',
      sku: 'LOR-MAJ-71',
      branchId: 'delhi',
      branchName: 'South Extension II (Delhi)',
      available: 85,
      reserved: 5,
      unit: 'Tubes (50g)',
      batch: 'BAT-6650',
      mfgDate: '2024-06-20',
      expiry: '2027-11-20',
      location: 'Aisle 4 - Rack D',
      status: 'overstock',
      supplier: 'L’Oréal India Ltd',
      purchasePrice: '₹340',
      networkStock: { mumbai: 24, delhi: 85, bangalore: 18, hyderabad: 15, centralHub: 120 },
    },
    {
      id: 'STK-05',
      product: 'Moroccanoil Treatment Oil (100ml)',
      sku: 'MOR-OIL-100',
      branchId: 'hyderabad',
      branchName: 'Jubilee Hills (Hyderabad)',
      available: 3,
      reserved: 1,
      unit: 'Bottles (100ml)',
      batch: 'BAT-5540',
      mfgDate: '2024-04-10',
      expiry: '2027-03-15',
      location: 'Aisle 2 - Retail Shelf',
      status: 'low',
      supplier: 'Moroccanoil India Ltd',
      purchasePrice: '₹2,100',
      networkStock: { mumbai: 14, delhi: 12, bangalore: 8, hyderabad: 3, centralHub: 30 },
    },
  ]);

  const filtered = stockItems.filter((item) => {
    const matchesBranch = isAllBranches || item.branchId === selectedBranchId;
    const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
    const matchesSearch =
      item.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.batch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.branchName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBranch && matchesFilter && matchesSearch;
  });

  const handleConfirmTransfer = () => {
    if (!transferModalItem) return;
    const targetBranchObj = branches.find((b) => b.id === transferTargetBranch);
    toast(
      `Transfer Manifest Created: ${transferQty} units of ${transferModalItem.product} scheduled for transfer to ${targetBranchObj?.name || transferTargetBranch}.`,
    );
    setTransferModalItem(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-ink tracking-tight">
              Inventory Stock & FIFO Batches
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
              {isAllBranches ? (
                <Globe className="w-3 h-3 text-purple-700" />
              ) : (
                <Building2 className="w-3 h-3 text-purple-700" />
              )}
              {isAllBranches
                ? 'Chain-Wide Physical Stock'
                : `${selectedBranch.shortName} Store Ledger`}
            </span>
          </div>
          <p className="text-xs text-soft mt-1">
            Real-time physical stock balances, cross-branch availability, FIFO batch lots, bin
            tracking, and rapid inter-branch transfers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              toast(
                `Export Stock: Current stock ledger for ${selectedBranch.name} exported to CSV.`,
              )
            }
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-purple-600 text-purple-600 bg-white hover:bg-purple-50 transition-all shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-purple-600" />
            Export Stock Ledger
          </button>
        </div>
      </div>

      {/* BRANCH FILTER PILLS TOOLBAR */}
      <div className="bg-white p-3 rounded-2xl border border-line shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted flex items-center gap-1">
            <Building2 className="w-3 h-3 text-purple-700" />
            Filter By Salon Location:
          </span>
          <span className="text-[10px] text-soft font-semibold">{filtered.length} SKUs Listed</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {branches.map((b) => (
            <button
              key={b.id}
              onClick={() => setSelectedBranchId(b.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer border ${
                selectedBranchId === b.id
                  ? 'bg-purple-900 text-white border-purple-900 shadow-xs'
                  : 'bg-pine/5 text-soft hover:text-ink border-line/60 hover:bg-pine/10'
              }`}
            >
              {b.id === 'all' ? '🌐 All Branches (Chain)' : b.shortName}
            </button>
          ))}
        </div>
      </div>

      {/* SUB-TABS: Stock Table vs Batch Directory */}
      <div className="flex overflow-x-auto gap-2 border-b border-line pb-2 no-scrollbar">
        {[
          { id: 'stock', label: 'Physical Stock Ledger', count: filtered.length },
          { id: 'batches', label: 'FIFO Batch Master', count: filtered.length },
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
            {tab.label}{' '}
            <span className="ml-1.5 px-1.5 py-0.2 text-[10px] bg-white/20 text-current rounded-full">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* STATUS FILTER TABS */}
      <div className="flex overflow-x-auto gap-2 border-b border-line pb-2 no-scrollbar">
        {[
          { id: 'all', label: 'All Items', count: stockItems.length },
          {
            id: 'normal',
            label: 'Normal Stock',
            count: stockItems.filter((s) => s.status === 'normal').length,
          },
          {
            id: 'low',
            label: 'Low Stock Alerts',
            count: stockItems.filter((s) => s.status === 'low').length,
          },
          {
            id: 'expiring',
            label: 'Expiring Soon (<30d)',
            count: stockItems.filter((s) => s.status === 'expiring').length,
          },
          {
            id: 'overstock',
            label: 'Overstock Flagged',
            count: stockItems.filter((s) => s.status === 'overstock').length,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterStatus(tab.id as any)}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
              filterStatus === tab.id
                ? 'bg-[#5A2EA6] text-white shadow-xs'
                : 'bg-pine/10 text-soft hover:text-ink'
            }`}
          >
            {tab.label}{' '}
            <span className="ml-1 px-1.5 py-0.2 text-[9.5px] bg-white/20 text-current rounded-full">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white p-3 rounded-2xl border border-line shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search by product name, SKU, holding branch, batch number, or bin location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-pine/10 border border-line rounded-xl outline-none focus:border-purple-600"
          />
        </div>
      </div>

      {/* DYNAMIC TAB CONTENT */}
      {activeTab === 'stock' ? (
        /* CURRENT STOCK TABLE */
        <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-pine/5 text-soft uppercase tracking-wider font-semibold border-b border-line">
                  <th className="p-3">Product & SKU</th>
                  <th className="p-3">Holding Branch</th>
                  <th className="p-3">Available</th>
                  <th className="p-3">Reserved</th>
                  <th className="p-3">Network Stock Distribution</th>
                  <th className="p-3">Batch & Expiry</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/40">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-purple-50/30 transition-colors">
                    {/* Product & SKU */}
                    <td className="p-3">
                      <div className="font-bold text-ink">{item.product}</div>
                      <div className="text-[11px] font-mono font-bold text-purple-700">
                        {item.sku} • {item.unit}
                      </div>
                    </td>

                    {/* Holding Branch */}
                    <td className="p-3">
                      <div className="font-semibold text-ink flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-purple-700 shrink-0" />
                        {item.branchName}
                      </div>
                    </td>

                    {/* Available */}
                    <td className="p-3 font-bold text-emerald-700 text-sm">{item.available}</td>

                    {/* Reserved */}
                    <td className="p-3 font-semibold text-amber-700">{item.reserved}</td>

                    {/* Multi-Branch Network Distribution Badges */}
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        <span
                          className="px-1.5 py-0.5 bg-purple-50 text-purple-900 border border-purple-200 rounded text-[10px] font-bold"
                          title="Mumbai"
                        >
                          MUM: {item.networkStock.mumbai}
                        </span>
                        <span
                          className="px-1.5 py-0.5 bg-indigo-50 text-indigo-900 border border-indigo-200 rounded text-[10px] font-bold"
                          title="Delhi"
                        >
                          DEL: {item.networkStock.delhi}
                        </span>
                        <span
                          className="px-1.5 py-0.5 bg-blue-50 text-blue-900 border border-blue-200 rounded text-[10px] font-bold"
                          title="Bangalore"
                        >
                          BLR: {item.networkStock.bangalore}
                        </span>
                        <span
                          className="px-1.5 py-0.5 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded text-[10px] font-bold"
                          title="Central Hub"
                        >
                          HUB: {item.networkStock.centralHub}
                        </span>
                      </div>
                    </td>

                    {/* Batch & Expiry */}
                    <td className="p-3">
                      <div className="font-mono font-bold text-ink">{item.batch}</div>
                      <div className="text-[11px] font-bold text-purple-900">{item.expiry}</div>
                    </td>

                    {/* Location */}
                    <td className="p-3 text-soft font-medium">{item.location}</td>

                    {/* Status */}
                    <td className="p-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status === 'expiring'
                            ? 'bg-rose-100 text-rose-800'
                            : item.status === 'low'
                              ? 'bg-amber-100 text-amber-800'
                              : item.status === 'overstock'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {item.status.toUpperCase()}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setTransferModalItem(item)}
                          className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 rounded-lg text-[11px] font-bold border border-indigo-200 cursor-pointer flex items-center gap-1"
                          title="Transfer stock to sister branch"
                        >
                          <ArrowLeftRight className="w-3 h-3" />
                          Transfer
                        </button>
                        <button
                          onClick={() => setSelectedBatch(item)}
                          className="px-2.5 py-1 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg font-semibold text-[11px] border border-purple-200 cursor-pointer"
                        >
                          Specs
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* BATCH MASTER DIRECTORY */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((b) => (
            <div
              key={b.id}
              className="bg-white p-5 rounded-2xl border border-line shadow-sm space-y-3"
            >
              <div className="flex justify-between items-center border-b border-line pb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full">
                    Batch: {b.batch}
                  </span>
                  <span className="text-[10px] font-semibold text-soft bg-pine/10 px-2 py-0.5 rounded-md">
                    {b.branchName}
                  </span>
                </div>
                <span className="text-xs font-bold text-emerald-700">
                  {(b as any).quantity || `${b.available + b.reserved} Units`} Total
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-ink">{b.product}</h3>
                <div className="text-xs text-soft font-mono font-semibold">{b.sku}</div>
              </div>

              {/* BATCH FIELDS */}
              <div className="p-3.5 bg-pine/5 rounded-xl border border-line grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-soft block">Holding Location</span>
                  <span className="font-semibold text-ink">{b.branchName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-soft block">Shelf Bin Location</span>
                  <span className="font-mono font-bold text-ink">{b.location}</span>
                </div>
                <div>
                  <span className="text-[10px] text-soft block">Manufacture Date</span>
                  <span className="font-semibold text-ink">{b.mfgDate}</span>
                </div>
                <div>
                  <span className="text-[10px] text-soft block">Expiry Date (FIFO)</span>
                  <span className="font-bold text-purple-700">{b.expiry}</span>
                </div>
                <div>
                  <span className="text-[10px] text-soft block">Supplier</span>
                  <span className="font-bold text-ink">{b.supplier}</span>
                </div>
                <div>
                  <span className="text-[10px] text-soft block">Contract Cost</span>
                  <span className="font-bold text-emerald-700">{b.purchasePrice}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* QUICK INTER-BRANCH TRANSFER MODAL */}
      {transferModalItem &&
        createPortal(
          <div className="fixed inset-0 bg-[#3B2647]/50 backdrop-blur-sm z-[9999] overflow-y-auto flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[28px] w-full max-w-lg shadow-[0_25px_60px_rgba(90,46,166,0.18)] p-6 space-y-4 border border-[#5A2EA6]/10">
              <div className="flex justify-between items-center border-b border-line pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2.5 py-0.5 rounded-full flex items-center gap-1 w-fit">
                    <ArrowLeftRight className="w-3 h-3" />
                    Inter-Branch Stock Transfer
                  </span>
                  <h3 className="font-serif text-[18px] text-[#3B2647] font-bold tracking-tight mt-1">
                    Transfer: {transferModalItem.product}
                  </h3>
                </div>
                <button
                  onClick={() => setTransferModalItem(null)}
                  className="text-soft hover:text-ink transition bg-transparent border-0 cursor-pointer p-1 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-pine/5 rounded-xl border border-line flex justify-between items-center">
                  <div>
                    <span className="text-soft text-[10.5px]">Source Origin Branch:</span>
                    <div className="font-bold text-ink">{transferModalItem.branchName}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-soft text-[10.5px]">Available Stock:</span>
                    <div className="font-bold text-emerald-700 text-sm">
                      {transferModalItem.available} Units
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-ink mb-1">
                    Select Destination Sibling Branch:
                  </label>
                  <select
                    value={transferTargetBranch}
                    onChange={(e) => setTransferTargetBranch(e.target.value)}
                    className="w-full p-2.5 bg-white border border-line rounded-xl text-xs font-semibold outline-none focus:border-purple-600"
                  >
                    {branches
                      .filter((b) => b.id !== 'all' && b.id !== transferModalItem.branchId)
                      .map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name} ({b.city})
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-ink mb-1">
                    Transfer Quantity (Units):
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={transferModalItem.available}
                    value={transferQty}
                    onChange={(e) =>
                      setTransferQty(Math.max(1, Number.parseInt(e.target.value) || 1))
                    }
                    className="w-full p-2.5 bg-white border border-line rounded-xl text-xs font-bold outline-none focus:border-purple-600"
                  />
                </div>

                <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 text-[11px] text-indigo-900 leading-snug">
                  <strong>Logistics Note:</strong> Stock will be locked in <em>"In-Transit"</em>{' '}
                  status upon dispatch. A tamper-seal container manifest will be generated
                  automatically.
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-line">
                <button
                  onClick={() => setTransferModalItem(null)}
                  className="px-4 py-2 bg-pine/10 hover:bg-pine/20 text-soft font-bold rounded-xl text-xs cursor-pointer border-0"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmTransfer}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer border-0 flex items-center gap-1.5"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  Dispatch Transfer
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* BATCH DETAIL MODAL */}
      {selectedBatch &&
        createPortal(
          <div className="fixed inset-0 bg-[#3B2647]/50 backdrop-blur-sm z-[9999] overflow-y-auto flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-[0_25px_60px_rgba(90,46,166,0.18)] p-6 space-y-4 border border-[#5A2EA6]/10">
              <div className="flex justify-between items-center border-b border-line pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full">
                    Batch Master Specifications
                  </span>
                  <h3 className="font-serif text-[18px] text-[#3B2647] font-bold tracking-tight mt-1">
                    {selectedBatch.product}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedBatch(null)}
                  className="text-soft hover:text-ink transition bg-transparent border-0 cursor-pointer p-1 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3 p-4 bg-purple-50/50 rounded-2xl border border-purple-200">
                  <div>
                    <span className="text-soft text-[10.5px]">Batch Number:</span>
                    <div className="font-mono font-bold text-purple-900 text-sm">
                      {selectedBatch.batch}
                    </div>
                  </div>
                  <div>
                    <span className="text-soft text-[10.5px]">SKU Code:</span>
                    <div className="font-mono font-bold text-ink text-sm">{selectedBatch.sku}</div>
                  </div>
                  <div>
                    <span className="text-soft text-[10.5px]">Holding Branch:</span>
                    <div className="font-bold text-purple-900">{selectedBatch.branchName}</div>
                  </div>
                  <div>
                    <span className="text-soft text-[10.5px]">Manufacture Date:</span>
                    <div className="font-bold text-ink">{selectedBatch.mfgDate}</div>
                  </div>
                  <div>
                    <span className="text-soft text-[10.5px]">Expiry Date (FIFO):</span>
                    <div className="font-bold text-purple-700">{selectedBatch.expiry}</div>
                  </div>
                  <div>
                    <span className="text-soft text-[10.5px]">Authorized Supplier:</span>
                    <div className="font-bold text-ink">{selectedBatch.supplier}</div>
                  </div>
                  <div>
                    <span className="text-soft text-[10.5px]">Contract Purchase Price:</span>
                    <div className="font-bold text-emerald-700">{selectedBatch.purchasePrice}</div>
                  </div>
                  <div>
                    <span className="text-soft text-[10.5px]">Available / Reserved:</span>
                    <div className="font-bold text-ink">
                      {selectedBatch.available} Available • {selectedBatch.reserved} Reserved
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-line">
                <button
                  onClick={() => setSelectedBatch(null)}
                  className="px-6 py-2 bg-[#5A2EA6] text-white rounded-xl text-xs font-bold cursor-pointer border-0"
                >
                  Close Batch Master
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
