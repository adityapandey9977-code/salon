import type { PRDFeature, PersonaInfo, PricingTier } from '../types/landingTypes';

export const personasData: PersonaInfo[] = [
  {
    id: 'brand_owner',
    title: 'Brand Owner & Head Office',
    roleTag: 'Multi-Location Command',
    badge: 'PRD Panel 2',
    description:
      'Centralized control over multi-branch performance, master service catalogues, pricing policies, GST configs, and staff commission rules.',
    highlights: [
      'Real-time multi-branch revenue & occupancy matrix',
      'Unified master catalogue & regional pricing control',
      'Franchise royalty settlement & audit trails',
      'Custom role-based permissions (RBAC) & compliance',
    ],
    metrics: [
      { label: 'Network Revenue', value: '₹48.2 Lakh' },
      { label: 'Active Branches', value: '14 Locations' },
      { label: 'Chain Occupancy', value: '94.8%' },
    ],
    accentColor: '#e6c594',
  },
  {
    id: 'branch_manager',
    title: 'Branch Manager & Front Desk',
    roleTag: 'Diary & Billing Hub',
    badge: 'PRD Panel 3',
    description:
      'Conflict-free appointment diary, walk-in queue management, split GST invoicing, resource locking, and end-of-day cashier closure.',
    highlights: [
      'Conflict-free chair & room availability locking',
      'Walk-in queue with estimated wait time tracking',
      'Split payment POS (UPI / Card / Cash / Wallet)',
      'Automated daily cashier reconciliation & tips',
    ],
    metrics: [
      { label: "Today's Appointments", value: '68 Bookings' },
      { label: 'Chair Utilisation', value: '98.2%' },
      { label: 'Avg Ticket Value', value: '₹2,450' },
    ],
    accentColor: '#c084fc',
  },
  {
    id: 'stylist',
    title: 'Stylist & Therapist Workspace',
    roleTag: 'Service & Formula Hub',
    badge: 'PRD Panel 4',
    description:
      'Personalized schedule, shade & formula history [P-02], consultation notes, allergy caution flags [P-01], and commission targets.',
    highlights: [
      'Formula intelligence for color/treatment continuity',
      'Client allergy, patch-test & contraindication warnings',
      'Before & After treatment photo upload & notes',
      'Real-time daily target & tip performance tracker',
    ],
    metrics: [
      { label: 'Services Completed', value: '12 Today' },
      { label: 'Client Satisfaction', value: '4.95 ★' },
      { label: 'Daily Commission', value: '₹3,840' },
    ],
    accentColor: '#f3a683',
  },
  {
    id: 'client',
    title: 'Client Self-Service Portal',
    roleTag: 'Booking & Membership',
    badge: 'PRD Panel 8',
    description:
      '24/7 web & WhatsApp booking, membership package wallet, loyalty points balance, and treatment feedback.',
    highlights: [
      'Instant online booking & WhatsApp link confirmations',
      'Package session balance & expiry tracking',
      'Household beauty profile for family bookings',
      'Loyalty points & referral rewards wallet',
    ],
    metrics: [
      { label: 'Repeat Client Rate', value: '84.6%' },
      { label: 'Active Members', value: '3,420 Clients' },
      { label: 'WhatsApp Bookings', value: '62%' },
    ],
    accentColor: '#e879f9',
  },
];

export const prdFeaturesData: PRDFeature[] = [
  {
    id: 'f1',
    reqId: 'SALO-PR-019',
    title: 'Conflict-Free Smart Diary',
    category: 'Core',
    description:
      'Real-time multi-resource scheduling matching stylist skills, room/chair availability, and service duration buffers.',
    tag: 'Must Have',
  },
  {
    id: 'f2',
    reqId: 'SALO-PR-043',
    title: 'GST-Compliant POS & Billing',
    category: 'POS',
    description:
      'Automated GST invoices, credit notes, split payments (UPI/Card/Cash), gift cards, package redemptions, and daily closure audit.',
    tag: 'GST Ready',
  },
  {
    id: 'f3',
    reqId: 'P-01',
    title: 'Client Safety & Allergy Flags',
    category: 'Safety',
    description:
      'Client-safe service eligibility rules checking allergy warnings, patch-test history, and medical contraindication notes.',
    tag: 'Differentiator [P]',
    isDifferentiator: true,
  },
  {
    id: 'f4',
    reqId: 'P-02',
    title: 'Formula Intelligence & Handover',
    category: 'Formula',
    description:
      'Preserve precise hair color, facial chemical formulas, and treatment notes for seamless handover when staff changes.',
    tag: 'Differentiator [P]',
    isDifferentiator: true,
  },
  {
    id: 'f5',
    reqId: 'P-06',
    title: 'Local-Language WhatsApp Assistant',
    category: 'WhatsApp',
    description:
      'Automated appointment reminders, instant booking links, DLT-approved templates, and aftercare instructions via WhatsApp.',
    tag: 'Differentiator [P]',
    isDifferentiator: true,
  },
  {
    id: 'f6',
    reqId: 'SALO-PR-078',
    title: 'Consumable Recipe & Inventory BOM',
    category: 'Inventory',
    description:
      'Track professional consumption against standard service recipes, stock expiry, batch tracking, and material variance alerts.',
    tag: 'Cost Control',
  },
];

export const pricingTiersData: PricingTier[] = [
  {
    name: 'Single Salon / Spa',
    price: '₹2,499',
    period: '/month per branch',
    description: 'Ideal for independent salons, beauty clinics, and single-location luxury spas.',
    features: [
      'Up to 8 Stylist / Therapist accounts',
      'Conflict-free appointment & walk-in diary',
      'GST POS, UPI / Card payments & cashier closure',
      'WhatsApp booking links & basic SMS reminders',
      'Basic inventory & stocktake management',
    ],
    ctaText: 'Start 14-Day Free Trial',
  },
  {
    name: 'Multi-Branch Chain',
    price: '₹4,999',
    period: '/month per branch',
    description:
      'For growing brands managing multiple branches, shared staff, and central pricing.',
    isPopular: true,
    features: [
      'Unlimited Stylist & Receptionist accounts',
      'Multi-branch central client profile & history',
      'Formula intelligence [P-02] & allergy safety flags [P-01]',
      'Local-language WhatsApp booking assistant [P-06]',
      'Service recipe inventory BOM & stock variance',
      'Custom commission rules & tiered incentives',
    ],
    ctaText: 'Get Started Now',
  },
  {
    name: 'Enterprise & Franchise',
    price: 'Custom',
    period: 'Tailored pricing',
    description: 'For nationwide salon chains, franchise networks, and international operations.',
    features: [
      'Franchise royalty settlement & compliance panel',
      'Resource-aware smart slot suggestions [P-03]',
      'Package liability & breakage forecasting [P-04]',
      'Dedicated account manager & 99.9% uptime SLA',
      'Custom ERP, accounting & WhatsApp API integrations',
    ],
    ctaText: 'Contact Enterprise Team',
  },
];
