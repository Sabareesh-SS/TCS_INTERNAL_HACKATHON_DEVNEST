import React, { useState } from 'react';
import { Incident, IncidentStatus } from '../types/incident';
import { X, Wrench, Plus, Trash2 } from 'lucide-react';

interface RecordFindingsModalProps {
  incident: Incident;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (status: IncidentStatus, data: {
    rootCause?: string;
    repairNotes?: string;
    partsRequired?: string[];
  }) => void;
  currentTechName: string;
}

export const RecordFindingsModal: React.FC<RecordFindingsModalProps> = ({
  incident,
  isOpen,
  onClose,
  onSubmit,
  currentTechName,
}) => {
  if (!isOpen) return null;

  const [selectedStatus, setSelectedStatus] = useState<IncidentStatus>(incident.status);
  const [rootCause, setRootCause] = useState(incident.repairRecord?.rootCause || '');
  const [repairNotes, setRepairNotes] = useState(incident.repairRecord?.repairNotes || '');
  const [parts, setParts] = useState<string[]>(incident.repairRecord?.partsRequired || ['']);

  const handleAddPart = () => {
    setParts([...parts, '']);
  };

  const handleRemovePart = (index: number) => {
    setParts(parts.filter((_, i) => i !== index));
  };

  const handlePartChange = (index: number, val: string) => {
    const updated = [...parts];
    updated[index] = val;
    setParts(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanParts = parts.filter((p) => p.trim() !== '');
    onSubmit(selectedStatus, {
      rootCause,
      repairNotes,
      partsRequired: cleanParts,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white border border-zinc-200 rounded-lg max-w-xl w-full p-6 text-zinc-900 shadow-2xl space-y-5">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-zinc-100 border border-zinc-200 text-zinc-800">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900">
                Record Repair Findings & Status
              </h3>
              <p className="text-xs text-zinc-500 font-mono">
                {incident.id} · {incident.deviceName} ({incident.classroomId})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Target Status Selection */}
          <div>
            <label className="text-xs font-mono uppercase text-zinc-500 block mb-2 font-semibold">
              Update Incident Status
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setSelectedStatus('in_progress')}
                className={`py-2 px-2.5 rounded border text-xs font-mono text-center font-semibold transition-colors ${
                  selectedStatus === 'in_progress'
                    ? 'border-sky-300 bg-sky-50 text-sky-700'
                    : 'border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                In Progress
              </button>
              <button
                type="button"
                onClick={() => setSelectedStatus('awaiting_verification')}
                className={`py-2 px-2.5 rounded border text-xs font-mono text-center font-semibold transition-colors ${
                  selectedStatus === 'awaiting_verification'
                    ? 'border-amber-300 bg-amber-50 text-amber-700'
                    : 'border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                Verification
              </button>
              <button
                type="button"
                onClick={() => setSelectedStatus('resolved')}
                className={`py-2 px-2.5 rounded border text-xs font-mono text-center font-semibold transition-colors ${
                  selectedStatus === 'resolved'
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                    : 'border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                Resolved
              </button>
              <button
                type="button"
                onClick={() => setSelectedStatus('unable_to_resolve')}
                className={`py-2 px-2.5 rounded border text-xs font-mono text-center font-semibold transition-colors ${
                  selectedStatus === 'unable_to_resolve'
                    ? 'border-rose-300 bg-rose-50 text-rose-700'
                    : 'border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                Escalate
              </button>
            </div>
          </div>

          {/* Root Cause Input */}
          <div>
            <label className="text-xs font-mono uppercase text-zinc-500 block mb-1.5 font-semibold">
              Verified Root Cause
            </label>
            <input
              type="text"
              value={rootCause}
              onChange={(e) => setRootCause(e.target.value)}
              placeholder="e.g. Pin 19 Hot Plug Detect trace corroded on podium transmitter"
              className="w-full px-3 py-2 text-xs rounded bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-zinc-400 focus:outline-none text-zinc-900 font-sans"
            />
          </div>

          {/* Repair Notes */}
          <div>
            <label className="text-xs font-mono uppercase text-zinc-500 block mb-1.5 font-semibold">
              Technical Repair Notes & Actions Taken
            </label>
            <textarea
              rows={3}
              value={repairNotes}
              onChange={(e) => setRepairNotes(e.target.value)}
              placeholder="Describe physical checks performed, signal analyzer readings, and tests passed..."
              className="w-full px-3 py-2 text-xs rounded bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-zinc-400 focus:outline-none text-zinc-900 font-sans resize-none"
            />
          </div>

          {/* Parts Required / Replaced */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-mono uppercase text-zinc-500 font-semibold">
                Parts & Consumables Replaced
              </label>
              <button
                type="button"
                onClick={handleAddPart}
                className="text-[11px] font-mono text-sky-700 hover:text-sky-800 font-bold flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Part
              </button>
            </div>
            <div className="space-y-1.5 max-h-32 overflow-y-auto">
              {parts.map((part, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={part}
                    onChange={(e) => handlePartChange(idx, e.target.value)}
                    placeholder="e.g. HDMI 2.0 Extender Balun, Cat6A patch cable"
                    className="flex-1 px-3 py-1.5 text-xs rounded bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-zinc-400 focus:outline-none text-zinc-900"
                  />
                  {parts.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePart(idx)}
                      className="p-1.5 text-zinc-400 hover:text-rose-600 rounded hover:bg-zinc-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Technician Signature Info */}
          <div className="p-3 rounded bg-zinc-50 border border-zinc-200 flex items-center justify-between text-xs font-mono text-zinc-600">
            <span>Signing Technician: <strong className="text-zinc-800">{currentTechName}</strong></span>
            <span className="text-[11px] text-zinc-400">Logged to Supabase Audit</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-mono rounded border border-zinc-200 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-mono rounded bg-zinc-900 hover:bg-zinc-800 text-white font-semibold transition-colors"
            >
              Save Findings & Update Status
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
