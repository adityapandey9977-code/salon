import { ConflictError, NotFoundError } from '@salon-spa-saas/common-types';
import { prisma } from '../prisma/client';
import { Prisma, } from '../prisma/generated-client';
export class ServiceRepository {
    toDto(item) {
        return {
            id: item.id,
            tenantId: item.tenantId,
            categoryId: item.categoryId,
            code: item.code,
            name: item.name,
            description: item.description,
            durationMinutes: item.durationMinutes,
            bufferBeforeMinutes: item.bufferBeforeMinutes,
            bufferAfterMinutes: item.bufferAfterMinutes,
            basePrice: Number(item.basePrice),
            gstRate: Number(item.gstRate),
            taxCode: item.taxCode,
            sacCode: item.sacCode,
            requiresConsultation: item.requiresConsultation,
            requiresPatchTest: item.requiresPatchTest,
            isActive: item.isActive,
            isBookableOnline: item.isBookableOnline,
            imageUrl: item.imageUrl,
            requiredSkill: item.requiredSkill,
            requiredLevel: item.requiredLevel,
            requiredRoomOrChair: item.requiredRoomOrChair,
            requiredEquipment: item.requiredEquipment,
            pricingMode: item.pricingMode,
            discountEligible: item.discountEligible,
            availableBranches: item.availableBranches && item.availableBranches.length > 0
                ? item.availableBranches
                : item.metadata?.availableBranches || [],
            metadata: item.metadata,
            createdAt: item.createdAt.toISOString(),
            updatedAt: item.updatedAt.toISOString(),
            branchPrices: item.branchPrices?.map((bp) => ({
                branchId: bp.branchId,
                price: Number(bp.price),
                isActive: bp.isActive,
            })),
        };
    }
    toCategoryDto(item) {
        return {
            id: item.id,
            tenantId: item.tenantId,
            name: item.name,
            code: item.code,
            description: item.description,
            sortOrder: item.sortOrder,
            imageUrl: item.imageUrl,
            accentColor: item.accentColor,
            isActive: item.isActive,
            createdAt: item.createdAt.toISOString(),
            updatedAt: item.updatedAt.toISOString(),
        };
    }
    // Categories
    async listCategories(tenantId) {
        const records = await prisma.serviceCategory.findMany({
            where: { tenantId },
            orderBy: { sortOrder: 'asc' },
        });
        return records.map((r) => this.toCategoryDto(r));
    }
    async createCategory(data) {
        try {
            const record = await prisma.serviceCategory.create({
                data: {
                    tenantId: data.tenantId,
                    name: data.name,
                    code: data.code,
                    description: data.description,
                    sortOrder: data.sortOrder || 0,
                    imageUrl: data.imageUrl,
                    accentColor: data.accentColor,
                    isActive: data.isActive !== undefined ? data.isActive : true,
                },
            });
            return this.toCategoryDto(record);
        }
        catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
                throw new ConflictError('A category with this code already exists');
            }
            throw err;
        }
    }
    async updateCategory(tenantId, id, data) {
        const existing = await prisma.serviceCategory.findFirst({ where: { id, tenantId } });
        if (!existing)
            throw new NotFoundError('Service category not found');
        const updated = await prisma.serviceCategory.update({
            where: { id },
            data,
        });
        return this.toCategoryDto(updated);
    }
    async deleteCategory(tenantId, id) {
        const existing = await prisma.serviceCategory.findFirst({ where: { id, tenantId } });
        if (!existing)
            throw new NotFoundError('Service category not found');
        const activeServicesCount = await prisma.serviceMaster.count({
            where: { categoryId: id, deletedAt: null },
        });
        if (activeServicesCount > 0) {
            throw new ConflictError(`Cannot delete category with ${activeServicesCount} linked service(s). Please reassign or delete them first.`);
        }
        await prisma.serviceCategory.delete({ where: { id } });
    }
    // Services
    async findById(tenantId, id) {
        const record = await prisma.serviceMaster.findFirst({
            where: { id, tenantId, deletedAt: null },
            include: { branchPrices: true },
        });
        if (!record)
            return null;
        return this.toDto(record);
    }
    async findByBranch(tenantId, serviceId, branchId) {
        const service = await this.findById(tenantId, serviceId);
        if (!service)
            throw new NotFoundError('Service not found');
        const branchPrice = service.branchPrices?.find((bp) => bp.branchId === branchId && bp.isActive);
        const effectivePrice = branchPrice ? branchPrice.price : service.basePrice;
        return { service, effectivePrice };
    }
    async list(tenantId, filters) {
        const where = {
            tenantId,
            deletedAt: null,
        };
        if (filters.categoryId)
            where.categoryId = filters.categoryId;
        if (filters.isActive !== undefined)
            where.isActive = filters.isActive;
        if (filters.isBookableOnline !== undefined)
            where.isBookableOnline = filters.isBookableOnline;
        if (filters.branchId) {
            where.OR = [
                { branchPrices: { some: { branchId: filters.branchId, isActive: true } } },
                { availableBranches: { has: filters.branchId } },
            ];
        }
        if (filters.search) {
            const searchCondition = [
                { name: { contains: filters.search, mode: 'insensitive' } },
                { code: { contains: filters.search, mode: 'insensitive' } },
            ];
            if (where.OR) {
                where.AND = [{ OR: where.OR }, { OR: searchCondition }];
                delete where.OR;
            }
            else {
                where.OR = searchCondition;
            }
        }
        const skip = (filters.page - 1) * filters.limit;
        const [total, records] = await Promise.all([
            prisma.serviceMaster.count({ where }),
            prisma.serviceMaster.findMany({
                where,
                skip,
                take: filters.limit,
                include: { branchPrices: true },
                orderBy: { name: 'asc' },
            }),
        ]);
        return {
            items: records.map((r) => this.toDto(r)),
            total,
            page: filters.page,
            limit: filters.limit,
        };
    }
    async create(data) {
        try {
            const branches = Array.isArray(data.availableBranches)
                ? data.availableBranches
                : Array.isArray(data.metadata?.availableBranches)
                    ? data.metadata.availableBranches
                    : [];
            const metadataObj = typeof data.metadata === 'object' && data.metadata !== null
                ? { ...data.metadata, availableBranches: branches }
                : { availableBranches: branches };
            const record = await prisma.serviceMaster.create({
                data: {
                    tenantId: data.tenantId,
                    categoryId: data.categoryId,
                    code: data.code,
                    name: data.name,
                    description: data.description,
                    durationMinutes: data.durationMinutes,
                    bufferBeforeMinutes: data.bufferBeforeMinutes || 0,
                    bufferAfterMinutes: data.bufferAfterMinutes || 0,
                    basePrice: new Prisma.Decimal(data.basePrice),
                    gstRate: new Prisma.Decimal(data.gstRate !== undefined ? data.gstRate : 18.0),
                    taxCode: data.taxCode,
                    sacCode: data.sacCode,
                    requiresConsultation: data.requiresConsultation || false,
                    requiresPatchTest: data.requiresPatchTest || false,
                    isActive: data.isActive !== undefined ? data.isActive : true,
                    isBookableOnline: data.isBookableOnline !== undefined ? data.isBookableOnline : true,
                    imageUrl: data.imageUrl,
                    requiredSkill: data.requiredSkill,
                    requiredLevel: data.requiredLevel,
                    requiredRoomOrChair: data.requiredRoomOrChair,
                    requiredEquipment: data.requiredEquipment,
                    pricingMode: data.pricingMode || 'Shared price across branches',
                    discountEligible: data.discountEligible !== undefined ? data.discountEligible : true,
                    availableBranches: branches,
                    metadata: metadataObj,
                },
                include: { branchPrices: true },
            });
            return this.toDto(record);
        }
        catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
                throw new ConflictError('A service with this code already exists');
            }
            throw err;
        }
    }
    async update(tenantId, id, data) {
        const existing = await prisma.serviceMaster.findFirst({
            where: { id, tenantId, deletedAt: null },
        });
        if (!existing)
            throw new NotFoundError('Service not found');
        const updateData = { ...data };
        if (typeof updateData.basePrice === 'number') {
            updateData.basePrice = new Prisma.Decimal(updateData.basePrice);
        }
        if (typeof updateData.gstRate === 'number') {
            updateData.gstRate = new Prisma.Decimal(updateData.gstRate);
        }
        if (updateData.availableBranches !== undefined) {
            const branches = Array.isArray(updateData.availableBranches) ? updateData.availableBranches : [];
            updateData.availableBranches = branches;
            updateData.metadata = {
                ...(typeof existing.metadata === 'object' && existing.metadata !== null ? existing.metadata : {}),
                ...(typeof updateData.metadata === 'object' && updateData.metadata !== null ? updateData.metadata : {}),
                availableBranches: branches,
            };
        }
        else if (updateData.metadata?.availableBranches !== undefined) {
            const branches = Array.isArray(updateData.metadata.availableBranches)
                ? updateData.metadata.availableBranches
                : [];
            updateData.availableBranches = branches;
        }
        const updated = await prisma.serviceMaster.update({
            where: { id },
            data: updateData,
            include: { branchPrices: true },
        });
        return this.toDto(updated);
    }
    async delete(tenantId, id) {
        const existing = await prisma.serviceMaster.findFirst({
            where: { id, tenantId, deletedAt: null },
        });
        if (!existing)
            throw new NotFoundError('Service not found');
        await prisma.serviceMaster.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                isActive: false,
            },
        });
    }
    async setBranchPrice(data) {
        const service = await prisma.serviceMaster.findFirst({
            where: { id: data.serviceId, tenantId: data.tenantId, deletedAt: null },
        });
        if (!service)
            throw new NotFoundError('Service not found');
        await prisma.serviceBranchPrice.upsert({
            where: {
                tenantId_branchId_serviceId: {
                    tenantId: data.tenantId,
                    branchId: data.branchId,
                    serviceId: data.serviceId,
                },
            },
            update: {
                price: new Prisma.Decimal(data.price),
                effectiveFrom: data.effectiveFrom,
                effectiveTo: data.effectiveTo,
                isActive: data.isActive !== undefined ? data.isActive : true,
            },
            create: {
                tenantId: data.tenantId,
                branchId: data.branchId,
                serviceId: data.serviceId,
                price: new Prisma.Decimal(data.price),
                effectiveFrom: data.effectiveFrom,
                effectiveTo: data.effectiveTo,
                isActive: data.isActive !== undefined ? data.isActive : true,
            },
        });
    }
    async setRecipe(data) {
        const service = await prisma.serviceMaster.findFirst({
            where: { id: data.serviceId, tenantId: data.tenantId, deletedAt: null },
        });
        if (!service)
            throw new NotFoundError('Service not found');
        await prisma.$transaction(async (tx) => {
            // Upsert BOM
            const bom = await tx.serviceRecipeBom.upsert({
                where: { serviceId: data.serviceId },
                update: {
                    name: data.name,
                    description: data.description,
                    version: data.version || 1,
                },
                create: {
                    tenantId: data.tenantId,
                    serviceId: data.serviceId,
                    name: data.name,
                    description: data.description,
                    version: data.version || 1,
                },
            });
            // Clear existing items and re-create
            await tx.serviceBomItem.deleteMany({ where: { bomId: bom.id } });
            await tx.serviceBomItem.createMany({
                data: data.items.map((it) => ({
                    tenantId: data.tenantId,
                    bomId: bom.id,
                    skuId: it.skuId,
                    quantityRequired: new Prisma.Decimal(it.quantityRequired),
                    unit: it.unit || 'ML',
                })),
            });
        });
    }
    // ==========================================
    // Skills Registry Operations
    // ==========================================
    isSkillsTableReady = false;
    async ensureSkillsTable() {
        if (this.isSkillsTableReady)
            return;
        try {
            await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS catalogue_skills (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          tenant_id UUID NOT NULL,
          code VARCHAR(50) NOT NULL,
          name VARCHAR(255) NOT NULL,
          category_id VARCHAR(100),
          category_name VARCHAR(255),
          description TEXT,
          status VARCHAR(20) DEFAULT 'Active',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT uq_catalogue_skills_tenant_code UNIQUE(tenant_id, code)
        )
      `);
            await prisma.$executeRawUnsafe(`
        CREATE INDEX IF NOT EXISTS idx_catalogue_skills_tenant ON catalogue_skills(tenant_id)
      `);
            try {
                await prisma.$executeRawUnsafe(`
          ALTER TABLE catalogue_skills ALTER COLUMN category_id TYPE VARCHAR(100)
        `);
            }
            catch {
                // Ignored if column already exists as VARCHAR or table was newly created
            }
            this.isSkillsTableReady = true;
        }
        catch (err) {
            console.error('[ServiceRepository] ensureSkillsTable error:', err);
            throw err;
        }
    }
    async listSkills(tenantId) {
        await this.ensureSkillsTable();
        // 1. Sync any skills defined on services in service_masters for this tenant
        try {
            const distinctServiceSkills = await prisma.$queryRawUnsafe(`SELECT DISTINCT sm.required_skill, sm.category_id, sc.name as category_name
         FROM service_masters sm
         LEFT JOIN service_categories sc ON sc.id = sm.category_id
         WHERE sm.tenant_id = $1::uuid 
           AND sm.deleted_at IS NULL 
           AND sm.required_skill IS NOT NULL 
           AND TRIM(sm.required_skill) != ''`, tenantId);
            for (const ds of distinctServiceSkills) {
                const skillName = ds.required_skill ? String(ds.required_skill).trim() : '';
                if (!skillName)
                    continue;
                const exists = await prisma.$queryRawUnsafe(`SELECT id FROM catalogue_skills WHERE tenant_id = $1::uuid AND LOWER(name) = LOWER($2) LIMIT 1`, tenantId, skillName);
                if (exists.length === 0) {
                    const slug = skillName.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
                    const code = `SKL-${slug || 'SKILL'}`;
                    await prisma.$executeRawUnsafe(`INSERT INTO catalogue_skills (tenant_id, code, name, category_id, category_name, description, status)
             VALUES ($1::uuid, $2, $3, $4, $5, $6, 'Active')
             ON CONFLICT (tenant_id, code) DO NOTHING`, tenantId, code, skillName, ds.category_id || null, ds.category_name || 'General Services', `Master technical competency required for ${skillName} services.`);
                }
            }
        }
        catch (syncErr) {
            console.warn('[ServiceRepository] Syncing skills from service_masters error:', syncErr);
        }
        // 2. Fetch skills for tenant directly from database
        const rawSkills = await prisma.$queryRawUnsafe(`SELECT id, tenant_id, code, name, category_id, category_name, description, status, created_at, updated_at
       FROM catalogue_skills
       WHERE tenant_id = $1::uuid
       ORDER BY created_at ASC`, tenantId);
        if (rawSkills.length === 0) {
            return [];
        }
        // 3. Count services linked for each skill in live database
        const countMap = {};
        try {
            const serviceCounts = await prisma.$queryRawUnsafe(`SELECT required_skill, COUNT(*)::int as count
         FROM service_masters
         WHERE tenant_id = $1::uuid AND deleted_at IS NULL AND required_skill IS NOT NULL
         GROUP BY required_skill`, tenantId);
            for (const sc of serviceCounts) {
                if (sc.required_skill) {
                    countMap[sc.required_skill.toLowerCase()] = Number(sc.count) || 0;
                }
            }
        }
        catch (countErr) {
            console.warn('[ServiceRepository] Counting linked services error:', countErr);
        }
        return rawSkills.map((r) => {
            const linked = countMap[r.name.toLowerCase()] ?? countMap[r.code.toLowerCase()] ?? 0;
            return {
                id: r.id,
                tenantId: r.tenant_id,
                code: r.code,
                name: r.name,
                categoryId: r.category_id,
                categoryName: r.category_name || 'General Services',
                description: r.description || '',
                status: (r.status === 'Inactive' ? 'Inactive' : 'Active'),
                servicesLinked: linked,
                staffCount: 0,
                createdAt: r.created_at
                    ? new Date(r.created_at).toISOString()
                    : new Date().toISOString(),
                updatedAt: r.updated_at
                    ? new Date(r.updated_at).toISOString()
                    : new Date().toISOString(),
            };
        });
    }
    async seedStandardSkills(tenantId) {
        await this.ensureSkillsTable();
        const categories = await this.listCategories(tenantId);
        const hairCat = categories.find((c) => c.name.toLowerCase().includes('hair'))?.name ||
            'Hair Dressing & Styling';
        const skinCat = categories.find((c) => c.name.toLowerCase().includes('skin') ||
            c.name.toLowerCase().includes('facial'))?.name || 'Skin & Organic Therapy';
        const spaCat = categories.find((c) => c.name.toLowerCase().includes('spa') ||
            c.name.toLowerCase().includes('massage'))?.name || 'Spa & Wellness Rituals';
        const nailCat = categories.find((c) => c.name.toLowerCase().includes('nail'))?.name ||
            'Nails Art & Spa Lounge';
        const makeupCat = categories.find((c) => c.name.toLowerCase().includes('bridal') ||
            c.name.toLowerCase().includes('makeup'))?.name || 'Bridal & Red Carpet Studio';
        const defaultSeeds = [
            {
                code: 'SKL-HAIR-01',
                name: 'Precision Hair Styling',
                categoryName: hairCat,
                description: 'Structural sectioning, bespoke layered cuts, and razor feathering techniques.',
            },
            {
                code: 'SKL-CHEM-02',
                name: 'Chemical Hair Therapy',
                categoryName: hairCat,
                description: 'Keratin, cysteine, balayage bleaching, and ammonia-free root melt chemistry.',
            },
            {
                code: 'SKL-SKIN-03',
                name: 'Clinical Skin Aesthetics',
                categoryName: skinCat,
                description: 'Hydrodermabrasion, high-frequency ozone therapy, chemical peel neutralisation.',
            },
            {
                code: 'SKL-SPA-04',
                name: 'Spa Bodywork & Acupressure',
                categoryName: spaCat,
                description: 'Swedish effleurage, lymphatic drainage, reflexology point pressure, hot stones.',
            },
            {
                code: 'SKL-NAIL-05',
                name: 'Nail Architecture & Artistry',
                categoryName: nailCat,
                description: 'Polygel apex sculpting, electric file cuticle prep, chrome encapsulation.',
            },
            {
                code: 'SKL-MAKE-06',
                name: 'Couture Airbrush Makeup',
                categoryName: makeupCat,
                description: 'High-definition micro-pigment misting, contouring, silicone bridal sealing.',
            },
        ];
        for (const s of defaultSeeds) {
            const catMatch = categories.find((c) => c.name === s.categoryName);
            await prisma.$executeRawUnsafe(`INSERT INTO catalogue_skills (tenant_id, code, name, category_id, category_name, description, status)
         VALUES ($1::uuid, $2, $3, $4, $5, $6, 'Active')
         ON CONFLICT (tenant_id, code) DO NOTHING`, tenantId, s.code, s.name, catMatch ? catMatch.id : null, s.categoryName, s.description);
        }
        return this.listSkills(tenantId);
    }
    async createSkill(tenantId, data) {
        await this.ensureSkillsTable();
        const cleanCode = data.code.trim().toUpperCase();
        const existing = await prisma.$queryRawUnsafe(`SELECT id FROM catalogue_skills WHERE tenant_id = $1::uuid AND UPPER(code) = $2 LIMIT 1`, tenantId, cleanCode);
        if (existing.length > 0) {
            throw new ConflictError(`Skill with code "${cleanCode}" already exists.`);
        }
        const categoryIdVal = data.categoryId && typeof data.categoryId === 'string' && data.categoryId.trim() !== ''
            ? data.categoryId.trim()
            : null;
        const categoryNameVal = data.categoryName && typeof data.categoryName === 'string' && data.categoryName.trim() !== ''
            ? data.categoryName.trim()
            : null;
        const descriptionVal = data.description && typeof data.description === 'string' && data.description.trim() !== ''
            ? data.description.trim()
            : null;
        const statusVal = data.status || 'Active';
        const inserted = await prisma.$queryRawUnsafe(`INSERT INTO catalogue_skills (tenant_id, code, name, category_id, category_name, description, status)
       VALUES ($1::uuid, $2, $3, $4, $5, $6, $7)
       RETURNING id, tenant_id, code, name, category_id, category_name, description, status, created_at, updated_at`, tenantId, cleanCode, data.name.trim(), categoryIdVal, categoryNameVal, descriptionVal, statusVal);
        const r = inserted[0];
        return {
            id: r.id,
            tenantId: r.tenant_id,
            code: r.code,
            name: r.name,
            categoryId: r.category_id,
            categoryName: r.category_name,
            description: r.description,
            status: r.status,
            servicesLinked: 0,
            staffCount: 0,
            createdAt: new Date(r.created_at).toISOString(),
            updatedAt: new Date(r.updated_at).toISOString(),
        };
    }
    async updateSkill(tenantId, id, data) {
        await this.ensureSkillsTable();
        if (data.code) {
            const cleanCode = data.code.trim().toUpperCase();
            const existing = await prisma.$queryRawUnsafe(`SELECT id FROM catalogue_skills WHERE tenant_id = $1::uuid AND UPPER(code) = $2 AND id != $3::uuid LIMIT 1`, tenantId, cleanCode, id);
            if (existing.length > 0) {
                throw new ConflictError(`Skill with code "${cleanCode}" already exists.`);
            }
        }
        const currentRaw = await prisma.$queryRawUnsafe(`SELECT * FROM catalogue_skills WHERE tenant_id = $1::uuid AND id = $2::uuid LIMIT 1`, tenantId, id);
        if (currentRaw.length === 0) {
            throw new NotFoundError('Skill not found.');
        }
        const current = currentRaw[0];
        const updatedName = data.name !== undefined ? data.name.trim() : current.name;
        const updatedCode = data.code !== undefined ? data.code.trim().toUpperCase() : current.code;
        const updatedCategoryId = data.categoryId !== undefined
            ? data.categoryId && typeof data.categoryId === 'string' && data.categoryId.trim() !== ''
                ? data.categoryId.trim()
                : null
            : current.category_id;
        const updatedCategoryName = data.categoryName !== undefined
            ? data.categoryName && typeof data.categoryName === 'string' && data.categoryName.trim() !== ''
                ? data.categoryName.trim()
                : null
            : current.category_name;
        const updatedDescription = data.description !== undefined
            ? data.description && typeof data.description === 'string' && data.description.trim() !== ''
                ? data.description.trim()
                : null
            : current.description;
        const updatedStatus = data.status !== undefined ? data.status : current.status;
        const updated = await prisma.$queryRawUnsafe(`UPDATE catalogue_skills
       SET name = $1, code = $2, category_id = $3, category_name = $4, description = $5, status = $6, updated_at = NOW()
       WHERE tenant_id = $7::uuid AND id = $8::uuid
       RETURNING id, tenant_id, code, name, category_id, category_name, description, status, created_at, updated_at`, updatedName, updatedCode, updatedCategoryId, updatedCategoryName, updatedDescription, updatedStatus, tenantId, id);
        const r = updated[0];
        return {
            id: r.id,
            tenantId: r.tenant_id,
            code: r.code,
            name: r.name,
            categoryId: r.category_id,
            categoryName: r.category_name,
            description: r.description,
            status: r.status,
            servicesLinked: 0,
            staffCount: 0,
            createdAt: new Date(r.created_at).toISOString(),
            updatedAt: new Date(r.updated_at).toISOString(),
        };
    }
    async deleteSkill(tenantId, id) {
        await this.ensureSkillsTable();
        await prisma.$executeRawUnsafe(`DELETE FROM catalogue_skills WHERE tenant_id = $1::uuid AND id = $2::uuid`, tenantId, id);
    }
}
export const serviceRepository = new ServiceRepository();
