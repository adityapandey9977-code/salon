import { PrismaClient } from '../src/infrastructure/prisma/generated-client';

const prisma = new PrismaClient();

const STANDARD_CATEGORIES = [
  {
    name: 'Hair Dressing & Styling',
    code: 'HAIR_CARE',
    description: 'Precision haircuts, bespoke blowouts, balayage coloring, and intensive keratin treatments.',
    sortOrder: 1,
  },
  {
    name: 'Skin & Organic Therapy',
    code: 'SKIN_CARE',
    description: 'Dermatologist-formulated hydra facials, LED collagen rejuvenation, and organic vitamin infusers.',
    sortOrder: 2,
  },
  {
    name: 'Spa & Wellness Rituals',
    code: 'SPA_WELLNESS',
    description: 'Holistic deep tissue massages, Swedish aromatherapy, hot stone therapy, and body scrubs.',
    sortOrder: 3,
  },
  {
    name: 'Nails Art & Spa Lounge',
    code: 'NAIL_CARE',
    description: 'Gel extensions, French overlays, therapeutic reflexology pedicures, and nail artistry.',
    sortOrder: 4,
  },
  {
    name: 'Bridal & Red Carpet Studio',
    code: 'BRIDAL_STUDIO',
    description: 'Couture airbrush bridal makeup, luxury pre-wedding packages, and high-fashion styling.',
    sortOrder: 5,
  },
  {
    name: 'Men’s Grooming Lounge',
    code: 'MENS_GROOMING',
    description: 'Executive beard sculpting, scalp detox massage, express facials, and grooming.',
    sortOrder: 6,
  },
];

