import type React from 'react';
import { useState } from 'react';
import { personasData, prdFeaturesData, pricingTiersData } from '../data/landingData';
import type { AuthRole } from '../types/landingTypes';
import { AuthModal } from './AuthModal';

export const SalonLandingPage: React.FC = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);
  const [activePersonaId, setActivePersonaId] = useState<string>('brand_owner');
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<AuthRole>('brand_owner');

  // Hero Live Widget Tab
  const [heroWidgetTab, setHeroWidgetTab] = useState<'diary' | 'pos' | 'formula' | 'whatsapp'>(
    'diary',
  );

  // PRD Feature Category Filter
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // ROI Calculator State
  const [branchCount, setBranchCount] = useState<number>(3);
  const [monthlyBookings, setMonthlyBookings] = useState<number>(800);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const activePersona = personasData.find((p) => p.id === activePersonaId) || personasData[0];

  const handleOpenAuth = (role: AuthRole = 'brand_owner') => {
    setSelectedRole(role);
    setIsAuthOpen(true);
  };

  // Filtered PRD Features
  const categories = ['All', 'Core', 'POS', 'Safety', 'Formula', 'WhatsApp', 'Inventory'];
  const filteredFeatures =
    selectedCategory === 'All'
      ? prdFeaturesData
      : prdFeaturesData.filter((f) => f.category === selectedCategory);

  // Calculator calculations
  const extraRevenue = branchCount * monthlyBookings * 180 * 12; // ~ ₹180 extra revenue per booking from rebooking & upsell
  const hoursSaved = branchCount * 14; // 14 hours saved per branch/week
  const wastageSaved = branchCount * 28500 * 12; // ₹28,500 monthly wastage saved per branch

  const faqs = [
    {
      q: 'Is the platform compliant with Indian GST & e-invoicing standards?',
      a: 'Yes! The POS module automatically calculates SGST, CGST, and IGST based on item categories, supports split payment methods (UPI, Card, Cash, Wallet), and generates downloadable GST tax receipts and credit notes (SALO-PR-043).',
    },
    {
      q: 'How does the Local-Language WhatsApp Assistant [P-06] work?',
      a: 'Our WhatsApp integration uses DLT-approved templates to automatically send booking confirmations, appointment reminders, interactive rebooking prompts, and post-service care guides in Hindi, English, and regional languages.',
    },
    {
      q: 'What is Formula Intelligence & Controlled Handover [P-02]?',
      a: 'It stores exact hair color mixes (brand, shade ratio, developer volume) and skin treatment formulas in client records. When a client books with a different stylist, the formula auto-populates to guarantee color continuity.',
    },
    {
      q: 'Can we migrate existing data from spreadsheets or legacy software?',
      a: 'Yes, our automated onboarding tool validates and imports client profiles, service catalogues, inventory stock, and historical formula notes with full error reconciliation before go-live.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#140d1a] text-[#faf8f5] font-sans selection:bg-[#e6c594] selection:text-[#140d1a] overflow-x-hidden">
      {/* Background Glow Elements - Midnight Plum & Champagne Rose */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-1/4 w-[650px] h-[650px] bg-[#c084fc]/15 rounded-full blur-[160px]" />
        <div className="absolute bottom-1/3 left-10 w-[550px] h-[550px] bg-[#dfa0a0]/15 rounded-full blur-[140px]" />
      </div>

      {/* Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#140d1a]/90 backdrop-blur-xl border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#e6c594] via-[#dfa0a0] to-[#c084fc] flex items-center justify-center font-bold text-[#140d1a] text-lg shadow-lg shadow-[#e6c594]/25">
              S&S
            </div>
            <div>
              <span className="font-serif text-xl font-bold tracking-tight text-white block leading-none">
                Aura Salon & Spa
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#e6c594] font-semibold">
                Opulent SaaS Platform
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-widest text-white/70">
            <a href="#hero" className="hover:text-[#e6c594] transition">
              Overview
            </a>
            <a href="#demo" className="hover:text-[#e6c594] transition">
              Live Simulation
            </a>
            <a href="#personas" className="hover:text-[#e6c594] transition">
              Workspaces
            </a>
            <a href="#calculator" className="hover:text-[#e6c594] transition">
              ROI Calculator
            </a>
            <a href="#features" className="hover:text-[#e6c594] transition">
              PRD Matrix
            </a>
            <a href="#pricing" className="hover:text-[#e6c594] transition">
              Pricing
            </a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => handleOpenAuth('branch_manager')}
              className="hidden sm:inline-flex px-4 py-2 rounded-xl border border-purple-400/20 bg-white/5 text-xs font-semibold hover:bg-white/10 transition text-white"
            >
              Branch Sign In
            </button>
            <button
              onClick={() => handleOpenAuth('brand_owner')}
              className="hidden sm:inline-flex px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#e6c594] via-[#dfa0a0] to-[#e6c594] text-[#140d1a] text-xs font-bold hover:brightness-110 transition shadow-lg shadow-[#e6c594]/25"
            >
              Get Started →
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="md:hidden p-2 rounded-xl border border-purple-400/30 bg-white/5 text-[#e6c594] hover:bg-white/10 transition cursor-pointer"
              aria-label="Toggle Navigation"
            >
              {isMobileNavOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        {isMobileNavOpen && (
          <div className="md:hidden border-t border-purple-500/20 bg-[#140d1a]/95 backdrop-blur-xl px-6 py-5 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col gap-3 text-xs font-semibold uppercase tracking-widest text-white/80">
              <a href="#hero" onClick={() => setIsMobileNavOpen(false)} className="py-1 hover:text-[#e6c594] transition">
                Overview
              </a>
              <a href="#demo" onClick={() => setIsMobileNavOpen(false)} className="py-1 hover:text-[#e6c594] transition">
                Live Simulation
              </a>
              <a href="#personas" onClick={() => setIsMobileNavOpen(false)} className="py-1 hover:text-[#e6c594] transition">
                Workspaces
              </a>
              <a href="#calculator" onClick={() => setIsMobileNavOpen(false)} className="py-1 hover:text-[#e6c594] transition">
                ROI Calculator
              </a>
              <a href="#features" onClick={() => setIsMobileNavOpen(false)} className="py-1 hover:text-[#e6c594] transition">
                PRD Matrix
              </a>
              <a href="#pricing" onClick={() => setIsMobileNavOpen(false)} className="py-1 hover:text-[#e6c594] transition">
                Pricing
              </a>
            </nav>
            <div className="pt-3 border-t border-purple-500/20 flex flex-col gap-2">
              <button
                onClick={() => {
                  setIsMobileNavOpen(false);
                  handleOpenAuth('branch_manager');
                }}
                className="w-full py-2.5 rounded-xl border border-purple-400/20 bg-white/5 text-xs font-semibold hover:bg-white/10 transition text-white text-center"
              >
                Branch Sign In
              </button>
              <button
                onClick={() => {
                  setIsMobileNavOpen(false);
                  handleOpenAuth('brand_owner');
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#e6c594] via-[#dfa0a0] to-[#e6c594] text-[#140d1a] text-xs font-bold hover:brightness-110 transition shadow-lg shadow-[#e6c594]/25 text-center"
              >
                Get Started →
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="hero" className="relative pt-16 pb-20 px-6 max-w-7xl mx-auto z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#e6c594]/10 border border-[#e6c594]/30 text-[#e6c594] text-[11px] font-semibold uppercase tracking-widest mb-8">
          <span className="w-2 h-2 rounded-full bg-[#e6c594] animate-pulse" />
          India-First Salon & Spa Management SaaS · PRD Version 1.0
        </div>

        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          <div>
            <h1 className="font-serif text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight text-white">
              Run salon & spa
              <br />
              chains the <span className="italic font-normal text-[#e6c594]">intelligent</span> way.
            </h1>

            <p className="mt-6 text-lg text-white/70 max-w-xl leading-relaxed">
              Unified conflict-free appointment diary, GST POS, client safety flags [P-01], formula
              handover intelligence [P-02], and local-language WhatsApp booking [P-06].
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={() => handleOpenAuth('brand_owner')}
                className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#e6c594] via-[#dfa0a0] to-[#e6c594] text-[#140d1a] font-bold text-sm hover:scale-[1.02] transition shadow-xl shadow-[#e6c594]/30"
              >
                Launch Brand Owner Demo →
              </button>
              <button
                onClick={() => handleOpenAuth('branch_manager')}
                className="px-6 py-3.5 rounded-2xl bg-white/5 border border-purple-400/20 text-white font-semibold text-sm hover:bg-white/10 transition flex items-center gap-2"
              >
                <span>Front Desk POS Login</span>
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="mt-12 grid grid-cols-3 gap-4 p-4 rounded-2xl bg-[#1f1528]/80 border border-purple-500/20 backdrop-blur-md">
              <div>
                <div className="text-2xl font-bold text-white font-mono">₹48.2L</div>
                <div className="text-[11px] text-white/50 uppercase tracking-wider font-medium">
                  Monthly Revenue
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#e6c594] font-mono">98.4%</div>
                <div className="text-[11px] text-white/50 uppercase tracking-wider font-medium">
                  Chair Utilisation
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#c084fc] font-mono">121+</div>
                <div className="text-[11px] text-white/50 uppercase tracking-wider font-medium">
                  PRD Capabilities
                </div>
              </div>
            </div>
          </div>

          {/* Hero Interactive Interactive Widget */}
          <div id="demo" className="relative">
            <div className="p-6 rounded-3xl bg-[#1e1428] border border-purple-500/30 shadow-2xl space-y-4">
              {/* Interactive Widget Header Tabs */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10">
                  <button
                    onClick={() => setHeroWidgetTab('diary')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                      heroWidgetTab === 'diary'
                        ? 'bg-[#e6c594] text-[#140d1a]'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    Diary
                  </button>
                  <button
                    onClick={() => setHeroWidgetTab('pos')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                      heroWidgetTab === 'pos'
                        ? 'bg-[#e6c594] text-[#140d1a]'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    GST POS
                  </button>
                  <button
                    onClick={() => setHeroWidgetTab('formula')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                      heroWidgetTab === 'formula'
                        ? 'bg-[#e6c594] text-[#140d1a]'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    Formula [P-02]
                  </button>
                  <button
                    onClick={() => setHeroWidgetTab('whatsapp')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                      heroWidgetTab === 'whatsapp'
                        ? 'bg-[#e6c594] text-[#140d1a]'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    WhatsApp
                  </button>
                </div>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-md bg-[#c084fc]/20 border border-[#c084fc]/40 text-[#e9d5ff] text-[10px] uppercase font-bold tracking-wider">
                  Live System
                </span>
              </div>

              {/* Tab Content 1: Live Diary */}
              {heroWidgetTab === 'diary' && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#e6c594]/20 border border-[#e6c594]/40 flex items-center justify-center font-bold text-[#e6c594] text-xs">
                        PM
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">
                          Priya Sharma · Keratin Hair Treatment
                        </div>
                        <div className="text-xs text-white/50">
                          Stylist: Ananya R. · Chair #03 · 11:30 AM
                        </div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-pink-500/20 text-pink-300 text-xs font-semibold">
                      In Progress
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#c084fc]/20 border border-[#c084fc]/40 flex items-center justify-center font-bold text-[#e9d5ff] text-xs">
                        RK
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">
                          Rohit Kapoor · Full Body Swedish Spa
                        </div>
                        <div className="text-xs text-white/50">
                          Therapist: Rahul M. · Room #02 · 12:00 PM
                        </div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-[#e6c594]/20 text-[#e6c594] text-xs font-semibold">
                      Confirmed
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-gradient-to-r from-[#c084fc]/20 via-[#dfa0a0]/15 to-transparent border border-[#c084fc]/30 flex items-center gap-3">
                    <div className="text-lg">✨</div>
                    <div className="text-xs text-white/90">
                      <strong className="text-[#e6c594]">Allergy Safety Flag [P-01]:</strong> Zero
                      patch-test sensitivity flagged for client Priya S.
                    </div>
                  </div>
                </div>
              )}

              {/* Tab Content 2: POS & GST Billing */}
              {heroWidgetTab === 'pos' && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex justify-between text-xs text-white/70">
                      <span>Service: Balayage Hair Color + Styling</span>
                      <span className="font-mono font-bold text-white">₹4,500</span>
                    </div>
                    <div className="flex justify-between text-xs text-white/70">
                      <span>Retail: Moroccanoil Serum (100ml)</span>
                      <span className="font-mono font-bold text-white">₹2,800</span>
                    </div>
                    <div className="flex justify-between text-xs text-white/50 pt-2 border-t border-white/10">
                      <span>CGST (9%) + SGST (9%)</span>
                      <span className="font-mono">₹1,314</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-[#e6c594] pt-2 border-t border-white/10">
                      <span>Total GST Invoice (Split UPI + Card)</span>
                      <span className="font-mono">₹8,614</span>
                    </div>
                  </div>
                  <div className="text-center text-[11px] text-green-400 font-semibold">
                    ✓ GST Invoice Generated & Sent via WhatsApp Receipt
                  </div>
                </div>
              )}

              {/* Tab Content 3: Formula Intelligence */}
              {heroWidgetTab === 'formula' && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="p-4 rounded-xl bg-purple-900/20 border border-purple-500/30 space-y-2">
                    <div className="text-xs font-bold text-[#e6c594] uppercase tracking-wider">
                      Formula Record #F-882 · Color Continuity
                    </div>
                    <div className="text-xs text-white/90 font-mono bg-black/40 p-2.5 rounded-lg">
                      Base: L'Oréal Majirel 6.1 (40g) + 20 Vol Developer (60ml)
                      <br />
                      Highlights: Blond Studio 9 + 30 Vol (1:2 ratio)
                      <br />
                      Toner: Dialight 9.02 (20g) + 6 Vol (30ml)
                    </div>
                    <div className="text-[11px] text-white/60">
                      Logged by Stylist Ananya R. on 14 June 2026 for client Meera K.
                    </div>
                  </div>
                </div>
              )}

              {/* Tab Content 4: WhatsApp Assistant */}
              {heroWidgetTab === 'whatsapp' && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold">
                      <span>💬 WhatsApp Business Assistant [P-06]</span>
                    </div>
                    <div className="bg-emerald-900/20 p-3 rounded-lg text-white/90 leading-relaxed font-sans">
                      "Namaste Priya ji! 🌸 Confirming your appointment at Aura Spa (Bandra) for
                      tomorrow at 11:30 AM. Tap below to reschedule or view care tips."
                    </div>
                    <div className="flex gap-2 pt-1">
                      <span className="px-2.5 py-1 rounded bg-white/10 text-white/80 text-[10px]">
                        1-Tap Confirm
                      </span>
                      <span className="px-2.5 py-1 rounded bg-white/10 text-white/80 text-[10px]">
                        Reschedule
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Persona Showcase Section */}
      <section
        id="personas"
        className="py-20 px-6 bg-[#1a1224] border-t border-b border-purple-500/20"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#e6c594]">
              Tailored Panel Architecture (PRD Section 4)
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mt-2">
              9 Specialized Role Workspaces
            </h2>
            <p className="text-sm text-white/60 mt-3">
              Explore how our multi-tenant SaaS empowers every stakeholder across your salon & spa
              business.
            </p>
          </div>

          {/* Persona Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {personasData.map((persona) => (
              <button
                key={persona.id}
                onClick={() => setActivePersonaId(persona.id)}
                className={`px-5 py-3 rounded-2xl text-xs font-semibold transition flex items-center gap-2 ${
                  activePersonaId === persona.id
                    ? 'bg-gradient-to-r from-[#e6c594] via-[#dfa0a0] to-[#e6c594] text-[#140d1a] shadow-lg shadow-[#e6c594]/20 font-bold'
                    : 'bg-white/5 border border-purple-500/20 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span>{persona.title}</span>
                <span className="text-[10px] opacity-70">({persona.badge})</span>
              </button>
            ))}
          </div>

          {/* Active Persona Card */}
          <div className="p-8 rounded-3xl bg-[#231730] border border-purple-500/30 grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-center">
            <div>
              <div className="inline-block px-3 py-1 rounded-md bg-[#e6c594]/15 text-[#e6c594] text-xs font-bold uppercase tracking-wider mb-3">
                {activePersona.roleTag}
              </div>
              <h3 className="font-serif text-3xl font-bold text-white mb-3">
                {activePersona.title}
              </h3>
              <p className="text-white/70 text-sm leading-relaxed mb-6">
                {activePersona.description}
              </p>

              <div className="space-y-2.5 mb-8">
                {activePersona.highlights.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs text-white/90">
                    <span className="w-5 h-5 rounded-full bg-[#e6c594]/20 text-[#e6c594] flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleOpenAuth(activePersona.id as AuthRole)}
                className="px-6 py-3 rounded-xl bg-white/10 border border-purple-400/20 text-white font-semibold text-xs hover:bg-white/20 transition"
              >
                Access {activePersona.title} Workspace →
              </button>
            </div>

            {/* Persona Live Metrics Card */}
            <div className="p-6 rounded-2xl bg-[#170e20] border border-purple-500/20 space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-white/50 border-b border-white/10 pb-3">
                Workspace Metrics Preview
              </div>
              {activePersona.metrics.map((m, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-white/5 flex items-center justify-between"
                >
                  <span className="text-xs text-white/60">{m.label}</span>
                  <span className="font-mono text-base font-bold text-[#e6c594]">{m.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Interactive ROI Calculator Section */}
      <section id="calculator" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-b from-[#251735] to-[#180e22] border border-[#e6c594]/30 shadow-2xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#e6c594]">
              Interactive Business Impact Calculator
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mt-2">
              Calculate Your Salon Network's ROI
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Input Controls */}
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-bold text-white mb-2">
                  <span>Number of Salon & Spa Branches</span>
                  <span className="text-[#e6c594] font-mono text-base">{branchCount} Branches</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={25}
                  value={branchCount}
                  onChange={(e) => setBranchCount(Number.parseInt(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#e6c594]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-white mb-2">
                  <span>Monthly Appointments per Branch</span>
                  <span className="text-[#e6c594] font-mono text-base">
                    {monthlyBookings} Bookings
                  </span>
                </div>
                <input
                  type="range"
                  min={200}
                  max={3000}
                  step={100}
                  value={monthlyBookings}
                  onChange={(e) => setMonthlyBookings(Number.parseInt(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#e6c594]"
                />
              </div>
            </div>

            {/* Result Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-white/5 border border-purple-500/20 text-center">
                <div className="text-xs text-white/60 mb-1">Extra Annual Revenue</div>
                <div className="font-mono text-2xl font-bold text-[#e6c594]">
                  ₹{(extraRevenue / 100000).toFixed(1)} Lakh
                </div>
                <div className="text-[10px] text-white/40 mt-1">via WhatsApp rebooking</div>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-purple-500/20 text-center">
                <div className="text-xs text-white/60 mb-1">Time Saved</div>
                <div className="font-mono text-2xl font-bold text-[#c084fc]">
                  {hoursSaved} hrs/wk
                </div>
                <div className="text-[10px] text-white/40 mt-1">front desk automation</div>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-purple-500/20 text-center">
                <div className="text-xs text-white/60 mb-1">Wastage Reduction</div>
                <div className="font-mono text-2xl font-bold text-emerald-400">
                  ₹{(wastageSaved / 100000).toFixed(1)} Lakh
                </div>
                <div className="text-[10px] text-white/40 mt-1">via BOM recipe control</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRD Capabilities & Differentiators Section */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#c084fc]">
            PRD Functional Requirements Matrix (121+ Items)
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mt-2">
            Engineered for High-Scale Salon Operations
          </h2>
        </div>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-[#e6c594] text-[#140d1a] font-bold shadow-md'
                  : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeatures.map((feat) => (
            <div
              key={feat.id}
              className={`p-6 rounded-2xl border transition hover:translate-y-[-2px] ${
                feat.isDifferentiator
                  ? 'bg-gradient-to-b from-[#241732] to-[#180e22] border-[#e6c594]/40 shadow-lg shadow-[#e6c594]/10'
                  : 'bg-white/5 border-purple-500/20 hover:border-purple-400/30'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono text-white/40">{feat.reqId}</span>
                <span
                  className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    feat.isDifferentiator
                      ? 'bg-[#e6c594]/20 text-[#e6c594]'
                      : 'bg-white/10 text-white/70'
                  }`}
                >
                  {feat.tag}
                </span>
              </div>
              <h3 className="font-serif text-xl font-bold text-white mb-2">{feat.title}</h3>
              <p className="text-xs text-white/60 leading-relaxed">{feat.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 bg-[#1a1224] border-t border-purple-500/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#e6c594]">
              Simple & Transparent Pricing
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mt-2">
              Flexible Plans for Single Salons & Multi-Branch Chains
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {pricingTiersData.map((tier, idx) => (
              <div
                key={idx}
                className={`p-8 rounded-3xl border flex flex-col justify-between transition ${
                  tier.isPopular
                    ? 'bg-[#251735] border-[#e6c594] shadow-2xl shadow-[#e6c594]/20 relative'
                    : 'bg-white/5 border-purple-500/20'
                }`}
              >
                {tier.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#e6c594] via-[#dfa0a0] to-[#e6c594] text-[#140d1a] text-[10px] font-extrabold uppercase tracking-widest">
                    Most Popular Choice
                  </div>
                )}

                <div>
                  <h3 className="font-serif text-2xl font-bold text-white mb-2">{tier.name}</h3>
                  <p className="text-xs text-white/60 mb-6">{tier.description}</p>
                  <div className="mb-6">
                    <span className="font-mono text-4xl font-bold text-white">{tier.price}</span>
                    <span className="text-xs text-white/50 ml-1">{tier.period}</span>
                  </div>

                  <div className="space-y-3 border-t border-white/10 pt-6 mb-8">
                    {tier.features.map((f, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-3 text-xs text-white/80">
                        <span className="text-[#e6c594]">✓</span>
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleOpenAuth('brand_owner')}
                  className={`w-full py-3.5 rounded-xl text-xs font-bold transition ${
                    tier.isPopular
                      ? 'bg-gradient-to-r from-[#e6c594] via-[#dfa0a0] to-[#e6c594] text-[#140d1a] hover:brightness-110 shadow-lg shadow-[#e6c594]/25'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {tier.ctaText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#e6c594]">
            Frequently Asked Questions
          </span>
          <h2 className="font-serif text-3xl font-bold text-white mt-2">
            Everything You Need to Know
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-white/5 border border-purple-500/20 overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between font-semibold text-sm text-white"
              >
                <span>{faq.q}</span>
                <span className="text-[#e6c594] text-lg font-mono">
                  {openFaq === idx ? '−' : '+'}
                </span>
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs text-white/70 leading-relaxed border-t border-white/5 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-purple-500/20 bg-[#0e0913] text-white/50 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#e6c594] flex items-center justify-center font-bold text-[#140d1a]">
              S&S
            </div>
            <div>
              <span className="font-serif text-sm font-bold text-white block">
                Salon & Spa Management Software
              </span>
              <span className="text-[10px]">India-First Multi-Tenant SaaS · Version 1.0</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <span>GST & DPDP Compliant</span>
            <span>·</span>
            <span>TRAI DLT Template Approved</span>
            <span>·</span>
            <span>99.9% Uptime SLA</span>
          </div>
        </div>
      </footer>

      {/* Role-Aware Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialRole={selectedRole}
      />
    </div>
  );
};
