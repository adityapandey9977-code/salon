import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';

export const dashboardRouter: Router = Router();

// Tenant & Branch Dashboards
dashboardRouter.get('/dashboard/metrics', DashboardController.getMetrics);
dashboardRouter.get('/dashboard/charts', DashboardController.getCharts);
dashboardRouter.get('/dashboard/occupancy', DashboardController.getOccupancy);
dashboardRouter.get('/dashboard/recent-activity', DashboardController.getRecentActivity);
dashboardRouter.get('/dashboard/branch-kpis', DashboardController.getBranchKpis);
dashboardRouter.get('/dashboard/call-center-kpis', DashboardController.getCallCenterKpis);
dashboardRouter.get('/branches/analytics/comparison', DashboardController.getBranchComparison);

// Inventory Dashboard KPIs
dashboardRouter.get('/inventory/dashboard-kpis', DashboardController.getInventoryDashboardKpis);

// Franchise Dashboards
dashboardRouter.get('/tenant/franchise/dashboard-kpis', DashboardController.getFranchiseDashboardKpis);
dashboardRouter.get('/tenant/franchise/sales-trend', DashboardController.getFranchiseSalesTrend);
dashboardRouter.get('/tenant/franchise/sales-summary', DashboardController.getFranchiseSalesSummary);
dashboardRouter.get('/tenant/franchise/staff-summary', DashboardController.getFranchiseStaffSummary);
dashboardRouter.get('/tenant/franchise/inventory-summary', DashboardController.getFranchiseInventorySummary);
