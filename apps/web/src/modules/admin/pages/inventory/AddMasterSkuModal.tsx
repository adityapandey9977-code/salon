import { Button, cn } from '@salon-spa-saas/ui';
import {
  AlertCircle,
  ArrowRight,
  Barcode,
  Boxes,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  HelpCircle,
  Image as ImageIcon,
  Info,
  Layers,
  MapPin,
  Package,
  Percent,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Split,
  Tag,
  Truck,
  Upload,
  X,
  Zap,
} from 'lucide-react';
import type React from 'react';
import { useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { STANDARD_MEASUREMENT_UNITS } from '../catalogue/ServicesTab';
import { masterBranches } from '../locations/AllBranchesTab';
import type { ProductItem } from './ProductsConsumablesTab';

export interface AddMasterSkuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: ProductItem, branchAllocations: Record<string, number>) => void;
  defaultType?: 'Retail Product' | 'Professional Consumable';
}

const POPULAR_BRANDS = [
  "L'Oréal Professionnel",
  'Kérastase Luxury',
  'Olaplex',
  'O3+ Skin Science',
  'Wella Professionals',
  'Schwarzkopf Professional',
  'Dermalogica',
  'Moroccanoil',
  'Biotop Professional',
  'GK Hair',
];

const POPULAR_CATEGORIES = [
  'Hair Care',
  'Colour & Chemical',
  'Skin & Aesthetics',
  'Spa & Body Wellness',
  'Nails & Extensions',
  "Men's Grooming",
];

const GST_SLABS = [
  {
    label: '18% GST (9% CGST + 9% SGST - Standard Cosmetics)',
    value: '18% GST',
    rate: 0.18,
    hsn: '3305 90 90',
  },
  {
    label: '28% GST (14% CGST + 14% SGST - Luxury/Specialty)',
    value: '28% GST',
    rate: 0.28,
    hsn: '3304 99 90',
  },
  {
    label: '12% GST (6% CGST + 6% SGST - Ayurvedic / Medicated)',
    value: '12% GST',
    rate: 0.12,
    hsn: '3004 90 11',
  },
  {
    label: '5% GST (2.5% CGST + 2.5% SGST - Essential Oils/Base)',
    value: '5% GST',
    rate: 0.05,
    hsn: '3301 29 90',
  },
  { label: '0% GST (Tax Exempted)', value: '0% GST', rate: 0, hsn: '9999 99 99' },
];

const IMAGE_PRESETS = [
  {
    label: 'Hair Care Bottle',
    url: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop&q=80',
  },
  {
    label: 'Serum & Oil Dropper',
    url: 'https://images.unsplash.com/photo-1608248597359-577742111d4d?w=600&auto=format&fit=crop&q=80',
  },
  {
    label: 'Salon Hair Colour Tube',
    url: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=600&auto=format&fit=crop&q=80',
  },
  {
    label: 'Facial Pod & Cream Jar',
    url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80',
  },
  {
    label: 'Spa Scrub & Butter Tub',
    url: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=600&auto=format&fit=crop&q=80',
  },
  {
    label: 'Nail Gel Polish Bottle',
    url: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=600&auto=format&fit=crop&q=80',
  },
];

