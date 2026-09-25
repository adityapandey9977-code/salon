/**
 *   Salon SaaS — Role & Permissions Scoping Utilities
 * Strictly isolates Super Admin (Platform) roles from Tenant/Branch (Staff) roles.
 */

export interface RoleLike {
  id?: string;
  code?: string;
  name?: string;
  role?: string;
  scope?: string;
  isSystem?: boolean;
  permissions?: any[];
  [key: string]: any;
}

const KNOWN_EXCLUDED_ROLE_CODES = new Set([
  'SUPER',
  'SUPER_ADMIN',
  'SUPER_ADMINISTRATOR',
  'SUPERADMIN',
  'SUPPORT_OPERATOR',
  'BILLING_SPECIALIST',
  'SECURITY_AUDITOR',
  'PLATFORM_ADMIN',
  'PLATFORM_OPERATOR',
  'OPERATOR',
  'SALON_ADMIN',
  'CUSTOMER',
  'CLIENT',
]);

const KNOWN_EXCLUDED_NAME_KEYWORDS = [
  'SUPER ADMIN',
  'SUPER ADMINISTRATOR',
  'SUPERADMIN',
  'PLATFORM OPERATOR',
  'PLATFORM ADMIN',
  'BILLING SPECIALIST',
  'SECURITY AUDITOR',
  'SALON OWNER / ADMINISTRATOR',
  'CUSTOMER / CLIENT',
  'CUSTOMER',
  'CLIENT',
];

/**
 * Returns true if the role belongs to the Super Admin (Platform) tier or non-staff excluded role.
 */
export function isPlatformRole(role: RoleLike | string | null | undefined): boolean {
  if (!role) return false;

  if (typeof role === 'string') {
    const upper = role.toUpperCase().trim();
    if (KNOWN_EXCLUDED_ROLE_CODES.has(upper)) return true;
    if (
      upper.startsWith('PLATFORM_') ||
      upper.startsWith('PLATFORM') ||
      upper.startsWith('SUPER_') ||
      upper.startsWith('SUPER')
    ) {
      return true;
    }
    return KNOWN_EXCLUDED_NAME_KEYWORDS.some((kw) => upper === kw || upper.includes(kw));
  }

  const code = (role.code || '').toUpperCase().trim();
  const name = (role.name || role.role || '').toUpperCase().trim();
  const scope = (role.scope || '').toUpperCase().trim();

  // 1. Direct code matches
  if (
    code &&
    (KNOWN_EXCLUDED_ROLE_CODES.has(code) ||
      code.startsWith('PLATFORM_') ||
      code.startsWith('PLATFORM') ||
      code.startsWith('SUPER_') ||
      code === 'SUPER')
  ) {
    return true;
  }

  // 2. Scope matches
  if (scope === 'PLATFORM WIDE' || scope === 'PLATFORM' || scope === 'PLATFORM-WIDE') {
    return true;
  }

  // 3. Name keyword matches
  if (name && KNOWN_EXCLUDED_NAME_KEYWORDS.some((kw) => name === kw || name.includes(kw))) {
    return true;
  }

  // 4. Check if role has platform-level module permissions
  if (role.permissions && Array.isArray(role.permissions)) {
    const hasPlatformPerm = role.permissions.some((p: any) => {
      const module = (p?.permission?.module || p?.module || '').toUpperCase();
      const permCode = (p?.permission?.code || p?.code || '').toLowerCase();
      return module === 'PLATFORM' || permCode.startsWith('platform.');
    });
    if (hasPlatformPerm) return true;
  }

  return false;
}

/**
 * Returns true if the role belongs to Tenant / Salon Staff operations.
 */
export function isTenantRole(role: RoleLike | string | null | undefined): boolean {
  return !isPlatformRole(role);
}

/**
 * Filters out all Super Admin / Platform / Customer / Salon-Owner-Admin roles, returning strictly Salon Staff roles.
 */
export function filterSalonRoles<T extends RoleLike>(roles: T[]): T[] {
  if (!Array.isArray(roles)) return [];
  return roles.filter((r) => !isPlatformRole(r));
}

/**
 * Filters out all Tenant / Salon roles, returning strictly Platform Super Admin roles.
 */
export function filterPlatformRoles<T extends RoleLike>(roles: T[]): T[] {
  if (!Array.isArray(roles)) return [];
  return roles.filter((r) => isPlatformRole(r));
}
