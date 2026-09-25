import { Button, cn } from '@salon-spa-saas/ui';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  DollarSign,
  Info,
  Layers,
  Plus,
  Scissors,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { STANDARD_MEASUREMENT_UNITS } from '../catalogue/ServicesTab';
import type { ServiceRecipe } from './ProductsConsumablesTab';

export interface AddRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (recipe: ServiceRecipe) => void;
}

const COMMON_CONSUMABLE_OPTIONS = [
  { name: 'Organic Styling Serum', defaultCost: 65, defaultUnit: 'ml' },
  { name: 'Nourishing Hair Wash & Conditioner', defaultCost: 80, defaultUnit: 'ml' },
  { name: 'Keratin Complex Protein Serum', defaultCost: 450, defaultUnit: 'ml' },
  { name: 'Clarifying Pre-Treatment Wash', defaultCost: 120, defaultUnit: 'ml' },
  { name: 'Thermal Shield Sealer', defaultCost: 150, defaultUnit: 'ml' },
  { name: 'Glycolic Acid Exfoliating Pod', defaultCost: 280, defaultUnit: 'Pod' },
  { name: 'Antioxidant Infusion Serum', defaultCost: 220, defaultUnit: 'ml' },
  { name: 'Collagen Peptide Hydrogel Mask', defaultCost: 190, defaultUnit: 'Sheet' },
  { name: 'Cold-Pressed Sweet Almond Oil', defaultCost: 95, defaultUnit: 'ml' },
  { name: 'Kashmir Lavender Essential Oil', defaultCost: 140, defaultUnit: 'drops' },
  { name: "L'Oréal Majirel Permanent Hair Colour", defaultCost: 340, defaultUnit: 'Tube' },
  { name: "L'Oréal Oxydant Crème Developer 20 Vol", defaultCost: 85, defaultUnit: 'ml' },
];

