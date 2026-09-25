-- ==============================================================================
--   Salon & Spa SaaS - Database-Per-Service Initialization
-- Creates 12 independent logical databases with uuid extension support
-- ==============================================================================

-- 1. Identity Service Database
SELECT 'CREATE DATABASE identity_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'identity_db')\gexec

-- 2. Organization Service Database
SELECT 'CREATE DATABASE organization_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'organization_db')\gexec

-- 3. People Service Database
SELECT 'CREATE DATABASE people_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'people_db')\gexec

-- 4. Customer Service Database
SELECT 'CREATE DATABASE customer_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'customer_db')\gexec

-- 5. Booking Service Database
SELECT 'CREATE DATABASE booking_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'booking_db')\gexec

-- 6. Commerce Service Database
SELECT 'CREATE DATABASE commerce_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'commerce_db')\gexec

-- 7. Payment Service Database
SELECT 'CREATE DATABASE payment_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'payment_db')\gexec

-- 8. Inventory Service Database
SELECT 'CREATE DATABASE inventory_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'inventory_db')\gexec

-- 9. Finance Service Database
SELECT 'CREATE DATABASE finance_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'finance_db')\gexec

-- 10. Communication Service Database
SELECT 'CREATE DATABASE communication_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'communication_db')\gexec

-- 11. Platform Service Database
SELECT 'CREATE DATABASE platform_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'platform_db')\gexec

-- 12. Reporting Service Database
SELECT 'CREATE DATABASE reporting_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'reporting_db')\gexec

-- Connect to each database and enable uuid-ossp extension
\c identity_db CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\c organization_db CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\c people_db CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\c customer_db CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\c booking_db CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\c commerce_db CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\c payment_db CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\c inventory_db CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\c finance_db CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\c communication_db CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\c platform_db CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\c reporting_db CREATE EXTENSION IF NOT EXISTS "uuid-ossp";