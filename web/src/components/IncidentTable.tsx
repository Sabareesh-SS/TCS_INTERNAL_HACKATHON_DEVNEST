import React from 'react';
import { Incident } from '../types/incident';
import { StatusBadge } from './StatusBadge';
import { Sparkles, ArrowRight, Video, Mic, Laptop, Tv, Cpu, Volume2, Network } from 'lucide-react';

interface IncidentTableProps {
  incidents: Incident[];
  onSelectIncident: (id: string) => void;
  onAcceptAssignment?: (id: string) => void;
}

export const IncidentTable: React.FC<IncidentTableProps> = ({
  incidents,
  onSelectIncident,
  onAcceptAssignment,
}) => {

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'projector':
        return <Video className="w-3.5 h-3.5 text-zinc-600" />;
      case 'microphone':
        return <Mic className="w-3.5 h-3.5 text-zinc-600" />;
      case 'smartboard':
        return <Tv className="w-3.5 h-3.5 text-zinc-600" />;
      case 'ptz-camera':
        return <Video className="w-3.5 h-3.5 text-zinc-600" />;
      case 'crestron':
        return <Cpu className="w-3.5 h-3.5 text-zinc-600" />;
      case 'amplifier':
        return <Volume2 className="w-3.5 h-3.5 text-zinc-600" />;
      case 'switcher':
        return <Network className="w-3.5 h-3.5 text-zinc-600" />;
      default:
        return <Laptop className="w-3.5 h-3.5 text-zinc-600" />;
    }
  };

  if (incidents.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-12 text-center text-zinc-500 font-mono shadow-xs">
        <p className="text-sm font-semibold">No incidents match the active filter criteria.</p>
        <span className="text-xs text-zinc-400 mt-1 block">
          All campus AV telemetry channels reporting nominal state
        </span>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-zinc-200 bg-white shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 text-zinc-500 font-mono uppercase text-[11px] tracking-wider font-semibold">
              <th className="py-3 px-4">Incident</th>
              <th className="py-3 px-4">Device / Room</th>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 hidden lg:table-cell">AI Diagnostic Hypothesis</th>
              <th className="py-3 px-4 hidden md:table-cell">Assigned To</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 font-sans">
            {incidents.map((incident) => {
              return (
                <tr
                  key={incident.id}
                  onClick={() => onSelectIncident(incident.id)}
                  className="hover:bg-zinc-50 transition-colors cursor-pointer group"
                >
                  {/* Incident ID */}
                  <td className="py-3 px-4 font-mono font-bold text-zinc-900 whitespace-nowrap">
                    <span className="group-hover:text-sky-600 transition-colors">
                      {incident.id}
                    </span>
                    <span className="text-[10px] text-zinc-400 block font-normal font-mono">
                      {incident.reportedAt}
                    </span>
                  </td>

                  {/* Device / Room */}
                  <td className="py-3 px-4 max-w-xs">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded bg-zinc-100 border border-zinc-200">
                        {getDeviceIcon(incident.deviceType)}
                      </span>
                      <div className="min-w-0">
                        <span className="font-semibold text-zinc-900 block truncate">
                          {incident.deviceName}
                        </span>
                        <span className="text-[11px] font-mono text-zinc-500 truncate block">
                          {incident.classroomId} · {incident.deviceModel}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Priority */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <StatusBadge priority={incident.priority} />
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <StatusBadge status={incident.status} />
                  </td>

                  {/* AI Diagnostic Summary */}
                  <td className="py-3 px-4 hidden lg:table-cell max-w-sm">
                    <div className="flex items-start gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                      <p className="text-zinc-600 text-xs truncate">
                        {incident.aiDiagnostic.probableCauseHypothesis}
                      </p>
                    </div>
                  </td>

                  {/* Assignee */}
                  <td className="py-3 px-4 hidden md:table-cell whitespace-nowrap font-mono text-xs">
                    {incident.assignedTechnicianName ? (
                      <span className="text-zinc-800 font-medium">
                        {incident.assignedTechnicianName}
                      </span>
                    ) : (
                      <span className="text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded text-[10px] font-mono">
                        Needs Dispatch
                      </span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="py-3 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      {incident.status === 'unassigned' && onAcceptAssignment && (
                        <button
                          type="button"
                          onClick={() => onAcceptAssignment(incident.id)}
                          className="px-2.5 py-1 text-xs font-mono rounded bg-zinc-900 hover:bg-zinc-800 text-white font-medium transition-colors"
                          title="Dispatch to on-duty field technician"
                        >
                          Dispatch
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onSelectIncident(incident.id)}
                        className="p-1 rounded text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                        title="View Full Incident Details"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
