import { Button, cn } from '@salon-spa-saas/ui';
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock,
  DollarSign,
  Download,
  Edit,
  ExternalLink,
  Eye,
  FileText,
  Filter,
  Layers,
  Mail,
  MapPin,
  Package,
  Phone,
  Plus,
  RotateCcw,
  Search,
  ShoppingCart,
  Truck,
  UserCheck,
  X,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AddSupplierModal } from './AddSupplierModal';
import { CreatePOModal } from './CreatePOModal';
import { InitiatePurchaseReturnModal } from './InitiatePurchaseReturnModal';

// Mock Purchase Order
export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierName: string;
  supplierCode: string;
  branchName: string;
  branchId: string;
  orderDate: string;
  expectedDate: string;
  totalItems: number;
  subtotal: string;
  discount: string;
  tax: string;
  totalValue: string;
  status:
    | 'Draft'
    | 'Pending Approval'
    | 'Approved'
    | 'Ordered'
    | 'Partially Received'
    | 'Fully Received'
    | 'Cancelled'
    | 'Closed';
  createdBy: string;
  receivingProgress: {
    orderedQty: number;
    receivedQty: number;
    pendingQty: number;
  };
  items: {
    productName: string;
    sku: string;
    quantity: number;
    unit: string;
    unitCost: string;
    taxPct: string;
    totalAmount: string;
    receivedQty: number;
  }[];
  timeline: {
    stage: string;
    timestamp: string;
    user: string;
    isDone: boolean;
  }[];
}

// Mock Supplier
export interface Supplier {
  id: string;
  code: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  gstin: string;
  categories: string[];
  branchesServed: string[];
  activePOs: number;
  totalPurchaseValue: string;
  lastPurchaseDate: string;
  paymentTerms: string;
  status: 'Active' | 'Under Review' | 'Inactive';
}

// Mock Goods Receipt Note (GRN)
export interface GoodsReceipt {
  id: string;
  grnNumber: string;
  poNumber: string;
  supplierName: string;
  branchName: string;
  receiptDate: string;
  totalItems: number;
  totalQuantity: number;
  totalValue: string;
  verifiedBy: string;
  status: 'Draft' | 'Received' | 'Partially Received' | 'Verified' | 'Rejected';
  items: {
    productName: string;
    batchNumber: string;
    expiryDate: string;
    orderedQty: number;
    receivedQty: number;
    unitCost: string;
  }[];
}

// Mock Purchase Return
export interface PurchaseReturn {
  id: string;
  supplierName: string;
  branchName: string;
  productName: string;
  quantity: number;
  unit: string;
  reason:
    | 'Damaged in Transit'
    | 'Near Expiry Spoilage'
    | 'Wrong Variant Received'
    | 'Quality Defect'
    | string;
  amount: string;
  returnDate: string;
  status: 'Requested' | 'Approved' | 'Processed' | 'Rejected' | 'Completed';
  creditNoteRef: string;
}

