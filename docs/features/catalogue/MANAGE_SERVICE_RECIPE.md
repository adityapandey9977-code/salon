# Feature: Manage Service Bill of Materials (BOM) / Recipe

## 1. Business Context & Overview
Defines professional inventory consumable quantities (e.g. shampoo, color tube grams, keratin solution ml) depleted per service execution.

## 2. Service Ownership
- **Owner**: `commerce-service`
- **Database**: `commerce_db` (table: `service_recipe_boms`, `service_bom_items`)

## 3. API Contract
- **Endpoint**: `POST /api/v1/services/:id/recipe`
- **Permissions**: `service.recipe.manage`
- **Request Body**:
```json
{
  "name": "Standard Hair Spa Formula",
  "items": [
    {
      "skuId": "9a0b1c2d-3e4f-5a6b-7c8d-9e0f1a2b3c4d",
      "quantityRequired": 30.0,
      "unit": "ML"
    }
  ]
}
```

## 4. Architecture & Persistence Flow
1. Upsert versioned `service_recipe_boms` record with items.
2. Invalidate `tenant:{tenantId}:service:{serviceId}:recipe`.
3. Publish `ServiceRecipeUpdated` event to RabbitMQ.
