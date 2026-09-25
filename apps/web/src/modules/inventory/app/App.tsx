import { AppLayout } from '@/shared/layouts/AppLayout/AppLayout';
import { ProtectedRoute } from '@/shared/components/ProtectedRoute';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import { InventoryBranchProvider } from '../context/InventoryBranchContext';
import { InventorySidebar } from '../layouts/Sidebar/Sidebar';

import { AlertsPage } from '../pages/AlertsPage';
import { AuditPage } from '../pages/AuditPage';
import { ConsumptionPage } from '../pages/ConsumptionPage';
import { DashboardPage } from '../pages/DashboardPage';
import { GoodsReceiptPage } from '../pages/GoodsReceiptPage';
import { NotificationsPage } from '../pages/NotificationsPage';
import { ProductsPage } from '../pages/ProductsPage';
import { ProfilePage } from '../pages/ProfilePage';
import { PurchasesPage } from '../pages/PurchasesPage';
import { ReportsPage } from '../pages/ReportsPage';
import { ServiceRecipesPage } from '../pages/ServiceRecipesPage';
import { StockPage } from '../pages/StockPage';
import { SuppliersPage } from '../pages/SuppliersPage';
import { TransfersPage } from '../pages/TransfersPage';

export function InventoryApp() {
  return (
    <InventoryBranchProvider>
      <BrowserRouter basename="/inventory">
        <Routes>
          <Route element={<ProtectedRoute allowedRoles={['INVENTORY_MANAGER', 'TENANT_ADMIN', 'SALON_ADMIN']} loginPath="/inventory/login" />}>
            <Route path="/" element={<AppLayout sidebar={<InventorySidebar />} />}>
            <Route index element={<DashboardPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="recipes" element={<ServiceRecipesPage />} />
            <Route path="suppliers" element={<SuppliersPage />} />
            <Route path="purchases" element={<PurchasesPage />} />
            <Route path="goods-receipt" element={<GoodsReceiptPage />} />
            <Route path="stock" element={<StockPage />} />
            <Route path="transfers" element={<TransfersPage />} />
            <Route path="consumption" element={<ConsumptionPage />} />
            <Route path="audit" element={<AuditPage />} />
            <Route path="alerts" element={<AlertsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </InventoryBranchProvider>
  );
}

export default InventoryApp;
