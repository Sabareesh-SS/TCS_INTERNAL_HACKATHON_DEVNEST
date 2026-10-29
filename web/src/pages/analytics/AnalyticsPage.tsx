import React from 'react';
import { analyticsService } from '../../services/analyticsService';
import { MetricCard } from '../../components/MetricCard';
import {
  Clock,
  CheckCircle2,
  Sparkles,
  DoorClosed,
  Cpu,
  Layers,
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const metrics = analyticsService.getCampusMetrics();
  const roomStats = analyticsService.getRoomFaultAnalytics();
  const deviceMetrics = analyticsService.getDeviceCategoryMetrics();

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900">
            Recurring Faults & Room Analytics
          </h2>
        </div>
      </div>

      {/* KPI Overview Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Mean Time To Resolve"
          value={`${metrics.averageMttrMinutes}m`}
          subtext="-4m vs last month"
          icon={Clock}
          badge="Fastest"
          badgeColor="emerald"
        />
        <MetricCard
          label="First-Time Fix Rate"
          value={`${metrics.firstTimeFixRate}%`}
          subtext="Target: >90%"
          icon={CheckCircle2}
          badge="High Fix"
          badgeColor="emerald"
        />
        <MetricCard
          label="AI RAG Accuracy"
          value={`${metrics.aiDiagnosticAccuracy}%`}
          subtext="Grounded manual citations"
          icon={Sparkles}
          badge="AI Tested"
          badgeColor="sky"
        />
        <MetricCard
          label="Active Duty Techs"
          value={metrics.activeTechniciansOnDuty}
          subtext="Covering 84 AV endpoints"
          icon={Layers}
          badge="Optimal"
          badgeColor="zinc"
        />
      </div>

      {/* High-Risk Rooms Table & Analysis */}
      <div className="rounded-lg border border-zinc-200 bg-white p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
          <div className="flex items-center gap-2">
            <DoorClosed className="w-4 h-4 text-amber-600" />
            <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-zinc-800">
              Room-Level Recurring Fault Rankings
            </h3>
          </div>
          <span className="text-[10px] font-mono text-zinc-500">
            Sorted by incident volume
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-sans">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 font-mono text-[10px] uppercase text-zinc-500 font-semibold">
                <th className="py-2.5 px-3">Classroom</th>
                <th className="py-2.5 px-3">Incidents (30d)</th>
                <th className="py-2.5 px-3">Avg MTTR</th>
                <th className="py-2.5 px-3">Most Common Root Cause</th>
                <th className="py-2.5 px-3 text-right">Risk Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {roomStats.map((room) => (
                <tr key={room.roomId} className="hover:bg-zinc-50">
                  <td className="py-2.5 px-3 font-mono font-bold text-zinc-900">
                    {room.roomId}
                    <span className="text-[11px] text-zinc-500 block font-normal font-sans">
                      {room.roomName}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-zinc-700 font-medium">
                    {room.totalFaultsMonth} faults
                  </td>
                  <td className="py-2.5 px-3 font-mono text-zinc-700 font-medium">
                    {room.mttrMinutes} min
                  </td>
                  <td className="py-2.5 px-3 text-zinc-700">
                    {room.mostCommonIssue}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold border ${
                        room.riskLevel === 'high'
                          ? 'border-rose-200 bg-rose-50 text-rose-700'
                          : room.riskLevel === 'moderate'
                          ? 'border-amber-200 bg-amber-50 text-amber-700'
                          : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {room.riskLevel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Device Failure Breakdown (Solid bar chart - NO GRADIENTS) */}
      <div className="rounded-lg border border-zinc-200 bg-white p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-sky-600" />
            <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-zinc-800">
              Hardware Failure Category Distribution
            </h3>
          </div>
          <span className="text-[10px] font-mono text-zinc-500">
            Total 37 recorded events
          </span>
        </div>

        <div className="space-y-4">
          {deviceMetrics.map((item) => (
            <div key={item.category} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-900 font-bold">{item.category}</span>
                <span className="text-zinc-600 font-medium">
                  {item.incidentCount} tickets ({item.percentage}%)
                </span>
              </div>

              {/* Solid Progress Bar (NO GRADIENT) */}
              <div className="w-full h-2.5 rounded-full bg-zinc-100 border border-zinc-200 overflow-hidden">
                <div
                  className="h-full bg-sky-600 rounded-full"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>

              <span className="text-[11px] text-zinc-500 font-sans block">
                Primary Root Cause: {item.primaryRootCause}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
