import { Router } from 'express';
import { FinanceController } from '../controllers/finance.controller';

const router: Router = Router();

// Overview & KPIs
router.get('/overview', FinanceController.getOverview);
router.get('/corporate-kpis', FinanceController.getCorporateKpis);
router.get('/cashflow-trend', FinanceController.getCashflowTrend);
router.get('/profitability/matrix', FinanceController.getProfitabilityMatrix);
router.get('/tax/gst-return', FinanceController.getGstReturn);

// Chart of Accounts
router.get('/accounts', FinanceController.listAccounts);
router.post('/accounts', FinanceController.createAccount);

// Journals
router.get('/journals', FinanceController.listJournals);
router.post('/journals', FinanceController.createJournal);
router.post('/journals/:id/post', FinanceController.postJournal);

// Commissions
router.get('/commissions/tiers', FinanceController.getCommissionTiers);
router.put('/commissions/tiers', FinanceController.updateCommissionTiers);

export { router as financeRoutes };
