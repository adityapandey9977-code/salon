import { useToast } from '@salon-spa-saas/ui';
import {
  ArrowRight,
  Building,
  Building2,
  CheckCircle2,
  Clock,
  DollarSign,
  Download,
  FileText,
  Globe,
  MapPin,
  Plus,
  Search,
  ShieldAlert,
  ShoppingCart,
  Sparkles,
  Tag,
  Trash2,
  Truck,
  X,
  XCircle,
} from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useInventoryBranch } from '../context/InventoryBranchContext';

export type POStatus = 'Draft' | 'Pending' | 'Approved' | 'Ordered' | 'Received' | 'Cancelled';

export function PurchasesPage() {
  const { toast } = useToast();
  const {
    branches,
    selectedBranchId,
    setSelectedBranchId,
    selectedBranch,
    isAllBranches,
    userRole,
  } = useInventoryBranch();

  const [activeTab, setActiveTab] = useState<
    'all' | 'Draft' | 'Pending' | 'Approved' | 'Ordered' | 'Received' | 'Cancelled'
  >('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form State for PO Creation with full fields
  const [poForm, setPoForm] = useState({
    poNumber: `PO-${Math.floor(4000 + Math.random() * 900)}`,
    supplier: 'L’Oréal India Ltd',
    branch: 'Bandra West Flagship (Mumbai)',
    orderDate: '2026-08-07',
    expectedDelivery: '2026-08-10',
    status: 'Pending' as POStatus,
    items: [
      { product: 'Developer 20Vol (1000ml)', quantity: 20, price: 850, gstPct: 18, discount: 50 },
      {
        product: 'Majirel Hair Color Cream 7.1',
        quantity: 50,
        price: 340,
        gstPct: 18,
        discount: 0,
      },
    ],
  });

  const [orders, setOrders] = useState([
    {
      poNumber: 'PO-4091',
      supplier: 'L’Oréal India Ltd',
      branch: 'Bandra West Flagship (Mumbai)',
      orderDate: '2026-08-05',
      expectedDelivery: '2026-08-08',
      status: 'Ordered' as POStatus,
      totalAmount: '₹42,500',
      requiresHqApproval: true,
      itemsCount: 6,
      items: [
        { product: 'Developer 20Vol', quantity: 20, price: 850, gstPct: 18, discount: 500 },
        {
          product: 'Majirel Hair Color Cream 7.1',
          quantity: 50,
          price: 340,
          gstPct: 18,
          discount: 0,
        },
      ],
    },
    {
      poNumber: 'PO-4092',
      supplier: 'Luxury Beauty Distributors',
      branch: 'South Extension II (Delhi)',
      orderDate: '2026-08-06',
      expectedDelivery: '2026-08-09',
      status: 'Approved' as POStatus,
      totalAmount: '₹18,200',
      requiresHqApproval: false,
      itemsCount: 3,
      items: [
        { product: 'Kérastase Mask 500ml', quantity: 5, price: 2400, gstPct: 18, discount: 200 },
      ],
    },
    {
      poNumber: 'PO-4093',
      supplier: 'Olaplex India Pvt Ltd',
      branch: 'Indiranagar Atelier (Bangalore)',
      orderDate: '2026-08-07',
      expectedDelivery: '2026-08-10',
      status: 'Pending' as POStatus,
      totalAmount: '₹26,000',
      requiresHqApproval: true,
      itemsCount: 2,
      items: [
        { product: 'Olaplex No. 1 Multiplier', quantity: 4, price: 6500, gstPct: 18, discount: 0 },
      ],
    },
    {
      poNumber: 'PO-4089',
      supplier: 'L’Oréal India Ltd',
      branch: 'Jubilee Hills Wellness (Hyderabad)',
      orderDate: '2026-08-01',
      expectedDelivery: '2026-08-04',
      status: 'Received' as POStatus,
      totalAmount: '₹34,000',
      requiresHqApproval: true,
      itemsCount: 4,
      items: [{ product: 'Majirel Cream 6.0', quantity: 40, price: 340, gstPct: 18, discount: 0 }],
    },
    {
      poNumber: 'PO-4085',
      supplier: 'Central Logistics Suppliers',
      branch: 'Central Logistics Hub (Bhiwandi)',
      orderDate: '2026-07-28',
      expectedDelivery: '2026-07-31',
      status: 'Draft' as POStatus,
      totalAmount: '₹8,500',
      requiresHqApproval: false,
      itemsCount: 1,
      items: [
        { product: 'Disinfectant Spray 1L', quantity: 20, price: 350, gstPct: 18, discount: 0 },
      ],
    },
  ]);

  const handleUpdateStatus = (poNumber: string, newStatus: POStatus) => {
    setOrders(orders.map((o) => (o.poNumber === poNumber ? { ...o, status: newStatus } : o)));
    toast(`PO Status Updated: Purchase Order ${poNumber} moved to [${newStatus}].`);
  };

  const handleAddItemRow = () => {
    setPoForm({
      ...poForm,
      items: [
        ...poForm.items,
        { product: 'New Consumable Item', quantity: 10, price: 500, gstPct: 18, discount: 0 },
      ],
    });
  };

  const handleRemoveItemRow = (idx: number) => {
    const updated = poForm.items.filter((_, i) => i !== idx);
    setPoForm({ ...poForm, items: updated });
  };

  const handleSavePO = (e: React.FormEvent) => {
    e.preventDefault();

    const calculatedTotal = poForm.items.reduce((acc, item) => {
      const sub = item.quantity * item.price;
      const gst = sub * (item.gstPct / 100);
      return acc + sub + gst - item.discount;
    }, 0);

    const newPO = {
      poNumber: poForm.poNumber,
      supplier: poForm.supplier,
      branch: poForm.branch,
      orderDate: poForm.orderDate,
      expectedDelivery: poForm.expectedDelivery,
      status: poForm.status,
      totalAmount: `₹${calculatedTotal.toLocaleString('en-IN')}`,
      requiresHqApproval: calculatedTotal > 25000,
      itemsCount: poForm.items.length,
      items: poForm.items,
    };

    setOrders([newPO, ...orders]);
    setIsCreateModalOpen(false);
    toast(
      `Purchase Order Created: ${newPO.poNumber} issued to ${newPO.supplier} (${newPO.totalAmount}).`,
    );
  };

  const filteredOrders = orders.filter((o) => {
    const matchesBranch =
      isAllBranches || o.branch.includes(selectedBranch.shortName.split(' ')[0]);
    const matchesTab = activeTab === 'all' || o.status === activeTab;
    const matchesSearch =
      o.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.branch.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBranch && matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-ink tracking-tight">
              Purchase Management & PO Lifecycle
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
              {isAllBranches ? (
                <Globe className="w-3 h-3 text-purple-700" />
              ) : (
                <Building2 className="w-3 h-3 text-purple-700" />
              )}
              {isAllBranches ? 'Chain Procurement Desk' : `${selectedBranch.shortName} POs`}
            </span>
          </div>
          <p className="text-xs text-soft mt-1">
            Full procurement lifecycle management: low stock alerts, purchase requests,
            Maker-Checker approvals (&gt;₹25k), and GRN receipts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#5A2EA6] hover:bg-[#482387] text-white text-xs font-bold rounded-xl shadow cursor-pointer transition-all border-0"
          >
            <Plus className="w-4 h-4" />
            Create Purchase Order (PO)
          </button>

          <button
            onClick={() => toast('Export PO Log: Purchase orders list exported to CSV.')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-purple-600 text-purple-600 bg-white hover:bg-purple-50 transition-all shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-purple-600" />
            Export Orders
          </button>
        </div>
      </div>

      {/* VISUAL PROCUREMENT WORKFLOW STEPPER */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-5 rounded-2xl shadow-lg space-y-3">
        <div className="flex justify-between items-center text-xs font-bold text-purple-200">
          <span className="flex items-center gap-1 text-emerald-400">
            <Sparkles className="w-3.5 h-3.5" /> Standard Procurement Pipeline
          </span>
          <span>7-Stage Workflow Automation</span>
        </div>

        {/* Pipeline Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-1">
          {[
            { step: '1. Low Stock', desc: 'Auto Alert' },
            { step: '2. Request', desc: 'Store Reorder' },
            { step: '3. Approval', desc: 'Manager Audit' },
            { step: '4. PO Issue', desc: 'PO Transmitted' },
            { step: '5. Supplier', desc: 'Fulfillment' },
            { step: '6. GRN Receipt', desc: 'Goods Intake' },
            { step: '7. Stock Updated', desc: 'Ledger Post' },
          ].map((s, idx) => (
            <div
              key={idx}
              className="p-2 bg-white/10 rounded-xl border border-white/15 text-center space-y-0.5"
            >
              <div className="text-[11px] font-bold text-white">{s.step}</div>
              <div className="text-[9.5px] text-purple-200">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* STATUS TABS */}
      <div className="flex overflow-x-auto gap-2 border-b border-line pb-2 no-scrollbar">
        {[
          { id: 'all', label: 'All Orders', count: orders.length },
          {
            id: 'Draft',
            label: 'Drafts',
            count: orders.filter((o) => o.status === 'Draft').length,
          },
          {
            id: 'Pending',
            label: 'Pending Approval',
            count: orders.filter((o) => o.status === 'Pending').length,
          },
          {
            id: 'Approved',
            label: 'Approved POs',
            count: orders.filter((o) => o.status === 'Approved').length,
          },
          {
            id: 'Ordered',
            label: 'Ordered / In-Transit',
            count: orders.filter((o) => o.status === 'Ordered').length,
          },
          {
            id: 'Received',
            label: 'Received (GRN Posted)',
            count: orders.filter((o) => o.status === 'Received').length,
          },
          {
            id: 'Cancelled',
            label: 'Cancelled',
            count: orders.filter((o) => o.status === 'Cancelled').length,
          },
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

      {/* SEARCH BAR */}
      <div className="bg-white p-3 rounded-2xl border border-line shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search by PO number, supplier, or destination branch..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-pine/10 border border-line rounded-xl outline-none focus:border-purple-600"
          />
        </div>
      </div>

      {/* PO ORDERS TABLE */}
      <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-pine/5 text-soft uppercase tracking-wider font-semibold border-b border-line">
                <th className="p-3">PO Number & Date</th>
                <th className="p-3">Supplier Name</th>
                <th className="p-3">Destination Branch</th>
                <th className="p-3">Items & Qty</th>
                <th className="p-3">Total Amount & Approval</th>
                <th className="p-3">Expected Delivery</th>
                <th className="p-3">Workflow Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/40">
              {filteredOrders.map((po) => (
                <tr key={po.poNumber} className="hover:bg-purple-50/30 transition-colors">
                  <td className="p-3 font-bold text-purple-700">
                    <div>{po.poNumber}</div>
                    <div className="text-[10px] text-muted">{po.orderDate}</div>
                  </td>
                  <td className="p-3 font-bold text-ink">{po.supplier}</td>
                  <td className="p-3">
                    <div className="font-semibold text-ink flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-purple-700 shrink-0" />
                      {po.branch}
                    </div>
                  </td>
                  <td className="p-3 font-semibold text-ink">{po.itemsCount} SKUs</td>
                  <td className="p-3">
                    <div className="font-bold text-emerald-700">{po.totalAmount}</div>
                    {po.requiresHqApproval && (
                      <span className="text-[9.5px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded inline-flex items-center gap-0.5 mt-0.5">
                        <ShieldAlert className="w-2.5 h-2.5" /> Maker-Checker (&gt;₹25k)
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-soft font-medium">{po.expectedDelivery}</td>
                  <td className="p-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        po.status === 'Draft'
                          ? 'bg-slate-100 text-slate-700 border border-slate-300'
                          : po.status === 'Pending'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : po.status === 'Approved'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : po.status === 'Ordered'
                                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                : po.status === 'Received'
                                  ? 'bg-purple-100 text-purple-800 border border-purple-300'
                                  : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}
                    >
                      {po.status}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-1">
                    {po.status === 'Pending' && (
                      <button
                        onClick={() => handleUpdateStatus(po.poNumber, 'Approved')}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold cursor-pointer border-0"
                      >
                        Approve
                      </button>
                    )}
                    {po.status === 'Approved' && (
                      <button
                        onClick={() => handleUpdateStatus(po.poNumber, 'Ordered')}
                        className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-bold cursor-pointer border-0"
                      >
                        Transmit Order
                      </button>
                    )}
                    {po.status === 'Ordered' && (
                      <button
                        onClick={() => handleUpdateStatus(po.poNumber, 'Received')}
                        className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[11px] font-bold cursor-pointer border-0"
                      >
                        Post GRN
                      </button>
                    )}
                    <button
                      onClick={() => toast(`View PO: Opened ${po.poNumber} breakdown.`)}
                      className="px-2.5 py-1 bg-pine/10 text-ink hover:bg-pine/20 rounded-lg text-[11px] font-semibold border-0 cursor-pointer"
                    >
                      View PO
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE PURCHASE ORDER MODAL */}
      {isCreateModalOpen &&
        createPortal(
          <div className="fixed inset-0 bg-[#3B2647]/50 backdrop-blur-sm z-[9999] overflow-y-auto flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[32px] w-full max-w-4xl shadow-[0_25px_60px_rgba(90,46,166,0.18)] p-6 space-y-4 border border-[#5A2EA6]/10">
              <div className="flex justify-between items-center border-b border-line pb-3">
                <div>
                  <h3 className="font-serif text-[18px] text-[#3B2647] font-bold tracking-tight">
                    Create Itemized Purchase Order
                  </h3>
                  <p className="text-xs text-soft">
                    Issue purchase order with price, GST %, discount, and branch destination
                  </p>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="text-soft hover:text-ink transition bg-transparent border-0 cursor-pointer p-1 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSavePO} className="space-y-4 text-xs">
                <div className="grid grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      PO Number
                    </label>
                    <input
                      type="text"
                      value={poForm.poNumber}
                      disabled
                      className="w-full p-2.5 bg-pine/5 border border-line rounded-xl font-mono font-bold text-purple-700"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      Supplier *
                    </label>
                    <select
                      value={poForm.supplier}
                      onChange={(e) => setPoForm({ ...poForm, supplier: e.target.value })}
                      className="w-full p-2.5 bg-paper/30 border border-line rounded-xl outline-none focus:border-[#5A2EA6] text-ink font-semibold cursor-pointer"
                    >
                      <option value="L’Oréal India Ltd">L’Oréal India Ltd</option>
                      <option value="Luxury Beauty Distributors">Luxury Beauty Distributors</option>
                      <option value="Olaplex India Pvt Ltd">Olaplex India Pvt Ltd</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      Destination Branch *
                    </label>
                    <select
                      value={poForm.branch}
                      onChange={(e) => setPoForm({ ...poForm, branch: e.target.value })}
                      className="w-full p-2.5 bg-paper/30 border border-line rounded-xl outline-none focus:border-[#5A2EA6] text-ink font-semibold cursor-pointer"
                    >
                      {branches
                        .filter((b) => b.id !== 'all')
                        .map((b) => (
                          <option key={b.id} value={b.name}>
                            {b.name} ({b.city})
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      Expected Delivery
                    </label>
                    <input
                      type="date"
                      value={poForm.expectedDelivery}
                      onChange={(e) => setPoForm({ ...poForm, expectedDelivery: e.target.value })}
                      className="w-full p-2.5 bg-paper/30 border border-line rounded-xl outline-none font-semibold text-ink"
                    />
                  </div>
                </div>

                {/* ITEMIZED PRODUCTS TABLE IN MODAL */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-soft uppercase tracking-wider">
                      Itemized Order Lines
                    </span>
                    <button
                      type="button"
                      onClick={handleAddItemRow}
                      className="flex items-center gap-1 text-[11px] font-bold text-[#5A2EA6] hover:underline bg-transparent border-0 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Product Item
                    </button>
                  </div>

                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {poForm.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-pine/5 rounded-2xl border border-line grid grid-cols-12 gap-2 items-center"
                      >
                        <div className="col-span-4">
                          <label className="text-[9.5px] font-bold text-muted uppercase block">
                            Product Name / SKU
                          </label>
                          <input
                            type="text"
                            value={item.product}
                            onChange={(e) => {
                              const updated = [...poForm.items];
                              updated[idx].product = e.target.value;
                              setPoForm({ ...poForm, items: updated });
                            }}
                            className="w-full p-2 bg-white border border-line rounded-xl font-semibold text-xs"
                          />
                        </div>

                        <div className="col-span-2">
                          <label className="text-[9.5px] font-bold text-muted uppercase block">
                            Quantity
                          </label>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => {
                              const updated = [...poForm.items];
                              updated[idx].quantity = Number.parseInt(e.target.value) || 0;
                              setPoForm({ ...poForm, items: updated });
                            }}
                            className="w-full p-2 bg-white border border-line rounded-xl font-bold text-purple-900 text-xs"
                          />
                        </div>

                        <div className="col-span-2">
                          <label className="text-[9.5px] font-bold text-muted uppercase block">
                            Unit Price (₹)
                          </label>
                          <input
                            type="number"
                            value={item.price}
                            onChange={(e) => {
                              const updated = [...poForm.items];
                              updated[idx].price = Number.parseFloat(e.target.value) || 0;
                              setPoForm({ ...poForm, items: updated });
                            }}
                            className="w-full p-2 bg-white border border-line rounded-xl font-bold text-emerald-700 text-xs"
                          />
                        </div>

                        <div className="col-span-2">
                          <label className="text-[9.5px] font-bold text-muted uppercase block">
                            GST %
                          </label>
                          <input
                            type="number"
                            value={item.gstPct}
                            onChange={(e) => {
                              const updated = [...poForm.items];
                              updated[idx].gstPct = Number.parseFloat(e.target.value) || 0;
                              setPoForm({ ...poForm, items: updated });
                            }}
                            className="w-full p-2 bg-white border border-line rounded-xl font-semibold text-xs"
                          />
                        </div>

                        <div className="col-span-2 flex items-center justify-between gap-1">
                          <div>
                            <label className="text-[9.5px] font-bold text-muted uppercase block">
                              Discount (₹)
                            </label>
                            <input
                              type="number"
                              value={item.discount}
                              onChange={(e) => {
                                const updated = [...poForm.items];
                                updated[idx].discount = Number.parseFloat(e.target.value) || 0;
                                setPoForm({ ...poForm, items: updated });
                              }}
                              className="w-full p-2 bg-white border border-line rounded-xl font-semibold text-xs"
                            />
                          </div>
                          {poForm.items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveItemRow(idx)}
                              className="text-rose-600 hover:text-rose-800 bg-transparent border-0 cursor-pointer p-1 mt-4"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2.5 pt-4 border-t border-line">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-5 py-2.5 border border-line rounded-xl text-xs font-bold text-soft cursor-pointer bg-transparent"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#5A2EA6] hover:bg-[#482387] text-white rounded-xl text-xs font-bold shadow cursor-pointer border-0"
                  >
                    Submit Purchase Order
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