const STANDARD_SERVICES = [
  {
    code: 'HAIR-CUT-01',
    name: 'Signature Precision Cut & Blowout',
    categoryCode: 'HAIR_CARE',
    durationMinutes: 45,
    bufferAfterMinutes: 15,
    basePrice: 1850,
    requiredSkill: 'Precision Hair Styling',
    requiredLevel: 'Senior',
    requiredRoomOrChair: 'Styling Chair',
    requiredEquipment: 'Ionic Dryer & Shears',
    description: 'Bespoke diagnostic consultation followed by precision structural haircut and botanical blowout styling.',
  },
  {
    code: 'HAIR-KER-02',
    name: 'Cysteine & Keratin Infusion Treatment',
    categoryCode: 'HAIR_CARE',
    durationMinutes: 120,
    bufferAfterMinutes: 20,
    basePrice: 5200,
    requiredSkill: 'Chemical Hair Therapy',
    requiredLevel: 'Expert',
    requiredRoomOrChair: 'Chemical Treatment Bay',
    requiredEquipment: 'Nano Titanium Flat Iron',
    description: 'Formaldehyde-free protein reconstruction treatment delivering lasting mirror shine and frizz control.',
  },
  {
    code: 'HAIR-BAL-08',
    name: 'Balayage & Olaplex Molecular Bonding',
    categoryCode: 'HAIR_CARE',
    durationMinutes: 90,
    bufferAfterMinutes: 15,
    basePrice: 4200,
    requiredSkill: 'Precision Hair Styling',
    requiredLevel: 'Senior',
    requiredRoomOrChair: 'Styling Chair',
    requiredEquipment: 'Color Bar Station',
    description: 'Hand-painted French balayage highlights with Olaplex bond multiplier restoration.',
  },
  {
    code: 'SKIN-HYD-03',
    name: '7-Step Medical Hydra-Facial Rejuvenation',
    categoryCode: 'SKIN_CARE',
    durationMinutes: 60,
    bufferAfterMinutes: 15,
    basePrice: 3800,
    requiredSkill: 'Clinical Skin Aesthetics',
    requiredLevel: 'Senior',
    requiredRoomOrChair: 'Aesthetic Treatment Suite',
    requiredEquipment: 'Vortex Hydrodermabrasion Unit',
    description: 'Deep pore vacuum extraction, glycolic exfoliation, antioxidant infusion, and LED collagen phototherapy.',
  },
  {
    code: 'SKIN-GLD-10',
    name: '24K Pure Gold Collagen Facial',
    categoryCode: 'SKIN_CARE',
    durationMinutes: 75,
    bufferAfterMinutes: 15,
    basePrice: 4800,
    requiredSkill: 'Clinical Skin Aesthetics',
    requiredLevel: 'Senior',
    requiredRoomOrChair: 'Aesthetic Treatment Suite',
    requiredEquipment: 'Ultrasonic Infusion Wand',
    description: 'Luxury cellular regeneration utilizing 24-karat gold leaf sheets and bio-marine collagen.',
  },
  {
    code: 'SPA-SWD-04',
    name: 'Swedish Aromatherapy Deep Tissue Massage',
    categoryCode: 'SPA_WELLNESS',
    durationMinutes: 90,
    bufferAfterMinutes: 20,
    basePrice: 4500,
    requiredSkill: 'Spa Bodywork & Acupressure',
    requiredLevel: 'Expert',
    requiredRoomOrChair: 'Hydrotherapy Spa Suite',
    requiredEquipment: 'Heated Basalt Stone Set',
    description: 'Therapeutic muscle tension release using cold-pressed essential oils and heated basalt stones.',
  },
  {
    code: 'SPA-SHI-09',
    name: 'Ayurvedic Shirodhara & Scalp Elixir',
    categoryCode: 'SPA_WELLNESS',
    durationMinutes: 60,
    bufferAfterMinutes: 15,
    basePrice: 3200,
    requiredSkill: 'Spa Bodywork & Acupressure',
    requiredLevel: 'Senior',
    requiredRoomOrChair: 'Ayurvedic Treatment Room',
    requiredEquipment: 'Copper Shirodhara Vessel',
    description: 'Rhythmic warm herbal oil stream over third-eye chakra to alleviate anxiety and promote scalp vitality.',
  },
  {
    code: 'NAIL-GEL-05',
    name: 'Sculpted Gel Extensions & Ombre Art',
    categoryCode: 'NAIL_CARE',
    durationMinutes: 75,
    bufferAfterMinutes: 10,
    basePrice: 2400,
    requiredSkill: 'Nail Architecture & Artistry',
    requiredLevel: 'Intermediate',
    requiredRoomOrChair: 'Nail Bar Station',
    requiredEquipment: 'Dual UV/LED Curing Lamp',
    description: 'Custom monomer sculpture with chrome glitter fade, cuticular hydration, and high-gloss topcoat.',
  },
  {
    code: 'NAIL-RUS-12',
    name: 'Russian Gel Manicure & Nail Architecture',
    categoryCode: 'NAIL_CARE',
    durationMinutes: 60,
    bufferAfterMinutes: 15,
    basePrice: 2100,
    requiredSkill: 'Nail Architecture & Artistry',
    requiredLevel: 'Senior',
    requiredRoomOrChair: 'Nail Bar Station',
    requiredEquipment: 'E-File Precision Apparatus',
    description: 'Dry hardware cuticular cleaning combined with structural rubber base alignment.',
  },
  {
    code: 'BRID-AIR-06',
    name: 'Couture HD Airbrush Bridal Glamour',
    categoryCode: 'BRIDAL_STUDIO',
    durationMinutes: 150,
    bufferAfterMinutes: 30,
    basePrice: 16500,
    requiredSkill: 'Couture Airbrush Makeup',
    requiredLevel: 'Expert',
    requiredRoomOrChair: 'Bridal Suite VIP',
    requiredEquipment: 'Compressor Airbrush System',
    description: 'Long-wear waterproof silicon airbrush makeup, mink lash application, saree draping, and ornamentation.',
  },
  {
    code: 'MENS-BEA-07',
    name: 'Executive Hot Towel Beard Sculpt & Scalp Polish',
    categoryCode: 'MENS_GROOMING',
    durationMinutes: 40,
    bufferAfterMinutes: 10,
    basePrice: 1150,
    requiredSkill: 'Barbering & Hot Towel Shave',
    requiredLevel: 'Intermediate',
    requiredRoomOrChair: 'Barber Chair 1',
    requiredEquipment: 'Steamer & Razor Sanitizer',
    description: 'Triple hot towel wrap, eucalyptus pre-shave oil, straight razor edging, and tea tree head massage.',
  },
  {
    code: 'MENS-DTX-11',
    name: 'Charcoal Detox & Scalp Exfoliation',
    categoryCode: 'MENS_GROOMING',
    durationMinutes: 45,
    bufferAfterMinutes: 15,
    basePrice: 1600,
    requiredSkill: 'Barbering & Hot Towel Shave',
    requiredLevel: 'Intermediate',
    requiredRoomOrChair: 'Barber Chair 2',
    requiredEquipment: 'Micro-Mist Scalp Steamer',
    description: 'Activated bamboo charcoal scrub removing mineral accumulation and product buildup.',
  },
];

