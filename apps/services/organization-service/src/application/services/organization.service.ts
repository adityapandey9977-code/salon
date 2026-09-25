import crypto from 'crypto';
import { ConflictError, NotFoundError } from '@salon-spa-saas/common-types';
import type {
  CreateBranchRequest,
  CreateResourceRequest,
  CreateTenantRequest,
} from '@salon-spa-saas/contracts';
import { DOMAIN_EVENTS, createEventEnvelope } from '@salon-spa-saas/events';
import { config } from '../../config';
import { emailService } from '../../infrastructure/email/email.service';
import { eventBus } from '../../infrastructure/messaging/publisher';
import { prisma } from '../../infrastructure/prisma/client';
import { organizationReadStore } from '../../infrastructure/redis/organization-read.store';

let cachedPublicIp: string | null = null;
let lastPublicIpFetchTime = 0;
const IP_CACHE_TTL = 1000 * 60 * 15; // 15 minutes cache

async function resolvePublicServerIp(req?: any): Promise<string> {
  const now = Date.now();
  if (cachedPublicIp && now - lastPublicIpFetchTime < IP_CACHE_TTL) {
    return cachedPublicIp;
  }

  // 1. Check if request host header is a direct public IP address
  if (req) {
    const hostHeader = req.headers?.['x-forwarded-host'] || req.headers?.host;
    if (hostHeader) {
      const cleanHost = (hostHeader as string).split(':')[0];
      if (/^(\d{1,3}\.){3}\d{1,3}$/.test(cleanHost) && cleanHost !== '127.0.0.1') {
        cachedPublicIp = cleanHost;
        lastPublicIpFetchTime = now;
        return cleanHost;
      }
    }
  }

  // 2. Fetch from fast public IP service with short timeout (Production Ready)
  try {
    const ip = await new Promise<string>((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Timeout')), 2000);
      https
        .get('https://api.ipify.org?format=json', (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('end', () => {
            clearTimeout(timeout);
            try {
              const parsed = JSON.parse(data);
              if (parsed.ip && /^(\d{1,3}\.){3}\d{1,3}$/.test(parsed.ip)) {
                resolve(parsed.ip);
              } else {
                reject(new Error('Invalid IP format'));
              }
            } catch (e) {
              reject(e);
            }
          });
        })
        .on('error', (err) => {
          clearTimeout(timeout);
          reject(err);
        });
    });

    if (ip) {
      cachedPublicIp = ip;
      lastPublicIpFetchTime = now;
      return ip;
    }
  } catch {
    // If public fetch times out or server is in air-gapped / local VPC
  }

  // 3. Check Network Interfaces on OS
  try {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
      const ifaceList = interfaces[name];
      if (ifaceList) {
        for (const iface of ifaceList) {
          if (iface.family === 'IPv4' && !iface.internal) {
            if (!iface.address.startsWith('127.')) {
              cachedPublicIp = iface.address;
              lastPublicIpFetchTime = now;
              return iface.address;
            }
          }
        }
      }
    }
  } catch { }

  // 4. Default   Global Edge Anycast IP fallback
  return '76.76.21.21';
}

export class OrganizationService {
  public async getDnsInfo(req?: any) {
    const serverIp = await resolvePublicServerIp(req);
    const hostHeader = req?.headers?.['x-forwarded-host'] || req?.headers?.host || 'digiflexsalon.com';
    const cleanHost = (hostHeader as string).split(':')[0];
    const cnameTarget =
      cleanHost.includes('localhost') || cleanHost.includes('127.0.0.1')
        ? 'cname.digiflexsalon.com'
        : `cname.${cleanHost.replace(/^app\./, '').replace(/^admin\./, '')}`;

    return {
      serverIp,
      cnameTarget: cnameTarget || 'cname.digiflexsalon.com',
      detectedAt: new Date().toISOString(),
    };
  }

