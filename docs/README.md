#   Salon & Spa SaaS — Technical Documentation Hub

> **Comprehensive Architecture, Microservices Specifications, API Dictionaries, Data Schemas & Product Walkthroughs**

---

## 1. Documentation Structure & Map

```
docs/
├── README.md                                 # Master Documentation Hub (This File)
│
├── services/                                 # Dedicated Documentation for all 13 Services
│   ├── README.md                             # Services Map & Matrix
│   ├── api-gateway.md                        # API Gateway Ingress, Rate-limits & Routing
│   ├── identity-service.md                   # Identity, Auth, RBAC, Scopes & Sessions
│   ├── organization-service.md               # Brands, Franchises, Branches & Operating Hours
│   ├── people-service.md                     # Staff, Stylists, Shifts & Attendance
│   ├── customer-service.md                   # Client 360, Consultations & Loyalty
│   ├── booking-service.md                    # Appointments, Slots & State Machine
│   ├── commerce-service.md                   # Services Menu, Packages & Products
│   ├── payment-service.md                    # POS Billing, Split Tender & Invoices
│   ├── inventory-service.md                  # Stock Tracking, POs & Transfers
│   ├── finance-service.md                    # General Ledgers, Expenses & Payroll
│   ├── communication-service.md              # WhatsApp, SMS & Email Notifications
│   ├── platform-service.md                   # Multi-Tenant SaaS Subscriptions & Feature Flags
│   └── reporting-service.md                  # BI Dashboards, KPIs & Report Exports
│
├── architecture/                             # Core Architecture & Engineering Standards
│   ├── ARCHITECTURE_BACKEND.md               # Backend Monorepo & Microservices Guide
│   ├── agentic.md                            # Agentic Development Protocol
│   └── folder_structure.md                   # Repository Directory Topology
│
├── api-dictionaries/                         # Persona & Module API Endpoints Dictionaries
│   ├── DIGIFLEX_SALON_SAAS_MASTER_API_ENDPOINTS_DICTIONARY.md
│   ├── SUPER_ADMIN_MODULE_API_ENDPOINTS_DICTIONARY.md
│   ├── ADMIN_MODULE_API_ENDPOINTS_DICTIONARY.md
│   ├── BRANCH_MANAGER_MODULE_API_ENDPOINTS_DICTIONARY.md
│   ├── CALL_CENTER_MODULE_API_ENDPOINTS_DICTIONARY.md
│   ├── CLIENT_MODULE_API_ENDPOINTS_DICTIONARY.md
│   ├── FINANCE_MODULE_API_ENDPOINTS_DICTIONARY.md
│   ├── FRANCHISE_MODULE_API_ENDPOINTS_DICTIONARY.md
│   ├── INVENTORY_MODULE_API_ENDPOINTS_DICTIONARY.md
│   ├── STYLIST_MODULE_API_ENDPOINTS_DICTIONARY.md
│   └── LANDING_MODULE_API_ENDPOINTS_DICTIONARY.md
│
├── database-schemas/                         # Persona Data Schema & Dictionary Files
│   ├── ADMIN_PANEL_DATABASE_SCHEMA_DICTIONARY.md
│   ├── BRANCH_MANAGER_DATABASE_SCHEMA_DICTIONARY.md
│   ├── CALL_CENTER_PANEL_DATABASE_SCHEMA_DICTIONARY.md
│   ├── CLIENT_PANEL_DATABASE_SCHEMA_DICTIONARY.md
│   ├── FINANCE_HR_PANEL_DATABASE_SCHEMA_DICTIONARY.md
│   ├── FRANCHISE_PANEL_DATABASE_SCHEMA_DICTIONARY.md
│   ├── INVENTORY_PANEL_DATABASE_SCHEMA_DICTIONARY.md
│   ├── STYLIST_PANEL_DATABASE_SCHEMA_DICTIONARY.md
│   └── SUPER_ADMIN_DATABASE_SCHEMA_DICTIONARY.md
│
├── walkthroughs/                             # Module Walkthroughs & PDFs
│   ├── branch-manager/                       # Branch Manager PDF/HTML Walkthroughs
│   │   ├── Branch_Manager_Catalogue_Walkthrough.pdf
│   │   ├── Branch_Manager_Clients_Walkthrough.pdf
│   │   ├── Branch_Manager_Finance_Walkthrough.pdf
│   │   ├── Branch_Manager_Franchise_Walkthrough.pdf
│   │   ├── Branch_Manager_Inventory_Walkthrough.pdf
│   │   ├── Branch_Manager_Marketing_Walkthrough.pdf
│   │   ├── Branch_Manager_Operations_Walkthrough.pdf
│   │   ├── Branch_Manager_Packages_Walkthrough.pdf
│   │   ├── Branch_Manager_Reports_Walkthrough.pdf
│   │   ├── Branch_Manager_Roles_Walkthrough.pdf
│   │   ├── Branch_Manager_Settings_Walkthrough.pdf
│   │   ├── Branch_Manager_Staff_Walkthrough.pdf
│   │   └── Branch_Manager_UI_Walkthrough.pdf
│   └── mobile-app/                           # Customer App Walkthroughs & PRD
│       ├── Customer_Mobile_App_PDG_PRD_Walkthrough.pdf
│       └── Customer_Mobile_App_PDG_PRD_Documentation.md
│
└── specs/                                    # UI Integration & Microservices Specs
    ├── SuperAdmin_Frontend_UI_Integration_Spec.md
    └── SuperAdmin_Microservices_Architecture.md
```

