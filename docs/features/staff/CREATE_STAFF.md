# Feature Guide: Create Staff & Employee Record

## 1. Overview
The `people-service` allows Salon Admins (via `TENANT` principal) and HR managers to create staff employee master records, initial professional profiles, and emergency contacts.

## 2. Distinction Between HR Employee vs Login-Enabled Staff
- **HR-only Employee**: An employee record with `identityUserId = null`. Used for staff members who do not require portal or mobile app access.
- **Login-enabled Employee**: An employee record linked via `identityUserId` to an authoritative user account in `identity-service`.

## 3. Endpoint Specifications
- **Method**: `POST`
- **Path**: `/api/v1/staff`
- **Permission**: `staff.create`
- **Headers**:
  - `x-tenant-id`: Tenant UUID
  - `x-principal-type`: `TENANT` or `USER`
  - `x-permissions`: `["staff.create"]`

### Request Body Example
```json
{
  "employeeCode": "EMP-101",
  "firstName": "Aarav",
  "lastName": "Sharma",
  "displayName": "Aarav Sharma",
  "email": "aarav.sharma@salon.local",
  "mobilePhone": "+919876543210",
  "gender": "MALE",
  "employmentStatus": "ACTIVE",
  "employmentType": "FULL_TIME",
  "joiningDate": "2026-09-04",
  "primaryBranchId": "22222222-2222-2222-2222-222222222222",
  "jobTitle": "Senior Hair Stylist",
  "department": "Hair Care",
  "profile": {
    "bio": "Specialist in advanced hair coloring and texture treatments.",
    "yearsOfExperience": 7.5,
    "specialization": "Balayage & Hair Spa",
    "commissionEligible": true,
    "acceptsOnlineBooking": true,
    "isBookable": true,
    "serviceCapacity": 1,
    "profileVisibility": "PUBLIC"
  },
  "emergencyContacts": [
    {
      "name": "Sunita Sharma",
      "relationship": "Spouse",
      "mobilePhone": "+919876543211"
    }
  ]
}
```

### Response Example
```json
{
  "success": true,
  "data": {
    "id": "44444444-4444-4444-4444-444444444444",
    "tenantId": "11111111-1111-1111-1111-111111111111",
    "employeeCode": "EMP-101",
    "displayName": "Aarav Sharma",
    "employmentStatus": "ACTIVE",
    "jobTitle": "Senior Hair Stylist",
    "createdAt": "2026-09-04T10:00:00.000Z"
  },
  "meta": {
    "correlationId": "d3b07384-d113-4a11-b0e6-a052b6d5f0e1"
  }
}
```

## 4. Domain Events Emitted
- `EMPLOYEE_CREATED.v1` (`EmployeeCreated`) published to RabbitMQ exchange `salon.events.topic` with routing key `people.employeecreated`.
