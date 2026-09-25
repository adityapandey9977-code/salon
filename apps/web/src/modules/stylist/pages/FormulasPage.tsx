import { Button, cn, useToast } from '@salon-spa-saas/ui';
import { Check, Copy, FlaskConical, History, Plus, Search, ShieldAlert, X } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { createPortal } from 'react-dom';

interface FormulaItem {
  id: string;
  client: string;
  date: string;
  service: string;
  shade: string;
  additive: string;
  processingTime: string;
  notes: string;
}

const initialFormulas: FormulaItem[] = [
  {
    id: 'f-1',
    client: 'Priya Sharma',
    date: 'Jul 24, 2026',
    service: 'Balayage Color & Gloss',
    shade: 'Shade 7.1 Ash Blonde + 20Vol Bleach',
    additive: '10g Olaplex No.1 Bond Multiplier',
    processingTime: '25 minutes',
    notes: 'Ammonia-free formula. Perfect cool ash tone achieved.',
  },
  {
    id: 'f-2',
    client: 'Sonia Gupta',
    date: 'Jun 28, 2026',
    service: 'Root Touch Up & Gloss',
    shade: 'Shade 5.0 Light Brown + 10Vol Developer',
    additive: '5ml Argan Serum Glow',
    processingTime: '30 minutes',
    notes: '100% grey coverage on temple section.',
  },
];

const treatmentRecipes = [
  {
    name: 'Kérastase Chronologiste Caviar Treatment',
    recipe: '15ml Caviar Pearl Concentrate + 30g Essential Balm Mask',
    application: 'Section by section scalp to tip application, steam 15m.',
    benefits: 'Anti-aging hair fiber renewal & deep nourishment.',
  },
  {
    name: 'Olaplex Standalone Intensive Rebuilding',
    recipe: '15ml Olaplex No.1 + 90ml Water, follow with No.2 Bond Perfector 30ml',
    application: 'Saturate dry hair 10m, apply No.2 for 20m before shampoo.',
    benefits: 'Repairs broken disulfide bonds in bleached hair.',
  },
];

