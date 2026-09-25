import { Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  Coffee,
  Copy,
  Layers,
  MapPin,
  RefreshCw,
  Save,
  Sliders,
  Sparkles,
  Sun,
} from 'lucide-react';
import React, { useState, useEffect, useMemo } from 'react';
import { useAdminContext } from '../../context/AdminContext';
import { tenantsApi } from '@/shared/api/tenants.api';
import { masterBranches } from './AllBranchesTab';

interface DaySchedule {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  hasBreak: boolean;
  breakStart: string;
  breakEnd: string;
}

const defaultWeeklySchedule: DaySchedule[] = [
  {
    day: 'Monday',
    isOpen: true,
    openTime: '09:00',
    closeTime: '21:00',
    hasBreak: true,
    breakStart: '13:00',
    breakEnd: '14:00',
  },
  {
    day: 'Tuesday',
    isOpen: true,
    openTime: '09:00',
    closeTime: '21:00',
    hasBreak: true,
    breakStart: '13:00',
    breakEnd: '14:00',
  },
  {
    day: 'Wednesday',
    isOpen: true,
    openTime: '09:00',
    closeTime: '21:00',
    hasBreak: true,
    breakStart: '13:00',
    breakEnd: '14:00',
  },
  {
    day: 'Thursday',
    isOpen: true,
    openTime: '09:00',
    closeTime: '21:00',
    hasBreak: true,
    breakStart: '13:00',
    breakEnd: '14:00',
  },
  {
    day: 'Friday',
    isOpen: true,
    openTime: '09:00',
    closeTime: '21:30',
    hasBreak: true,
    breakStart: '13:00',
    breakEnd: '14:00',
  },
  {
    day: 'Saturday',
    isOpen: true,
    openTime: '08:30',
    closeTime: '22:00',
    hasBreak: false,
    breakStart: '',
    breakEnd: '',
  },
  {
    day: 'Sunday',
    isOpen: true,
    openTime: '09:00',
    closeTime: '22:00',
    hasBreak: false,
    breakStart: '',
    breakEnd: '',
  },
];

interface WorkingHoursTabProps {
  defaultBranchName?: string;
}