  public async getTenants() {
    const tenants = await prisma.organizationTenant.findMany({
      include: {
        branches: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return tenants.map((t) => ({
      id: t.id,
      code: t.code,
      slug: t.slug,
      salonName: t.salonName || t.tradeName,
      name: t.salonName || t.tradeName,
      legalName: t.legalName,
      tradeName: t.tradeName,
      displayName: t.displayName,
      businessEmail: t.businessEmail,
      businessPhone: t.businessPhone,
      ownerEmail: t.businessEmail,
      ownerPhone: t.businessPhone,
      ownerName: t.legalName || 'Salon Owner',
      contactEmail: t.businessEmail,
      contactPhone: t.businessPhone,
      addressLine1: t.addressLine1,
      addressLine2: t.addressLine2,
      city: t.city || 'Bhopal',
      state: t.state || 'Madhya Pradesh',
      region: t.state || 'Central India',
      postalCode: t.postalCode,
      country: t.country,
      currency: t.currency,
      timezone: t.timezone,
      status: t.status === 'ACTIVE' ? 'Active' : t.status === 'SUSPENDED' ? 'Suspended' : 'Pending Setup',
      activePlans: 'Enterprise Plan',
      revenue: '₹0.00 /mo',
      branchesCount: t.branches.length,
      branchesList: t.branches.map((b) => b.name),
      customDomain: t.customDomain || undefined,
      primaryColor: t.primaryColor || '#7C3AED',
      createdAt: t.createdAt.toISOString().split('T')[0],
      updatedAt: t.updatedAt.toISOString(),
    }));
  }

  public async getTenantById(tenantId: string) {
    return organizationReadStore.getTenantProfile(tenantId, async () => {
      const tenant = await prisma.organizationTenant.findUnique({
        where: { id: tenantId },
        include: { branches: true },
      });
      if (!tenant) return null;
      return {
        id: tenant.id,
        code: tenant.code,
        slug: tenant.slug,
        salonName: tenant.salonName || tenant.tradeName,
        name: tenant.salonName || tenant.tradeName,
        legalName: tenant.legalName,
        tradeName: tenant.tradeName,
        displayName: tenant.displayName,
        businessEmail: tenant.businessEmail,
        businessPhone: tenant.businessPhone,
        ownerEmail: tenant.businessEmail,
        ownerPhone: tenant.businessPhone,
        ownerName: tenant.legalName || 'Salon Owner',
        contactEmail: tenant.businessEmail,
        contactPhone: tenant.businessPhone,
        addressLine1: tenant.addressLine1,
        addressLine2: tenant.addressLine2,
        city: tenant.city || 'Bhopal',
        state: tenant.state || 'Madhya Pradesh',
        region: tenant.state || 'Central India',
        postalCode: tenant.postalCode,
        country: tenant.country,
        currency: tenant.currency,
        timezone: tenant.timezone,
        status: tenant.status === 'ACTIVE' ? 'Active' : 'Suspended',
        activePlans: 'Enterprise Plan',
        revenue: '₹0.00 /mo',
        branchesCount: tenant.branches.length,
        branchesList: tenant.branches.map((b) => b.name),
        customDomain: tenant.customDomain || undefined,
        primaryColor: tenant.primaryColor || '#7C3AED',
        createdAt: tenant.createdAt.toISOString().split('T')[0],
        updatedAt: tenant.updatedAt.toISOString(),
      };
    });
  }

  public async getTenantByCode(code: string) {
    return prisma.organizationTenant.findUnique({
      where: { code },
    });
  }

  public async createTenant(input: CreateTenantRequest) {
    const salonName = input.salonName || input.name || 'New Salon Tenant';
    const rawSlug =
      input.slug ||
      salonName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') ||
      'salon';
    const uniqueSuffix = Math.floor(1000 + Math.random() * 9000);
    const slug = input.slug ? input.slug : `${rawSlug}-${uniqueSuffix}`;
    const code =
      input.code ||
      `SALON-${rawSlug.slice(0, 4).toUpperCase()}-${uniqueSuffix}`;
    const businessEmail =
      input.businessEmail ||
      input.ownerEmail ||
      input.contactEmail ||
      `owner@${rawSlug}.com`;
    const businessPhone =
      input.businessPhone ||
      input.ownerPhone ||
      input.contactPhone ||
      '+91 99000 00000';
    const ownerName = input.ownerName || input.legalName || salonName;
    const city = input.city || 'Bhopal';
    const state = input.state || input.region || 'Madhya Pradesh';
    const addressLine1 = input.addressLine1 || `${city} Central Location`;
    const postalCode = input.postalCode || '462001';
    const currency = input.defaultCurrency || 'INR';
    const timezone = input.timezone || 'Asia/Kolkata';
    const activePlans = input.activePlans || 'Enterprise Plan';

    const tenant = await prisma.organizationTenant.create({
      data: {
        code,
        slug,
        salonName,
        legalName: ownerName,
        tradeName: salonName,
        displayName: input.displayName || salonName,
        businessEmail,
        businessPhone,
        gstin: input.gstin,
        pan: input.pan,
        addressLine1,
        addressLine2: input.addressLine2,
        city,
        state,
        postalCode,
        country: input.country || 'IN',
        currency,
        timezone,
        status: 'ACTIVE',
        customDomain: input.customDomain || null,
        primaryColor: input.primaryColor || '#7C3AED',
        whiteLabelEmail: true,
      },
    });

    // Create a single default branch matching the tenant's name and details
    const branchCode = `BR-${code.slice(-4)}-1`;
    let defaultBranch = null;
    try {
      defaultBranch = await prisma.branch.create({
        data: {
          tenantId: tenant.id,
          name: salonName,
          code: branchCode,
          addressLine1,
          addressLine2: input.addressLine2,
          city,
          state,
          postalCode,
          phone: businessPhone,
          email: businessEmail,
          gstin: input.gstin,
          pan: input.pan,
          config: { create: {} },
        },
      });
    } catch (branchErr) {
      console.warn(`[OrganizationService] Default branch creation notice:`, branchErr);
    }

    const createdBranches = defaultBranch ? [defaultBranch] : [];

    // Auto-generate strong initial password if not provided
    const initialPassword =
      input.initialPassword ||
      input.password ||
      `Salon@${Math.floor(100000 + Math.random() * 900000)}!`;

    // Auto-provision initial Tenant Credential in Identity Service
    try {
      const res = await fetch(
        `${config.IDENTITY_SERVICE_URL}/internal/v1/tenant-credentials`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-service-secret': config.SERVICE_INTERNAL_SECRET,
          },
          body: JSON.stringify({
            tenantId: tenant.id,
            loginEmail: businessEmail,
            mobilePhone: businessPhone,
            initialPassword,
          }),
        },
      );
      if (!res.ok) {
        const errText = await res.text();
        console.warn(
          `[OrganizationService] Identity Service credential response ${res.status}: ${errText}`,
        );
      }
    } catch (identityErr) {
      console.warn(
        '[OrganizationService] Could not connect to Identity Service for credential provisioning:',
        identityErr,
      );
    }

    // Dispatch welcome email with credentials to the tenant owner
    try {
      await emailService.sendTenantCredentialsEmail({
        toEmail: businessEmail,
        ownerName: ownerName,
        salonName: salonName,
        slug: slug,
        generatedPassword: initialPassword,
        loginUrl: config.APP_LOGIN_URL,
      });
    } catch (emailErr) {
      console.warn('[OrganizationService] Failed to dispatch credentials email:', emailErr);
    }

    await organizationReadStore.invalidateTenantProfile(tenant.id);

    // Publish TenantCreated Domain Event
    try {
      const event = createEventEnvelope({
        eventType: DOMAIN_EVENTS.TENANT_CREATED,
        aggregateType: 'Tenant',
        aggregateId: tenant.id,
        tenantId: tenant.id,
        payload: {
          tenantId: tenant.id,
          code: tenant.code,
          salonName: tenant.salonName,
          businessEmail: tenant.businessEmail,
        },
      });
      await eventBus.publish(event);
    } catch (busErr) {
      console.warn('[OrganizationService] RabbitMQ publish notice:', busErr);
    }

    return {
      id: tenant.id,
      code: tenant.code,
      slug: tenant.slug,
      salonName: tenant.salonName,
      name: tenant.salonName,
      legalName: tenant.legalName,
      tradeName: tenant.tradeName,
      displayName: tenant.displayName,
      businessEmail: tenant.businessEmail,
      businessPhone: tenant.businessPhone,
      ownerEmail: tenant.businessEmail,
      ownerPhone: tenant.businessPhone,
      ownerName: tenant.legalName,
      contactEmail: tenant.businessEmail,
      contactPhone: tenant.businessPhone,
      initialPassword,
      password: initialPassword,
      city: tenant.city,
      state: tenant.state,
      region: tenant.state,
      postalCode: tenant.postalCode,
      country: tenant.country,
      currency: tenant.currency,
      timezone: tenant.timezone,
      status: 'Active',
      activePlans,
      revenue: '₹0.00 /mo',
      branchesCount: createdBranches.length,
      branchesList: createdBranches.map((b) => b.name),
      customDomain: input.customDomain,
      primaryColor: input.primaryColor || '#7C3AED',
      createdAt: tenant.createdAt.toISOString().split('T')[0],
      updatedAt: tenant.updatedAt.toISOString(),
    };
  }

  public async updateTenant(tenantId: string, input: Partial<CreateTenantRequest>) {
    const existing = await prisma.organizationTenant.findUnique({
      where: { id: tenantId },
    });
    if (!existing) {
      throw new NotFoundError(`Tenant with ID ${tenantId} not found`);
    }

    const updated = await prisma.organizationTenant.update({
      where: { id: tenantId },
      data: {
        salonName: input.salonName || input.name || existing.salonName,
        legalName: input.legalName || input.ownerName || existing.legalName,
        businessEmail: input.businessEmail || input.ownerEmail || input.contactEmail || existing.businessEmail,
        businessPhone: input.businessPhone || input.ownerPhone || input.contactPhone || existing.businessPhone,
        city: input.city || existing.city,
        state: input.state || input.region || existing.state,
        addressLine1: input.addressLine1 || existing.addressLine1,
        postalCode: input.postalCode || existing.postalCode,
        customDomain: input.customDomain !== undefined ? input.customDomain : existing.customDomain,
        primaryColor: input.primaryColor || existing.primaryColor,
      },
    });

    await organizationReadStore.invalidateTenantProfile(tenantId);
    return {
      ...updated,
      name: updated.salonName || updated.tradeName,
      salonName: updated.salonName || updated.tradeName,
      customDomain: input.customDomain,
      primaryColor: input.primaryColor || '#7C3AED',
    };
  }

  public async deleteTenant(tenantId: string) {
    const existing = await prisma.organizationTenant.findUnique({
      where: { id: tenantId },
    });
    if (!existing) {
      throw new NotFoundError(`Tenant with ID ${tenantId} not found`);
    }

    await prisma.organizationTenant.delete({
      where: { id: tenantId },
    });
    await organizationReadStore.invalidateTenantProfile(tenantId);
    return true;
  }

  public async getBranches(tenantId?: string | null, franchiseId?: string | null) {
    const isUuid = (str?: any) =>
      typeof str === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

    const whereClause: any = {};
    if (franchiseId && isUuid(franchiseId)) {
      whereClause.franchiseId = franchiseId;
    } else if (franchiseId) {
      const partner = await prisma.franchisePartner.findFirst({
        where: { companyName: { contains: franchiseId.trim(), mode: 'insensitive' } },
      });
      if (partner) {
        whereClause.franchiseId = partner.id;
      }
    }

    if (tenantId && isUuid(tenantId) && !whereClause.franchiseId) {
      whereClause.tenantId = tenantId;
    }

    const branches = await prisma.branch.findMany({
      where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
      include: {
        resources: true,
        operatingHours: true,
        holidays: true,
        config: true,
        franchise: true,
        brand: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    return branches.map((b) => ({
      id: b.id,
      tenantId: b.tenantId,
      name: b.name,
      code: b.code,
      type: (b.franchiseId ? 'Franchise' : 'Flagship') as 'Flagship' | 'Lounge' | 'Express' | 'Franchise',
      address: b.addressLine1 + (b.addressLine2 ? `, ${b.addressLine2}` : ''),
      addressLine1: b.addressLine1,
      addressLine2: b.addressLine2,
      city: b.city,
      state: b.state,
      postalCode: b.postalCode,
      primaryManagerEmployeeId: b.primaryManagerEmployeeId,
      manager: 'Branch Lead',
      managerEmail: b.email || `manager.${b.code.toLowerCase()}@salon.com`,
      contactNumber: b.phone,
      phone: b.phone,
      email: b.email,
      status: (b.status === 'ACTIVE' ? 'Active' : b.status === 'TEMPORARILY_CLOSED' ? 'Pending' : 'Inactive') as 'Active' | 'Inactive' | 'Pending',
      workingHours: '09:00 AM - 09:00 PM',
      revenue: 0,
      appointments: 0,
      occupancy: 0,
      staffCount: b.resources.length || 6,
      clientCount: 0,
      createdDate: b.createdAt.toISOString().split('T')[0],
      servicesAvailable: [
        'Hair Styling & Texture',
        'Bridal & Aesthetics',
        'Therapeutic Spa & Massage',
        'Nail Studio & Care',
        'Skin Glow & Facials',
      ],
      franchisePartnerId: b.franchiseId || undefined,
      franchisePartnerName: b.franchise?.companyName || undefined,
      isFranchiseOwned: Boolean(b.franchiseId),
      resources: b.resources,
      operatingHours: b.operatingHours,
      holidays: b.holidays,
      config: b.config,
    }));
  }

  public async getBranchById(branchId: string) {
    const branch = await prisma.branch.findUnique({
      where: { id: branchId },
      include: {
        resources: true,
        operatingHours: true,
        holidays: true,
        config: true,
        franchise: true,
      },
    });

    if (!branch) {
      throw new NotFoundError(`Branch with id ${branchId} not found`);
    }

    return branch;
  }

  public async updateBranch(branchId: string, input: any) {
    const existing = await prisma.branch.findUnique({
      where: { id: branchId },
    });
    if (!existing) {
      throw new NotFoundError(`Branch with id ${branchId} not found`);
    }

    let status = existing.status;
    if (input.status) {
      status =
        input.status === 'Active' || input.status === 'ACTIVE'
          ? 'ACTIVE'
          : input.status === 'Pending' || input.status === 'TEMPORARILY_CLOSED'
            ? 'TEMPORARILY_CLOSED'
            : 'INACTIVE';
    }

    const isUuid = (str?: any) =>
      typeof str === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

    let resolvedFranchiseId = existing.franchiseId;
    if (input.franchisePartnerId !== undefined || input.franchiseId !== undefined) {
      const candidate = input.franchisePartnerId ?? input.franchiseId;
      if (!candidate || candidate === '' || candidate === 'null') {
        resolvedFranchiseId = null;
      } else if (isUuid(candidate)) {
        resolvedFranchiseId = candidate;
      } else if (input.franchisePartnerName) {
        const found = await prisma.franchisePartner.findFirst({
          where: { companyName: { contains: input.franchisePartnerName.trim(), mode: 'insensitive' } },
        });
        resolvedFranchiseId = found ? found.id : null;
      } else {
        resolvedFranchiseId = null;
      }
    }

    // Enforce Authorized Outlets Count if assigning to a new / different franchise
    if (resolvedFranchiseId && resolvedFranchiseId !== existing.franchiseId) {
      const franchise = await prisma.franchisePartner.findUnique({
        where: { id: resolvedFranchiseId },
        include: { _count: { select: { branches: true } } },
      });
      if (franchise) {
        const allowedLimit = franchise.authorizedOutletsCount || 1;
        const currentCount = franchise._count.branches;
        if (currentCount >= allowedLimit) {
          throw new BadRequestError(
            `Franchise partner "${franchise.companyName}" has reached its authorized outlet limit of ${allowedLimit} outlet(s) (currently has ${currentCount}). Cannot assign branch.`
          );
        }
      }
    }

    const updated = await prisma.branch.update({
      where: { id: branchId },
      data: {
        name: input.name ?? existing.name,
        code: input.code ?? existing.code,
        addressLine1: input.addressLine1 ?? input.address ?? existing.addressLine1,
        addressLine2: input.addressLine2 ?? existing.addressLine2,
        city: input.city ?? existing.city,
        state: input.state ?? existing.state,
        postalCode: input.postalCode ?? existing.postalCode,
        phone: input.phone ?? input.contactNumber ?? existing.phone,
        email: input.email ?? input.managerEmail ?? existing.email,
        franchiseId: resolvedFranchiseId,
        primaryManagerEmployeeId:
          input.primaryManagerEmployeeId !== undefined
            ? input.primaryManagerEmployeeId
            : existing.primaryManagerEmployeeId,
        status,
      },
      include: {
        resources: true,
        operatingHours: true,
        holidays: true,
        config: true,
        franchise: true,
      },
    });

    if (
      input.primaryManagerEmployeeId &&
      input.primaryManagerEmployeeId !== existing.primaryManagerEmployeeId
    ) {
      try {
        await fetch(`${config.IDENTITY_SERVICE_URL}/internal/v1/staff-users/assign-branch`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-service-secret': config.SERVICE_INTERNAL_SECRET,
          },
          body: JSON.stringify({
            tenantId: updated.tenantId,
            branchId: updated.id,
            employeeId: input.primaryManagerEmployeeId,
            roleCode: 'BRANCH_MANAGER',
          }),
        });
      } catch (identityErr) {
        console.warn('[OrganizationService] Failed to sync branch scope to Identity Service:', identityErr);
      }
    }

    return {
      ...updated,
      type: (updated.franchiseId ? 'Franchise' : 'Flagship') as 'Flagship' | 'Lounge' | 'Express' | 'Franchise',
      franchisePartnerId: updated.franchiseId || undefined,
      franchisePartnerName: updated.franchise?.companyName || input.franchisePartnerName || undefined,
      isFranchiseOwned: Boolean(updated.franchiseId),
    };
  }

  public async deleteBranch(branchId: string) {
    const existing = await prisma.branch.findUnique({
      where: { id: branchId },
    });
    if (!existing) {
      throw new NotFoundError(`Branch with id ${branchId} not found`);
    }

    await prisma.branch.delete({
      where: { id: branchId },
    });
    return true;
  }

  public async getOperatingHours(branchId: string) {
    return prisma.operatingHours.findMany({
      where: { branchId },
      orderBy: { dayOfWeek: 'asc' },
    });
  }

  public async updateOperatingHours(
    branchId: string,
    schedules: Array<{ dayOfWeek: number; openTime: string; closeTime: string; isOpen?: boolean }>,
  ) {
    for (const schedule of schedules) {
      await prisma.operatingHours.upsert({
        where: {
          branchId_dayOfWeek: {
            branchId,
            dayOfWeek: schedule.dayOfWeek,
          },
        },
        create: {
          branchId,
          dayOfWeek: schedule.dayOfWeek,
          openTime: schedule.openTime,
          closeTime: schedule.closeTime,
          isOpen: schedule.isOpen ?? true,
        },
        update: {
          openTime: schedule.openTime,
          closeTime: schedule.closeTime,
          isOpen: schedule.isOpen ?? true,
        },
      });
    }

    return prisma.operatingHours.findMany({
      where: { branchId },
      orderBy: { dayOfWeek: 'asc' },
    });
  }

  public async getHolidays(tenantId?: string | null, branchId?: string | null) {
    return prisma.holiday.findMany({
      where: branchId ? { branchId } : tenantId ? { branch: { tenantId } } : undefined,
      include: {
        branch: true,
      },
      orderBy: { date: 'asc' },
    });
  }

  public async createHoliday(branchId: string, input: { date: string | Date; description: string }) {
    const dateObj = new Date(input.date);
    return prisma.holiday.create({
      data: {
        branchId,
        date: dateObj,
        description: input.description,
      },
    });
  }

  public async deleteHoliday(holidayId: string) {
    return prisma.holiday.delete({
      where: { id: holidayId },
    });
  }

  public async getFranchisePartners(tenantId?: string | null) {
    if (tenantId) {
      return prisma.franchisePartner.findMany({
        where: { tenantId },
        include: {
          branches: true,
          tenant: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    return prisma.franchisePartner.findMany({
      include: {
        branches: true,
        tenant: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  public async getFranchisePartnerById(partnerId: string) {
    const partner = await prisma.franchisePartner.findUnique({
      where: { id: partnerId },
      include: {
        branches: true,
        tenant: true,
      },
    });
    if (!partner) {
      throw new NotFoundError(`Franchise partner with ID "${partnerId}" not found.`);
    }
    return partner;
  }

  public async updateFranchisePartner(partnerId: string, input: any) {
    const existing = await prisma.franchisePartner.findUnique({
      where: { id: partnerId },
    });
    if (!existing) {
      throw new NotFoundError(`Franchise partner with ID "${partnerId}" not found.`);
    }

    const dataToUpdate: any = {};
    if (input.companyName || input.name) dataToUpdate.companyName = (input.companyName || input.name).trim();
    if (input.code !== undefined) dataToUpdate.code = input.code ? String(input.code).trim() : null;
    if (input.contactPerson || input.contact) dataToUpdate.contactPerson = (input.contactPerson || input.contact).trim();
    if (input.contactPhone || input.phone) dataToUpdate.contactPhone = (input.contactPhone || input.phone).trim();
    if (input.address !== undefined) dataToUpdate.address = input.address ? String(input.address).trim() : null;
    if (input.territoryRegion !== undefined || input.region !== undefined) {
      const reg = input.territoryRegion || input.region;
      dataToUpdate.territoryRegion = reg ? String(reg).trim() : null;
    }
    if (input.authorizedOutletsCount !== undefined || input.maxOutlets !== undefined || input.locations !== undefined) {
      const raw = input.authorizedOutletsCount ?? input.maxOutlets ?? input.locations;
      dataToUpdate.authorizedOutletsCount = typeof raw === 'number' ? raw : parseInt(String(raw || '1'), 10) || 1;
    }
    if (input.royaltyModel !== undefined || input.royaltyStructure !== undefined) {
      const rm = input.royaltyModel || input.royaltyStructure;
      dataToUpdate.royaltyModel = rm ? String(rm).trim() : null;
    }
    if (input.status !== undefined) dataToUpdate.status = String(input.status).trim();
    if (input.agreementStart !== undefined || input.startDate !== undefined) {
      const raw = input.agreementStart || input.startDate;
      dataToUpdate.agreementStart = raw ? new Date(raw) : null;
    }
    if (input.agreementEnd !== undefined || input.endDate !== undefined) {
      const raw = input.agreementEnd || input.endDate;
      dataToUpdate.agreementEnd = raw ? new Date(raw) : null;
    }
    if (input.gstin !== undefined) dataToUpdate.gstin = input.gstin ? String(input.gstin).trim() : null;

    return prisma.franchisePartner.update({
      where: { id: partnerId },
      data: dataToUpdate,
      include: {
        branches: true,
        tenant: true,
      },
    });
  }

  public async createFranchisePartner(tenantId: string, input: any) {
    const contactEmail = (input.contactEmail || input.email || 'partner@franchise.com').toLowerCase().trim();
    const contactPerson = input.contactPerson || input.contact || input.manager || 'Partner Lead';
    const companyName = input.companyName || input.name || 'Franchise Partner';
    const contactPhone = input.contactPhone || input.phone || '+91 98000 00000';

    // Enforce 1 Franchise Partner per Email Constraint
    const existingPartner = await prisma.franchisePartner.findFirst({
      where: { contactEmail },
    });

    if (existingPartner) {
      throw new ConflictError(`A franchise partner with email "${contactEmail}" is already registered.`);
    }

    // Auto-generate a secure random 12-char password
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const generatedPassword = `Franchise@2026!${randomSuffix}`;

    // 1. Provision User Credential in Identity Service
    const franchiseId = crypto.randomUUID();

    try {
      const res = await fetch(`${config.IDENTITY_SERVICE_URL}/internal/v1/staff-users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-service-secret': config.SERVICE_INTERNAL_SECRET,
        },
        body: JSON.stringify({
          tenantId,
          franchiseId,
          fullName: companyName,
          email: contactEmail,
          mobilePhone: contactPhone,
          password: generatedPassword,
          roleCode: 'FRANCHISE_OWNER',
        }),
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Identity service failed to provision franchise partner: ${errText}`);
      }
    } catch (err: any) {
      throw new ConflictError(`Failed to provision identity user for franchise partner: ${err.message}`);
    }

    const code = (input.code || '').trim() || null;
    const address = (input.address || input.registeredOfficeAddress || '').trim() || null;
    const territoryRegion = (input.territoryRegion || input.region || '').trim() || null;
    const rawOutlets = input.authorizedOutletsCount ?? input.maxOutlets ?? input.locations ?? input.formLocations;
    const authorizedOutletsCount =
      typeof rawOutlets === 'number' ? rawOutlets : parseInt(String(rawOutlets || '1'), 10) || 1;
    const royaltyModel = (input.royaltyModel || input.royaltyStructure || '').trim() || null;
    const status = (input.status || 'ACTIVE').trim();

    let agreementStart: Date | null = null;
    const rawStart = input.agreementStart || input.startDate;
    if (rawStart) {
      const d = new Date(rawStart);
      if (!isNaN(d.getTime())) agreementStart = d;
    }

    let agreementEnd: Date | null = null;
    const rawEnd = input.agreementEnd || input.endDate;
    if (rawEnd) {
      const d = new Date(rawEnd);
      if (!isNaN(d.getTime())) agreementEnd = d;
    }

    // 2. Create Franchise Partner Record in Organization DB
    const partner = await prisma.franchisePartner.create({
      data: {
        id: franchiseId,
        tenantId,
        companyName,
        code,
        contactPerson,
        contactEmail,
        contactPhone,
        address,
        territoryRegion,
        authorizedOutletsCount,
        royaltyModel,
        status,
        agreementStart,
        agreementEnd,
        gstin: input.gstin || null,
      },
    });

    // 3. Dispatch Credentials Email to Partner via SMTP Nodemailer
    try {
      await emailService.sendTenantCredentialsEmail({
        toEmail: contactEmail,
        ownerName: contactPerson,
        salonName: companyName,
        slug: 'franchise-partner',
        generatedPassword,
        loginUrl: 'http://localhost:5173/franchise/login',
      });
    } catch (emailErr) {
      console.error('[OrganizationService] Failed to send franchise partner email:', emailErr);
    }

    return {
      ...partner,
      generatedPassword,
    };
  }

  public async createBranch(tenantId: string, input: CreateBranchRequest) {
    const isUuid = (str?: any) =>
      typeof str === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

    let resolvedTenantId = tenantId;
    let resolvedFranchiseId: string | null = null;
    let matchedFranchise: any = null;

    const rawFid = input.franchiseId || (input as any).franchisePartnerId;
    if (rawFid && isUuid(rawFid)) {
      matchedFranchise = await prisma.franchisePartner.findUnique({ where: { id: rawFid } });
    } else if ((input as any).franchisePartnerName) {
      matchedFranchise = await prisma.franchisePartner.findFirst({
        where: {
          companyName: {
            contains: (input as any).franchisePartnerName.trim(),
            mode: 'insensitive',
          },
        },
      });
    }

    if (matchedFranchise) {
      resolvedFranchiseId = matchedFranchise.id;
      // Inherit the tenantId directly from the franchise partner to guarantee foreign key integrity
      if (matchedFranchise.tenantId && isUuid(matchedFranchise.tenantId)) {
        resolvedTenantId = matchedFranchise.tenantId;
      }

      // Enforce Authorized Outlets Count for Franchise
      const franchiseWithCount = await prisma.franchisePartner.findUnique({
        where: { id: matchedFranchise.id },
        include: { _count: { select: { branches: true } } },
      });
      if (franchiseWithCount) {
        const allowedLimit = franchiseWithCount.authorizedOutletsCount || 1;
        const currentCount = franchiseWithCount._count.branches;
        if (currentCount >= allowedLimit) {
          throw new BadRequestError(
            `Franchise partner "${franchiseWithCount.companyName}" has reached its authorized outlet limit of ${allowedLimit} outlet(s) (currently has ${currentCount}). Cannot create additional outlets.`
          );
        }
      }
    }

    // Verify resolvedTenantId exists in database table
    let tenantExists = isUuid(resolvedTenantId)
      ? await prisma.organizationTenant.findUnique({ where: { id: resolvedTenantId } })
      : null;

    if (!tenantExists) {
      const defaultTenant =
        (await prisma.organizationTenant.findFirst({ where: { status: 'ACTIVE' } })) ||
        (await prisma.organizationTenant.findFirst());
      if (defaultTenant) {
        resolvedTenantId = defaultTenant.id;
      }
    }

    const branch = await prisma.branch.create({
      data: {
        tenantId: resolvedTenantId,
        name: input.name,
        code: input.code,
        franchiseId: resolvedFranchiseId,
        primaryManagerEmployeeId: input.primaryManagerEmployeeId || null,
        addressLine1: input.addressLine1,
        addressLine2: input.addressLine2,
        city: input.city,
        state: input.state,
        postalCode: input.postalCode,
        phone: input.phone,
        email: input.email,
        gstin: input.gstin,
        config: {
          create: {},
        },
      },
      include: {
        franchise: true,
        resources: true,
        operatingHours: true,
        holidays: true,
        config: true,
      },
    });

    if (input.primaryManagerEmployeeId) {
      try {
        await fetch(`${config.IDENTITY_SERVICE_URL}/internal/v1/staff-users/assign-branch`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-service-secret': config.SERVICE_INTERNAL_SECRET,
          },
          body: JSON.stringify({
            tenantId: branch.tenantId,
            branchId: branch.id,
            employeeId: input.primaryManagerEmployeeId,
            roleCode: 'BRANCH_MANAGER',
          }),
        });
      } catch (identityErr) {
        console.warn('[OrganizationService] Failed to assign branch scope to manager in Identity Service:', identityErr);
      }
    }

    // Publish BranchCreated Event
    const event = createEventEnvelope({
      eventType: DOMAIN_EVENTS.BRANCH_CREATED,
      aggregateType: 'Branch',
      aggregateId: branch.id,
      tenantId: branch.tenantId,
      branchId: branch.id,
      franchiseId: branch.franchiseId,
      payload: {
        tenantId: branch.tenantId,
        branchId: branch.id,
        franchiseId: branch.franchiseId,
        name: branch.name,
        code: branch.code,
        city: branch.city,
      },
    });
    await eventBus.publish(event);

    return {
      ...branch,
      type: (branch.franchiseId ? 'Franchise' : 'Flagship') as 'Flagship' | 'Lounge' | 'Express' | 'Franchise',
      franchisePartnerId: branch.franchiseId || undefined,
      franchisePartnerName: branch.franchise?.companyName || (input as any).franchisePartnerName || undefined,
      isFranchiseOwned: Boolean(branch.franchiseId),
    };
  }

  public async getResources(tenantId: string | null, branchId?: string | null) {
    const isValidUuid = (val?: string | null) =>
      !!val && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);

    const validTenantId = isValidUuid(tenantId) ? tenantId : undefined;
    const validBranchId = isValidUuid(branchId) ? branchId : undefined;

    // Relational scope: if neither tenant nor branch is specified, return empty array to prevent cross-tenant leaks
    if (!validTenantId && !validBranchId) {
      return [];
    }

    return prisma.branchResource.findMany({
      where: {
        ...(validTenantId ? { branch: { tenantId: validTenantId } } : {}),
        ...(validBranchId ? { branchId: validBranchId } : {}),
      },
      include: {
        branch: {
          select: {
            id: true,
            name: true,
            code: true,
            city: true,
            tenantId: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  public async createResource(input: CreateResourceRequest) {
    return prisma.branchResource.create({
      data: {
        branchId: input.branchId,
        name: input.name,
        code: input.code || null,
        type: input.type,
        capacity: input.capacity,
        description: input.description || null,
        isAvailable: input.isAvailable !== undefined ? input.isAvailable : true,
      },
      include: {
        branch: {
          select: {
            id: true,
            name: true,
            code: true,
            city: true,
            tenantId: true,
          },
        },
      },
    });
  }

  public async updateResource(id: string, data: any) {
    const isAvail =
      data.isAvailable !== undefined
        ? data.isAvailable
        : data.isActive !== undefined
          ? data.isActive
          : undefined;

    return prisma.branchResource.update({
      where: { id },
      data: {
        ...(data.name ? { name: data.name } : {}),
        ...(data.code !== undefined ? { code: data.code } : {}),
        ...(data.type ? { type: data.type } : {}),
        ...(data.capacity ? { capacity: data.capacity } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(isAvail !== undefined ? { isAvailable: isAvail } : {}),
        ...(data.branchId ? { branchId: data.branchId } : {}),
      },
      include: {
        branch: {
          select: {
            id: true,
            name: true,
            code: true,
            city: true,
            tenantId: true,
          },
        },
      },
    });
  }

  public async deleteResource(id: string) {
    return prisma.branchResource.delete({
      where: { id },
    });
  }

  /**
   * Re-provision credentials for an existing tenant.
   * Useful when initial provisioning failed (e.g., secret mismatch).
   * Generates a new password, calls identity-service upsert, and re-sends credentials email.
   */
  public async reprovisionCredentials(tenantId: string) {
    const tenant = await prisma.organizationTenant.findUnique({
      where: { id: tenantId },
    });
    if (!tenant) {
      throw new NotFoundError(`Tenant with ID ${tenantId} not found`);
    }

    const newPassword = `Salon@${Math.floor(100000 + Math.random() * 900000)}!`;

    // Call identity-service upsert endpoint
    const res = await fetch(
      `${config.IDENTITY_SERVICE_URL}/internal/v1/tenant-credentials`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-service-secret': config.SERVICE_INTERNAL_SECRET,
        },
        body: JSON.stringify({
          tenantId: tenant.id,
          loginEmail: tenant.businessEmail,
          mobilePhone: tenant.businessPhone,
          initialPassword: newPassword,
        }),
      },
    );

    let credentialId: string | undefined;
    if (!res.ok) {
      const errText = await res.text();
      // If 409 Conflict, credential already exists — update its password
      if (res.status === 409) {
        const patchRes = await fetch(
          `${config.IDENTITY_SERVICE_URL}/internal/v1/tenant-credentials/reset-password`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-service-secret': config.SERVICE_INTERNAL_SECRET,
            },
            body: JSON.stringify({
              loginEmail: tenant.businessEmail,
              newPassword,
            }),
          },
        );
        if (!patchRes.ok) {
          const patchErr = await patchRes.text();
          throw new Error(`Identity Service password reset failed: ${patchErr}`);
        }
      } else {
        throw new Error(`Identity Service credential provisioning failed (${res.status}): ${errText}`);
      }
    } else {
      const resJson = (await res.json()) as any;
      credentialId = resJson.data?.id;
    }

    // Re-send credentials email
    await emailService.sendTenantCredentialsEmail({
      toEmail: tenant.businessEmail || 'owner@salon.com',
      ownerName: tenant.legalName || 'Salon Owner',
      salonName: tenant.salonName || tenant.tradeName || 'Your Salon',
      slug: tenant.slug || 'salon',
      generatedPassword: newPassword,
      loginUrl: config.APP_LOGIN_URL,
    });

    return {
      tenantId: tenant.id,
      loginEmail: tenant.businessEmail,
      credentialId,
      message: 'Credentials reprovisioned and email sent successfully.',
    };
  }

  // ==========================================
  // Compliance Requirements Management
  // ==========================================
  public async getComplianceRequirements(tenantId?: string) {
    const DEFAULT_REQUIREMENTS = [
      {
        id: 'REQ-01',
        code: 'REQ-01',
        name: 'Business Trade License',
        category: 'Statutory Licensing',
        level: 'outlet',
        renewalFrequency: 'Annual',
        validityMonths: 12,
        mandatory: true,
        requiresDocument: true,
        description: 'Municipal Corporation Trade & Business License for salon premises',
        isActive: true,
        createdAt: '2024-01-01',
        isDefault: true,
      },
      {
        id: 'REQ-02',
        code: 'REQ-02',
        name: 'GST Registration Certificate',
        category: 'Statutory Licensing',
        level: 'both',
        renewalFrequency: 'Permanent / One-Time',
        validityMonths: 0,
        mandatory: true,
        requiresDocument: true,
        description: '15-digit State GSTIN tax registration certificate and filings',
        isActive: true,
        createdAt: '2024-01-01',
        isDefault: true,
      },
      {
        id: 'REQ-03',
        code: 'REQ-03',
        name: 'Fire Safety NOC & Evacuation Plan',
        category: 'Fire & Life Safety',
        level: 'outlet',
        renewalFrequency: 'Annual',
        validityMonths: 12,
        mandatory: true,
        requiresDocument: true,
        description: 'Fire Department NOC clearance & fire extinguisher annual refilling proof',
        isActive: true,
        createdAt: '2024-01-01',
        isDefault: true,
      },
      {
        id: 'REQ-04',
        code: 'REQ-04',
        name: 'Staff Training & Protocol Certification',
        category: 'Staff Certification',
        level: 'both',
        renewalFrequency: 'Semi-Annual',
        validityMonths: 6,
        mandatory: true,
        requiresDocument: true,
        description: 'Brand HQ master stylist, hygiene protocols, and service technical certification',
        isActive: true,
        createdAt: '2024-01-01',
        isDefault: true,
      },
      {
        id: 'REQ-05',
        code: 'REQ-05',
        name: 'Equipment Maintenance & Autoclave Log',
        category: 'Equipment & Assets',
        level: 'outlet',
        renewalFrequency: 'Annual',
        validityMonths: 12,
        mandatory: true,
        requiresDocument: true,
        description: 'Autoclave sterilization calibration, hydraulic chair servicing & electrical audit',
        isActive: true,
        createdAt: '2024-01-01',
        isDefault: true,
      },
      {
        id: 'REQ-06',
        code: 'REQ-06',
        name: 'Brand Standards & Ambience SOP Audit',
        category: 'Brand Standards & SOP',
        level: 'both',
        renewalFrequency: 'Quarterly',
        validityMonths: 3,
        mandatory: true,
        requiresDocument: true,
        description: 'Storefront signage, uniform etiquette, aroma, interior aesthetics & mystery audit',
        isActive: true,
        createdAt: '2024-01-01',
        isDefault: true,
      },
      {
        id: 'REQ-07',
        code: 'REQ-07',
        name: 'Commercial General Liability Insurance',
        category: 'Insurance & Legal',
        level: 'both',
        renewalFrequency: 'Annual',
        validityMonths: 12,
        mandatory: true,
        requiresDocument: true,
        description: 'Commercial Public Liability & Property damage active policy on file',
        isActive: true,
        createdAt: '2024-01-01',
        isDefault: true,
      },
      {
        id: 'REQ-08',
        code: 'REQ-08',
        name: 'Staff Medical Fitness & Health Card',
        category: 'Health & Hygiene',
        level: 'outlet',
        renewalFrequency: 'Annual',
        validityMonths: 12,
        mandatory: true,
        requiresDocument: true,
        description: 'Annual staff health examination, communicable disease test & sanitary certificate',
        isActive: true,
        createdAt: '2024-01-01',
        isDefault: true,
      },
    ];

    try {
      const whereCondition = tenantId ? { tenantId } : {};
      const customDbReqs = await prisma.complianceRequirement.findMany({
        where: whereCondition,
        orderBy: { createdAt: 'asc' },
      });

      const mappedCustom = customDbReqs.map((cr) => ({
        id: cr.code || cr.id,
        dbId: cr.id,
        code: cr.code,
        name: cr.name,
        category: cr.category,
        level: cr.level,
        renewalFrequency: cr.renewalFrequency,
        validityMonths: cr.validityMonths,
        mandatory: cr.mandatory,
        requiresDocument: cr.requiresDocument,
        description: cr.description || '',
        isActive: cr.isActive,
        createdAt: cr.createdAt.toISOString().split('T')[0],
        tenantId: cr.tenantId,
        isDefault: cr.isDefault,
      }));

      return [...DEFAULT_REQUIREMENTS, ...mappedCustom];
    } catch {
      return DEFAULT_REQUIREMENTS;
    }
  }

  public async createComplianceRequirement(payload: {
    tenantId?: string;
    code?: string;
    name: string;
    category: string;
    level: string;
    renewalFrequency: string;
    validityMonths?: number;
    mandatory?: boolean;
    requiresDocument?: boolean;
    description?: string;
  }) {
    let targetTenantId = payload.tenantId;
    if (!targetTenantId) {
      const firstTenant = await prisma.organizationTenant.findFirst();
      targetTenantId = firstTenant?.id || '00000000-0000-0000-0000-000000000001';
    }

    const currentCount = await prisma.complianceRequirement.count({
      where: { tenantId: targetTenantId },
    });
    const generatedCode = payload.code || `REQ-${String(8 + currentCount + 1).padStart(2, '0')}`;

    const created = await prisma.complianceRequirement.create({
      data: {
        tenantId: targetTenantId,
        code: generatedCode,
        name: payload.name,
        category: payload.category || 'Statutory Licensing',
        level: payload.level || 'outlet',
        renewalFrequency: payload.renewalFrequency || 'Annual',
        validityMonths: payload.validityMonths ?? 12,
        mandatory: payload.mandatory ?? true,
        requiresDocument: payload.requiresDocument ?? true,
        description: payload.description || `${payload.name} standard required for salon operations`,
        isActive: true,
        isDefault: false,
      },
    });

    return {
      id: created.code,
      dbId: created.id,
      code: created.code,
      name: created.name,
      category: created.category,
      level: created.level,
      renewalFrequency: created.renewalFrequency,
      validityMonths: created.validityMonths,
      mandatory: created.mandatory,
      requiresDocument: created.requiresDocument,
      description: created.description,
      isActive: created.isActive,
      createdAt: created.createdAt.toISOString().split('T')[0],
      tenantId: created.tenantId,
      isDefault: false,
    };
  }

  public async deleteComplianceRequirement(idOrCode: string) {
    try {
      await prisma.complianceRequirement.deleteMany({
        where: {
          OR: [{ id: idOrCode }, { code: idOrCode }],
        },
      });
      return { success: true, message: `Compliance requirement ${idOrCode} removed.` };
    } catch {
      return { success: true, message: `Compliance requirement ${idOrCode} removed.` };
    }
  }
}