---

## 2. Quick Navigation Links

### Backend Services
- [All 13 Microservices Overview](file:///e:/salon%20management%20system/ -Salon/docs/services/README.md)
- [API Gateway](file:///e:/salon%20management%20system/ -Salon/docs/services/api-gateway.md)
- [Identity Service](file:///e:/salon%20management%20system/ -Salon/docs/services/identity-service.md)
- [Organization Service](file:///e:/salon%20management%20system/ -Salon/docs/services/organization-service.md)
- [People Service](file:///e:/salon%20management%20system/ -Salon/docs/services/people-service.md)
- [Customer Service](file:///e:/salon%20management%20system/ -Salon/docs/services/customer-service.md)
- [Booking Service](file:///e:/salon%20management%20system/ -Salon/docs/services/booking-service.md)
- [Commerce Service](file:///e:/salon%20management%20system/ -Salon/docs/services/commerce-service.md)
- [Payment Service](file:///e:/salon%20management%20system/ -Salon/docs/services/payment-service.md)
- [Inventory Service](file:///e:/salon%20management%20system/ -Salon/docs/services/inventory-service.md)
- [Finance Service](file:///e:/salon%20management%20system/ -Salon/docs/services/finance-service.md)
- [Communication Service](file:///e:/salon%20management%20system/ -Salon/docs/services/communication-service.md)
- [Platform Service](file:///e:/salon%20management%20system/ -Salon/docs/services/platform-service.md)
- [Reporting Service](file:///e:/salon%20management%20system/ -Salon/docs/services/reporting-service.md)

### API Endpoints Dictionaries
- [Master API Endpoints Dictionary](file:///e:/salon%20management%20system/ -Salon/docs/api-dictionaries/DIGIFLEX_SALON_SAAS_MASTER_API_ENDPOINTS_DICTIONARY.md)
- [Super Admin Endpoints](file:///e:/salon%20management%20system/ -Salon/docs/api-dictionaries/SUPER_ADMIN_MODULE_API_ENDPOINTS_DICTIONARY.md)
- [Salon Brand Admin Endpoints](file:///e:/salon%20management%20system/ -Salon/docs/api-dictionaries/ADMIN_MODULE_API_ENDPOINTS_DICTIONARY.md)
- [Branch Manager Endpoints](file:///e:/salon%20management%20system/ -Salon/docs/api-dictionaries/BRANCH_MANAGER_MODULE_API_ENDPOINTS_DICTIONARY.md)

### Database Dictionaries
- [Super Admin Database Dictionary](file:///e:/salon%20management%20system/ -Salon/docs/database-schemas/SUPER_ADMIN_DATABASE_SCHEMA_DICTIONARY.md)
- [Brand Admin Database Dictionary](file:///e:/salon%20management%20system/ -Salon/docs/database-schemas/ADMIN_PANEL_DATABASE_SCHEMA_DICTIONARY.md)
- [Branch Manager Database Dictionary](file:///e:/salon%20management%20system/ -Salon/docs/database-schemas/BRANCH_MANAGER_DATABASE_SCHEMA_DICTIONARY.md)