export function AddRecipeModal({ isOpen, onClose, onSave }: AddRecipeModalProps) {
  const [serviceName, setServiceName] = useState('');
  const [category, setCategory] = useState('Hair Dressing & Styling');
  const [durationMinutes, setDurationMinutes] = useState('45');
  const [version, setVersion] = useState('v1.0 (Initial Standard)');

  // Dynamic Materials List
  const [materials, setMaterials] = useState<ServiceRecipe['materials']>([
    {
      consumableId: 'PRD-001',
      consumableName: 'Organic Styling Serum',
      quantity: 15,
      unit: 'ml',
      standardUsage: 'Mid-lengths to hair ends',
      isRequired: true,
      costEstimate: '₹65',
    },
  ]);

  // Material input states
  const [matName, setMatName] = useState('');
  const [matQty, setMatQty] = useState('');
  const [matUnit, setMatUnit] = useState('ml');
  const [matUsage, setMatUsage] = useState('');
  const [matCost, setMatCost] = useState('80');

  const handleAddMaterial = () => {
    if (!matName.trim() || !matQty.trim() || isNaN(Number(matQty))) {
      alert('Please enter a valid consumable material name and numeric quantity.');
      return;
    }

    const newMat = {
      consumableId: `PRD-${Math.floor(100 + Math.random() * 900)}`,
      consumableName: matName.trim(),
      quantity: Number.parseFloat(matQty),
      unit: matUnit,
      standardUsage: matUsage.trim() || 'Standard application',
      isRequired: true,
      costEstimate: matCost.startsWith('₹') ? matCost : `₹${matCost}`,
    };

    setMaterials([...materials, newMat]);
    setMatName('');
    setMatQty('');
    setMatUsage('');
  };

  const handleRemoveMaterial = (idx: number) => {
    setMaterials(materials.filter((_, i) => i !== idx));
  };

  const totalEstimatedCost = materials.reduce((acc, m) => {
    const num = Number.parseFloat(m.costEstimate.replace(/[^\d.]/g, '')) || 0;
    return acc + num;
  }, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceName.trim()) {
      alert('Please enter a service name.');
      return;
    }
    if (materials.length === 0) {
      alert('Please add at least one consumable item to the Bill of Materials.');
      return;
    }

    const newRecipe: ServiceRecipe = {
      id: `RCP-${Date.now().toString().slice(-4)}`,
      serviceName: serviceName.trim(),
      category,
      durationMinutes: Number.parseInt(durationMinutes, 10) || 45,
      version,
      status: 'Active',
      updatedDate: 'Just Now',
      updatedBy: 'Master Admin HQ',
      materials,
      versionHistory: [
        {
          version,
          date: 'Just Now',
          author: 'Master Admin HQ',
          changeNote: 'Initial standard recipe published to network.',
        },
      ],
    };

    onSave(newRecipe);
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-[#2D1552]/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#5A2EA6]/25 animate-in zoom-in-95 duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-[#5A2EA6]/15 flex items-start justify-between gap-4 bg-gradient-to-r from-[#FAF7FF] via-[#F5EFFF] to-[#FAF7FF] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#5A2EA6] text-white flex items-center justify-center shadow-md shadow-[#5A2EA6]/20 shrink-0">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#5A2EA6]/10 text-[#5A2EA6] border border-[#5A2EA6]/20">
                RECIPE BILL OF MATERIALS (BOM)
              </span>
              <h2 className="font-serif font-bold text-ink text-lg sm:text-xl leading-tight mt-0.5">
                Create Service Consumables Recipe
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 grid place-items-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Service Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-6">
              <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                Target Service Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Signature Botanical Keratin Spa"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                Service Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-purple-100 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
              >
                <option value="Hair Dressing & Styling">Hair Dressing &amp; Styling</option>
                <option value="Skin & Aesthetics">Skin &amp; Aesthetics</option>
                <option value="Colour & Chemical">Colour &amp; Chemical</option>
                <option value="Spa & Wellness Rituals">Spa &amp; Wellness</option>
                <option value="Nails Art & Spa Lounge">Nails Art &amp; Spa</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                Standard Duration (Mins)
              </label>
              <input
                type="number"
                min="5"
                step="5"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
              />
            </div>
          </div>

          {/* Add Consumable Item to Recipe */}
          <div className="p-4 bg-[#FCFAFF] rounded-2xl border border-purple-100 space-y-3">
            <span className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block">
              Add Recipe Consumable &amp; Standard Metric
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
              <div className="sm:col-span-4">
                <label className="text-[10px] font-bold text-soft uppercase block mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  list="recipeConsumablesList"
                  placeholder="e.g. Keratin Serum"
                  value={matName}
                  onChange={(e) => setMatName(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-purple-100 bg-white text-xs font-semibold text-ink outline-none focus:border-[#5A2EA6]"
                />
                <datalist id="recipeConsumablesList">
                  {COMMON_CONSUMABLE_OPTIONS.map((c, i) => (
                    <option key={i} value={c.name} />
                  ))}
                </datalist>
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold text-soft uppercase block mb-1">
                  Qty Amount *
                </label>
                <input
                  type="number"
                  min="0.1"
                  step="any"
                  placeholder="e.g. 20"
                  value={matQty}
                  onChange={(e) => setMatQty(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-purple-100 bg-white text-xs font-semibold text-ink outline-none focus:border-[#5A2EA6]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold text-soft uppercase block mb-1">
                  Unit *
                </label>
                <select
                  value={matUnit}
                  onChange={(e) => setMatUnit(e.target.value)}
                  className="w-full h-9 px-2 rounded-xl border border-purple-100 bg-white text-xs font-semibold text-ink outline-none focus:border-[#5A2EA6] cursor-pointer"
                >
                  <optgroup label="Volume / Liquids">
                    <option value="ml">ml</option>
                    <option value="ltr">ltr</option>
                    <option value="pumps">pumps</option>
                    <option value="drops">drops</option>
                  </optgroup>
                  <optgroup label="Weight / Mass">
                    <option value="gm">gm</option>
                    <option value="kg">kg</option>
                    <option value="scoop">scoop</option>
                  </optgroup>
                  <optgroup label="Packaging & Count">
                    <option value="pcs">pcs</option>
                    <option value="Tube">Tube</option>
                    <option value="Sachet">Sachet</option>
                    <option value="Ampoule">Ampoule</option>
                    <option value="Pod">Pod</option>
                    <option value="Sheet">Sheet</option>
                    <option value="Strip">Strip</option>
                    <option value="Kit">Kit</option>
                  </optgroup>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold text-soft uppercase block mb-1">
                  Cost Est (₹)
                </label>
                <input
                  type="text"
                  placeholder="₹80"
                  value={matCost}
                  onChange={(e) => setMatCost(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-purple-100 bg-white text-xs font-semibold text-ink outline-none focus:border-[#5A2EA6]"
                />
              </div>

              <div className="sm:col-span-2">
                <button
                  type="button"
                  onClick={handleAddMaterial}
                  className="w-full h-9 px-3 rounded-xl text-xs font-bold bg-[#5A2EA6] hover:bg-[#4a2489] text-white flex items-center justify-center gap-1 cursor-pointer border-0 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Item</span>
                </button>
              </div>
            </div>
          </div>

          {/* Configured Materials Table */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-soft uppercase tracking-wider block">
              Configured Recipe Consumables ({materials.length} Items)
            </span>

            <div className="rounded-2xl border border-purple-100 overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#F8F5FF] text-[#5A2EA6] font-bold text-[10px] uppercase">
                  <tr>
                    <th className="p-2.5 pl-3">Consumable Material</th>
                    <th className="p-2.5 text-center">Standard Quantity</th>
                    <th className="p-2.5">Usage Rule</th>
                    <th className="p-2.5 text-right">Cost Est.</th>
                    <th className="p-2.5 pr-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {materials.map((m, idx) => (
                    <tr key={idx} className="hover:bg-purple-50/20">
                      <td className="p-2.5 pl-3 font-bold text-ink">{m.consumableName}</td>
                      <td className="p-2.5 text-center font-bold text-[#5A2EA6] bg-purple-50/40">
                        {m.quantity} {m.unit}
                      </td>
                      <td className="p-2.5 text-slate-600">{m.standardUsage}</td>
                      <td className="p-2.5 text-right font-bold text-emerald-700">
                        {m.costEstimate}
                      </td>
                      <td className="p-2.5 pr-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveMaterial(idx)}
                          className="w-6 h-6 rounded-md hover:bg-rose-50 text-slate-400 hover:text-rose-600 grid place-items-center cursor-pointer border-0 bg-transparent"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-purple-50 rounded-xl flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700">
                Total Recipe Consumables Cost per Service:
              </span>
              <strong className="text-[#5A2EA6] text-sm font-serif font-bold">
                ₹{totalEstimatedCost.toFixed(2)}
              </strong>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2.5 rounded-b-3xl">
          <Button
            variant="outline"
            onClick={onClose}
            className="h-9 px-4 rounded-xl text-xs font-bold"
          >
            Cancel
          </Button>
          <button
            type="button"
            onClick={handleSubmit}
            className="h-9 px-4 rounded-xl text-xs font-bold bg-[#5A2EA6] hover:bg-[#4a2489] text-white shadow-xs flex items-center gap-1.5 cursor-pointer border-0"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Publish Recipe BOM</span>
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