export function AddMasterSkuModal({
  isOpen,
  onClose,
  onSave,
  defaultType = 'Retail Product',
}: AddMasterSkuModalProps) {
  // Form State
  const [productType, setProductType] = useState<'Retail Product' | 'Professional Consumable'>(
    defaultType,
  );
  const [name, setName] = useState('');
  const [brand, setBrand] = useState(POPULAR_BRANDS[0]);
  const [skuCode, setSkuCode] = useState('');
  const [barcode, setBarcode] = useState('');
  const [category, setCategory] = useState(POPULAR_CATEGORIES[0]);

  // UOM & Pack Specification
  const [selectedUnit, setSelectedUnit] = useState('ml');
  const [packSize, setPackSize] = useState('500');
  const [unitDescription, setUnitDescription] = useState('Bottle (500ml)');

  // Pricing & GST
  const [costPrice, setCostPrice] = useState('850');
  const [sellingPrice, setSellingPrice] = useState('1450');
  const [selectedGst, setSelectedGst] = useState(GST_SLABS[0].value);
  const [hsnCode, setHsnCode] = useState(GST_SLABS[0].hsn);

  // Stock Ingestion & Batch Control
  const [initialStock, setInitialStock] = useState('60');
  const [batchNumber, setBatchNumber] = useState(
    `LOT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
  );
  const [manufacturingDate, setManufacturingDate] = useState(
    new Date().toISOString().split('T')[0],
  );
  const [expiryDate, setExpiryDate] = useState(
    new Date(Date.now() + 730 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  );
  const [storageLocation, setStorageLocation] = useState('Aisle 2 - Central Backbar');

  // Inventory Thresholds & Supplier
  const [minLevel, setMinLevel] = useState('15');
  const [reorderLevel, setReorderLevel] = useState('30');
  const [maxLevel, setMaxLevel] = useState('200');
  const [preferredSupplier, setPreferredSupplier] = useState('L’Oréal India Distribution Hub');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(IMAGE_PRESETS[0].url);

  // Multi-Branch Initial Stock Allocation
  const [branchAllocations, setBranchAllocations] = useState<Record<string, number>>(() => {
    const alloc: Record<string, number> = {};
    const branches = masterBranches || [];
    const count = branches.length || 1;
    const perBranch = Math.floor(60 / count);
    branches.forEach((b, idx) => {
      alloc[b.name] = idx === 0 ? perBranch + (60 % count) : perBranch;
    });
    return alloc;
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-generate SKU Code based on brand and name
  const handleAutoGenerateSku = () => {
    const brandPrefix =
      brand
        .replace(/[^a-zA-Z]/g, '')
        .slice(0, 3)
        .toUpperCase() || 'SKU';
    const namePrefix =
      name
        .replace(/[^a-zA-Z]/g, '')
        .slice(0, 3)
        .toUpperCase() || 'ITM';
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    setSkuCode(`SKU-${brandPrefix}-${namePrefix}-${randomSuffix}`);
  };

  // Auto-generate EAN-13 Barcode
  const handleAutoGenerateBarcode = () => {
    const countryCode = '890'; // India GS1 prefix
    const randomNine = Math.floor(100000000 + Math.random() * 900000000);
    setBarcode(`${countryCode}${randomNine}`);
  };

  // Synchronize unit description
  const handleUnitOrPackChange = (newUnit: string, newPack: string) => {
    setSelectedUnit(newUnit);
    setPackSize(newPack);
    if (newPack && newUnit) {
      if (['ml', 'ltr', 'pumps', 'drops', 'fl oz'].includes(newUnit)) {
        setUnitDescription(`Bottle (${newPack}${newUnit})`);
      } else if (['gm', 'kg', 'mg', 'scoop'].includes(newUnit)) {
        setUnitDescription(`Jar/Pack (${newPack}${newUnit})`);
      } else if (newUnit === 'Tube') {
        setUnitDescription(`Tube (${newPack}ml)`);
      } else {
        setUnitDescription(`${newUnit} (${newPack} Count)`);
      }
    }
  };

  // Distribute stock evenly across all branches
  const handleDistributeEvenly = () => {
    const total = Number.parseInt(initialStock, 10) || 0;
    const branches = masterBranches || [];
    if (branches.length === 0) return;
    const perBranch = Math.floor(total / branches.length);
    const remainder = total % branches.length;

    const newAlloc: Record<string, number> = {};
    branches.forEach((b, idx) => {
      newAlloc[b.name] = idx === 0 ? perBranch + remainder : perBranch;
    });
    setBranchAllocations(newAlloc);
  };

  // Update specific branch allocation
  const handleBranchAllocChange = (branchName: string, val: number) => {
    setBranchAllocations((prev) => ({
      ...prev,
      [branchName]: Math.max(0, val),
    }));
  };

  // Total allocated units calculation
  const totalAllocated = useMemo(() => {
    return Object.values(branchAllocations).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
  }, [branchAllocations]);

  // Financial Calculations
  const numCost = Number.parseFloat(costPrice) || 0;
  const numSelling = productType === 'Retail Product' ? Number.parseFloat(sellingPrice) || 0 : 0;
  const grossMargin =
    numSelling > 0 ? (((numSelling - numCost) / numSelling) * 100).toFixed(1) : '0.0';
  const markup =
    numCost > 0 && numSelling > 0 ? (((numSelling - numCost) / numCost) * 100).toFixed(1) : '0.0';
  const netStockValuation = (Number.parseInt(initialStock, 10) || 0) * numCost;

  // Handle local image upload
  const handleImageFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      alert('Image file size must be less than 5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImageUrl(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Please enter a product / SKU name.');
      return;
    }

    const effectiveSku =
      skuCode.trim() ||
      `SKU-${brand.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const effectiveBarcode =
      barcode.trim() || `890${Math.floor(100000000 + Math.random() * 900000000)}`;
    const parsedInitialStock = Number.parseInt(initialStock, 10) || 0;

    const newProduct: ProductItem = {
      id: `PRD-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      sku: effectiveSku,
      barcode: effectiveBarcode,
      category,
      type: productType,
      unit: unitDescription || `${selectedUnit} (${packSize})`,
      brand,
      currentStock: parsedInitialStock,
      reorderLevel: Number.parseInt(reorderLevel, 10) || 20,
      minLevel: Number.parseInt(minLevel, 10) || 10,
      maxLevel: Number.parseInt(maxLevel, 10) || 150,
      costPrice: `₹${numCost.toLocaleString('en-IN')}`,
      sellingPrice:
        productType === 'Retail Product' ? `₹${numSelling.toLocaleString('en-IN')}` : undefined,
      stockValue: `₹${netStockValuation.toLocaleString('en-IN')}`,
      status: 'Active',
      description:
        description.trim() ||
        `${brand} professional grade ${category.toLowerCase()} master SKU for salon network.`,
      preferredSupplier: preferredSupplier.trim() || 'Direct Distribution',
      storageLocation: storageLocation.trim() || 'Central Bay',
      batches: [
        {
          batchNumber: batchNumber.trim() || `LOT-${new Date().getFullYear()}-01`,
          expiryDate: new Date(expiryDate).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          }),
          quantity: parsedInitialStock,
          status: 'Good',
        },
      ],
      stockBreakdown: {
        total: parsedInitialStock,
        available: parsedInitialStock,
        reserved: 0,
        damaged: 0,
        expired: 0,
      },
    };

    onSave(newProduct, branchAllocations);
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-[#2D1552]/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#5A2EA6]/25 animate-in zoom-in-95 duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Modal Header ── */}
        <div className="px-6 py-4.5 border-b border-[#5A2EA6]/15 flex items-start justify-between gap-4 bg-gradient-to-r from-[#FAF7FF] via-[#F5EFFF] to-[#FAF7FF] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#5A2EA6] text-white flex items-center justify-center shadow-md shadow-[#5A2EA6]/20 shrink-0">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#5A2EA6]/10 text-[#5A2EA6] border border-[#5A2EA6]/20">
                  DIGIFLEX SAAS · INVENTORY MASTER
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  PRD SALO-PR-076 / 077
                </span>
              </div>
              <h2 className="font-serif font-bold text-ink text-lg sm:text-xl leading-tight mt-0.5">
                Add Master SKU &amp; Initial Stock Intake
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 grid place-items-center transition cursor-pointer"
            title="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Modal Body Form ── */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Top Classification Tabs */}
          <div className="bg-[#FCFAFF] p-3 rounded-2xl border border-[#5A2EA6]/20 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-ink uppercase tracking-wider pl-1">
                SKU Classification:
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setProductType('Retail Product')}
                className={cn(
                  'px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border cursor-pointer',
                  productType === 'Retail Product'
                    ? 'bg-[#5A2EA6] text-white border-[#5A2EA6] shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-purple-50',
                )}
              >
                <Package className="w-3.5 h-3.5" />
                <span>Retail Product (POS Sales)</span>
              </button>

              <button
                type="button"
                onClick={() => setProductType('Professional Consumable')}
                className={cn(
                  'px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border cursor-pointer',
                  productType === 'Professional Consumable'
                    ? 'bg-[#5A2EA6] text-white border-[#5A2EA6] shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-purple-50',
                )}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Professional Consumable (Recipe BOM)</span>
              </button>
            </div>
          </div>

          {/* 1. MASTER SKU IDENTITY & BRAND */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
              <h3 className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-purple-100 text-[#5A2EA6] text-[11px] grid place-items-center font-extrabold">
                  1
                </span>
                <span>Product Master Identity &amp; Barcode</span>
              </h3>
              <span className="text-[10.5px] text-muted font-medium">
                Unique Master Catalog Record
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
              {/* Product Name */}
              <div className="sm:col-span-8">
                <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                  Product / SKU Master Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. L'Oréal Serie Expert Absolut Repair Golden Mask"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                />
              </div>

              {/* Brand Selection */}
              <div className="sm:col-span-4">
                <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                  Brand / Manufacturer *
                </label>
                <input
                  type="text"
                  list="brandSuggestionsList"
                  required
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. L'Oréal Professionnel"
                  className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                />
                <datalist id="brandSuggestionsList">
                  {POPULAR_BRANDS.map((b, i) => (
                    <option key={i} value={b} />
                  ))}
                </datalist>
              </div>

              {/* Category */}
              <div className="sm:col-span-4">
                <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                  Primary Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-purple-100 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6] cursor-pointer"
                >
                  {POPULAR_CATEGORIES.map((c, i) => (
                    <option key={i} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* SKU Code with Auto Generate */}
              <div className="sm:col-span-4">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider">
                    Master SKU Code *
                  </label>
                  <button
                    type="button"
                    onClick={handleAutoGenerateSku}
                    className="text-[9.5px] font-bold text-[#5A2EA6] hover:underline flex items-center gap-0.5 cursor-pointer border-0 bg-transparent"
                  >
                    <Zap className="w-2.5 h-2.5 text-[#5A2EA6]" />
                    <span>Auto-Gen</span>
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="e.g. SKU-LOR-REP-01"
                  value={skuCode}
                  onChange={(e) => setSkuCode(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-white text-xs font-mono font-bold text-ink focus:outline-none focus:border-[#5A2EA6]"
                />
              </div>

              {/* Barcode with Auto Generate */}
              <div className="sm:col-span-4">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider">
                    Barcode / EAN-13 *
                  </label>
                  <button
                    type="button"
                    onClick={handleAutoGenerateBarcode}
                    className="text-[9.5px] font-bold text-[#5A2EA6] hover:underline flex items-center gap-0.5 cursor-pointer border-0 bg-transparent"
                  >
                    <Barcode className="w-2.5 h-2.5 text-[#5A2EA6]" />
                    <span>Generate EAN</span>
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="e.g. 8901030789123"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-white text-xs font-mono font-bold text-ink focus:outline-none focus:border-[#5A2EA6]"
                />
              </div>
            </div>
          </div>

          {/* 2. UNIT OF MEASUREMENT & CONSUMPTION SPEC */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
              <h3 className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-purple-100 text-[#5A2EA6] text-[11px] grid place-items-center font-extrabold">
                  2
                </span>
                <span>Unit of Measurement (UOM) &amp; Sizing</span>
              </h3>
              <span className="text-[10.5px] text-[#5A2EA6] font-bold">
                Standard Metric Recipe Deduction Engine
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
              {/* Unit Dropdown */}
              <div className="sm:col-span-4">
                <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                  Measurement Unit (UOM) *
                </label>
                <select
                  value={selectedUnit}
                  onChange={(e) => handleUnitOrPackChange(e.target.value, packSize)}
                  className="w-full h-10 px-3 rounded-xl border border-purple-100 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6] cursor-pointer"
                >
                  <optgroup label="Volume / Liquids">
                    <option value="ml">ml (Millilitres)</option>
                    <option value="ltr">ltr (Litres)</option>
                    <option value="pumps">pumps (Dispenser Pumps)</option>
                    <option value="drops">drops (Essential Drops)</option>
                    <option value="fl oz">fl oz (Fluid Ounces)</option>
                  </optgroup>
                  <optgroup label="Weight / Mass">
                    <option value="gm">gm (Grams)</option>
                    <option value="kg">kg (Kilograms)</option>
                    <option value="mg">mg (Milligrams)</option>
                    <option value="scoop">scoop (Powder Scoops)</option>
                  </optgroup>
                  <optgroup label="Packaging & Single-Use Count">
                    <option value="pcs">pcs (Pieces / Units)</option>
                    <option value="Tube">Tube (Color / Chemical)</option>
                    <option value="Sachet">Sachet (Single Sachet)</option>
                    <option value="Ampoule">Ampoule (Active Booster)</option>
                    <option value="Vial">Vial (Concentrate)</option>
                    <option value="Pod">Pod (Treatment Pod)</option>
                    <option value="Capsule">Capsule (Serum Capsule)</option>
                    <option value="Sheet">Sheet (Mask / Foil)</option>
                    <option value="Strip">Strip (Wax Strip)</option>
                    <option value="Kit">Kit (Treatment Kit)</option>
                    <option value="Pair">Pair (Gloves / Eye Pads)</option>
                  </optgroup>
                </select>
              </div>

              {/* Pack Sizing Amount */}
              <div className="sm:col-span-4">
                <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                  Net Content / Pack Size *
                </label>
                <input
                  type="number"
                  min="0.1"
                  step="any"
                  placeholder="e.g. 500"
                  value={packSize}
                  onChange={(e) => handleUnitOrPackChange(selectedUnit, e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                />
              </div>

              {/* Formatted Display Unit Label */}
              <div className="sm:col-span-4">
                <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                  Catalog UOM Description
                </label>
                <input
                  type="text"
                  value={unitDescription}
                  onChange={(e) => setUnitDescription(e.target.value)}
                  placeholder="e.g. Bottle (500ml)"
                  className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-bold text-[#5A2EA6] focus:outline-none focus:border-[#5A2EA6]"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-purple-50/70 rounded-xl border border-purple-100 text-[11px] text-[#5A2EA6]">
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span>
                {productType === 'Professional Consumable'
                  ? `Configured for automatic BOM subtraction. Every service completed using this product will deduct exact ${selectedUnit} from backwash inventory balance.`
                  : `Retail unit tracked as 1 ${unitDescription}. Sold at front desk POS with automated FIFO batch decrement.`}
              </span>
            </div>
          </div>

          {/* 3. PRICING, GST & MARGINS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
              <h3 className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-purple-100 text-[#5A2EA6] text-[11px] grid place-items-center font-extrabold">
                  3
                </span>
                <span>Pricing, GST Slabs &amp; Valuation</span>
              </h3>
              <span className="text-[10.5px] text-muted font-medium">
                India GST &amp; HSN Compliance
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
              {/* Cost Price */}
              <div className="sm:col-span-3">
                <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                  Cost / Inward Price (₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    placeholder="850"
                    value={costPrice}
                    onChange={(e) => setCostPrice(e.target.value)}
                    className="w-full h-10 pl-7 pr-3 rounded-xl border border-purple-100 bg-white text-xs font-bold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  />
                </div>
              </div>

              {/* Selling Price (Only for Retail) */}
              <div className="sm:col-span-3">
                <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                  {productType === 'Retail Product'
                    ? 'Selling MRP (₹) *'
                    : 'Retail Price (Optional)'}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="1450"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(e.target.value)}
                    className="w-full h-10 pl-7 pr-3 rounded-xl border border-purple-100 bg-white text-xs font-bold text-emerald-700 focus:outline-none focus:border-[#5A2EA6]"
                  />
                </div>
              </div>

              {/* GST Slab */}
              <div className="sm:col-span-4">
                <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                  GST Tax Rate Slab *
                </label>
                <select
                  value={selectedGst}
                  onChange={(e) => {
                    setSelectedGst(e.target.value);
                    const found = GST_SLABS.find((g) => g.value === e.target.value);
                    if (found) setHsnCode(found.hsn);
                  }}
                  className="w-full h-10 px-3 rounded-xl border border-purple-100 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6] cursor-pointer"
                >
                  {GST_SLABS.map((g, i) => (
                    <option key={i} value={g.value}>
                      {g.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* HSN Code */}
              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                  HSN / SAC Code
                </label>
                <input
                  type="text"
                  placeholder="3305 90 90"
                  value={hsnCode}
                  onChange={(e) => setHsnCode(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-purple-100 bg-white text-xs font-mono font-bold text-ink focus:outline-none focus:border-[#5A2EA6]"
                />
              </div>
            </div>

            {/* Live Profitability Metrics */}
            <div className="p-3.5 bg-gradient-to-r from-[#FAF8FD] to-[#F3EEFF] rounded-2xl border border-purple-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="px-3 py-1 bg-white rounded-xl border border-purple-100 shadow-2xs">
                  <span className="text-[9.5px] text-soft block">Unit Profit</span>
                  <strong className="text-xs font-bold text-emerald-700">
                    +₹{Math.max(0, numSelling - numCost).toLocaleString('en-IN')}
                  </strong>
                </div>
                <div className="px-3 py-1 bg-white rounded-xl border border-purple-100 shadow-2xs">
                  <span className="text-[9.5px] text-soft block">Gross Margin</span>
                  <strong className="text-xs font-bold text-[#5A2EA6]">{grossMargin}%</strong>
                </div>
                <div className="px-3 py-1 bg-white rounded-xl border border-purple-100 shadow-2xs">
                  <span className="text-[9.5px] text-soft block">Markup %</span>
                  <strong className="text-xs font-bold text-indigo-700">+{markup}%</strong>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-muted block">Inward Stock Total Valuation</span>
                <strong className="text-sm font-serif font-bold text-[#5A2EA6]">
                  ₹{netStockValuation.toLocaleString('en-IN')}
                </strong>
              </div>
            </div>
          </div>

          {/* 4. STOCK INGESTION & BATCH CONTROL */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
              <h3 className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-purple-100 text-[#5A2EA6] text-[11px] grid place-items-center font-extrabold">
                  4
                </span>
                <span>Stock Inwarding &amp; Batch / Expiry Tracking</span>
              </h3>
              <span className="text-[10.5px] text-emerald-700 font-bold">
                FIFO &amp; Expiry Governance (SALO-PR-081)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
              {/* Initial Quantity */}
              <div className="sm:col-span-3">
                <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                  Opening Inward Qty (Units) *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  placeholder="60"
                  value={initialStock}
                  onChange={(e) => setInitialStock(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-white text-xs font-bold text-ink focus:outline-none focus:border-[#5A2EA6]"
                />
              </div>

              {/* Initial Batch Number */}
              <div className="sm:col-span-3">
                <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                  Initial Batch / Lot # *
                </label>
                <input
                  type="text"
                  required
                  placeholder="LOT-2026-01"
                  value={batchNumber}
                  onChange={(e) => setBatchNumber(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-white text-xs font-mono font-bold text-ink focus:outline-none focus:border-[#5A2EA6]"
                />
              </div>

              {/* Manufacturing Date */}
              <div className="sm:col-span-3">
                <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                  Manufacturing Date
                </label>
                <input
                  type="date"
                  value={manufacturingDate}
                  onChange={(e) => setManufacturingDate(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-white text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
                />
              </div>

              {/* Expiry Date */}
              <div className="sm:col-span-3">
                <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                  Expiration Date *
                </label>
                <input
                  type="date"
                  required
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-white text-xs font-bold text-ink focus:outline-none focus:border-[#5A2EA6]"
                />
              </div>
            </div>
          </div>

          {/* 5. MULTI-BRANCH NETWORK STOCK ALLOCATION */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
              <h3 className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-purple-100 text-[#5A2EA6] text-[11px] grid place-items-center font-extrabold">
                  5
                </span>
                <span>Multi-Branch Stock Allocation</span>
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDistributeEvenly}
                  className="text-[10.5px] font-bold text-[#5A2EA6] hover:underline cursor-pointer border-0 bg-transparent flex items-center gap-1"
                >
                  <Split className="w-3 h-3 text-[#5A2EA6]" />
                  <span>Distribute Evenly</span>
                </button>
                <span
                  className={cn(
                    'text-[10px] font-bold px-2 py-0.5 rounded-full border',
                    totalAllocated === Number.parseInt(initialStock, 10)
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200',
                  )}
                >
                  {totalAllocated} of {initialStock || 0} Units Allocated
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {masterBranches.map((b) => {
                const allocVal = branchAllocations[b.name] ?? 0;
                return (
                  <div
                    key={b.id}
                    className="p-3 bg-[#FCFAFF] rounded-xl border border-purple-100/90 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0 flex-1">
                      <strong className="text-xs font-bold text-ink block truncate">
                        {b.name}
                      </strong>
                      <span className="text-[10px] text-muted truncate block">
                        {b.city} · {b.type}
                      </span>
                    </div>
                    <div className="w-20 shrink-0">
                      <input
                        type="number"
                        min="0"
                        value={allocVal}
                        onChange={(e) =>
                          handleBranchAllocChange(b.name, Number.parseInt(e.target.value, 10) || 0)
                        }
                        className="w-full h-8 px-2 rounded-lg border border-purple-200 bg-white text-center text-xs font-bold text-ink focus:outline-none focus:border-[#5A2EA6]"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 6. REORDER THRESHOLDS & SUPPLIER */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
              <h3 className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-purple-100 text-[#5A2EA6] text-[11px] grid place-items-center font-extrabold">
                  6
                </span>
                <span>Thresholds, Storage &amp; Preferred Vendor</span>
              </h3>
              <span className="text-[10.5px] text-muted font-medium">
                Automated Purchase Trigger (SALO-PR-086)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
              {/* Min Safety Stock */}
              <div className="sm:col-span-3">
                <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                  Safety Minimum Level
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="15"
                  value={minLevel}
                  onChange={(e) => setMinLevel(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                />
              </div>

              {/* Reorder Trigger */}
              <div className="sm:col-span-3">
                <label className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block mb-1">
                  Reorder Alert Threshold *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  placeholder="30"
                  value={reorderLevel}
                  onChange={(e) => setReorderLevel(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-amber-200 bg-amber-50/20 text-xs font-bold text-amber-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Storage Location */}
              <div className="sm:col-span-3">
                <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                  Primary Storage Bin / Rack
                </label>
                <input
                  type="text"
                  placeholder="Aisle 2 - Backwash Shelf 1"
                  value={storageLocation}
                  onChange={(e) => setStorageLocation(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                />
              </div>

              {/* Preferred Supplier */}
              <div className="sm:col-span-3">
                <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                  Preferred Supplier
                </label>
                <input
                  type="text"
                  placeholder="L’Oréal India Distribution Hub"
                  value={preferredSupplier}
                  onChange={(e) => setPreferredSupplier(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                />
              </div>
            </div>
          </div>

          {/* 7. COVER PHOTO & DESCRIPTION */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
              <h3 className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-purple-100 text-[#5A2EA6] text-[11px] grid place-items-center font-extrabold">
                  7
                </span>
                <span>Product Specifications &amp; Media</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
              {/* Image Preview & Selector */}
              <div className="sm:col-span-4 space-y-2">
                <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block">
                  Product Cover Photo
                </label>
                <div className="relative rounded-2xl border-2 border-dashed border-[#5A2EA6]/25 p-2 bg-[#FAF8FD] flex flex-col items-center justify-center text-center h-32 overflow-hidden group">
                  {imageUrl ? (
                    <>
                      <img
                        src={imageUrl}
                        alt="Product Cover"
                        className="w-full h-full object-cover rounded-xl"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-2.5 py-1 bg-white text-[#5A2EA6] text-[10px] font-bold rounded-lg cursor-pointer border-0 shadow-sm"
                        >
                          Change Photo
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center">
                      <ImageIcon className="w-6 h-6 text-[#5A2EA6] mb-1" />
                      <span className="text-[11px] font-bold text-ink">Upload Product Image</span>
                      <span className="text-[9px] text-muted">PNG, JPG up to 5MB</span>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageFile(file);
                    }}
                  />
                </div>

                {/* Preset Presets */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {IMAGE_PRESETS.slice(0, 4).map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setImageUrl(p.url)}
                      className={cn(
                        'w-8 h-8 rounded-lg overflow-hidden border shrink-0 cursor-pointer transition',
                        imageUrl === p.url
                          ? 'ring-2 ring-[#5A2EA6] border-white'
                          : 'border-slate-200 opacity-70 hover:opacity-100',
                      )}
                      title={p.label}
                    >
                      <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="sm:col-span-8">
                <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                  Master SKU Clinical &amp; Treatment Description
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter detailed ingredients, treatment usage directions, scalp/skin type application, and salon precautions..."
                  className="w-full p-3 rounded-xl border border-purple-100 bg-white text-xs text-ink placeholder:text-muted focus:outline-none focus:border-[#5A2EA6] resize-none"
                />
              </div>
            </div>
          </div>
        </form>

        {/* ── Modal Footer ── */}
        <div className="p-4.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3 shrink-0 rounded-b-3xl">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted font-medium">
              Network Inflow: <strong>{initialStock || 0} Units</strong> · Valuation:{' '}
              <strong>₹{netStockValuation.toLocaleString('en-IN')}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-10 px-4 rounded-xl text-xs font-bold border-slate-300 text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </Button>

            <button
              type="button"
              onClick={handleSubmit}
              className="h-10 px-5 rounded-xl text-xs font-bold bg-[#5A2EA6] hover:bg-[#4a2489] text-white shadow-md shadow-[#5A2EA6]/25 transition-all flex items-center gap-2 cursor-pointer border-0"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Publish Master SKU &amp; Ingest Stock</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
