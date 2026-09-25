import { PrismaClient, StockMovementType, PoStatus } from '../src/infrastructure/prisma/generated-client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Inventory Service database...');

  const tenantIds = [
    'a0000000-0000-0000-0000-000000000001',
    'e4b3c2a1-0000-0000-0000-000000000001',
  ];
  const defaultBranchId = 'b0000000-0000-0000-0000-000000000001';

  for (const tenantId of tenantIds) {
    // 1. Categories
    const catHair = await prisma.inventoryCategory.upsert({
      where: { tenantId_name: { tenantId, name: 'Hair Care' } },
      update: {},
      create: {
        tenantId,
        name: 'Hair Care',
        description: 'Professional hair developer, shampoo, conditioner, and mask',
      },
    });

    const catSkin = await prisma.inventoryCategory.upsert({
      where: { tenantId_name: { tenantId, name: 'Skin Care' } },
      update: {},
      create: {
        tenantId,
        name: 'Skin Care',
        description: 'Facial cleansers, exfoliating scrubs, serums, and moisturisers',
      },
    });

    const catSpa = await prisma.inventoryCategory.upsert({
      where: { tenantId_name: { tenantId, name: 'Spa' } },
      update: {},
      create: {
        tenantId,
        name: 'Spa',
        description: 'Aroma massage oils, body scrubs, and body butter packs',
      },
    });

    const catRetail = await prisma.inventoryCategory.upsert({
      where: { tenantId_name: { tenantId, name: 'Retail' } },
      update: {},
      create: {
        tenantId,
        name: 'Retail',
        description: 'Retail home-care bottles, styling sprays, and gift packs',
      },
    });

    const catConsumables = await prisma.inventoryCategory.upsert({
      where: { tenantId_name: { tenantId, name: 'Consumables' } },
      update: {},
      create: {
        tenantId,
        name: 'Consumables',
        description: 'Gloves, foil sheets, neck strips, and cotton pads',
      },
    });

    const catCleaning = await prisma.inventoryCategory.upsert({
      where: { tenantId_name: { tenantId, name: 'Cleaning' } },
      update: {},
      create: {
        tenantId,
        name: 'Cleaning',
        description: 'Salon equipment disinfectant sprays, floor cleaners, and sanitizers',
      },
    });

    // 2. SKUs
    const skus = [
      {
        skuCode: 'LOR-DEV-20V',
        barcode: '8901234567890',
        name: 'L’Oréal Professionnel Developer 20Vol',
        description: 'Oxidant developer for permanent and demi-permanent hair color',
        categoryId: catHair.id,
        unitOfMeasure: '1000 ml',
        costPrice: 850.0,
        retailPrice: 1200.0,
        isConsumable: true,
        isRetail: false,
        reorderLevel: 10,
        reorderQuantity: 20,
        initialStock: 14,
      },
      {
        skuCode: 'KER-NUT-500',
        barcode: '8909876543210',
        name: 'Kérastase Nutritive Mask',
        description: 'Intense nourishing hair treatment mask for dry hair',
        categoryId: catHair.id,
        unitOfMeasure: '500 ml',
        costPrice: 2400.0,
        retailPrice: 3200.0,
        isConsumable: true,
        isRetail: true,
        reorderLevel: 5,
        reorderQuantity: 10,
        initialStock: 8,
      },
      {
        skuCode: 'HYD-CLE-200',
        barcode: '8901122334455',
        name: 'Hydra Facial Cleansing Gel',
        description: 'Deep pore facial cleansing gel with hyaluronic acid',
        categoryId: catSkin.id,
        unitOfMeasure: '250 ml',
        costPrice: 1200.0,
        retailPrice: 1800.0,
        isConsumable: true,
        isRetail: true,
        reorderLevel: 6,
        reorderQuantity: 15,
        initialStock: 12,
      },
      {
        skuCode: 'SPA-MAS-500',
        barcode: '8902233445566',
        name: 'Aroma Therapy Body Massage Oil',
        description: 'Relaxing lavender and eucalyptus blend spa massage oil',
        categoryId: catSpa.id,
        unitOfMeasure: '500 ml',
        costPrice: 1500.0,
        retailPrice: 2200.0,
        isConsumable: true,
        isRetail: false,
        reorderLevel: 4,
        reorderQuantity: 10,
        initialStock: 6,
      },
      {
        skuCode: 'RET-SHA-250',
        barcode: '8903344556677',
        name: 'Kérastase Bain Satin Shampoo (Retail)',
        description: 'Gentle hydrating daily shampoo for normal to slightly dry hair',
        categoryId: catRetail.id,
        unitOfMeasure: '250 ml',
        costPrice: 1800.0,
        retailPrice: 2500.0,
        isConsumable: false,
        isRetail: true,
        reorderLevel: 8,
        reorderQuantity: 20,
        initialStock: 10,
      },
      {
        skuCode: 'CLN-DIS-100',
        barcode: '8904455667788',
        name: 'Salon Equipment Disinfectant Spray',
        description: 'Hospital grade multi-surface sanitizer for salon stations and tools',
        categoryId: catCleaning.id,
        unitOfMeasure: '1000 ml',
        costPrice: 350.0,
        retailPrice: 500.0,
        isConsumable: true,
        isRetail: false,
        reorderLevel: 12,
        reorderQuantity: 25,
        initialStock: 18,
      },
      {
        skuCode: 'OLA-NO1-525',
        barcode: '8905566778899',
        name: 'Olaplex No. 1 Bond Multiplier',
        description: 'Concentrated first salon step to rebuild broken disulfide bonds',
        categoryId: catHair.id,
        unitOfMeasure: '525 ml',
        costPrice: 4200.0,
        retailPrice: 5500.0,
        isConsumable: true,
        isRetail: false,
        reorderLevel: 3,
        reorderQuantity: 6,
        initialStock: 5,
      },
      {
        skuCode: 'SCH-MAJ-060',
        barcode: '8906677889900',
        name: 'Schwarzkopf Igora Royal Color Tube',
        description: 'High definition permanent hair color with true-to-tuft results',
        categoryId: catHair.id,
        unitOfMeasure: '60 ml',
        costPrice: 420.0,
        retailPrice: 650.0,
        isConsumable: true,
        isRetail: false,
        reorderLevel: 15,
        reorderQuantity: 40,
        initialStock: 22,
      },
    ];

    for (const item of skus) {
      const sku = await prisma.inventorySku.upsert({
        where: {
          tenantId_skuCode: {
            tenantId,
            skuCode: item.skuCode,
          },
        },
        update: {
          name: item.name,
          barcode: item.barcode,
          description: item.description,
          categoryId: item.categoryId,
          unitOfMeasure: item.unitOfMeasure,
          costPrice: item.costPrice,
          retailPrice: item.retailPrice,
          isConsumable: item.isConsumable,
          isRetail: item.isRetail,
          reorderEnabled: true,
        },
        create: {
          tenantId,
          skuCode: item.skuCode,
          barcode: item.barcode,
          name: item.name,
          description: item.description,
          categoryId: item.categoryId,
          unitOfMeasure: item.unitOfMeasure,
          costPrice: item.costPrice,
          retailPrice: item.retailPrice,
          isConsumable: item.isConsumable,
          isRetail: item.isRetail,
          reorderEnabled: true,
        },
      });

      // Seed BranchStock
      await prisma.branchStock.upsert({
        where: {
          tenantId_branchId_skuId: {
            tenantId,
            branchId: defaultBranchId,
            skuId: sku.id,
          },
        },
        update: {
          quantityOnHandProjection: item.initialStock,
          quantityAvailableProjection: item.initialStock,
          reorderLevel: item.reorderLevel,
          reorderQuantity: item.reorderQuantity,
        },
        create: {
          tenantId,
          branchId: defaultBranchId,
          skuId: sku.id,
          quantityOnHandProjection: item.initialStock,
          quantityAvailableProjection: item.initialStock,
          quantityReservedProjection: 0,
          reorderLevel: item.reorderLevel,
          reorderQuantity: item.reorderQuantity,
        },
      });

      // Opening Stock Movement
      const existingMovement = await prisma.stockMovement.findFirst({
        where: {
          tenantId,
          branchId: defaultBranchId,
          skuId: sku.id,
          movementType: StockMovementType.OPENING,
        },
      });

      if (!existingMovement) {
        await prisma.stockMovement.create({
          data: {
            tenantId,
            branchId: defaultBranchId,
            skuId: sku.id,
            movementType: StockMovementType.OPENING,
            quantity: item.initialStock,
            unitCost: item.costPrice,
            referenceType: 'INITIAL_SEED',
            reason: 'Initial system seed stock allocation',
          },
        });
      }
    }

    // 3. Suppliers
    await prisma.supplier.upsert({
      where: {
        tenantId_supplierCode: {
          tenantId,
          supplierCode: 'SUP-LOREAL-DIST',
        },
      },
      update: {},
      create: {
        tenantId,
        supplierCode: 'SUP-LOREAL-DIST',
        legalName: 'L’Oréal India Distribution Pvt Ltd',
        displayName: 'L’Oréal Salon Direct',
        gstin: '27AABCL1234F1Z5',
        pan: 'AABCL1234F',
        email: 'orders@loreal-direct.in',
        phone: '+91 22 6789 0000',
        addressLine1: 'Peninsula Towers, Lower Parel',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400013',
      },
    });
  }

  console.log('Inventory Service database seeded successfully with comprehensive catalog.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