const mockPOs: PurchaseOrder[] = [
  {
    id: 'PO-001',
    poNumber: 'PO-2026-0814',
    supplierName: 'L’Oréal India Distribution Hub',
    supplierCode: 'SUP-LOR-01',
    branchName: 'Indore Central Flagship',
    branchId: 'BR-01',
    orderDate: '14 Aug 2026',
    expectedDate: '20 Aug 2026',
    totalItems: 4,
    subtotal: '₹1,20,000',
    discount: '₹6,000',
    tax: '₹20,520',
    totalValue: '₹1,34,520',
    status: 'Ordered',
    createdBy: 'Sunil Rao (Storekeeper)',
    receivingProgress: { orderedQty: 180, receivedQty: 0, pendingQty: 180 },
    items: [
      {
        productName: "L'Oréal Majirel Colour Tube 6.13",
        sku: 'SKU-MAJ-613',
        quantity: 80,
        unit: 'Tubes',
        unitCost: '₹340',
        taxPct: '18%',
        totalAmount: '₹32,096',
        receivedQty: 0,
      },
      {
        productName: "L'Oréal Oxydant Developer 20 Vol",
        sku: 'SKU-LOR-DEV20',
        quantity: 30,
        unit: 'Bottles',
        unitCost: '₹420',
        taxPct: '18%',
        totalAmount: '₹14,868',
        receivedQty: 0,
      },
      {
        productName: "L'Oréal Absolut Repair Shampoo (500ml)",
        sku: 'SKU-LOR-001',
        quantity: 50,
        unit: 'Bottles',
        unitCost: '₹850',
        taxPct: '18%',
        totalAmount: '₹50,150',
        receivedQty: 0,
      },
      {
        productName: "L'Oréal Liss Unlimited Mask (500ml)",
        sku: 'SKU-LOR-MSK',
        quantity: 20,
        unit: 'Tubs',
        unitCost: '₹950',
        taxPct: '18%',
        totalAmount: '₹22,420',
        receivedQty: 0,
      },
    ],
    timeline: [
      { stage: 'PO Draft Created', timestamp: '14 Aug, 10:30 AM', user: 'Sunil Rao', isDone: true },
      {
        stage: 'Brand Owner Approved',
        timestamp: '14 Aug, 02:15 PM',
        user: 'Aditya Pandey',
        isDone: true,
      },
      {
        stage: 'Dispatched by Vendor',
        timestamp: '16 Aug, 11:00 AM',
        user: 'L’Oréal Logistics',
        isDone: true,
      },
      {
        stage: 'Goods Received (GRN)',
        timestamp: 'Pending Arrival',
        user: 'Storekeeper',
        isDone: false,
      },
      {
        stage: 'Finance Payment Release',
        timestamp: 'Scheduled in Finance',
        user: 'Finance Panel',
        isDone: false,
      },
    ],
  },
  {
    id: 'PO-002',
    poNumber: 'PO-2026-0810',
    supplierName: 'O3+ Direct Skin Care Supply',
    supplierCode: 'SUP-O3-02',
    branchName: 'Vijay Nagar Boutique',
    branchId: 'BR-02',
    orderDate: '10 Aug 2026',
    expectedDate: '15 Aug 2026',
    totalItems: 2,
    subtotal: '₹57,000',
    discount: '₹2,850',
    tax: '₹9,747',
    totalValue: '₹63,897',
    status: 'Partially Received',
    createdBy: 'Kunal Sen (Floor Mgr)',
    receivingProgress: { orderedQty: 60, receivedQty: 40, pendingQty: 20 },
    items: [
      {
        productName: 'O3+ Seaweed Facial Kit Pods',
        sku: 'SKU-O3-SEA01',
        quantity: 40,
        unit: 'Kits',
        unitCost: '₹950',
        taxPct: '18%',
        totalAmount: '₹44,840',
        receivedQty: 40,
      },
      {
        productName: 'O3+ D-Tan Brightening Pack (500gm)',
        sku: 'SKU-O3-DTAN',
        quantity: 20,
        unit: 'Jars',
        unitCost: '₹850',
        taxPct: '18%',
        totalAmount: '₹20,060',
        receivedQty: 0,
      },
    ],
    timeline: [
      { stage: 'PO Draft Created', timestamp: '10 Aug, 09:00 AM', user: 'Kunal Sen', isDone: true },
      {
        stage: 'Brand Owner Approved',
        timestamp: '10 Aug, 01:30 PM',
        user: 'Aditya Pandey',
        isDone: true,
      },
      {
        stage: 'Partial GRN Verification',
        timestamp: '15 Aug, 03:20 PM',
        user: 'Vijay Nagar Store',
        isDone: true,
      },
      {
        stage: 'Remaining Stock In-Transit',
        timestamp: 'Expected 19 Aug',
        user: 'O3+ Courier',
        isDone: false,
      },
    ],
  },
  {
    id: 'PO-003',
    poNumber: 'PO-2026-0818',
    supplierName: 'Luxury Beauty Brands LLP',
    supplierCode: 'SUP-LBB-03',
    branchName: 'Bhopal Arera Colony',
    branchId: 'BR-03',
    orderDate: '18 Aug 2026',
    expectedDate: '24 Aug 2026',
    totalItems: 3,
    subtotal: '₹1,85,000',
    discount: '₹9,250',
    tax: '₹31,635',
    totalValue: '₹2,07,385',
    status: 'Pending Approval',
    createdBy: 'Kavita Nair (Branch Manager)',
    receivingProgress: { orderedQty: 90, receivedQty: 0, pendingQty: 90 },
    items: [
      {
        productName: 'Kérastase Elixir Ultime Hair Oil (100ml)',
        sku: 'SKU-KER-OIL01',
        quantity: 40,
        unit: 'Bottles',
        unitCost: '₹2,400',
        taxPct: '18%',
        totalAmount: '₹1,13,280',
        receivedQty: 0,
      },
      {
        productName: 'Moroccanoil Treatment Original (100ml)',
        sku: 'SKU-MOR-TRT01',
        quantity: 30,
        unit: 'Bottles',
        unitCost: '₹2,200',
        taxPct: '18%',
        totalAmount: '₹77,880',
        receivedQty: 0,
      },
      {
        productName: 'Moroccanoil Luminous Hairspray',
        sku: 'SKU-MOR-SPR01',
        quantity: 20,
        unit: 'Cans',
        unitCost: '₹1,650',
        taxPct: '18%',
        totalAmount: '₹38,940',
        receivedQty: 0,
      },
    ],
    timeline: [
      {
        stage: 'PO Draft Submitted',
        timestamp: '18 Aug, 10:15 AM',
        user: 'Kavita Nair',
        isDone: true,
      },
      {
        stage: 'Head Office Maker-Checker Review',
        timestamp: 'Awaiting Sign-off',
        user: 'Aditya Pandey',
        isDone: false,
      },
    ],
  },
  {
    id: 'PO-004',
    poNumber: 'PO-2026-0801',
    supplierName: 'L’Oréal India Distribution Hub',
    supplierCode: 'SUP-LOR-01',
    branchName: 'Indore Central Flagship',
    branchId: 'BR-01',
    orderDate: '01 Aug 2026',
    expectedDate: '06 Aug 2026',
    totalItems: 5,
    subtotal: '₹2,40,000',
    discount: '₹12,000',
    tax: '₹41,040',
    totalValue: '₹2,69,040',
    status: 'Fully Received',
    createdBy: 'Sunil Rao (Storekeeper)',
    receivingProgress: { orderedQty: 320, receivedQty: 320, pendingQty: 0 },
    items: [],
    timeline: [
      {
        stage: 'PO Created & Approved',
        timestamp: '01 Aug 2026',
        user: 'Aditya Pandey',
        isDone: true,
      },
      {
        stage: 'Full GRN Verified & Stocked',
        timestamp: '06 Aug 2026',
        user: 'Sunil Rao',
        isDone: true,
      },
      {
        stage: 'Settled via Finance Panel',
        timestamp: '10 Aug 2026',
        user: 'Accounts Desk',
        isDone: true,
      },
    ],
  },
];