export function FormulasPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'color' | 'treatments' | 'history'>('color');
  const [formulas, setFormulas] = useState<FormulaItem[]>(initialFormulas);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal Form States
  const [client, setClient] = useState('Priya Sharma');
  const [service, setService] = useState('Balayage Color & Gloss');
  const [shade, setShade] = useState('Shade 8.1 Platinum Blonde + 20Vol Developer');
  const [additive, setAdditive] = useState('10g Olaplex No.1 Bond Multiplier');
  const [processingTime, setProcessingTime] = useState('25 minutes');
  const [notes, setNotes] = useState('Ammonia-free organic developer used. Section 04 foils.');

  const handleCopyFormula = (shadeText: string) => {
    toast(`Copied formula: "${shadeText}" to clipboard! 🧪`);
  };

  const handleAddFormulaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shade.trim()) return;

    const newFormula: FormulaItem = {
      id: `f-${Date.now()}`,
      client,
      date: 'Jul 24, 2026',
      service,
      shade,
      additive,
      processingTime,
      notes,
    };

    setFormulas([newFormula, ...formulas]);
    setIsModalOpen(false);
    toast(`Successfully logged new chemical color formula for ${client}! 🧪`);
  };

  return (
    <div className="animate-in fade-in duration-300 space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl text-ink font-bold tracking-tight">
            Formulas &amp; Chemical Recipes
          </h1>
          <p className="text-[13px] text-soft mt-1">
            Color shade codes, developer ratios, treatment BOM recipes, and client formula handover
            logbook
          </p>
        </div>

        <div className="flex bg-[#F8F5FF] p-1 rounded-2xl border border-[#5A2EA6]/15">
          <button
            onClick={() => setActiveTab('color')}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-bold transition border-0 cursor-pointer',
              activeTab === 'color'
                ? 'bg-[#5A2EA6] text-white shadow-xs'
                : 'text-[#5A2EA6] hover:bg-[#5A2EA6]/5',
            )}
          >
            Hair Color Formulas
          </button>
          <button
            onClick={() => setActiveTab('treatments')}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-bold transition border-0 cursor-pointer',
              activeTab === 'treatments'
                ? 'bg-[#5A2EA6] text-white shadow-xs'
                : 'text-[#5A2EA6] hover:bg-[#5A2EA6]/5',
            )}
          >
            Spa &amp; Treatment Recipes
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-bold transition border-0 cursor-pointer',
              activeTab === 'history'
                ? 'bg-[#5A2EA6] text-white shadow-xs'
                : 'text-[#5A2EA6] hover:bg-[#5A2EA6]/5',
            )}
          >
            Formula Handover History
          </button>
        </div>
      </div>

      {/* HAIR COLOR FORMULAS TAB */}
      {activeTab === 'color' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-base font-bold text-ink">
              Client Hair Color Formula Records ({formulas.length})
            </h3>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="h-9 px-4 text-xs font-bold premium-btn-primary cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Log New Formula
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formulas.map((f) => (
              <div
                key={f.id}
                className="bg-white rounded-[24px] border border-[#5A2EA6]/15 p-5 shadow-xs space-y-3 hover:border-[#5A2EA6]/30 transition"
              >
                <div className="flex justify-between items-start border-b border-line pb-2">
                  <div>
                    <h4 className="font-serif text-base font-bold text-ink">{f.client}</h4>
                    <span className="text-[11px] text-soft font-medium">
                      {f.service} · {f.date}
                    </span>
                  </div>
                  <Button
                    onClick={() => handleCopyFormula(f.shade)}
                    variant="outline"
                    className="h-7 px-2.5 text-[10px] font-bold border-[#5A2EA6]/20 text-[#5A2EA6] cursor-pointer"
                  >
                    <Copy className="w-3 h-3 mr-1" /> Copy Formula
                  </Button>
                </div>

                <div className="bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl p-3 space-y-1.5 text-xs font-mono">
                  <p className="font-bold text-[#5A2EA6]">Shade: {f.shade}</p>
                  <p className="text-ink font-medium">Additive: {f.additive}</p>
                  <p className="text-soft font-medium">Processing: {f.processingTime}</p>
                </div>

                <p className="text-[11.5px] text-soft italic">{f.notes}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SPA & TREATMENT RECIPES TAB */}
      {activeTab === 'treatments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {treatmentRecipes.map((r, i) => (
            <div
              key={i}
              className="bg-white rounded-[24px] border border-[#5A2EA6]/15 p-5 shadow-xs space-y-3"
            >
              <h4 className="font-serif text-base font-bold text-[#5A2EA6]">{r.name}</h4>
              <div className="bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl p-3 text-xs font-mono font-bold text-ink">
                Recipe Ratio: {r.recipe}
              </div>
              <p className="text-xs text-soft">
                <strong>Application:</strong> {r.application}
              </p>
              <p className="text-[11.5px] text-emerald-800 font-semibold">✓ {r.benefits}</p>
            </div>
          ))}
        </div>
      )}

      {/* FORMULA HANDOVER HISTORY TAB */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-[24px] border border-[#5A2EA6]/15 p-5 shadow-xs space-y-4">
          <h3 className="font-serif text-base font-bold text-ink border-b border-line pb-3">
            Formula Handover Audit Logbook
          </h3>
          <div className="divide-y divide-[#5A2EA6]/10 space-y-2">
            {formulas.map((f) => (
              <div key={f.id} className="pt-3 flex justify-between items-center text-xs">
                <div>
                  <b className="text-ink font-bold">{f.client}</b>
                  <span className="text-soft block">
                    {f.service} · {f.date}
                  </span>
                  <span className="font-mono text-[#5A2EA6] font-bold block mt-0.5">{f.shade}</span>
                </div>
                <Button
                  onClick={() => handleCopyFormula(f.shade)}
                  variant="outline"
                  className="h-7 px-2 text-[10px] font-bold border-[#5A2EA6]/20 text-[#5A2EA6]"
                >
                  Re-use Formula
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LARGE DIALOG MODAL COVERING SCREEN */}
      {isModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[99999] bg-[#3B2647]/50 backdrop-blur-md flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-200">
            <form
              onSubmit={handleAddFormulaSubmit}
              className="bg-white rounded-[32px] w-[94vw] max-w-3xl lg:max-w-4xl max-h-[92vh] shadow-[0_30px_70px_rgba(90,46,166,0.25)] border border-[#5A2EA6]/20 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 relative z-[100000]"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-b from-[#FCFAFF] to-[#F8F5FF] px-7 py-5 border-b border-[#5A2EA6]/15 flex justify-between items-center relative shrink-0">
                <div>
                  <span className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block">
                    Chemical Recipe Logger
                  </span>
                  <h3 className="font-serif text-xl font-bold text-ink mt-0.5">
                    Log New Color / Treatment Formula
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-9 h-9 rounded-full bg-white hover:bg-paper text-soft hover:text-ink flex items-center justify-center transition border border-[#5A2EA6]/15 cursor-pointer shadow-xs"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-7 overflow-y-auto space-y-5 text-xs flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-soft uppercase tracking-wider block mb-1.5">
                      Target Client
                    </label>
                    <select
                      value={client}
                      onChange={(e) => setClient(e.target.value)}
                      className="w-full bg-[#FCFAFF] border border-line rounded-xl p-3 text-xs font-bold text-ink cursor-pointer outline-none focus:border-[#5A2EA6]"
                    >
                      <option value="Priya Sharma">Priya Sharma</option>
                      <option value="Ava Rose">Ava Rose</option>
                      <option value="Sonia Gupta">Sonia Gupta</option>
                      <option value="Meera Kapoor">Meera Kapoor</option>
                      <option value="Aarav Khanna">Aarav Khanna</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-soft uppercase tracking-wider block mb-1.5">
                      Service / Treatment
                    </label>
                    <input
                      type="text"
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      placeholder="e.g. Balayage Color & Gloss"
                      className="w-full bg-[#FCFAFF] border border-line rounded-xl p-3 text-xs font-bold text-ink outline-none focus:border-[#5A2EA6]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                    Color Shade Code &amp; Developer Ratio
                  </label>
                  <input
                    type="text"
                    value={shade}
                    onChange={(e) => setShade(e.target.value)}
                    placeholder="e.g. Shade 7.1 Ash Blonde + 20Vol Bleach"
                    className="w-full bg-[#FCFAFF] border border-[#5A2EA6]/30 rounded-xl p-3 text-xs font-bold text-ink outline-none font-mono focus:border-[#5A2EA6]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-soft uppercase tracking-wider block mb-1.5">
                      Bond Additive / Serum
                    </label>
                    <input
                      type="text"
                      value={additive}
                      onChange={(e) => setAdditive(e.target.value)}
                      placeholder="e.g. 10g Olaplex No.1"
                      className="w-full bg-[#FCFAFF] border border-line rounded-xl p-3 text-xs font-bold text-ink outline-none focus:border-[#5A2EA6]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-soft uppercase tracking-wider block mb-1.5">
                      Processing Duration
                    </label>
                    <input
                      type="text"
                      value={processingTime}
                      onChange={(e) => setProcessingTime(e.target.value)}
                      placeholder="e.g. 25 minutes"
                      className="w-full bg-[#FCFAFF] border border-line rounded-xl p-3 text-xs font-bold text-ink outline-none focus:border-[#5A2EA6]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-soft uppercase tracking-wider block mb-1.5">
                    Handover &amp; Application Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Record foil section details, organic developer notes, or scalp observations..."
                    className="w-full bg-[#FCFAFF] border border-line rounded-xl p-3 text-xs outline-none focus:border-[#5A2EA6] text-ink font-semibold h-28"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-[#FCFAFF] px-7 py-4 border-t border-[#5A2EA6]/10 flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold border border-line bg-white hover:bg-paper/40 text-soft cursor-pointer"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold premium-btn-primary cursor-pointer"
                >
                  Save &amp; Log Formula
                </Button>
              </div>
            </form>
          </div>,
          document.body,
        )}
    </div>
  );
}
