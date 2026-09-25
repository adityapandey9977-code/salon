import type React from 'react';
import { cn } from '../../utils';
import { Avatar } from '../Avatar';
import { StatusBadge } from '../StatusBadge';

export interface AuditTimelineItem {
  id: string;
  timestamp: string;
  title: string;
  description?: React.ReactNode;
  actor?: {
    name: string;
    avatar?: string;
    role?: string;
  };
  badge?: {
    status: string;
    label?: string;
  };
  icon?: React.ReactNode;
  diff?: {
    field: string;
    from: string | number;
    to: string | number;
  }[];
}

export interface AuditTimelineProps {
  items: AuditTimelineItem[];
  className?: string;
}

export const AuditTimeline: React.FC<AuditTimelineProps> = ({ items, className }) => {
  return (
    <div
      className={cn(
        'space-y-6 relative before:absolute before:left-4.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200/80 text-left',
        className,
      )}
    >
      {items.map((item) => (
        <div key={item.id} className="relative flex items-start gap-4 group">
          {/* Node Icon / Dot */}
          <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-600 shrink-0 z-10 group-hover:border-[#5A2EA6] group-hover:text-[#5A2EA6] transition">
            {item.icon ? (
              item.icon
            ) : item.actor?.avatar ? (
              <Avatar src={item.actor.avatar} alt={item.actor.name} size="sm" />
            ) : (
              <div className="w-2.5 h-2.5 rounded-full bg-[#5A2EA6]" />
            )}
          </div>

          {/* Content Card */}
          <div className="flex-1 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-slate-900">{item.title}</span>
                {item.badge && (
                  <StatusBadge status={item.badge.status} label={item.badge.label} size="sm" />
                )}
              </div>
              <span className="text-[10.5px] font-medium text-slate-400 shrink-0">
                {item.timestamp}
              </span>
            </div>

            {item.actor && (
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <span>By:</span>
                <strong className="text-slate-700 font-semibold">{item.actor.name}</strong>
                {item.actor.role && (
                  <span className="text-[10px] text-slate-400">({item.actor.role})</span>
                )}
              </div>
            )}

            {item.description && (
              <div className="text-xs text-slate-600 font-medium leading-relaxed">
                {item.description}
              </div>
            )}

            {item.diff && item.diff.length > 0 && (
              <div className="pt-2 border-t border-slate-100 space-y-1.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Value Changes:
                </div>
                <div className="space-y-1">
                  {item.diff.map((d, idx) => (
                    <div
                      key={idx}
                      className="text-[11px] font-medium flex items-center gap-2 flex-wrap bg-slate-50 p-1.5 rounded-lg border border-slate-100"
                    >
                      <span className="font-bold text-slate-700">{d.field}:</span>
                      <span className="line-through text-rose-500">{String(d.from)}</span>
                      <span className="text-slate-400">&rarr;</span>
                      <span className="font-bold text-emerald-600">{String(d.to)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