const mockSuppliers: Supplier[] = [
  {
    id: 'SUP-001',
    code: 'SUP-LOR-01',
    name: 'L’Oréal India Distribution Hub',
    contactPerson: 'Vikram Joshi (National Key Account Mgr)',
    phone: '+91 98260 11450',
    email: 'b2b.orders@loreal-india.com',
    address: 'Plot 44, Industrial Area, Sector 3, Pithampur, MP - 454775',
    gstin: '23AABCL1234F1ZX',
    categories: ['Hair Care', 'Colour & Chemical', 'Hair Treatments'],
    branchesServed: ['Indore Central', 'Vijay Nagar', 'Bhopal', 'Ujjain', 'Gwalior'],
    activePOs: 2,
    totalPurchaseValue: '₹14,80,000',
    lastPurchaseDate: '14 Aug 2026',
    paymentTerms: 'Net 30 Days (Direct Bank Transfer)',
    status: 'Active',
  },
  {
    id: 'SUP-002',
    code: 'SUP-O3-02',
    name: 'O3+ Direct Skin Care Supply',
    contactPerson: 'Meera Chawla (Regional Sales Lead)',
    phone: '+91 98930 22780',
    email: 'orders@o3pluspro.com',
    address: 'C-12, Commercial Enclave, Arera Hills, Bhopal, MP - 462011',
    gstin: '23AABCO5566G1ZB',
    categories: ['Skin & Aesthetics', 'Spa & Body'],
    branchesServed: ['Indore Central', 'Vijay Nagar', 'Bhopal'],
    activePOs: 1,
    totalPurchaseValue: '₹6,40,000',
    lastPurchaseDate: '10 Aug 2026',
    paymentTerms: 'Net 15 Days (Advance 20%)',
    status: 'Active',
  },
  {
    id: 'SUP-003',
    code: 'SUP-LBB-03',
    name: 'Luxury Beauty Brands LLP',
    contactPerson: 'Arunav Sengupta (Director B2B)',
    phone: '+91 98110 99820',
    email: 'supply@luxurybeautybrands.in',
    address: 'Warehouse 9, Logix Logistics Park, Dewas Naka, Indore - 452010',
    gstin: '23AABCL9988H1ZR',
    categories: ['Hair Care', 'Luxury Styling', 'Argan Oil'],
    branchesServed: ['Indore Central', 'Vijay Nagar', 'Bhopal', 'Gwalior'],
    activePOs: 1,
    totalPurchaseValue: '₹9,20,000',
    lastPurchaseDate: '18 Aug 2026',
    paymentTerms: 'Net 45 Days',
    status: 'Active',
  },
];

const mockGRNs: GoodsReceipt[] = [
  {
    id: 'GRN-001',
    grnNumber: 'GRN-2026-109',
    poNumber: 'PO-2026-0810',
    supplierName: 'O3+ Direct Skin Care Supply',
    branchName: 'Vijay Nagar Boutique',
    receiptDate: '15 Aug 2026',
    totalItems: 1,
    totalQuantity: 40,
    totalValue: '₹44,840',
    verifiedBy: 'Kunal Sen (Floor Mgr)',
    status: 'Verified',
    items: [
      {
        productName: 'O3+ Seaweed Facial Kit Pods',
        batchNumber: 'LOT-O3-8812',
        expiryDate: '24 Jun 2027',
        orderedQty: 40,
        receivedQty: 40,
        unitCost: '₹950',
      },
    ],
  },
  {
    id: 'GRN-002',
    grnNumber: 'GRN-2026-104',
    poNumber: 'PO-2026-0801',
    supplierName: 'L’Oréal India Distribution Hub',
    branchName: 'Indore Central Flagship',
    receiptDate: '06 Aug 2026',
    totalItems: 5,
    totalQuantity: 320,
    totalValue: '₹2,69,040',
    verifiedBy: 'Sunil Rao (Storekeeper)',
    status: 'Verified',
    items: [
      {
        productName: "L'Oréal Absolut Repair Shampoo (500ml)",
        batchNumber: 'LOT-LOR-2601',
        expiryDate: '15 Mar 2028',
        orderedQty: 100,
        receivedQty: 100,
        unitCost: '₹850',
      },
    ],
  },
];

const mockReturns: PurchaseReturn[] = [
  {
    id: 'RET-PUR-001',
    supplierName: 'L’Oréal India Distribution Hub',
    branchName: 'Vijay Nagar Boutique',
    productName: "L'Oréal Majirel Colour Tube - 6.13",
    quantity: 6,
    unit: 'Tubes',
    reason: 'Near Expiry Spoilage',
    amount: '₹2,040',
    returnDate: '12 Aug 2026',
    status: 'Processed',
    creditNoteRef: 'CN-LOR-2026-991',
  },
  {
    id: 'RET-PUR-002',
    supplierName: 'Luxury Beauty Brands LLP',
    branchName: 'Indore Central Flagship',
    productName: 'Moroccanoil Treatment Original (100ml)',
    quantity: 2,
    unit: 'Bottles',
    reason: 'Damaged in Transit',
    amount: '₹4,400',
    returnDate: '08 Aug 2026',
    status: 'Completed',
    creditNoteRef: 'CN-LBB-2026-102',
  },
];

