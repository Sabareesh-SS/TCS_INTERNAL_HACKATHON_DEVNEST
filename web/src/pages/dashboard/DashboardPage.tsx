import React from 'react';
import { useIncidents } from '../../context/IncidentContext';
import { useAuth } from '../../context/AuthContext';
import { MetricCard } from '../../components/MetricCard';
import { IncidentTable } from '../../components/IncidentTable';
import {
  AlertTriangle,
  Clock,
  Wrench,
  CheckCircle2,
  ArrowRight,
  DoorClosed,
  Cpu,
  QrCode,
} from 'lucide-react';
import { NavigationPage } from '../../components/Sidebar';

interface DashboardPageProps {
  onNavigate: (page: NavigationPage) => void;
  onSelectIncident: (id: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  onSelectIncident,
}) => {
  const { metrics, incidents, assignIncident, setStatusFilter } = useIncidents();
  const { currentUser } = useAuth();

  const recentIncidents = incidents.slice(0, 5);

  const handleCardClick = (filter: 'all' | 'unassigned' | 'in_progress' | 'resolved') => {
    setStatusFilter(filter);
    onNavigate('incidents');
  };

  const handleDispatchTicket = (id: string) => {
    // Admin dispatches to primary on-duty field technician Alex Rivera
    assignIncident(id, 'usr_tech_01', 'Alex Rivera (Field Tech)');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-lg border border-zinc-200 bg-white shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900">
            Welcome back, {currentUser.name}
          </h2>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onNavigate('incidents')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-mono rounded bg-zinc-900 hover:bg-zinc-800 text-white font-semibold transition-colors"
          >
            Incident Queue <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Metric Cards Section (Section 3) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-semibold">
            Campus AV Overview
          </h3>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Open Incidents"
            value={metrics.openCount}
            subtext="Across 6 active buildings"
            icon={AlertTriangle}
            badge="Live"
            badgeColor="rose"
            onClick={() => handleCardClick('all')}
          />
          <MetricCard
            label="Awaiting Assignment"
            value={metrics.awaitingCount}
            subtext="Needs technician dispatch"
            icon={Clock}
            badge="Action Req"
            badgeColor="amber"
            onClick={() => handleCardClick('unassigned')}
          />
          <MetricCard
            label="In Progress"
            value={metrics.inProgressCount}
            subtext="Under active field repair"
            icon={Wrench}
            badge="Active"
            badgeColor="sky"
            onClick={() => handleCardClick('in_progress')}
          />
          <MetricCard
            label="Resolved Today"
            value={metrics.resolvedTodayCount}
            subtext="28 min avg MTTR"
            icon={CheckCircle2}
            badge="Nominal"
            badgeColor="emerald"
            onClick={() => handleCardClick('resolved')}
          />
        </div>
      </div>

      {/* Recent Incidents Table (Section 3) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-semibold">
              Recent Incidents
            </h3>
          </div>

          <button
            onClick={() => onNavigate('incidents')}
            className="text-xs font-mono text-sky-700 hover:text-sky-800 font-semibold flex items-center gap-1"
          >
            View Full Queue ({incidents.length}) <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <IncidentTable
          incidents={recentIncidents}
          onSelectIncident={onSelectIncident}
          onAcceptAssignment={handleDispatchTicket}
        />
      </div>

      {/* High Risk Rooms & Facility Health Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Room Risk Watchlist */}
        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
            <div className="flex items-center gap-2">
              <DoorClosed className="w-4 h-4 text-amber-600" />
              <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-zinc-800">
                High-Frequency Fault Rooms
              </h4>
            </div>
            <span className="text-[10px] font-mono text-zinc-400">Past 30 Days</span>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between p-2.5 rounded bg-zinc-50 border border-zinc-200 text-xs">
              <div>
                <span className="font-bold text-zinc-900 block">Classroom AB-204</span>
                <span className="text-[11px] text-zinc-500 font-mono">
                  7 faults · Wall plate HDMI EDID wear
                </span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-rose-50 border border-rose-200 text-rose-700 font-bold">
                High Risk
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded bg-zinc-50 border border-zinc-200 text-xs">
              <div>
                <span className="font-bold text-zinc-900 block">Engineering Main Hall A</span>
                <span className="text-[11px] text-zinc-500 font-mono">
                  5 faults · PTZ VISCA control timeouts
                </span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-rose-50 border border-rose-200 text-rose-700 font-bold">
                High Risk
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded bg-zinc-50 border border-zinc-200 text-xs">
              <div>
                <span className="font-bold text-zinc-900 block">Seminar Room AB-105</span>
                <span className="text-[11px] text-zinc-500 font-mono">
                  4 faults · Shure RF squelch interference
                </span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-50 border border-amber-200 text-amber-700 font-bold">
                Moderate
              </span>
            </div>
          </div>
        </div>

        {/* Quick Technician Shortcuts */}
        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-sky-600" />
              <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-zinc-800">
                Dispatch & Equipment Operations
              </h4>
            </div>
            <span className="text-[10px] font-mono text-zinc-400">BIT NAVIS Suite</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <button
              onClick={() => onNavigate('classrooms')}
              className="p-3 rounded border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-left transition-colors"
            >
              <span className="text-zinc-900 font-semibold block">Browse Classrooms</span>
              <span className="text-[10px] text-zinc-500 block mt-0.5">6 registered halls</span>
            </button>
            <button
              onClick={() => onNavigate('devices')}
              className="p-3 rounded border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-left transition-colors"
            >
              <span className="text-zinc-900 font-semibold block">Equipment Assets</span>
              <span className="text-[10px] text-zinc-500 block mt-0.5">84 active devices</span>
            </button>
            <button
              onClick={() => onNavigate('qr-management')}
              className="p-3 rounded border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-left transition-colors"
            >
              <span className="text-zinc-900 font-semibold block">QR Management</span>
              <span className="text-[10px] text-zinc-500 block mt-0.5">Print & generate tags</span>
            </button>
            <button
              onClick={() => onNavigate('reports')}
              className="p-3 rounded border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-left transition-colors"
            >
              <span className="text-zinc-900 font-semibold block">Fault Analytics</span>
              <span className="text-[10px] text-zinc-500 block mt-0.5">MTTR & recurring logs</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
