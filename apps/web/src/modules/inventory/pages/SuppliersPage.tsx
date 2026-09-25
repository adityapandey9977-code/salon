import { useToast } from '@salon-spa-saas/ui';
import {
  Boxes,
  Building,
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  FileText,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  ShoppingCart,
  Star,
  TrendingUp,
  Truck,
  X,
} from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { createPortal } from 'react-dom';

export function SuppliersPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<
    'suppliers' | 'products' | 'orders' | 'invoices' | 'payments' | 'performance'
  >('suppliers');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Supplier Form State with all user-requested fields
  const [supplierForm, setSupplierForm] = useState({
    supplierName: '',
    company: '',
    gstNumber: '',
    phone: '',
    email: '',
    address: '',
    paymentTerms: 'Net 30 Days',
    leadTime: '2 Days',
    rating: '4.8',
    status: 'Active',
  });

  const [suppliers, setSuppliers] = useState([
    {
      id: 'SUP-01',
      supplierName: 'Vikram Sethi',
      company: 'L’Oréal India Ltd',
      gstNumber: '27AAAAA0000A1Z5',
      phone: '+91 98112 00112',
      email: 'orders@loreal.co.in',
      address: 'Plot 42, MIDC Industrial Area, Mumbai, MH - 400093',
      paymentTerms: 'Net 30 Days',
      leadTime: '2 Days',
      rating: '4.9 ★',
      status: 'Active',
      onTimeScore: '98.5%',
      activePOs: 3,
      totalSpend: '₹14,50,000',
    },
    {
      id: 'SUP-02',
      supplierName: 'Ananya Roy',
      company: 'Luxury Beauty Distributors',
      gstNumber: '27BBBBB1111B2Z6',
      phone: '+91 98334 11223',
      email: 'sales@luxurybeauty.in',
      address: 'Suite 104, Trade Centre, Lower Parel, Mumbai - 400013',
      paymentTerms: 'Net 15 Days',
      leadTime: '3 Days',
      rating: '4.7 ★',
      status: 'Active',
      onTimeScore: '94.2%',
      activePOs: 2,
      totalSpend: '₹8,20,000',
    },
    {
      id: 'SUP-03',
      supplierName: 'Rajesh Sharma',
      company: 'Olaplex India Pvt Ltd',
      gstNumber: '27CCCCC2222C3Z7',
      phone: '+91 98777 44556',
      email: 'supply@olaplex.in',
      address: 'Building 8, Cyber City, Gurugram, HR - 122002',
      paymentTerms: 'Advance Payment',
      leadTime: '1 Day',
      rating: '4.8 ★',
      status: 'Active',
      onTimeScore: '96.0%',
      activePOs: 1,
      totalSpend: '₹6,40,000',
    },
  ]);

  const handleAddSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierForm.company || !supplierForm.supplierName || !supplierForm.phone) {
      toast('Validation Error: Please fill in company name, contact person, and phone number.');
      return;
    }

    const newSup = {
      id: `SUP-${Math.floor(10 + Math.random() * 90)}`,
      ...supplierForm,
      rating: `${supplierForm.rating} ★`,
      onTimeScore: '98.0%',
      activePOs: 0,
      totalSpend: '₹0',
    };

    setSuppliers([newSup, ...suppliers]);
    setIsAddModalOpen(false);
    toast(`Supplier Registered: ${newSup.company} added to authorized vendor list.`);
  };

  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.gstNumber.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-ink tracking-tight">
            Supplier & Distributor Management
          </h1>
          <p className="text-xs text-soft mt-1">
            Maintain supplier master directory, GSTIN details, lead times, purchase orders,
            invoices, and vendor SLA performance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#5A2EA6] hover:bg-[#482387] text-white text-xs font-bold rounded-xl shadow cursor-pointer transition-all border-0"
          >
            <Plus className="w-4 h-4" />
            Add Supplier Profile
          </button>

          <button
            onClick={() => toast('Export Suppliers: Supplier list exported to CSV.')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-purple-600 text-purple-600 bg-white hover:bg-purple-50 transition-all shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-purple-600" />
            Export Suppliers
          </button>
        </div>
      </div>

      {/* SUB-TABS: Suppliers, Products, Purchase Orders, Invoices, Payments, Performance */}
      <div className="flex overflow-x-auto gap-2 border-b border-line pb-2 no-scrollbar">
        {[
          { id: 'suppliers', label: 'All Suppliers Directory', count: suppliers.length },
          { id: 'products', label: 'Supplied Products', count: 18 },
          { id: 'orders', label: 'Purchase Orders', count: 6 },
          { id: 'invoices', label: 'Vendor Invoices', count: 14 },
          { id: 'payments', label: 'Payment Ledger', count: 12 },
          { id: 'performance', label: 'Performance SLA', count: null },
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
            {tab.count !== null && (
              <span className="ml-1.5 px-1.5 py-0.2 text-[10px] bg-white/20 text-current rounded-full">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* SEARCH BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-line shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search by company, contact person, or GSTIN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-pine/10 border border-line rounded-xl outline-none focus:border-purple-600"
          />
        </div>
        <div className="text-xs text-soft font-medium">
          Showing <span className="font-bold text-ink">{filteredSuppliers.length}</span> active
          suppliers
        </div>
      </div>

      {/* TAB 1: ALL SUPPLIERS DIRECTORY */}
      {activeTab === 'suppliers' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredSuppliers.map((s) => (
            <div
              key={s.id}
              className="bg-white p-5 rounded-2xl border border-line shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-line pb-2">
                  <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full">
                    {s.id}
                  </span>
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-500" /> {s.rating}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-ink">{s.company}</h3>
                  <div className="text-xs text-purple-700 font-semibold mt-0.5">
                    Contact Rep: {s.supplierName}
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-soft">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-purple-600 shrink-0" /> {s.phone}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-purple-600 shrink-0" /> {s.email}
                  </div>
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />{' '}
                    <span className="line-clamp-2">{s.address}</span>
                  </div>

                  <div className="pt-2 border-t border-line/60 grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-muted block text-[10px]">GSTIN Number</span>
                      <span className="font-mono font-bold text-ink">{s.gstNumber}</span>
                    </div>
                    <div>
                      <span className="text-muted block text-[10px]">Payment Terms</span>
                      <span className="font-bold text-purple-700">{s.paymentTerms}</span>
                    </div>
                    <div>
                      <span className="text-muted block text-[10px]">Lead Time</span>
                      <span className="font-bold text-emerald-700">{s.leadTime}</span>
                    </div>
                    <div>
                      <span className="text-muted block text-[10px]">Status</span>
                      <span className="font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded-full text-[9.5px]">
                        {s.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-pine/5 rounded-xl flex justify-between items-center text-xs border border-line">
                <div>
                  <div className="text-[10px] text-soft">On-Time SLA</div>
                  <div className="font-bold text-emerald-700">{s.onTimeScore}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-soft">Total Volume</div>
                  <div className="font-bold text-ink">{s.totalSpend}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: SUPPLIED PRODUCTS */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-2xl border border-line p-5 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-ink">Supplier Product Catalog Mapping</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-pine/5 text-soft uppercase font-semibold border-b border-line">
                  <th className="p-3">Supplier Company</th>
                  <th className="p-3">Product Name & SKU</th>
                  <th className="p-3">UOM</th>
                  <th className="p-3">Contract Purchase Price</th>
                  <th className="p-3">Lead Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/40">
                <tr className="hover:bg-purple-50/30">
                  <td className="p-3 font-bold text-ink">L’Oréal India Ltd</td>
                  <td className="p-3 font-semibold text-purple-900">
                    Developer 20Vol (LOR-DEV-20V)
                  </td>
                  <td className="p-3">1000 ml</td>
                  <td className="p-3 font-bold text-emerald-700">₹850</td>
                  <td className="p-3 text-soft font-medium">2 Days</td>
                </tr>
                <tr className="hover:bg-purple-50/30">
                  <td className="p-3 font-bold text-ink">Luxury Beauty Distributors</td>
                  <td className="p-3 font-semibold text-purple-900">
                    Kérastase Nutritive Mask (KER-NUT-500)
                  </td>
                  <td className="p-3">500 ml</td>
                  <td className="p-3 font-bold text-emerald-700">₹2,400</td>
                  <td className="p-3 text-soft font-medium">3 Days</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PURCHASE ORDERS */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl border border-line p-5 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-ink">Supplier Active & Past Purchase Orders</h3>
          <div className="space-y-2 text-xs">
            <div className="p-3 bg-pine/5 rounded-xl border border-line flex justify-between items-center">
              <div>
                <div className="font-bold text-purple-700">PO-4091 • L’Oréal India Ltd</div>
                <div className="text-[11px] text-soft">6 SKUs • Expected Delivery: Today</div>
              </div>
              <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-full font-bold text-[10px]">
                In-Transit
              </span>
            </div>
            <div className="p-3 bg-pine/5 rounded-xl border border-line flex justify-between items-center">
              <div>
                <div className="font-bold text-purple-700">
                  PO-4092 • Luxury Beauty Distributors
                </div>
                <div className="text-[11px] text-soft">3 SKUs • Total: ₹18,200</div>
              </div>
              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px]">
                Approved
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: INVOICES */}
      {activeTab === 'invoices' && (
        <div className="bg-white rounded-2xl border border-line p-5 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-ink">Supplier Vendor Invoices</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-pine/5 text-soft uppercase font-semibold border-b border-line">
                  <th className="p-3">Invoice No & Date</th>
                  <th className="p-3">Supplier</th>
                  <th className="p-3">PO Reference</th>
                  <th className="p-3">Invoice Amount</th>
                  <th className="p-3">Verification Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/40">
                <tr className="hover:bg-purple-50/30">
                  <td className="p-3 font-bold text-ink">INV-88401 (2026-08-05)</td>
                  <td className="p-3 text-purple-700 font-semibold">L’Oréal India Ltd</td>
                  <td className="p-3 font-mono">PO-4091</td>
                  <td className="p-3 font-bold text-emerald-700">₹42,500</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold">
                      Verified GRN
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: PAYMENTS */}
      {activeTab === 'payments' && (
        <div className="bg-white rounded-2xl border border-line p-5 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-ink">Vendor Payment Ledger & Due Dates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 space-y-2">
              <div className="font-bold text-purple-900">L’Oréal India Ltd (Net 30 Days)</div>
              <div className="text-base font-bold text-ink">₹42,500 Outstanding</div>
              <div className="text-[11px] text-purple-700">Due Date: 2026-09-04 (In 28 Days)</div>
            </div>
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
              <div className="font-bold text-emerald-900">
                Luxury Beauty Distributors (Net 15 Days)
              </div>
              <div className="text-base font-bold text-emerald-900">₹0 (Paid in Full)</div>
              <div className="text-[11px] text-emerald-700">Last Payment: 2026-08-01</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: PERFORMANCE SLA */}
      {activeTab === 'performance' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-line shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-ink">Supplier On-Time Delivery Ratings</h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-xl">
                <div>
                  <div className="font-bold text-emerald-900">L’Oréal India Ltd</div>
                  <div className="text-[10px] text-soft">Avg Lead Time: 1.8 Days</div>
                </div>
                <div className="font-bold text-emerald-800 text-sm">98.5% SLA Score</div>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-xl">
                <div>
                  <div className="font-bold text-purple-900">Olaplex India Pvt Ltd</div>
                  <div className="text-[10px] text-soft">Avg Lead Time: 1.0 Day</div>
                </div>
                <div className="font-bold text-purple-800 text-sm">96.0% SLA Score</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD SUPPLIER MODAL (Wide max-w-3xl createPortal at document.body level) */}
      {isAddModalOpen &&
        createPortal(
          <div className="fixed inset-0 bg-[#3B2647]/50 backdrop-blur-sm z-[9999] overflow-y-auto flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[32px] w-full max-w-3xl shadow-[0_25px_60px_rgba(90,46,166,0.18)] p-6 space-y-4 border border-[#5A2EA6]/10">
              <div className="flex justify-between items-center border-b border-line pb-3">
                <h3 className="font-serif text-[18px] text-[#3B2647] font-bold tracking-tight">
                  Add Authorized Supplier Profile
                </h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-soft hover:text-ink transition bg-transparent border-0 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddSupplier} className="space-y-3.5 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      Company Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. L’Oréal India Ltd"
                      value={supplierForm.company}
                      onChange={(e) =>
                        setSupplierForm({ ...supplierForm, company: e.target.value })
                      }
                      className="w-full p-2.5 bg-paper/30 border border-line rounded-xl outline-none focus:border-[#5A2EA6] text-ink font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      Contact Representative Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikram Sethi"
                      value={supplierForm.supplierName}
                      onChange={(e) =>
                        setSupplierForm({ ...supplierForm, supplierName: e.target.value })
                      }
                      className="w-full p-2.5 bg-paper/30 border border-line rounded-xl outline-none focus:border-[#5A2EA6] text-ink font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      GSTIN Tax Number
                    </label>
                    <input
                      type="text"
                      placeholder="27AAAAA0000A1Z5"
                      value={supplierForm.gstNumber}
                      onChange={(e) =>
                        setSupplierForm({ ...supplierForm, gstNumber: e.target.value })
                      }
                      className="w-full p-2.5 bg-paper/30 border border-line rounded-xl outline-none focus:border-[#5A2EA6] text-ink font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="+91 98112 00112"
                      value={supplierForm.phone}
                      onChange={(e) => setSupplierForm({ ...supplierForm, phone: e.target.value })}
                      className="w-full p-2.5 bg-paper/30 border border-line rounded-xl outline-none focus:border-[#5A2EA6] text-ink font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="orders@loreal.co.in"
                      value={supplierForm.email}
                      onChange={(e) => setSupplierForm({ ...supplierForm, email: e.target.value })}
                      className="w-full p-2.5 bg-paper/30 border border-line rounded-xl outline-none focus:border-[#5A2EA6] text-ink font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                    Warehouse Address
                  </label>
                  <input
                    type="text"
                    placeholder="Plot 42, MIDC Industrial Area, Mumbai, MH - 400093"
                    value={supplierForm.address}
                    onChange={(e) => setSupplierForm({ ...supplierForm, address: e.target.value })}
                    className="w-full p-2.5 bg-paper/30 border border-line rounded-xl outline-none focus:border-[#5A2EA6] text-ink font-semibold"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      Payment Terms
                    </label>
                    <select
                      value={supplierForm.paymentTerms}
                      onChange={(e) =>
                        setSupplierForm({ ...supplierForm, paymentTerms: e.target.value })
                      }
                      className="w-full p-2.5 bg-paper/30 border border-line rounded-xl outline-none focus:border-[#5A2EA6] text-ink font-semibold cursor-pointer"
                    >
                      <option value="Net 30 Days">Net 30 Days</option>
                      <option value="Net 15 Days">Net 15 Days</option>
                      <option value="Advance Payment">Advance Payment</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      Lead Time
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2 Days"
                      value={supplierForm.leadTime}
                      onChange={(e) =>
                        setSupplierForm({ ...supplierForm, leadTime: e.target.value })
                      }
                      className="w-full p-2.5 bg-paper/30 border border-line rounded-xl outline-none focus:border-[#5A2EA6] text-ink font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      Vendor Rating
                    </label>
                    <input
                      type="text"
                      placeholder="4.9"
                      value={supplierForm.rating}
                      onChange={(e) => setSupplierForm({ ...supplierForm, rating: e.target.value })}
                      className="w-full p-2.5 bg-paper/30 border border-line rounded-xl outline-none focus:border-[#5A2EA6] text-ink font-semibold"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2.5 pt-4 border-t border-line">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-5 py-2.5 border border-line rounded-xl text-xs font-bold text-soft cursor-pointer bg-transparent"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#5A2EA6] hover:bg-[#482387] text-white rounded-xl text-xs font-bold shadow cursor-pointer border-0"
                  >
                    Save Supplier Profile
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