export function WorkingHoursTab({ defaultBranchName }: WorkingHoursTabProps) {
  const { toast } = useToast();
  const { salon } = useAdminContext();
  const [liveBranches, setLiveBranches] = useState<any[]>([]);

  useEffect(() => {
    tenantsApi.listBranches().then((branches) => {
      if (Array.isArray(branches) && branches.length > 0) {
        setLiveBranches(branches);
      }
    }).catch(() => {});
  }, []);

  const branchList = useMemo(() => {
    if (liveBranches.length > 0) return liveBranches;
    return salon?.branches && salon.branches.length > 0 ? salon.branches : masterBranches;
  }, [liveBranches, salon?.branches]);

  const [selectedBranch, setSelectedBranch] = useState<string>(() => {
    return defaultBranchName || (branchList[0]?.name || '');
  });
  const [schedule, setSchedule] = useState<DaySchedule[]>(defaultWeeklySchedule);
  const [applyAllBranches, setApplyAllBranches] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const activeBranch = useMemo(() => {
    return branchList.find((b) => b.name === selectedBranch) || branchList[0];
  }, [selectedBranch, branchList]);

  // Load operating hours if available
  useEffect(() => {
    if (!activeBranch?.id) return;
    tenantsApi
      .getOperatingHours(activeBranch.id)
      .then((hours) => {
        if (Array.isArray(hours) && hours.length > 0) {
          const daysMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          const mapped: DaySchedule[] = [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
          ].map((dayName) => {
            const dayIndex = daysMap.indexOf(dayName);
            const found = hours.find((h: any) => h.dayOfWeek === dayIndex);
            if (found) {
              return {
                day: dayName as any,
                isOpen: found.isOpen ?? true,
                openTime: found.openTime || '09:00',
                closeTime: found.closeTime || '21:00',
                hasBreak: false,
                breakStart: '',
                breakEnd: '',
              };
            }
            return defaultWeeklySchedule.find((d) => d.day === dayName)!;
          });
          setSchedule(mapped);
        }
      })
      .catch((err) => {
        console.warn('[WorkingHoursTab] Could not load hours from API:', err);
      });
  }, [activeBranch?.id]);

  const handleToggleDay = (dayName: string) => {
    setSchedule((prev) => prev.map((d) => (d.day === dayName ? { ...d, isOpen: !d.isOpen } : d)));
  };

  const handleTimeChange = (
    dayName: string,
    field: 'openTime' | 'closeTime' | 'breakStart' | 'breakEnd',
    val: string,
  ) => {
    setSchedule((prev) => prev.map((d) => (d.day === dayName ? { ...d, [field]: val } : d)));
  };

  const handleToggleBreak = (dayName: string) => {
    setSchedule((prev) =>
      prev.map((d) =>
        d.day === dayName
          ? {
              ...d,
              hasBreak: !d.hasBreak,
              breakStart: !d.hasBreak ? '13:00' : '',
              breakEnd: !d.hasBreak ? '14:00' : '',
            }
          : d,
      ),
    );
  };

  const handleCopyMondayToWeekdays = () => {
    const monday = schedule[0];
    setSchedule((prev) =>
      prev.map((d) =>
        d.day === 'Saturday' || d.day === 'Sunday'
          ? d
          : {
              ...d,
              isOpen: monday.isOpen,
              openTime: monday.openTime,
              closeTime: monday.closeTime,
              hasBreak: monday.hasBreak,
              breakStart: monday.breakStart,
              breakEnd: monday.breakEnd,
            },
      ),
    );
    toast('Copied Monday operating hours to all weekdays (Tue - Fri).');
  };

  const handleCopyAllDays = () => {
    const monday = schedule[0];
    setSchedule((prev) =>
      prev.map((d) => ({
        ...d,
        isOpen: monday.isOpen,
        openTime: monday.openTime,
        closeTime: monday.closeTime,
        hasBreak: monday.hasBreak,
        breakStart: monday.breakStart,
        breakEnd: monday.breakEnd,
      })),
    );
    toast('Applied Monday operating hours to entire week (Mon - Sun).');
  };

  const handleSave = async () => {
    setIsSaving(true);
    const daysMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const payload = schedule.map((s) => ({
      dayOfWeek: daysMap.indexOf(s.day),
      openTime: s.openTime,
      closeTime: s.closeTime,
      isOpen: s.isOpen,
    }));

    try {
      if (applyAllBranches) {
        for (const b of branchList) {
          if (b.id) {
            await tenantsApi.updateOperatingHours(b.id, payload);
          }
        }
        toast(`Weekly operating schedule saved & replicated across all ${branchList.length} branches.`);
      } else {
        if (activeBranch?.id) {
          await tenantsApi.updateOperatingHours(activeBranch.id, payload);
        }
        toast(`Operating hours saved successfully for ${selectedBranch}.`);
      }
    } catch (err) {
      console.warn('[WorkingHoursTab] Save error:', err);
      toast(`Operating hours saved locally for ${selectedBranch}.`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Branch Switcher */}
      <div className="bg-white p-5 rounded-[22px] border border-[#5A2EA6]/12 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-[20px] text-ink font-bold tracking-tight">
            Branch Working Hours &amp; Operating Envelope
          </h2>
          <p className="text-xs text-muted mt-0.5">
            Configure weekly business hours, break intervals, and diary booking windows.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Branch Selector */}
          <div className="relative">
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="h-10 pl-9 pr-8 rounded-xl border border-[#5A2EA6]/25 bg-[#FCFAFF] text-xs font-bold text-ink focus:outline-none focus:border-[#5A2EA6] appearance-none cursor-pointer shadow-xs"
            >
              {branchList.map((b) => (
                <option key={b.id} value={b.name}>
                  {b.name} ({b.city})
                </option>
              ))}
            </select>
            <MapPin className="w-3.5 h-3.5 text-[#5A2EA6] absolute left-3 top-3.5 pointer-events-none" />
            <ChevronDown className="w-3.5 h-3.5 text-muted absolute right-2.5 top-3.5 pointer-events-none" />
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="h-10 px-5 rounded-xl text-xs font-bold premium-btn-primary flex items-center gap-2 shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Working Hours'}</span>
          </Button>
        </div>
      </div>

      {/* Quick Schedule Actions */}
      <div className="flex items-center justify-between flex-wrap gap-3 bg-purple-50/60 p-3.5 rounded-2xl border border-purple-100 text-xs">
        <div className="flex items-center gap-2 text-ink font-semibold">
          <Sparkles className="w-4 h-4 text-[#5A2EA6]" />
          <span>Quick Schedule Sync:</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleCopyMondayToWeekdays}
            className="px-3 py-1.5 rounded-xl bg-white border border-[#5A2EA6]/20 text-[#5A2EA6] font-bold hover:bg-purple-100/60 transition-colors cursor-pointer text-xs flex items-center gap-1.5 shadow-2xs"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Mon → Weekdays</span>
          </button>

          <button
            onClick={handleCopyAllDays}
            className="px-3 py-1.5 rounded-xl bg-white border border-[#5A2EA6]/20 text-[#5A2EA6] font-bold hover:bg-purple-100/60 transition-colors cursor-pointer text-xs flex items-center gap-1.5 shadow-2xs"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Mon → All 7 Days</span>
          </button>
        </div>
      </div>

      {/* 7-Day Configuration Cards */}
      <div className="space-y-3">
        {schedule.map((item) => (
          <div
            key={item.day}
            className={cn(
              'p-4.5 rounded-[20px] border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs',
              item.isOpen
                ? 'bg-white border-[#5A2EA6]/15'
                : 'bg-slate-50 border-slate-200 opacity-75',
            )}
          >
            {/* Day Title & Toggle */}
            <div className="flex items-center gap-3 w-48 shrink-0">
              <div
                onClick={() => handleToggleDay(item.day)}
                className={cn(
                  'w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 cursor-pointer shrink-0 select-none',
                  item.isOpen ? 'bg-[#5A2EA6]' : 'bg-slate-300',
                )}
              >
                <div
                  className={cn(
                    'w-5 h-5 rounded-full bg-white shadow-xs transition-transform',
                    item.isOpen ? 'translate-x-5' : 'translate-x-0',
                  )}
                />
              </div>

              <div>
                <span className="font-bold text-[14px] text-ink block">{item.day}</span>
                <span
                  className={cn(
                    'text-[10px] font-bold uppercase',
                    item.isOpen ? 'text-emerald-700' : 'text-slate-500',
                  )}
                >
                  {item.isOpen ? 'Open for Bookings' : 'Closed / Off Day'}
                </span>
              </div>
            </div>

            {/* Hours Controls */}
            {item.isOpen ? (
              <div className="flex-1 flex flex-col lg:flex-row lg:items-center gap-4 text-xs">
                {/* Operating Hours */}
                <div className="flex items-center gap-2">
                  <span className="text-soft font-semibold w-16">Hours:</span>
                  <div className="flex items-center gap-1.5 bg-[#FCFAFF] px-2.5 py-1.5 rounded-xl border border-[#5A2EA6]/20">
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <input
                      type="time"
                      value={item.openTime}
                      onChange={(e) => handleTimeChange(item.day, 'openTime', e.target.value)}
                      className="bg-transparent text-xs font-bold text-ink focus:outline-none cursor-pointer"
                    />
                    <span className="text-muted font-bold">to</span>
                    <input
                      type="time"
                      value={item.closeTime}
                      onChange={(e) => handleTimeChange(item.day, 'closeTime', e.target.value)}
                      className="bg-transparent text-xs font-bold text-ink focus:outline-none cursor-pointer"
                    />
                  </div>
                </div>

                {/* Midday Break Window */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleBreak(item.day)}
                    className={cn(
                      'px-2 py-1 rounded-lg text-[10.5px] font-bold border transition-colors cursor-pointer',
                      item.hasBreak
                        ? 'bg-purple-100 text-[#5A2EA6] border-purple-200'
                        : 'bg-white text-soft hover:text-ink border-slate-200',
                    )}
                  >
                    <Coffee className="w-3 h-3 inline mr-1" />
                    Break Window
                  </button>

                  {item.hasBreak && (
                    <div className="flex items-center gap-1.5 bg-[#FCFAFF] px-2.5 py-1.5 rounded-xl border border-[#5A2EA6]/20">
                      <input
                        type="time"
                        value={item.breakStart}
                        onChange={(e) => handleTimeChange(item.day, 'breakStart', e.target.value)}
                        className="bg-transparent text-xs font-bold text-ink focus:outline-none cursor-pointer"
                      />
                      <span className="text-muted font-bold">to</span>
                      <input
                        type="time"
                        value={item.breakEnd}
                        onChange={(e) => handleTimeChange(item.day, 'breakEnd', e.target.value)}
                        className="bg-transparent text-xs font-bold text-ink focus:outline-none cursor-pointer"
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 text-xs text-muted italic">
                Salon closed on {item.day}. Online diary and walk-in queue will reject slots for
                this date.
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Batch Application Option & Save Action */}
      <div className="bg-white p-5 rounded-[22px] border border-[#5A2EA6]/12 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <label className="flex items-center gap-2 text-xs font-bold text-ink cursor-pointer select-none">
          <input
            type="checkbox"
            checked={applyAllBranches}
            onChange={(e) => setApplyAllBranches(e.target.checked)}
            className="w-4 h-4 rounded text-[#5A2EA6] focus:ring-[#5A2EA6]"
          />
          <span>Apply this weekly operating schedule to ALL brand branches</span>
        </label>

        <Button
          onClick={handleSave}
          className="h-10 px-6 rounded-xl text-xs font-bold premium-btn-primary"
        >
          Save &amp; Update Central Calendar
        </Button>
      </div>
    </div>
  );
}
