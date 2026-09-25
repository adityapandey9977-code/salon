export type AuthRole = 'brand_owner' | 'branch_manager' | 'super_admin' | 'stylist' | 'client';

export type AuthMode = 'login' | 'register' | 'forgot_password' | 'otp_verify';

export interface PersonaInfo {
  id: string;
  title: string;
  roleTag: string;
  badge: string;
  description: string;
  highlights: string[];
  metrics: { label: string; value: string }[];
  accentColor: string;
}

export interface PRDFeature {
  id: string;
  reqId: string;
  title: string;
  category: 'Core' | 'POS' | 'CRM' | 'Safety' | 'Formula' | 'WhatsApp' | 'Inventory';
  description: string;
  tag: string;
  isDifferentiator?: boolean;
}

export interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  ctaText: string;
}
