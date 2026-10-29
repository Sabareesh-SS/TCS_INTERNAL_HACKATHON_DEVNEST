import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: number | string;
  subtext?: string;
  icon: LucideIcon;
  badge?: string;
  badgeColor?: 'rose' | 'amber' | 'sky' | 'emerald' | 'zinc';
  onClick?: () => void;
  active?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subtext,
  icon: Icon,
  badge,
  badgeColor = 'zinc',
  onClick,
  active = false,
}) => {
  const badgeColorMap = {
    rose: 'border-rose-200 bg-rose-50 text-rose-700',
    amber: 'border-amber-200 bg-amber-50 text-amber-700',
    sky: 'border-sky-200 bg-sky-50 text-sky-700',
    emerald: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    zinc: 'border-zinc-200 bg-zinc-100 text-zinc-600',
  };

  return (
    <div
      onClick={onClick}
      className={`group relative p-5 rounded-lg border transition-all duration-150 text-left ${
        onClick ? 'cursor-pointer hover:border-zinc-400' : ''
      } ${
        active
          ? 'bg-white border-zinc-500 shadow-sm ring-1 ring-zinc-500'
          : 'bg-white border-zinc-200 hover:bg-zinc-50/50 shadow-xs'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider font-mono">
          {label}
        </span>
        <div className="p-2 rounded bg-zinc-100 border border-zinc-200 text-zinc-700 group-hover:text-zinc-900 transition-colors">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-3xl font-mono font-bold tracking-tight text-zinc-900">
          {value}
        </span>
        {badge && (
          <span
            className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded border ${badgeColorMap[badgeColor]}`}
          >
            {badge}
          </span>
        )}
      </div>

      {subtext && (
        <p className="text-xs text-zinc-500 font-mono mt-1">
          {subtext}
        </p>
      )}
    </div>
  );
};
