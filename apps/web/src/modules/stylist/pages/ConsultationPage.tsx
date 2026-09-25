import { Button, cn, useToast } from '@salon-spa-saas/ui';
import { CheckCircle2, ClipboardList, FileText, PenTool, Search, ShieldAlert } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

export function ConsultationPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'new' | 'history' | 'consent'>('new');

  // Form states
  const [clientName, setClientName] = useState('Priya Sharma');
  const [hairType, setHairType] = useState('Curly Type 3A');
  const [scalpCondition, setScalpCondition] = useState('Normal - Sensitive Scalp');
  const [previousColor, setPreviousColor] = useState('Box Dye Brown 6 Months Ago');
  const [patchTestResult, setPatchTestResult] = useState<'Clear' | 'Reaction Flagged'>('Clear');
  const [contraindications, setContraindications] = useState('Ammonia Sensitivity');

  const handleSubmitConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    toast(`Digital Consultation & Patch Test Waiver for ${clientName} saved successfully! 📝`);
  };

  return (
    <div className="animate-in fade-in duration-300 space-y-6 pb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl text-ink font-bold tracking-tight">
            Digital Consultation &amp; Consent
          </h1>
          <p className="text-[13px] text-soft mt-1">
            Pre-service diagnostic forms, hair/skin contraindication checks, patch test logs &amp;
            legal waivers
          </p>
        </div>

        <div className="flex bg-[#F8F5FF] p-1 rounded-2xl border border-[#5A2EA6]/15">
          <button
            onClick={() => setActiveTab('new')}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-bold transition border-0 cursor-pointer',
              activeTab === 'new'
                ? 'bg-[#5A2EA6] text-white shadow-xs'
                : 'text-[#5A2EA6] hover:bg-[#5A2EA6]/5',
            )}
          >
            New Consultation Form
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
            Consultation History
          </button>
          <button
            onClick={() => setActiveTab('consent')}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-bold transition border-0 cursor-pointer',
              activeTab === 'consent'
                ? 'bg-[#5A2EA6] text-white shadow-xs'
                : 'text-[#5A2EA6] hover:bg-[#5A2EA6]/5',
            )}
          >
            Consent &amp; Waivers
          </button>
        </div>
      </div>

      {activeTab === 'new' && (
        <form
          onSubmit={handleSubmitConsultation}
          className="bg-white rounded-[24px] border border-[#5A2EA6]/15 p-6 shadow-xs space-y-5"
        >
          <h3 className="font-serif text-lg font-bold text-ink border-b border-line pb-3">
            Client Diagnostic &amp; Hair Profile Sheet
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-soft uppercase tracking-wider block mb-1">
                Client Legal Name
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-[#FCFAFF] border border-line rounded-xl p-3 text-xs font-bold text-ink"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-soft uppercase tracking-wider block mb-1">
                Hair Texture &amp; Type
              </label>
              <input
                type="text"
                value={hairType}
                onChange={(e) => setHairType(e.target.value)}
                className="w-full bg-[#FCFAFF] border border-line rounded-xl p-3 text-xs font-bold text-ink"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-soft uppercase tracking-wider block mb-1">
                Scalp &amp; Skin Condition
              </label>
              <input
                type="text"
                value={scalpCondition}
                onChange={(e) => setScalpCondition(e.target.value)}
                className="w-full bg-[#FCFAFF] border border-line rounded-xl p-3 text-xs font-bold text-ink"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-soft uppercase tracking-wider block mb-1">
                Previous Chemical/Color History
              </label>
              <input
                type="text"
                value={previousColor}
                onChange={(e) => setPreviousColor(e.target.value)}
                className="w-full bg-[#FCFAFF] border border-line rounded-xl p-3 text-xs font-bold text-ink"
                required
              />
            </div>
          </div>

          <div className="p-4 bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-2xl space-y-3">
            <h4 className="text-xs font-bold text-[#5A2EA6] uppercase tracking-wider">
              Patch Test &amp; Safety Contraindication Check
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10.5px] font-bold text-muted block mb-1">
                  Patch Test Result (48h Prior)
                </label>
                <select
                  value={patchTestResult}
                  onChange={(e) => setPatchTestResult(e.target.value as any)}
                  className="w-full bg-white border border-line rounded-xl p-2.5 text-xs font-bold text-ink"
                >
                  <option value="Clear">✓ Clear (No Skin Reaction)</option>
                  <option value="Reaction Flagged">⚠️ Reaction Flagged (Do Not Proceed)</option>
                </select>
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-muted block mb-1">
                  Known Allergies / Cautions
                </label>
                <input
                  type="text"
                  value={contraindications}
                  onChange={(e) => setContraindications(e.target.value)}
                  className="w-full bg-white border border-line rounded-xl p-2.5 text-xs font-bold text-ink"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Button
              type="submit"
              className="h-10 px-6 rounded-xl text-xs font-bold premium-btn-primary"
            >
              Save Consultation &amp; Digital Sign-Off
            </Button>
          </div>
        </form>
      )}

      {activeTab === 'history' && (
        <div className="bg-white rounded-[24px] border border-[#5A2EA6]/15 p-5 shadow-xs space-y-4">
          <h3 className="font-serif text-base font-bold text-ink border-b border-line pb-3">
            Past Consultation Records
          </h3>
          <div className="space-y-3">
            <div className="p-4 bg-[#FCFAFF] border border-[#5A2EA6]/15 rounded-2xl flex justify-between items-center text-xs">
              <div>
                <b className="text-ink font-bold block">Priya Sharma · Balayage Diagnostic</b>
                <span className="text-soft">Jul 24, 2026 · Stylist: Emma Burke</span>
              </div>
              <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold px-3 py-1 rounded-full">
                Patch Test Clear ✓
              </span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'consent' && (
        <div className="bg-white rounded-[24px] border border-[#5A2EA6]/15 p-5 shadow-xs space-y-4">
          <h3 className="font-serif text-base font-bold text-ink border-b border-line pb-3">
            Digital Chemical Waiver &amp; Consent Forms
          </h3>
          <p className="text-xs text-soft">
            Clients sign these digital liability waivers prior to high-lift bleach, chemical
            straightening, or intensive skin peels.
          </p>
          <Button
            onClick={() => toast('Opening digital pad for client signature...')}
            className="h-9 text-xs font-bold premium-btn-primary"
          >
            <PenTool className="w-3.5 h-3.5 mr-1" /> Open Digital Signature Pad
          </Button>
        </div>
      )}
    </div>
  );
}
