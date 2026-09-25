import { Request, Response, NextFunction } from 'express';
import { AccountService } from '../../application/services/account.service';
import { JournalService } from '../../application/services/journal.service';
import { CommissionService } from '../../application/services/commission.service';
import { FinanceReadStore } from '../../infrastructure/redis/finance-read.store';

const accountService = new AccountService();
const journalService = new JournalService();
const commissionService = new CommissionService();
const cache = new FinanceReadStore();

export class FinanceController {
  private static getTenantId(req: Request): string {
    const tenantId = (req as any).user?.tenantId || (req as any).auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) {
      throw new Error('Tenant ID required');
    }
    return tenantId;
  }

  // Finance Overview & Corporate KPIs
  static async getOverview(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = FinanceController.getTenantId(req);
      const period = (req.query.period as string) || 'current-month';

      const cached = await cache.getOverview(tenantId, period);
      if (cached) {
        res.json({ success: true, data: cached });
        return;
      }

      const journals = await journalService.listJournals(tenantId, { take: 100 });
      let totalRevenue = 0;
      let totalExpenses = 0;

      for (const j of journals.items) {
        for (const l of j.lines) {
          if (l.account.type === 'REVENUE') totalRevenue += Number(l.credit) - Number(l.debit);
          if (l.account.type === 'EXPENSE') totalExpenses += Number(l.debit) - Number(l.credit);
        }
      }

      const netProfit = totalRevenue - totalExpenses;
      const profitMargin = totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 1000) / 10 : 0;

      const overview = {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalExpenses: Math.round(totalExpenses * 100) / 100,
        netProfit: Math.round(netProfit * 100) / 100,
        profitMargin,
        cashInBank: 145000.0,
        outstandingReceivables: 12400.0,
        accountsPayable: 8500.0,
      };

      await cache.setOverview(tenantId, period, overview, 300);
      res.json({ success: true, data: overview });
    } catch (err) {
      next(err);
    }
  }

  static async getCorporateKpis(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = FinanceController.getTenantId(req);
      res.json({
        success: true,
        data: {
          tenantId,
          grossMargin: 74.5,
          ebitda: 185000.0,
          currentRatio: 2.1,
          burnRate: 35000.0,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async getCashflowTrend(req: Request, res: Response, next: NextFunction) {
    try {
      res.json({
        success: true,
        data: [
          { month: 'Jan', inflow: 120000, outflow: 80000, net: 40000 },
          { month: 'Feb', inflow: 145000, outflow: 92000, net: 53000 },
          { month: 'Mar', inflow: 168000, outflow: 99000, net: 69000 },
        ],
      });
    } catch (err) {
      next(err);
    }
  }

  static async getProfitabilityMatrix(req: Request, res: Response, next: NextFunction) {
    try {
      res.json({
        success: true,
        data: {
          servicesMargin: 82.0,
          retailMargin: 45.0,
          overallMargin: 71.5,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async getGstReturn(req: Request, res: Response, next: NextFunction) {
    try {
      res.json({
        success: true,
        data: {
          period: 'GSTR-3B Current Quarter',
          outwardTaxableSupplies: 450000.0,
          cgst: 40500.0,
          sgst: 40500.0,
          igst: 0.0,
          totalTaxLiability: 81000.0,
          itcAvailable: 24500.0,
          netTaxPayableInCash: 56500.0,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  // Chart of Accounts
  static async listAccounts(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = FinanceController.getTenantId(req);
      const type = req.query.type as any;
      const accounts = await accountService.listAccounts(tenantId, type);
      res.json({ success: true, data: accounts });
    } catch (err) {
      next(err);
    }
  }

  static async createAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = FinanceController.getTenantId(req);
      const account = await accountService.createAccount(tenantId, req.body);
      res.status(201).json({ success: true, data: account });
    } catch (err) {
      next(err);
    }
  }

  // Journals
  static async listJournals(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = FinanceController.getTenantId(req);
      const journals = await journalService.listJournals(tenantId, req.query);
      res.json({ success: true, data: journals });
    } catch (err) {
      next(err);
    }
  }

  static async createJournal(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = FinanceController.getTenantId(req);
      const journal = await journalService.postJournal(tenantId, req.body);
      res.status(201).json({ success: true, data: journal });
    } catch (err) {
      next(err);
    }
  }

  static async postJournal(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = FinanceController.getTenantId(req);
      const journal = await journalService.postJournal(tenantId, req.body);
      res.json({ success: true, data: journal });
    } catch (err) {
      next(err);
    }
  }

  // Commission Tiers & Staff Commissions
  static async getCommissionTiers(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = FinanceController.getTenantId(req);
      const rules = await commissionService.listRules(tenantId);
      res.json({ success: true, data: rules });
    } catch (err) {
      next(err);
    }
  }

  static async updateCommissionTiers(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = FinanceController.getTenantId(req);
      const rule = await commissionService.upsertRule({ tenantId, ...req.body });
      res.json({ success: true, data: rule });
    } catch (err) {
      next(err);
    }
  }

  static async getStaffCommissions(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = FinanceController.getTenantId(req);
      const employeeId = req.query.employeeId as string | undefined;
      const commissions = await commissionService.listStaffCommissions(tenantId, { employeeId });
      res.json({ success: true, data: commissions });
    } catch (err) {
      next(err);
    }
  }
}
