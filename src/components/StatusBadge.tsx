import React from 'react';
import { IncidentStatus, IncidentPriority } from '../types/incident';
import { DeviceHealth } from '../types/device';

interface StatusBadgeProps {
  status?: IncidentStatus;
  priority?: IncidentPriority;
  health?: DeviceHealth;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, priority, health, size = 'sm' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs tracking-wide';

  if (status) {
    switch (status) {
      case 'unassigned':
        return (
          <span className={`inline-flex items-center gap-1.5 font-mono font-medium rounded border border-rose-200 bg-rose-50 text-rose-700 ${sizeClasses}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            Unassigned
          </span>
        );
      case 'in_progress':
        return (
          <span className={`inline-flex items-center gap-1.5 font-mono font-medium rounded border border-sky-200 bg-sky-50 text-sky-700 ${sizeClasses}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
            In Progress
          </span>
        );
      case 'awaiting_verification':
        return (
          <span className={`inline-flex items-center gap-1.5 font-mono font-medium rounded border border-amber-200 bg-amber-50 text-amber-700 ${sizeClasses}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Awaiting Verification
          </span>
        );
      case 'resolved':
        return (
          <span className={`inline-flex items-center gap-1.5 font-mono font-medium rounded border border-emerald-200 bg-emerald-50 text-emerald-700 ${sizeClasses}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Resolved
          </span>
        );
      case 'unable_to_resolve':
        return (
          <span className={`inline-flex items-center gap-1.5 font-mono font-medium rounded border border-zinc-200 bg-zinc-100 text-zinc-600 ${sizeClasses}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
            Escalated
          </span>
        );
    }
  }

  if (priority) {
    switch (priority) {
      case 'critical':
        return (
          <span className={`inline-flex items-center gap-1 font-mono uppercase font-semibold rounded border border-rose-200 bg-rose-50 text-rose-700 ${sizeClasses}`}>
            Critical
          </span>
        );
      case 'high':
        return (
          <span className={`inline-flex items-center gap-1 font-mono uppercase font-semibold rounded border border-amber-200 bg-amber-50 text-amber-700 ${sizeClasses}`}>
            High
          </span>
        );
      case 'medium':
        return (
          <span className={`inline-flex items-center gap-1 font-mono uppercase font-semibold rounded border border-sky-200 bg-sky-50 text-sky-700 ${sizeClasses}`}>
            Medium
          </span>
        );
      case 'low':
        return (
          <span className={`inline-flex items-center gap-1 font-mono uppercase font-semibold rounded border border-zinc-200 bg-zinc-100 text-zinc-600 ${sizeClasses}`}>
            Low
          </span>
        );
    }
  }

  if (health) {
    switch (health) {
      case 'healthy':
        return (
          <span className={`inline-flex items-center gap-1.5 font-mono rounded border border-emerald-200 bg-emerald-50 text-emerald-700 ${sizeClasses}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Operational
          </span>
        );
      case 'degraded':
        return (
          <span className={`inline-flex items-center gap-1.5 font-mono rounded border border-amber-200 bg-amber-50 text-amber-700 ${sizeClasses}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Degraded
          </span>
        );
      case 'faulty':
        return (
          <span className={`inline-flex items-center gap-1.5 font-mono rounded border border-rose-200 bg-rose-50 text-rose-700 ${sizeClasses}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            Faulty
          </span>
        );
      case 'maintenance':
        return (
          <span className={`inline-flex items-center gap-1.5 font-mono rounded border border-zinc-200 bg-zinc-100 text-zinc-600 ${sizeClasses}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
            Maintenance
          </span>
        );
    }
  }

  return null;
};
