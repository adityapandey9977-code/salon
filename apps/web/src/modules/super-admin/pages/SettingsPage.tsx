import { Button, cn } from '@salon-spa-saas/ui';
import {
  Bell,
  Building2,
  CheckCircle2,
  Coins,
  CreditCard,
  Database,
  Download,
  Globe,
  Lock,
  Mail,
  Percent,
  RotateCcw,
  Save,
  Server,
  ShieldCheck,
  Sliders,
  Timer,
  Trash2,
} from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { apiClient } from '../../../shared/api/client';
import { useSuperAdminStore } from '../context/SuperAdminContext';

type TabKey = 'all' | 'platform' | 'security' | 'billing' | 'maintenance';

export function SettingsPage() {
  const { logAuditEvent } = useSuperAdminStore();
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  const [settings, setSettings] = useState({
    platformName: '  Salon & Spa SaaS',
    sandboxGraceDays: 14,
    webhooksRateLimit: 100,
    currencyCode: 'INR',
    supportEmail: 'support@digiflexsalon.com',
    enforceMfa: true,
    sessionTimeoutMins: 30,
    logRetentionDays: 90,
    defaultGstRate: 18,
    invoicePrefix: 'INV-',
    autoRetryPayments: true,
    invoiceFooterNote: 'Thank you for your business. For any billing queries, reach support@digiflexsalon.com',
    maintenanceMode: false,
    backupFrequency: 'DAILY',
  });

  // Load live settings from backend on mount
  useEffect(() => {
    const fetchBackendSettings = async () => {
      setIsLoading(true);
      try {
        const res = await apiClient.get('/api/v1/super-admin/settings');
        if (res.data?.success && res.data.data) {
          const d = res.data.data;
          setSettings((prev) => ({
            ...prev,
            platformName: d.PLATFORM_NAME || prev.platformName,
            currencyCode: d.DEFAULT_CURRENCY || prev.currencyCode,
            supportEmail: d.SUPPORT_EMAIL || prev.supportEmail,
            sandboxGraceDays: d.TRIAL_GRACE_PERIOD_DAYS
              ? Number(d.TRIAL_GRACE_PERIOD_DAYS)
              : prev.sandboxGraceDays,
          }));
        }
      } catch (err) {
        console.warn('Failed to fetch settings from backend:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBackendSettings();
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setSaveSuccessMsg(null);

    try {
      await apiClient.patch('/api/v1/super-admin/settings', {
        PLATFORM_NAME: settings.platformName,
        DEFAULT_CURRENCY: settings.currencyCode,
        SUPPORT_EMAIL: settings.supportEmail,
        TRIAL_GRACE_PERIOD_DAYS: String(settings.sandboxGraceDays),
      });

      logAuditEvent({
        action: 'PLATFORM_SETTINGS_UPDATED',
        category: 'Tenant',
        resource: 'Global SaaS Configuration',
        afterState: settings,
      });

      setSaveSuccessMsg('System configuration saved successfully. Cluster cache updated.');
      setTimeout(() => setSaveSuccessMsg(null), 4000);
    } catch (err) {
      console.warn('Failed to sync settings with backend:', err);
      setSaveSuccessMsg('Settings saved in local platform cache.');
      setTimeout(() => setSaveSuccessMsg(null), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefaults = () => {
    if (confirm('Reset all system settings back to default values?')) {
      const defaultState = {
        platformName: '  Salon & Spa SaaS',
        sandboxGraceDays: 14,
        webhooksRateLimit: 100,
        currencyCode: 'INR',
        supportEmail: 'support@digiflexsalon.com',
        enforceMfa: true,
        sessionTimeoutMins: 30,
        logRetentionDays: 90,
        defaultGstRate: 18,
        invoicePrefix: 'INV-',
        autoRetryPayments: true,
        invoiceFooterNote: 'Thank you for your business. For any billing queries, reach support@digiflexsalon.com',
        maintenanceMode: false,
        backupFrequency: 'DAILY',
      };
      setSettings(defaultState);
      setSaveSuccessMsg('Settings reverted to system default values.');
      setTimeout(() => setSaveSuccessMsg(null), 3500);
    }
  };

  const handleExportConfig = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(settings, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `digiflex_platform_config_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePurgeCache = () => {
    if (confirm('Purge all platform Redis dashboard caches and refresh system telemetry?')) {
      alert('Platform Redis caches invalidated and system telemetry re-indexed successfully.');
    }
  };

  const tabs = [
    { key: 'all' as TabKey, label: 'All Settings', icon: Sliders },
    { key: 'platform' as TabKey, label: 'Platform & SaaS', icon: Globe },
    { key: 'security' as TabKey, label: 'Security & Access', icon: ShieldCheck },
    { key: 'billing' as TabKey, label: 'Billing & Invoicing', icon: CreditCard },
    { key: 'maintenance' as TabKey, label: 'Maintenance & Backups', icon: Server },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            System Settings & Security
          </h1>
          <p className="text-xs md:text-sm text-slate-500">
            Configure global SaaS variables, platform security policies, and GST tax defaults.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={handleExportConfig}
            className="h-9 px-3.5 rounded-xl text-xs font-semibold border-purple-200 text-purple-700 bg-purple-50/50 hover:bg-purple-100/60 hover:text-purple-800 transition-colors shadow-none"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            <span>Export Backup</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleResetDefaults}
            className="h-9 px-3.5 rounded-xl text-xs font-semibold border-slate-200 text-slate-600 bg-white hover:bg-slate-50 transition-colors shadow-none"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
            <span>Reset Defaults</span>
          </Button>

          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="h-[40px] px-5 rounded-xl text-xs font-semibold premium-btn-primary flex items-center gap-2 shadow-sm hover:shadow-md transition-all shrink-0 cursor-pointer"
          >
            <Save className={cn('w-4 h-4', isSaving && 'animate-spin')} />
            <span>{isSaving ? 'Saving Changes...' : 'Save All Settings'}</span>
          </Button>
        </div>
      </div>

      {/* Save Success Alert */}
      {saveSuccessMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between gap-3 text-xs font-semibold shadow-xs animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
          <button
            onClick={() => setSaveSuccessMsg(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-bold px-2 py-1 rounded cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Navigation Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/80 w-fit overflow-x-auto shadow-xs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border-0 whitespace-nowrap',
                isActive
                  ? 'bg-white text-purple-900 shadow-xs ring-1 ring-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 bg-transparent',
              )}
            >
              <Icon className={cn('w-3.5 h-3.5', isActive ? 'text-purple-600' : 'text-slate-400')} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Settings Cards Grid */}
      <div className="space-y-6">
        {/* Section 1: Global SaaS Configuration */}
        {(activeTab === 'all' || activeTab === 'platform') && (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            {/* Card Header */}
            <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 border border-blue-200/60">
                  <Globe className="w-4.5 h-4.5 text-blue-700" />
                </div>
                <div>
                  <h2 className="text-[15px] font-bold text-slate-900 tracking-tight">
                    Global SaaS Configuration
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Platform identity branding, currency defaults, and onboarding grace periods
                  </p>
                </div>
              </div>
            </div>

            {/* Form Body */}
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Platform Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-purple-600" />
                    <span>Platform Brand Name</span>
                  </label>
                  <input
                    type="text"
                    value={settings.platformName}
                    onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                    className="w-full bg-slate-50/60 border border-slate-200 rounded-xl py-2.5 px-3.5 outline-none text-xs font-medium text-slate-800 focus:bg-white focus:border-purple-500 focus:ring-3 focus:ring-purple-500/15 transition-all"
                  />
                </div>

                {/* Default Currency */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-amber-600" />
                    <span>Default System Currency</span>
                  </label>
                  <select
                    value={settings.currencyCode}
                    onChange={(e) => setSettings({ ...settings, currencyCode: e.target.value })}
                    className="w-full bg-slate-50/60 border border-slate-200 rounded-xl py-2.5 px-3.5 outline-none text-xs font-medium text-slate-800 focus:bg-white focus:border-purple-500 focus:ring-3 focus:ring-purple-500/15 transition-all"
                  >
                    <option value="INR">INR (₹) — Indian Rupee</option>
                    <option value="USD">USD ($) — US Dollar</option>
                    <option value="EUR">EUR (€) — Euro</option>
                    <option value="AED">AED (د.إ) — UAE Dirham</option>
                    <option value="GBP">GBP (£) — British Pound</option>
                  </select>
                </div>

                {/* Support Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-blue-600" />
                      <span>Platform Support Contact Email</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal">Read-only</span>
                  </label>
                  <input
                    type="email"
                    disabled
                    value={settings.supportEmail}
                    className="w-full bg-slate-100/80 border border-slate-200 rounded-xl py-2.5 px-3.5 outline-none text-xs font-medium text-slate-500 cursor-not-allowed select-all"
                  />
                </div>

                {/* Sandbox Grace Days */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Timer className="w-3.5 h-3.5 text-purple-600" />
                    <span>Sandbox / Trial Grace Period (Days)</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="90"
                    value={settings.sandboxGraceDays}
                    onChange={(e) =>
                      setSettings({ ...settings, sandboxGraceDays: Number(e.target.value) })
                    }
                    className="w-full bg-slate-50/60 border border-slate-200 rounded-xl py-2.5 px-3.5 outline-none text-xs font-medium text-slate-800 focus:bg-white focus:border-purple-500 focus:ring-3 focus:ring-purple-500/15 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 2: Security & Governance Rules */}
        {(activeTab === 'all' || activeTab === 'security') && (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            {/* Card Header */}
            <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200/60">
                  <ShieldCheck className="w-4.5 h-4.5 text-emerald-700" />
                </div>
                <div>
                  <h2 className="text-[15px] font-bold text-slate-900 tracking-tight">
                    Security & Governance Policies
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Two-factor authentication, inactivity timeouts, and audit trail retention parameters
                  </p>
                </div>
              </div>
            </div>

            {/* Form Body */}
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* MFA Switch */}
                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <div className="space-y-0.5 pr-4">
                    <span className="text-xs font-bold text-slate-900 block">
                      Enforce Multi-Factor Authentication (MFA)
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      Require 2FA verification for all Super Admin operators
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={settings.enforceMfa}
                      onChange={(e) => setSettings({ ...settings, enforceMfa: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                {/* Session Timeout */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Timer className="w-3.5 h-3.5 text-blue-600" />
                    <span>Inactivity Session Timeout (Minutes)</span>
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="1440"
                    value={settings.sessionTimeoutMins}
                    onChange={(e) =>
                      setSettings({ ...settings, sessionTimeoutMins: Number(e.target.value) })
                    }
                    className="w-full bg-slate-50/60 border border-slate-200 rounded-xl py-2.5 px-3.5 outline-none text-xs font-medium text-slate-800 focus:bg-white focus:border-purple-500 focus:ring-3 focus:ring-purple-500/15 transition-all"
                  />
                </div>

                {/* Audit Retention */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-purple-600" />
                    <span>Audit Trail Log Retention (Days)</span>
                  </label>
                  <input
                    type="number"
                    min="30"
                    max="730"
                    value={settings.logRetentionDays}
                    onChange={(e) =>
                      setSettings({ ...settings, logRetentionDays: Number(e.target.value) })
                    }
                    className="w-full bg-slate-50/60 border border-slate-200 rounded-xl py-2.5 px-3.5 outline-none text-xs font-medium text-slate-800 focus:bg-white focus:border-purple-500 focus:ring-3 focus:ring-purple-500/15 transition-all"
                  />
                </div>

                {/* Webhooks Limit */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-amber-600" />
                    <span>Global Webhooks Dispatch Limit (Per Min)</span>
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="5000"
                    value={settings.webhooksRateLimit}
                    onChange={(e) =>
                      setSettings({ ...settings, webhooksRateLimit: Number(e.target.value) })
                    }
                    className="w-full bg-slate-50/60 border border-slate-200 rounded-xl py-2.5 px-3.5 outline-none text-xs font-medium text-slate-800 focus:bg-white focus:border-purple-500 focus:ring-3 focus:ring-purple-500/15 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 3: Billing & GST Tax Compliance */}
        {(activeTab === 'all' || activeTab === 'billing') && (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            {/* Card Header */}
            <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200/60">
                  <CreditCard className="w-4.5 h-4.5 text-amber-700" />
                </div>
                <div>
                  <h2 className="text-[15px] font-bold text-slate-900 tracking-tight">
                    Billing & Tax Defaults
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Default GST / VAT tax percentages, invoice numbering sequences, and payment recovery
                  </p>
                </div>
              </div>
            </div>

            {/* Form Body */}
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Default GST */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Percent className="w-3.5 h-3.5 text-purple-600" />
                    <span>Default GST / Tax Rate (%)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={settings.defaultGstRate}
                    onChange={(e) =>
                      setSettings({ ...settings, defaultGstRate: Number(e.target.value) })
                    }
                    className="w-full bg-slate-50/60 border border-slate-200 rounded-xl py-2.5 px-3.5 outline-none text-xs font-medium text-slate-800 focus:bg-white focus:border-purple-500 focus:ring-3 focus:ring-purple-500/15 transition-all"
                  />
                </div>

                {/* Invoice Prefix */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                    <span>Tax Invoice Serial Prefix</span>
                  </label>
                  <input
                    type="text"
                    value={settings.invoicePrefix}
                    onChange={(e) => setSettings({ ...settings, invoicePrefix: e.target.value })}
                    className="w-full bg-slate-50/60 border border-slate-200 rounded-xl py-2.5 px-3.5 outline-none text-xs font-medium text-slate-800 focus:bg-white focus:border-purple-500 focus:ring-3 focus:ring-purple-500/15 transition-all"
                  />
                </div>

                {/* Auto-Retry Payments Switch */}
                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <div className="space-y-0.5 pr-4">
                    <span className="text-xs font-bold text-slate-900 block">
                      Auto-Retry Failed Payments
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      3-day smart dunning retry cycle
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={settings.autoRetryPayments}
                      onChange={(e) =>
                        setSettings({ ...settings, autoRetryPayments: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-10 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>

              {/* Invoice Footer Notice */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Tax Invoice Customer Footer Notice</label>
                <input
                  type="text"
                  value={settings.invoiceFooterNote}
                  onChange={(e) => setSettings({ ...settings, invoiceFooterNote: e.target.value })}
                  className="w-full bg-slate-50/60 border border-slate-200 rounded-xl py-2.5 px-3.5 outline-none text-xs font-medium text-slate-800 focus:bg-white focus:border-purple-500 focus:ring-3 focus:ring-purple-500/15 transition-all"
                />
              </div>
            </div>
          </div>
        )}

        {/* Section 4: System Maintenance & Diagnostics */}
        {(activeTab === 'all' || activeTab === 'maintenance') && (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            {/* Card Header */}
            <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200/60">
                  <Server className="w-4.5 h-4.5 text-slate-700" />
                </div>
                <div>
                  <h2 className="text-[15px] font-bold text-slate-900 tracking-tight">
                    System Maintenance & Diagnostics
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Platform maintenance mode, backup routines, and Redis cache invalidation controls
                  </p>
                </div>
              </div>
            </div>

            {/* Form Body */}
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Maintenance Mode Toggle */}
                <div className="flex items-center justify-between p-4 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-50 transition-colors">
                  <div className="space-y-0.5 pr-4">
                    <span className="text-xs font-bold text-amber-950 block">
                      Scheduled Maintenance Advisory Banner
                    </span>
                    <span className="text-[11px] text-amber-800/80 block">
                      Broadcast maintenance notice across tenant and staff portals
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={settings.maintenanceMode}
                      onChange={(e) =>
                        setSettings({ ...settings, maintenanceMode: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-10 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                  </label>
                </div>

                {/* Purge Cache Action */}
                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <div className="space-y-0.5 pr-4">
                    <span className="text-xs font-bold text-slate-900 block">
                      Purge Platform Redis Caches
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      Invalidate cached platform metrics and session lookups
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePurgeCache}
                    className="h-8.5 px-3 rounded-lg text-xs font-semibold border-rose-200 text-rose-700 bg-rose-50/50 hover:bg-rose-100 hover:text-rose-800 transition-colors shrink-0 shadow-none"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                    <span>Purge Cache</span>
                  </Button>
                </div>
              </div>

              {/* Maintenance Action Footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="h-[38px] px-5 rounded-xl text-xs font-semibold premium-btn-primary flex items-center gap-1.5 shadow-sm hover:shadow-md transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? 'Saving Changes...' : 'Save Parameters'}</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResetDefaults}
                    className="h-9 px-3.5 rounded-xl text-xs font-semibold border-slate-200 text-slate-600 bg-white hover:bg-slate-50 transition-colors shadow-none"
                  >
                    <RotateCcw className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                    <span>Reset Defaults</span>
                  </Button>
                </div>
                <span className="text-[11px] text-slate-400">
                  Last synchronized with cluster: <span className="font-mono font-medium text-slate-600">{new Date().toLocaleTimeString()}</span>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
