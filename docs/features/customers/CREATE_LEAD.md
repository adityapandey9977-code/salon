# Feature: Create Sales / Enquiry Lead

## 1. Business Context & Overview
Captures prospective inquiries from social media, campaigns, walk-ins, or telephonic enquiries into CRM funnel.

## 2. Service Ownership
- **Owner**: `customer-service`
- **Database**: `customer_db` (table: `leads`)

## 3. API Contract
- **Endpoint**: `POST /api/v1/customers/leads`
- **Permissions**: `lead.create`
- **Request Body**:
```json
{
  "firstName": "Rohan",
  "lastName": "Verma",
  "mobilePhone": "+919811223344",
  "email": "rohan.v@example.com",
  "source": "INSTAGRAM_CAMPAIGN",
  "interestedServiceId": "8b9e6f32-1111-4a23-bc99-23456789abcd",
  "preferredBranchId": "d3b07384-d113-4672-881b-801264c93591"
}
```

## 4. Architecture & Persistence Flow
1. Validate payload and phone format.
2. Persist in `leads` table with initial status `NEW`.
3. Publish `LeadCreated` event.