const TENANTS_TO_SEED = [
  '11111111-1111-1111-1111-111111111111',
  'a0000000-0000-0000-0000-000000000001',
];

async function main() {
  console.log('Seeding Commerce Service database with full category and treatment catalogue...');

  for (const tenantId of TENANTS_TO_SEED) {
    console.log(`\n--- Seeding Tenant ${tenantId} ---`);

    const categoryMap = new Map<string, string>();

    for (const cat of STANDARD_CATEGORIES) {
      const created = await prisma.serviceCategory.upsert({
        where: {
          tenantId_code: {
            tenantId,
            code: cat.code,
          },
        },
        update: {
          name: cat.name,
          description: cat.description,
          sortOrder: cat.sortOrder,
          isActive: true,
        },
        create: {
          tenantId,
          name: cat.name,
          code: cat.code,
          description: cat.description,
          sortOrder: cat.sortOrder,
          isActive: true,
        },
      });

      categoryMap.set(cat.code, created.id);
      console.log(`  [Category] ${created.name} (${created.code}) -> ${created.id}`);
    }

    for (const srv of STANDARD_SERVICES) {
      const categoryId = categoryMap.get(srv.categoryCode);
      if (!categoryId) continue;

      const createdSrv = await prisma.serviceMaster.upsert({
        where: {
          tenantId_code: {
            tenantId,
            code: srv.code,
          },
        },
        update: {
          name: srv.name,
          categoryId,
          basePrice: srv.basePrice,
          durationMinutes: srv.durationMinutes,
          bufferAfterMinutes: srv.bufferAfterMinutes,
          requiredSkill: srv.requiredSkill,
          requiredLevel: srv.requiredLevel,
          requiredRoomOrChair: srv.requiredRoomOrChair,
          requiredEquipment: srv.requiredEquipment,
          description: srv.description,
          isActive: true,
          isBookableOnline: true,
          availableBranches: [], // Available to all branches including new custom branches
        },
        create: {
          tenantId,
          categoryId,
          code: srv.code,
          name: srv.name,
          basePrice: srv.basePrice,
          durationMinutes: srv.durationMinutes,
          bufferAfterMinutes: srv.bufferAfterMinutes,
          requiredSkill: srv.requiredSkill,
          requiredLevel: srv.requiredLevel,
          requiredRoomOrChair: srv.requiredRoomOrChair,
          requiredEquipment: srv.requiredEquipment,
          description: srv.description,
          isActive: true,
          isBookableOnline: true,
          availableBranches: [],
        },
      });

      console.log(`    [Service] ${createdSrv.name} (${createdSrv.code}) - ₹${createdSrv.basePrice} (${createdSrv.durationMinutes}m)`);
    }

    // Coupon
    const couponCode = `WELCOME10_${tenantId.slice(0, 8)}`;
    await prisma.couponMaster.upsert({
      where: {
        code: couponCode,
      },
      update: {
        discountType: 'PERCENTAGE',
        discountValue: 10.0,
        minOrderValue: 500.0,
        maxDiscount: 200.0,
        isActive: true,
      },
      create: {
        tenantId,
        code: couponCode,
        discountType: 'PERCENTAGE',
        discountValue: 10.0,
        minOrderValue: 500.0,
        maxDiscount: 200.0,
        isActive: true,
      },
    });
  }

  console.log('\nCommerce Service database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Commerce seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
