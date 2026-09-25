import { useToast } from '@salon-spa-saas/ui';
import {
  AlertCircle,
  CheckCircle2,
  Download,
  FlaskConical,
  Layers,
  Play,
  Plus,
  Scissors,
  Search,
  Settings2,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { createPortal } from 'react-dom';

export function ServiceRecipesPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State for Service Recipe BOM
  const [recipeForm, setRecipeForm] = useState({
    serviceName: 'Full Hair Color Service',
    category: 'Hair Technical',
    ingredients: [
      {
        product: 'Majirel Hair Color Cream 7.1',
        quantity: '80',
        unit: 'ml',
        tolerancePct: '5%',
        requirement: 'Mandatory',
        unitCost: '₹340',
      },
      {
        product: 'L’Oréal Developer 20Vol',
        quantity: '120',
        unit: 'ml',
        tolerancePct: '5%',
        requirement: 'Mandatory',
        unitCost: '₹102',
      },
      {
        product: 'Nitrile Barber Gloves',
        quantity: '1',
        unit: 'Pair',
        tolerancePct: '0%',
        requirement: 'Mandatory',
        unitCost: '₹15',
      },
      {
        product: 'Color Application Brush',
        quantity: '1',
        unit: 'Pcs',
        tolerancePct: '0%',
        requirement: 'Optional',
        unitCost: '₹45',
      },
    ],
  });

  const [recipes, setRecipes] = useState([
    {
      id: 'REC-01',
      serviceName: 'Full Hair Color & Gloss',
      category: 'Hair Technical',
      standardCost: '₹502',
      ingredients: [
        {
          product: 'Majirel Hair Color Cream 7.1',
          quantity: '80',
          unit: 'ml',
          tolerancePct: '5%',
          requirement: 'Mandatory',
          unitCost: '₹340',
        },
        {
          product: 'L’Oréal Developer 20Vol',
          quantity: '120',
          unit: 'ml',
          tolerancePct: '5%',
          requirement: 'Mandatory',
          unitCost: '₹102',
        },
        {
          product: 'Nitrile Barber Gloves',
          quantity: '1',
          unit: 'Pair',
          tolerancePct: '0%',
          requirement: 'Mandatory',
          unitCost: '₹15',
        },
        {
          product: 'Color Application Brush',
          quantity: '1',
          unit: 'Pcs',
          tolerancePct: '0%',
          requirement: 'Optional',
          unitCost: '₹45',
        },
      ],
    },
    {
      id: 'REC-02',
      serviceName: 'Hydra Facial Detox & Spa',
      category: 'Skin & Facial',
      standardCost: '₹850',
      ingredients: [
        {
          product: 'Hydra Cleansing Gel',
          quantity: '20',
          unit: 'ml',
          tolerancePct: '2%',
          requirement: 'Mandatory',
          unitCost: '₹120',
        },
        {
          product: 'Hyaluronic Acid Concentrate',
          quantity: '10',
          unit: 'ml',
          tolerancePct: '2%',
          requirement: 'Mandatory',
          unitCost: '₹450',
        },
        {
          product: 'Peel Off Algae Mask',
          quantity: '40',
          unit: 'g',
          tolerancePct: '5%',
          requirement: 'Mandatory',
          unitCost: '₹280',
        },
      ],
    },
  ]);

  const handleTestAutoDeduction = (serviceName: string, ingredients: any[]) => {
    const summary = ingredients.map((i) => `${i.quantity}${i.unit} ${i.product}`).join(', ');
    toast(
      `Billing Auto-Deduction Triggered: [${serviceName}] automatically deducted ${summary} from warehouse inventory.`,
    );
  };

  const handleAddIngredientRow = () => {
    setRecipeForm({
      ...recipeForm,
      ingredients: [
        ...recipeForm.ingredients,
        {
          product: 'New Consumable Item',
          quantity: '10',
          unit: 'ml',
          tolerancePct: '5%',
          requirement: 'Mandatory',
          unitCost: '₹50',
        },
      ],
    });
  };

  const handleRemoveIngredientRow = (index: number) => {
    const updated = recipeForm.ingredients.filter((_, idx) => idx !== index);
    setRecipeForm({ ...recipeForm, ingredients: updated });
  };

  const handleSaveRecipe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipeForm.serviceName) {
      toast('Validation Error: Please select or enter a salon service name.');
      return;
    }

    const newRecipe = {
      id: `REC-${Math.floor(10 + Math.random() * 90)}`,
      serviceName: recipeForm.serviceName,
      category: recipeForm.category,
      standardCost: '₹540',
      ingredients: recipeForm.ingredients,
    };

    setRecipes([newRecipe, ...recipes]);
    setIsAddModalOpen(false);
    toast(
      `Service Recipe Created: ${newRecipe.serviceName} BOM configured with ${newRecipe.ingredients.length} items.`,
    );
  };

  const filteredRecipes = recipes.filter(
    (r) =>
      r.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-ink tracking-tight">
              Service Recipes (Bill of Materials - BOM)
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-600" /> Auto-Deduction Active
            </span>
          </div>
          <p className="text-xs text-soft mt-1">
            Configure exact raw material consumption per salon service. Billing a completed service
            automatically deducts inventory items.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#5A2EA6] hover:bg-[#482387] text-white text-xs font-bold rounded-xl shadow cursor-pointer transition-all border-0"
          >
            <Plus className="w-4 h-4" />
            Create Service Recipe (BOM)
          </button>

          <button
            onClick={() => toast('Export Recipes: Service recipe BOM exported to CSV.')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-purple-600 text-purple-600 bg-white hover:bg-purple-50 transition-all shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-purple-600" />
            Export Recipes
          </button>
        </div>
      </div>

      {/* SEARCH AND INFORMATION BANNER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-5 rounded-2xl shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-full">
              Automated Inventory Engine
            </span>
            <span className="text-xs text-purple-200">100% Billing Sync</span>
          </div>
          <h2 className="text-base font-bold text-white">
            How Service Recipe Auto-Deduction Works
          </h2>
          <p className="text-xs text-purple-200 leading-relaxed">
            When a stylist completes a service at POS (e.g. <b>Hair Color Service</b>), the system
            automatically deducts the configured BOM items: <b>80 ml Hair Color</b> +{' '}
            <b>120 ml Developer</b> + <b>1 Pair Gloves</b> from warehouse stock.
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-line shadow-sm flex flex-col justify-center space-y-2">
          <div className="text-xs font-bold text-ink">Recipe Search</div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search service name or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-pine/10 border border-line rounded-xl outline-none focus:border-purple-600"
            />
          </div>
        </div>
      </div>

      {/* SERVICE RECIPE BOM CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRecipes.map((r) => (
          <div
            key={r.id}
            className="bg-white p-5 rounded-2xl border border-line shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition-all"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start border-b border-line pb-3">
                <div>
                  <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full">
                    {r.id}
                  </span>
                  <h3 className="text-base font-bold text-ink mt-1.5">{r.serviceName}</h3>
                  <div className="text-xs text-soft font-medium">{r.category}</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-soft">Standard Material Cost</div>
                  <div className="text-lg font-bold text-emerald-700">{r.standardCost}</div>
                </div>
              </div>

              {/* INGREDIENTS TABLE */}
              <div className="space-y-2 text-xs">
                <div className="font-bold text-soft uppercase text-[10.5px]">
                  Configured Consumables (BOM):
                </div>
                <div className="space-y-1.5">
                  {r.ingredients.map((ing: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-pine/5 rounded-xl border border-line flex justify-between items-center text-xs"
                    >
                      <div>
                        <div className="font-bold text-ink flex items-center gap-1.5">
                          {ing.product}
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${
                              ing.requirement === 'Mandatory'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {ing.requirement}
                          </span>
                        </div>
                        <div className="text-[10px] text-soft mt-0.5">
                          Tolerance:{' '}
                          <span className="font-bold text-purple-700">{ing.tolerancePct}</span> •
                          Unit Cost: {ing.unitCost}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-bold text-[#5A2EA6] text-sm">
                          {ing.quantity} {ing.unit}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ACTION FOOTER */}
            <div className="pt-3 border-t border-line/60 flex justify-between items-center">
              <button
                onClick={() => handleTestAutoDeduction(r.serviceName, r.ingredients)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-bold border border-emerald-200 transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 text-emerald-600" />
                Test Auto-Deduction
              </button>

              <button
                onClick={() => toast(`Configure BOM: Opened editor for ${r.serviceName}.`)}
                className="px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-xl text-xs font-semibold border border-purple-200 cursor-pointer"
              >
                Configure BOM Rules
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE SERVICE RECIPE MODAL (Wide max-w-4xl createPortal) */}
      {isAddModalOpen &&
        createPortal(
          <div className="fixed inset-0 bg-[#3B2647]/50 backdrop-blur-sm z-[9999] overflow-y-auto flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[32px] w-full max-w-4xl shadow-[0_25px_60px_rgba(90,46,166,0.18)] p-6 space-y-4 border border-[#5A2EA6]/10">
              <div className="flex justify-between items-center border-b border-line pb-3">
                <div>
                  <h3 className="font-serif text-[18px] text-[#3B2647] font-bold tracking-tight">
                    Create Service Recipe (BOM)
                  </h3>
                  <p className="text-xs text-soft">
                    Configure raw material auto-deductions per salon service
                  </p>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-soft hover:text-ink transition bg-transparent border-0 cursor-pointer p-1 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveRecipe} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      Salon Service Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Hair Color Service"
                      value={recipeForm.serviceName}
                      onChange={(e) =>
                        setRecipeForm({ ...recipeForm, serviceName: e.target.value })
                      }
                      className="w-full p-2.5 bg-paper/30 border border-line rounded-xl outline-none focus:border-[#5A2EA6] text-ink font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      Service Category
                    </label>
                    <select
                      value={recipeForm.category}
                      onChange={(e) => setRecipeForm({ ...recipeForm, category: e.target.value })}
                      className="w-full p-2.5 bg-paper/30 border border-line rounded-xl outline-none focus:border-[#5A2EA6] text-ink font-semibold cursor-pointer"
                    >
                      <option value="Hair Technical">Hair Technical</option>
                      <option value="Skin & Facial">Skin &amp; Facial</option>
                      <option value="Spa & Massage">Spa &amp; Massage</option>
                      <option value="Nail & Pedicure">Nail &amp; Pedicure</option>
                    </select>
                  </div>
                </div>

                {/* INGREDIENTS LIST FORM BUILDER */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-soft uppercase tracking-wider">
                      Consumable Ingredients (BOM)
                    </span>
                    <button
                      type="button"
                      onClick={handleAddIngredientRow}
                      className="flex items-center gap-1 text-[11px] font-bold text-[#5A2EA6] hover:underline bg-transparent border-0 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Ingredient Row
                    </button>
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {recipeForm.ingredients.map((ing, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-pine/5 rounded-2xl border border-line grid grid-cols-12 gap-2 items-center"
                      >
                        <div className="col-span-4">
                          <label className="text-[9.5px] font-bold text-muted uppercase block">
                            Product SKU
                          </label>
                          <input
                            type="text"
                            value={ing.product}
                            onChange={(e) => {
                              const updated = [...recipeForm.ingredients];
                              updated[idx].product = e.target.value;
                              setRecipeForm({ ...recipeForm, ingredients: updated });
                            }}
                            className="w-full p-2 bg-white border border-line rounded-xl font-semibold text-xs"
                          />
                        </div>

                        <div className="col-span-2">
                          <label className="text-[9.5px] font-bold text-muted uppercase block">
                            Quantity
                          </label>
                          <input
                            type="text"
                            value={ing.quantity}
                            onChange={(e) => {
                              const updated = [...recipeForm.ingredients];
                              updated[idx].quantity = e.target.value;
                              setRecipeForm({ ...recipeForm, ingredients: updated });
                            }}
                            className="w-full p-2 bg-white border border-line rounded-xl font-bold text-purple-900 text-xs"
                          />
                        </div>

                        <div className="col-span-2">
                          <label className="text-[9.5px] font-bold text-muted uppercase block">
                            Unit (UOM)
                          </label>
                          <select
                            value={ing.unit}
                            onChange={(e) => {
                              const updated = [...recipeForm.ingredients];
                              updated[idx].unit = e.target.value;
                              setRecipeForm({ ...recipeForm, ingredients: updated });
                            }}
                            className="w-full p-2 bg-white border border-line rounded-xl font-semibold text-xs cursor-pointer"
                          >
                            <option value="ml">ml</option>
                            <option value="g">g</option>
                            <option value="Pair">Pair</option>
                            <option value="Pcs">Pcs</option>
                            <option value="Bottle">Bottle</option>
                          </select>
                        </div>

                        <div className="col-span-2">
                          <label className="text-[9.5px] font-bold text-muted uppercase block">
                            Tolerance %
                          </label>
                          <input
                            type="text"
                            value={ing.tolerancePct}
                            onChange={(e) => {
                              const updated = [...recipeForm.ingredients];
                              updated[idx].tolerancePct = e.target.value;
                              setRecipeForm({ ...recipeForm, ingredients: updated });
                            }}
                            className="w-full p-2 bg-white border border-line rounded-xl font-semibold text-xs"
                          />
                        </div>

                        <div className="col-span-2 flex items-center justify-between gap-1">
                          <div>
                            <label className="text-[9.5px] font-bold text-muted uppercase block">
                              Requirement
                            </label>
                            <select
                              value={ing.requirement}
                              onChange={(e) => {
                                const updated = [...recipeForm.ingredients];
                                updated[idx].requirement = e.target.value;
                                setRecipeForm({ ...recipeForm, ingredients: updated });
                              }}
                              className="p-2 bg-white border border-line rounded-xl font-semibold text-[10.5px] cursor-pointer"
                            >
                              <option value="Mandatory">Mandatory</option>
                              <option value="Optional">Optional</option>
                            </select>
                          </div>
                          {recipeForm.ingredients.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveIngredientRow(idx)}
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
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-5 py-2.5 border border-line rounded-xl text-xs font-bold text-soft cursor-pointer bg-transparent"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#5A2EA6] hover:bg-[#482387] text-white rounded-xl text-xs font-bold shadow cursor-pointer border-0"
                  >
                    Save Service Recipe (BOM)
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
