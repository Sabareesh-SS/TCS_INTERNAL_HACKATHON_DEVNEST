import React, { useState } from 'react';
import { useIncidents } from '../../context/IncidentContext';
import { useAuth } from '../../context/AuthContext';
import { FIELD_TECHNICIANS } from '../../services/authService';
import { StatusBadge } from '../../components/StatusBadge';
import { DiagnosticEvidence } from '../../components/DiagnosticEvidence';
import { RecordFindingsModal } from '../../components/RecordFindingsModal';
import {
  ArrowLeft,
  UserCheck,
  Wrench,
  CheckCircle2,
  QrCode,
  Clock,
  User,
  Copy,
  Check,
} from 'lucide-react';
import { NavigationPage } from '../../components/Sidebar';

interface IncidentDetailsPageProps {
  incidentId: string;
  onBack: () => void;
  onNavigate: (page: NavigationPage) => void;
  onViewQr?: (type: 'classroom' | 'device', id: string) => void;
}

export const IncidentDetailsPage: React.FC<IncidentDetailsPageProps> = ({
  incidentId,
  onBack,
  onViewQr,
}) => {
  const { incidents, assignIncident, updateStatus } = useIncidents();
  const { currentUser } = useAuth();

  const incident = incidents.find((i) => i.id === incidentId);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [isHypothesisVerifiedLocal, setIsHypothesisVerifiedLocal] = useState(
    incident?.aiDiagnostic.isHypothesisVerified || false
  );
  const [selectedTechId, setSelectedTechId] = useState<string>(
    incident?.assignedTechnicianId || FIELD_TECHNICIANS[0].id
  );

  if (!incident) {
    return (
      <div className="p-8 text-center text-zinc-500 font-mono">
        <p>Incident {incidentId} not found.</p>
        <button
          onClick={onBack}
          className="mt-4 px-3 py-1.5 text-xs rounded bg-zinc-100 border border-zinc-200 text-zinc-800 font-medium"
        >
          Return to Queue
        </button>
      </div>
    );
  }

  const handleCopyId = () => {
    navigator.clipboard.writeText(incident.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleDispatchToTech = () => {
    const tech = FIELD_TECHNICIANS.find((t) => t.id === selectedTechId) || FIELD_TECHNICIANS[0];
    assignIncident(incident.id, tech.id, tech.name);
  };

  const handleResolveDirectly = () => {
    setIsRecordModalOpen(true);
  };

  const handleSaveFindings = (
    status: typeof incident.status,
    data: {
      rootCause?: string;
      repairNotes?: string;
      partsRequired?: string[];
    }
  ) => {
    updateStatus(incident.id, status, {
      ...data,
      resolvedByTechnician: currentUser.name,
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-600 hover:text-zinc-900 font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Incident Queue
        </button>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-zinc-500">Classroom:</span>
          <span className="text-zinc-900 font-bold">{incident.classroomId}</span>
          {onViewQr && (
            <button
              onClick={() => onViewQr('classroom', incident.classroomId)}
              className="p-1 rounded text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
              title="View Classroom Entrance QR"
            >
              <QrCode className="w-3.5 h-3.5 text-sky-600" />
            </button>
          )}
        </div>
      </div>

      {/* Main Header / Status Banner (Section 4 Spec) */}
      <div className="p-6 rounded-lg border border-zinc-200 bg-white shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-zinc-900">
                Incident {incident.id}
              </h2>
              <button
                onClick={handleCopyId}
                className="p-1 rounded text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
                title="Copy Incident ID"
              >
                {copiedId ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
              <StatusBadge status={incident.status} size="md" />
              <StatusBadge priority={incident.priority} size="md" />
            </div>

            <p className="text-xs sm:text-sm text-zinc-500 mt-1 font-mono">
              Classroom {incident.classroomId} · {incident.deviceType.toUpperCase()} · Asset {incident.deviceId}
            </p>
          </div>

          {/* Quick QR link for device */}
          {onViewQr && (
            <button
              onClick={() => onViewQr('device', incident.deviceId)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-800 font-medium transition-colors shrink-0"
            >
              <QrCode className="w-3.5 h-3.5 text-emerald-600" />
              Chassis QR Tag
            </button>
          )}
        </div>

        {/* Reported Symptom Callout */}
        <div className="rounded border border-zinc-200 bg-zinc-50 p-4">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-1 font-semibold">
            Reported Symptom
          </span>
          <p className="text-sm sm:text-base font-bold text-zinc-900 font-sans">
            "{incident.reportedSymptom}"
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-2 text-xs font-mono text-zinc-500">
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-zinc-400" />
              Reported by: {incident.reportedBy}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              {incident.reportedAt}
            </span>
          </div>
        </div>

        {/* Administrator Dispatch & Status Control */}
        <div className="pt-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-2 font-semibold">
            Field Technician Dispatch & Status Control
          </span>
          <div className="flex flex-wrap items-center gap-3">
            {incident.status !== 'resolved' && (
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={selectedTechId}
                  onChange={(e) => setSelectedTechId(e.target.value)}
                  className="bg-zinc-50 border border-zinc-200 rounded px-2.5 py-1.5 text-xs font-mono text-zinc-800 focus:bg-white focus:outline-none focus:border-zinc-400"
                >
                  {FIELD_TECHNICIANS.map((tech) => (
                    <option key={tech.id} value={tech.id}>
                      {tech.name} ({tech.specialty})
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={handleDispatchToTech}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded bg-zinc-900 hover:bg-zinc-800 text-white font-medium transition-colors"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  {incident.assignedTechnicianId ? 'Reassign Tech' : 'Dispatch Tech'}
                </button>
              </div>
            )}

            {incident.status === 'in_progress' && (
              <span className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded bg-sky-50 border border-sky-200 text-sky-800 font-semibold">
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                Assigned: {incident.assignedTechnicianName}
              </span>
            )}

            {incident.status !== 'resolved' && (
              <>
                <button
                  type="button"
                  onClick={() => setIsRecordModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-800 font-medium transition-colors"
                >
                  <Wrench className="w-3.5 h-3.5 text-zinc-600" />
                  Record Findings & Parts
                </button>

                <button
                  type="button"
                  onClick={handleResolveDirectly}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Resolve Incident
                </button>
              </>
            )}

            {incident.status === 'resolved' && (
              <div className="flex items-center gap-2 p-2 px-3 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>
                  Incident marked resolved by {incident.repairRecord?.resolvedByTechnician || 'Operations Admin'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Diagnostic Summary & Grounded Evidence (Section 4 Core) */}
      <DiagnosticEvidence
        diagnostic={incident.aiDiagnostic}
        isVerified={isHypothesisVerifiedLocal}
        onVerifyHypothesis={() => setIsHypothesisVerifiedLocal(true)}
      />

      {/* Repair History & Technician Audit Log */}
      {incident.repairRecord && (
        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
            <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-zinc-800">
              Technician Field Repair Log
            </h3>
            <span className="text-[10px] font-mono text-zinc-400">
              Audit Record #TSCAI-{incident.id}
            </span>
          </div>

          <div className="space-y-3 text-xs font-sans">
            {incident.repairRecord.rootCause && (
              <div className="p-3 rounded bg-zinc-50 border border-zinc-200">
                <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-1 font-semibold">
                  Verified Root Cause
                </span>
                <p className="text-zinc-800 font-medium">{incident.repairRecord.rootCause}</p>
              </div>
            )}

            {incident.repairRecord.repairNotes && (
              <div className="p-3 rounded bg-zinc-50 border border-zinc-200">
                <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-1 font-semibold">
                  Repair Notes & Actions Taken
                </span>
                <p className="text-zinc-800">{incident.repairRecord.repairNotes}</p>
              </div>
            )}

            {incident.repairRecord.partsRequired && incident.repairRecord.partsRequired.length > 0 && (
              <div>
                <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-1.5 font-semibold">
                  Parts & Consumables Installed
                </span>
                <div className="flex flex-wrap gap-2">
                  {incident.repairRecord.partsRequired.map((part, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-mono px-2 py-1 rounded bg-zinc-100 border border-zinc-200 text-zinc-800 font-medium"
                    >
                      {part}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Record Findings Modal */}
      <RecordFindingsModal
        incident={incident}
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        onSubmit={handleSaveFindings}
        currentTechName={currentUser.name}
      />
    </div>
  );
};