export function ProcurementTab() {
  const [posList, setPosList] = useState<PurchaseOrder[]>(mockPOs);
  const [suppliersList, setSuppliersList] = useState<Supplier[]>(mockSuppliers);
  const [returnsList, setReturnsList] = useState<PurchaseReturn[]>(mockReturns);

  const [activeSubTab, setActiveSubTab] = useState<'po' | 'suppliers' | 'grn' | 'returns'>('po');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Selected Detail Modals & Workflow Modals
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isAddSupplierModalOpen, setIsAddSupplierModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [isCreatePOModalOpen, setIsCreatePOModalOpen] = useState(false);
  const [defaultPOSupplierId, setDefaultPOSupplierId] = useState<string | undefined>(undefined);
  const [isInitiateReturnOpen, setIsInitiateReturnOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveSupplier = (savedSupplier: Supplier) => {
    const exists = suppliersList.some((s) => s.id === savedSupplier.id);
    if (exists) {
      setSuppliersList(suppliersList.map((s) => (s.id === savedSupplier.id ? savedSupplier : s)));
      showToast(
        `Vendor profile for "${savedSupplier.name}" (${savedSupplier.code}) updated successfully.`,
      );
    } else {
      setSuppliersList([savedSupplier, ...suppliersList]);
      showToast(`New Vendor "${savedSupplier.name}" registered and approved for PO generation.`);
    }
  };

  const handleSavePO = (newPO: PurchaseOrder) => {
    setPosList([newPO, ...posList]);
    showToast(
      `Purchase Order ${newPO.poNumber} generated for ${newPO.supplierName} (${newPO.totalValue}).`,
    );
  };

  const handleSavePurchaseReturn = (newReturn: PurchaseReturn) => {
    setReturnsList([newReturn, ...returnsList]);
    showToast(
      `Return ${newReturn.id} processed for ${newReturn.supplierName} (Debit Note: ${newReturn.creditNoteRef}).`,
    );
  };

  const handleOpenCreatePOForSupplier = (s: Supplier) => {
    setSelectedSupplier(null);
    setDefaultPOSupplierId(s.id);
    setIsCreatePOModalOpen(true);
  };

  const handleOpenEditSupplier = (s: Supplier) => {
    setSelectedSupplier(null);
    setEditingSupplier(s);
    setIsAddSupplierModalOpen(true);
  };

  useEffect(() => {
    if (selectedPO || selectedSupplier) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedPO, selectedSupplier]);

  const getPOStatusBadge = (st: PurchaseOrder['status']) => {
    switch (st) {
      case 'Approved':
      case 'Fully Received':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Ordered':
      case 'Partially Received':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Pending Approval':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // Filtered POs
  const filteredPOs = posList.filter((po) => {
    if (selectedBranch !== 'all' && po.branchId !== selectedBranch) return false;
    if (selectedStatus !== 'all' && po.status !== selectedStatus) return false;
    if (searchTerm) {
      const match =
        `${po.poNumber} ${po.supplierName} ${po.branchName} ${po.createdBy}`.toLowerCase();
      return match.includes(searchTerm.toLowerCase());
    }
    return true;
  });

  // Filtered Suppliers
  const filteredSuppliers = suppliersList.filter((s) => {
    if (searchTerm) {
      const match = `${s.name} ${s.code} ${s.contactPerson} ${s.phone}`.toLowerCase();
      return match.includes(searchTerm.toLowerCase());
    }
    return true;
  });

  // Filtered Returns
  const filteredReturns = returnsList.filter((r) => {
    if (
      selectedBranch !== 'all' &&
      !r.branchName.includes(
        selectedBranch === 'BR-01'
          ? 'Indore'
          : selectedBranch === 'BR-02'
            ? 'Vijay'
            : selectedBranch === 'BR-03'
              ? 'Bhopal'
              : 'Atelier',
      )
    )
      return false;
    if (searchTerm) {
      const match =
        `${r.id} ${r.supplierName} ${r.branchName} ${r.productName} ${r.creditNoteRef} ${r.reason}`.toLowerCase();
      return match.includes(searchTerm.toLowerCase());
    }
    return true;
  });

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
            onClick={() => setActiveSubTab('po')}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border-0 flex items-center gap-2',
              activeSubTab === 'po'
                ? 'bg-[#5A2EA6] text-white shadow-xs'
                : 'text-soft hover:text-ink',
            )}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Purchase Orders</span>
            <span className="px-1.5 py-0.5 rounded-full bg-purple-100 text-[#5A2EA6] text-[10px] font-bold">
              {posList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('suppliers')}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border-0 flex items-center gap-2',
              activeSubTab === 'suppliers'
                ? 'bg-[#5A2EA6] text-white shadow-xs'
                : 'text-soft hover:text-ink',
            )}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Suppliers Directory</span>
            <span className="px-1.5 py-0.5 rounded-full bg-purple-100 text-[#5A2EA6] text-[10px] font-bold">
              {suppliersList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('grn')}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border-0 flex items-center gap-2',
              activeSubTab === 'grn'
                ? 'bg-[#5A2EA6] text-white shadow-xs'
                : 'text-soft hover:text-ink',
            )}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Purchase Receipts (GRN)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('returns')}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border-0 flex items-center gap-2',
              activeSubTab === 'returns'
                ? 'bg-[#5A2EA6] text-white shadow-xs'
                : 'text-soft hover:text-ink',
            )}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Purchase Returns</span>
            <span className="px-1.5 py-0.5 rounded-full bg-purple-100 text-[#5A2EA6] text-[10px] font-bold">
              {returnsList.length}
            </span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() =>
              showToast(`Exporting ${activeSubTab.toUpperCase()} procurement records (CSV)...`)
            }
            className="h-[36px] px-3 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <span>Export View</span>
          </Button>

          <Button
            onClick={() => {
              if (activeSubTab === 'suppliers') {
                setEditingSupplier(null);
                setIsAddSupplierModalOpen(true);
              } else if (activeSubTab === 'po') {
                setDefaultPOSupplierId(undefined);
                setIsCreatePOModalOpen(true);
              } else if (activeSubTab === 'grn') {
                showToast('Opening Goods Receipt Note (GRN) inwarding workflow...');
              } else {
                setIsInitiateReturnOpen(true);
              }
            }}
            className="h-[36px] px-4 rounded-xl text-xs font-bold premium-btn-primary flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>
              {activeSubTab === 'suppliers'
                ? 'Add Vendor / Supplier'
                : activeSubTab === 'po'
                  ? 'Create Purchase Order'
                  : activeSubTab === 'grn'
                    ? 'Inward Goods (GRN)'
                    : 'Initiate Return'}
            </span>
          </Button>
        </div>
      </div>

      {/* 2. Global Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#5A2EA6]/15 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search PO, supplier, branch, reference..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#5A2EA6]/20 rounded-xl text-xs font-semibold text-ink placeholder:text-muted outline-none focus:border-[#5A2EA6]"
            />
          </div>

          {/* Branch Filter */}
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl py-1.5 px-3 text-xs font-bold text-ink outline-none cursor-pointer"
          >
            <option value="all">All Delivery Branches</option>
            <option value="BR-01">Indore Central Flagship</option>
            <option value="BR-02">Vijay Nagar Boutique</option>
            <option value="BR-03">Bhopal Arera Colony</option>
          </select>

          {/* Status Filter */}
          {activeSubTab === 'po' && (
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl py-1.5 px-3 text-xs font-bold text-ink outline-none cursor-pointer"
            >
              <option value="all">All PO Statuses</option>
              <option value="Pending Approval">Pending Approval</option>
              <option value="Approved">Approved</option>
              <option value="Ordered">Ordered / In-Transit</option>
              <option value="Partially Received">Partially Received</option>
              <option value="Fully Received">Fully Received</option>
            </select>
          )}
        </div>

        <span className="text-xs text-soft font-semibold">
          Showing{' '}
          {activeSubTab === 'po'
            ? filteredPOs.length
            : activeSubTab === 'suppliers'
              ? filteredSuppliers.length
              : 2}{' '}
          records
        </span>
      </div>

      {/* 3. SUB-VIEW TABLES */}
      {activeSubTab === 'po' && (
        /* SECTION 11: PURCHASE ORDERS TABLE */
        <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#5A2EA6]/10 flex flex-wrap items-center justify-between gap-3 bg-[#FCFAFF]">
            <div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#5A2EA6]" />
                <h3 className="font-serif font-bold text-ink text-base">
                  Purchase Orders Master Register
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-extrabold whitespace-nowrap">
                  Procurement Oversight
                </span>
              </div>
              <p className="text-[11px] text-muted mt-0.5">
                Head Office sign-off authority for multi-branch vendor replenishment orders
              </p>
            </div>
            <span className="text-xs text-soft font-semibold">Maker-Checker Enforced</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] tracking-wider uppercase whitespace-nowrap">
                  <th className="p-3.5 pl-5">PO Number &amp; Date</th>
                  <th className="p-3.5">Vendor / Supplier</th>
                  <th className="p-3.5">Delivery Branch</th>
                  <th className="p-3.5">Expected Delivery</th>
                  <th className="p-3.5 text-center">Line Items</th>
                  <th className="p-3.5 text-right">Order Value</th>
                  <th className="p-3.5">Created By</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 pr-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#5A2EA6]/5 font-medium text-slate-700">
                {filteredPOs.map((po) => (
                  <tr key={po.id} className="hover:bg-[#5A2EA6]/3 transition-colors">
                    {/* PO Number */}
                    <td className="p-3.5 pl-5 whitespace-nowrap">
                      <strong className="font-bold text-ink block text-xs">{po.poNumber}</strong>
                      <span className="text-[10px] text-muted">Ordered: {po.orderDate}</span>
                    </td>

                    {/* Supplier */}
                    <td className="p-3.5 whitespace-nowrap">
                      <span className="font-bold text-slate-900 block text-xs">
                        {po.supplierName}
                      </span>
                      <span className="text-[10px] text-soft">{po.supplierCode}</span>
                    </td>

                    {/* Branch */}
                    <td className="p-3.5 whitespace-nowrap">
                      <span className="font-semibold text-slate-800 block text-xs">
                        {po.branchName}
                      </span>
                      <span className="text-[10px] text-soft">{po.branchId}</span>
                    </td>

                    {/* Expected Date */}
                    <td className="p-3.5 whitespace-nowrap text-slate-700 font-semibold">
                      {po.expectedDate}
                    </td>

                    {/* Items */}
                    <td className="p-3.5 text-center whitespace-nowrap font-bold text-ink">
                      {po.totalItems} SKUs
                    </td>

                    {/* Value */}
                    <td className="p-3.5 text-right font-extrabold text-[#5A2EA6] bg-purple-50/20 whitespace-nowrap">
                      {po.totalValue}
                    </td>

                    {/* Created By */}
                    <td className="p-3.5 whitespace-nowrap text-slate-700">{po.createdBy}</td>

                    {/* Status */}
                    <td className="p-3.5 text-center whitespace-nowrap">
                      <span
                        className={cn(
                          'inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap',
                          getPOStatusBadge(po.status),
                        )}
                      >
                        {po.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 pr-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          onClick={() => setSelectedPO(po)}
                          className="h-[30px] px-2.5 rounded-lg text-[11px] font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3 text-[#5A2EA6]" />
                          <span>
                            {po.status === 'Pending Approval' ? 'Review & Approve' : 'Inspect'}
                          </span>
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

      {activeSubTab === 'suppliers' && (
        /* SECTION 13: SUPPLIERS DIRECTORY */
        <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#5A2EA6]/10 flex flex-wrap items-center justify-between gap-3 bg-[#FCFAFF]">
            <div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#5A2EA6]" />
                <h3 className="font-serif font-bold text-ink text-base">
                  Approved Vendor &amp; Supplier Directory
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-extrabold whitespace-nowrap">
                  Master Vendor Database
                </span>
              </div>
              <p className="text-[11px] text-muted mt-0.5">
                Authorized salon brand suppliers with GSTIN compliance, category mandates, and
                active PO volumes
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => {
                  setEditingSupplier(null);
                  setIsAddSupplierModalOpen(true);
                }}
                className="h-[32px] px-3.5 rounded-xl text-xs font-bold premium-btn-primary flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Vendor / Supplier</span>
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] tracking-wider uppercase whitespace-nowrap">
                  <th className="p-3.5 pl-5">Vendor Name &amp; Code</th>
                  <th className="p-3.5">Contact Person</th>
                  <th className="p-3.5">Phone &amp; Email</th>
                  <th className="p-3.5">Supplied Categories</th>
                  <th className="p-3.5 text-center">Active POs</th>
                  <th className="p-3.5 text-right">Total Procurement</th>
                  <th className="p-3.5">Last Order</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 pr-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#5A2EA6]/5 font-medium text-slate-700">
                {filteredSuppliers.map((s) => (
                  <tr key={s.id} className="hover:bg-[#5A2EA6]/3 transition-colors">
                    <td className="p-3.5 pl-5 whitespace-nowrap">
                      <strong className="font-bold text-ink block text-xs">{s.name}</strong>
                      <span className="text-[10px] text-[#5A2EA6] font-mono">
                        {s.code} · {s.gstin}
                      </span>
                    </td>

                    <td className="p-3.5 whitespace-nowrap text-slate-800 font-medium">
                      {s.contactPerson}
                    </td>

                    <td className="p-3.5 whitespace-nowrap text-[11px]">
                      <span className="text-slate-800 block font-semibold">{s.phone}</span>
                      <span className="text-muted block">{s.email}</span>
                    </td>

                    <td className="p-3.5 max-w-[200px]">
                      <div className="flex flex-wrap gap-1">
                        {s.categories.map((c, cIdx) => (
                          <span
                            key={cIdx}
                            className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-50 text-[#5A2EA6] border border-purple-100"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="p-3.5 text-center whitespace-nowrap font-bold text-ink">
                      {s.activePOs} Orders
                    </td>

                    <td className="p-3.5 text-right font-extrabold text-[#5A2EA6] bg-purple-50/20 whitespace-nowrap">
                      {s.totalPurchaseValue}
                    </td>

                    <td className="p-3.5 whitespace-nowrap text-slate-700">{s.lastPurchaseDate}</td>

                    <td className="p-3.5 text-center whitespace-nowrap">
                      <span
                        className={cn(
                          'inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap',
                          s.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : s.status === 'Under Review'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200',
                        )}
                      >
                        {s.status}
                      </span>
                    </td>

                    <td className="p-3.5 pr-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          onClick={() => handleOpenCreatePOForSupplier(s)}
                          className="h-[30px] px-2.5 rounded-lg text-[11px] font-bold border-purple-200 text-[#5A2EA6] hover:bg-purple-50 flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3 text-[#5A2EA6]" />
                          <span>Order (PO)</span>
                        </Button>

                        <Button
                          variant="outline"
                          onClick={() => handleOpenEditSupplier(s)}
                          className="h-[30px] px-2.5 rounded-lg text-[11px] font-bold border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center gap-1"
                        >
                          <Edit className="w-3 h-3 text-slate-600" />
                          <span>Edit</span>
                        </Button>

                        <Button
                          variant="outline"
                          onClick={() => setSelectedSupplier(s)}
                          className="h-[30px] px-2.5 rounded-lg text-[11px] font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3 text-[#5A2EA6]" />
                          <span>Dossier</span>
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

      {activeSubTab === 'grn' && (
        /* SECTION 14: PURCHASE RECEIPTS (GRN) */
        <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#5A2EA6]/10 flex flex-wrap items-center justify-between gap-3 bg-[#FCFAFF]">
            <div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#5A2EA6]" />
                <h3 className="font-serif font-bold text-ink text-base">
                  Goods Received Notes (GRN) Inward Register
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-extrabold whitespace-nowrap">
                  Store Intake Verification
                </span>
              </div>
              <p className="text-[11px] text-muted mt-0.5">
                Physical receiving slips confirming batch, expiry, and damaged shipment inspections
              </p>
            </div>
            <span className="text-xs text-soft font-semibold">Storekeeper Audited</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] tracking-wider uppercase whitespace-nowrap">
                  <th className="p-3.5 pl-5">GRN Number &amp; Date</th>
                  <th className="p-3.5">Referenced PO</th>
                  <th className="p-3.5">Vendor</th>
                  <th className="p-3.5">Receiving Branch</th>
                  <th className="p-3.5 text-center">Items &amp; Qty</th>
                  <th className="p-3.5 text-right">Inward Valuation</th>
                  <th className="p-3.5">Verified By</th>
                  <th className="p-3.5 text-center">GRN Status</th>
                  <th className="p-3.5 pr-5 text-right">Accounting Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#5A2EA6]/5 font-medium text-slate-700">
                {mockGRNs.map((g) => (
                  <tr key={g.id} className="hover:bg-[#5A2EA6]/3 transition-colors">
                    <td className="p-3.5 pl-5 whitespace-nowrap">
                      <strong className="font-bold text-ink block text-xs">{g.grnNumber}</strong>
                      <span className="text-[10px] text-muted">{g.receiptDate}</span>
                    </td>

                    <td className="p-3.5 whitespace-nowrap font-mono font-bold text-[#5A2EA6]">
                      {g.poNumber}
                    </td>

                    <td className="p-3.5 whitespace-nowrap font-semibold text-slate-900">
                      {g.supplierName}
                    </td>

                    <td className="p-3.5 whitespace-nowrap text-slate-800">{g.branchName}</td>

                    <td className="p-3.5 text-center whitespace-nowrap font-bold text-ink">
                      {g.totalItems} SKUs ({g.totalQuantity} pcs)
                    </td>

                    <td className="p-3.5 text-right font-extrabold text-[#5A2EA6] bg-purple-50/20 whitespace-nowrap">
                      {g.totalValue}
                    </td>

                    <td className="p-3.5 whitespace-nowrap text-slate-700">{g.verifiedBy}</td>

                    <td className="p-3.5 text-center whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                        {g.status}
                      </span>
                    </td>

                    <td className="p-3.5 pr-5 text-right whitespace-nowrap">
                      <Button
                        variant="outline"
                        onClick={() => {
                          window.location.href = '/finance?tab=transactions';
                        }}
                        className="h-[30px] px-2.5 rounded-lg text-[11px] font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1 inline-flex"
                      >
                        <span>Open in Finance</span>
                        <ExternalLink className="w-3 h-3 text-[#5A2EA6]" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'returns' && (
        /* SECTION 15: PURCHASE RETURNS */
        <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#5A2EA6]/10 flex flex-wrap items-center justify-between gap-3 bg-[#FCFAFF]">
            <div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#5A2EA6]" />
                <h3 className="font-serif font-bold text-ink text-base">
                  Vendor Purchase Returns &amp; Debit Notes
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-extrabold whitespace-nowrap">
                  Defective / Spoilage Reversals
                </span>
              </div>
              <p className="text-[11px] text-muted mt-0.5">
                Returned stock items with supplier credit note lineage tracked for finance
                reconciliation
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => setIsInitiateReturnOpen(true)}
                className="h-[32px] px-3.5 rounded-xl text-xs font-bold premium-btn-primary flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Initiate Return / Debit Note</span>
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] tracking-wider uppercase whitespace-nowrap">
                  <th className="p-3.5 pl-5">Return ID &amp; Date</th>
                  <th className="p-3.5">Vendor</th>
                  <th className="p-3.5">Branch</th>
                  <th className="p-3.5">Product &amp; Qty</th>
                  <th className="p-3.5">Reason for Return</th>
                  <th className="p-3.5 text-right">Debit Amount</th>
                  <th className="p-3.5">Credit Note Ref</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 pr-5 text-right">Finance Posting</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#5A2EA6]/5 font-medium text-slate-700">
                {filteredReturns.map((r) => (
                  <tr key={r.id} className="hover:bg-[#5A2EA6]/3 transition-colors">
                    <td className="p-3.5 pl-5 whitespace-nowrap">
                      <strong className="font-bold text-ink block text-xs">{r.id}</strong>
                      <span className="text-[10px] text-muted">{r.returnDate}</span>
                    </td>

                    <td className="p-3.5 whitespace-nowrap font-semibold text-slate-900">
                      {r.supplierName}
                    </td>

                    <td className="p-3.5 whitespace-nowrap text-slate-800">{r.branchName}</td>

                    <td className="p-3.5 whitespace-nowrap">
                      <strong className="font-bold text-ink block">{r.productName}</strong>
                      <span className="text-[10px] text-soft">
                        {r.quantity} {r.unit}
                      </span>
                    </td>

                    <td className="p-3.5 whitespace-nowrap text-amber-800 font-medium">
                      {r.reason}
                    </td>

                    <td className="p-3.5 text-right font-extrabold text-red-700 whitespace-nowrap">
                      {r.amount}
                    </td>

                    <td className="p-3.5 whitespace-nowrap font-mono text-[11px] text-[#5A2EA6]">
                      {r.creditNoteRef}
                    </td>

                    <td className="p-3.5 text-center whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                        {r.status}
                      </span>
                    </td>

                    <td className="p-3.5 pr-5 text-right whitespace-nowrap">
                      <Button
                        variant="outline"
                        onClick={() => {
                          window.location.href = '/finance?tab=refunds';
                        }}
                        className="h-[30px] px-2.5 rounded-lg text-[11px] font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1 inline-flex"
                      >
                        <span>Finance Reversal</span>
                        <ExternalLink className="w-3 h-3 text-[#5A2EA6]" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Section 12: PURCHASE ORDER DETAILS MODAL */}
      {selectedPO &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-[#3B2647]/50 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setSelectedPO(null)}
          >
            <div
              className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#5A2EA6]/20 animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-4 bg-[#FCFAFF] rounded-t-3xl">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#5A2EA6] text-white">
                      Purchase Order Dossier
                    </span>
                    <span className="text-xs font-mono font-bold text-soft">
                      {selectedPO.poNumber}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-ink text-xl mt-1">
                    Vendor: {selectedPO.supplierName}
                  </h3>
                  <p className="text-xs text-muted">
                    Delivery Destination: {selectedPO.branchName} · Expected by{' '}
                    {selectedPO.expectedDate}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedPO(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 grid place-items-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Status & Receiving Progress */}
                <div className="p-4 rounded-2xl bg-purple-50/40 border border-purple-100 grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-soft block text-[10px] uppercase font-bold">
                      Order Status
                    </span>
                    <span
                      className={cn(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border mt-1',
                        getPOStatusBadge(selectedPO.status),
                      )}
                    >
                      {selectedPO.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-soft block text-[10px] uppercase font-bold">
                      Fulfilled Progress
                    </span>
                    <strong className="text-ink font-bold block text-sm mt-0.5">
                      {selectedPO.receivingProgress.receivedQty} of{' '}
                      {selectedPO.receivingProgress.orderedQty} Items Received
                    </strong>
                  </div>
                  <div>
                    <span className="text-soft block text-[10px] uppercase font-bold">
                      Total Order Value
                    </span>
                    <strong className="text-base font-serif font-bold text-[#5A2EA6]">
                      {selectedPO.totalValue}
                    </strong>
                  </div>
                </div>

                {/* Items Ordered Table */}
                <div>
                  <h4 className="text-xs font-bold text-ink uppercase tracking-wider mb-2">
                    Replenishment Order Line Items
                  </h4>
                  <div className="rounded-2xl border border-slate-100 overflow-hidden">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 text-slate-600 font-bold text-[10px] uppercase">
                        <tr>
                          <th className="p-2.5 pl-3">Product Item</th>
                          <th className="p-2.5 text-center">Ordered Qty</th>
                          <th className="p-2.5 text-center">Received Qty</th>
                          <th className="p-2.5 text-right">Unit Cost</th>
                          <th className="p-2.5 pr-3 text-right">Total (Incl GST)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {selectedPO.items.map((it, idx) => (
                          <tr key={idx} className="hover:bg-purple-50/20">
                            <td className="p-2.5 pl-3">
                              <strong className="font-bold text-ink block">{it.productName}</strong>
                              <span className="text-[10px] text-muted font-mono">{it.sku}</span>
                            </td>
                            <td className="p-2.5 text-center font-bold text-ink">
                              {it.quantity} {it.unit}
                            </td>
                            <td className="p-2.5 text-center font-bold text-[#5A2EA6] bg-purple-50/30">
                              {it.receivedQty} {it.unit}
                            </td>
                            <td className="p-2.5 text-right font-semibold text-slate-700">
                              {it.unitCost}
                            </td>
                            <td className="p-2.5 pr-3 text-right font-bold text-ink">
                              {it.totalAmount}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Order Summary & Financials */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-soft">Subtotal:</span>
                      <strong className="text-slate-800">{selectedPO.subtotal}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-soft">Estimated GST (18%):</span>
                      <strong className="text-slate-800">{selectedPO.tax}</strong>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-1.5">
                      <span className="font-bold text-ink">Gross Total Payable:</span>
                      <strong className="font-serif font-bold text-[#5A2EA6] text-sm">
                        {selectedPO.totalValue}
                      </strong>
                    </div>
                  </div>

                  {/* Audit Timeline */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                    <strong className="text-ink font-bold block mb-2">
                      Order Lifecycle Milestones
                    </strong>
                    <div className="space-y-2">
                      {selectedPO.timeline.map((tm, tIdx) => (
                        <div key={tIdx} className="flex items-start gap-2 text-[11px]">
                          <div
                            className={cn(
                              'w-2 h-2 rounded-full mt-1 shrink-0',
                              tm.isDone ? 'bg-emerald-500' : 'bg-slate-300',
                            )}
                          />
                          <div>
                            <span
                              className={cn(
                                'font-bold block',
                                tm.isDone ? 'text-ink' : 'text-muted',
                              )}
                            >
                              {tm.stage}
                            </span>
                            <span className="text-[10px] text-soft">
                              {tm.timestamp} {tm.user ? `· ${tm.user}` : ''}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50 rounded-b-3xl">
                <Button
                  variant="outline"
                  onClick={() => {
                    window.location.href = '/finance?tab=transactions';
                  }}
                  className="h-[32px] px-3 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1"
                >
                  <span>View Financial Posting in Finance Panel</span>
                  <ExternalLink className="w-3 h-3 text-[#5A2EA6]" />
                </Button>

                <div className="flex items-center gap-2">
                  {selectedPO.status === 'Pending Approval' ? (
                    <Button
                      onClick={() => {
                        selectedPO.status = 'Approved';
                        showToast(`PO ${selectedPO.poNumber} has been officially approved.`);
                        setSelectedPO(null);
                      }}
                      className="h-[32px] px-4 rounded-xl text-xs font-bold premium-btn-primary"
                    >
                      Authorize &amp; Dispatch PO
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setSelectedPO(null)}
                      className="h-[32px] px-4 rounded-xl text-xs font-bold premium-btn-primary"
                    >
                      Close Dossier
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* 5. Section 13: SUPPLIER DETAILS MODAL */}
      {selectedSupplier &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-[#3B2647]/50 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setSelectedSupplier(null)}
          >
            <div
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#5A2EA6]/20 animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-4 bg-[#FCFAFF] rounded-t-3xl">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#5A2EA6] text-white">
                      Vendor Partner Dossier
                    </span>
                    <span className="text-xs font-mono font-bold text-soft">
                      {selectedSupplier.code}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-ink text-xl mt-1">
                    {selectedSupplier.name}
                  </h3>
                  <p className="text-xs text-muted">
                    GSTIN: {selectedSupplier.gstin} · Terms: {selectedSupplier.paymentTerms}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedSupplier(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 grid place-items-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Contact Information */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-soft block text-[10px] uppercase font-bold">
                      Key Contact
                    </span>
                    <strong className="text-ink font-bold block text-sm mt-0.5">
                      {selectedSupplier.contactPerson}
                    </strong>
                    <div className="mt-2 space-y-1 text-[11px] text-slate-700">
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-[#5A2EA6]" /> {selectedSupplier.phone}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-3 h-3 text-[#5A2EA6]" /> {selectedSupplier.email}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-soft block text-[10px] uppercase font-bold">
                      Warehouse Address
                    </span>
                    <p className="text-slate-700 text-[11px] mt-1 flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#5A2EA6] shrink-0 mt-0.5" />
                      <span>{selectedSupplier.address}</span>
                    </p>
                  </div>
                </div>

                {/* Categories & Branches Served */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100">
                    <strong className="text-[#5A2EA6] font-bold block mb-1.5">
                      Mandated Categories
                    </strong>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedSupplier.categories.map((c, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-[#5A2EA6] border border-purple-200"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <strong className="text-ink font-bold block mb-1.5">
                      Serviced Salon Branches
                    </strong>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedSupplier.branchesServed.map((b, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-slate-800 border border-slate-200"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Historical Spend Summary */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-soft text-[10px] block font-bold uppercase">
                      Total Lifetime Procurement Spend
                    </span>
                    <strong className="text-lg font-serif font-bold text-[#5A2EA6]">
                      {selectedSupplier.totalPurchaseValue}
                    </strong>
                  </div>
                  <div className="text-right">
                    <span className="text-soft text-[10px] block font-bold uppercase">
                      Active In-Flight Orders
                    </span>
                    <strong className="text-base font-bold text-ink">
                      {selectedSupplier.activePOs} Purchase Orders
                    </strong>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50 rounded-b-3xl">
                <Button
                  variant="outline"
                  onClick={() => {
                    window.location.href = '/finance?tab=transactions';
                  }}
                  className="h-[32px] px-3 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1"
                >
                  <span>Supplier Settlement in Finance</span>
                  <ExternalLink className="w-3 h-3 text-[#5A2EA6]" />
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleOpenEditSupplier(selectedSupplier)}
                    className="h-[32px] px-3 rounded-xl text-xs font-bold border-slate-300 text-slate-700 hover:bg-slate-100 flex items-center gap-1"
                  >
                    <Edit className="w-3 h-3 text-slate-600" />
                    <span>Edit Vendor</span>
                  </Button>

                  <Button
                    onClick={() => handleOpenCreatePOForSupplier(selectedSupplier)}
                    className="h-[32px] px-3.5 rounded-xl text-xs font-bold bg-[#5A2EA6] text-white hover:bg-[#4a2489] flex items-center gap-1"
                  >
                    <ShoppingCart className="w-3 h-3 text-white" />
                    <span>Create PO</span>
                  </Button>

                  <Button
                    onClick={() => setSelectedSupplier(null)}
                    className="h-[32px] px-4 rounded-xl text-xs font-bold bg-slate-800 text-white hover:bg-slate-900"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* 6. Section 16: ADD / EDIT VENDOR MODAL */}
      <AddSupplierModal
        isOpen={isAddSupplierModalOpen}
        onClose={() => {
          setIsAddSupplierModalOpen(false);
          setEditingSupplier(null);
        }}
        onSave={handleSaveSupplier}
        initialSupplier={editingSupplier}
      />

      {/* 7. Section 17: CREATE PURCHASE ORDER MODAL */}
      <CreatePOModal
        isOpen={isCreatePOModalOpen}
        onClose={() => {
          setIsCreatePOModalOpen(false);
          setDefaultPOSupplierId(undefined);
        }}
        onSave={handleSavePO}
        suppliers={suppliersList}
        defaultSupplierId={defaultPOSupplierId}
      />

      {/* 8. Section 18: INITIATE PURCHASE RETURN & DEBIT NOTE MODAL */}
      <InitiatePurchaseReturnModal
        isOpen={isInitiateReturnOpen}
        onClose={() => setIsInitiateReturnOpen(false)}
        onSave={handleSavePurchaseReturn}
        suppliers={suppliersList}
      />
    </div>
  );
}
