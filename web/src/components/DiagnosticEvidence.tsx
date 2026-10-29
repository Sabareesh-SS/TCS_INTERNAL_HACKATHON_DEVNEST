import React from 'react';
import { AIDiagnosticSummary } from '../types/incident';
import { Sparkles, BookOpen, AlertCircle, CheckCircle2, Terminal, Info, ExternalLink } from 'lucide-react';

interface DiagnosticEvidenceProps {
  diagnostic: AIDiagnosticSummary;
  onVerifyHypothesis?: () => void;
  isVerified?: boolean;
}

export const DiagnosticEvidence: React.FC<DiagnosticEvidenceProps> = ({
  diagnostic,
  onVerifyHypothesis,
  isVerified = false,
}) => {
  const verifiedState = isVerified || diagnostic.isHypothesisVerified;

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5 space-y-5 shadow-xs">
      {/* AI Header */}
      <div className="flex items-center gap-2.5 pb-4 border-b border-zinc-200">
        <div className="p-1.5 rounded bg-sky-50 border border-sky-200 text-sky-700">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wide">
            AI Diagnostic Summary & RAG Grounding
          </h3>
        </div>
      </div>

      {/* Probable Cause Hypothesis */}
      <div className="p-4 rounded border border-zinc-200 bg-zinc-50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase font-bold text-zinc-700">
              Probable Cause
            </span>
            {verifiedState ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Technician Confirmed
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-700 font-semibold">
                <AlertCircle className="w-3 h-3 text-amber-600" />
                Model Hypothesis (Unverified)
              </span>
            )}
          </div>

          {!verifiedState && onVerifyHypothesis && (
            <button
              onClick={onVerifyHypothesis}
              className="text-xs font-mono px-2 py-1 rounded bg-white hover:bg-zinc-100 text-zinc-800 border border-zinc-300 font-medium transition-colors shadow-xs"
            >
              Confirm Hypothesis
            </button>
          )}
        </div>

        <p className="text-sm text-zinc-800 leading-relaxed font-sans font-medium">
          {diagnostic.probableCauseHypothesis}
        </p>
      </div>

      {/* Faculty Last Action & Result */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="p-3.5 rounded border border-zinc-200 bg-zinc-50">
          <div className="flex items-center gap-2 mb-1.5 text-zinc-600">
            <Terminal className="w-3.5 h-3.5 text-zinc-500" />
            <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">
              Last Step Attempted
            </span>
          </div>
          <p className="text-xs text-zinc-800 leading-normal font-sans">
            {diagnostic.lastStepAttempted}
          </p>
        </div>

        <div className="p-3.5 rounded border border-zinc-200 bg-zinc-50">
          <div className="flex items-center gap-2 mb-1.5 text-zinc-600">
            <Info className="w-3.5 h-3.5 text-zinc-500" />
            <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">
              Faculty Observation / Result
            </span>
          </div>
          <p className="text-xs text-zinc-800 leading-normal font-sans">
            {diagnostic.attemptResult}
          </p>
        </div>
      </div>

      {/* RAG Grounded Manual Reference */}
      <div className="p-3.5 rounded border border-sky-200 bg-sky-50/60">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-sky-700" />
            <span className="text-xs font-mono font-bold text-sky-800">
              Verified Manual Citation
            </span>
          </div>
          <span className="text-[10px] font-mono text-zinc-600">
            Page {diagnostic.manualReference.pageNumber} · {diagnostic.manualReference.section}
          </span>
        </div>
        <p className="text-xs text-zinc-800 italic mb-2 pl-3 border-l-2 border-sky-600 font-serif">
          "{diagnostic.manualReference.snippet}"
        </p>
        <div className="flex items-center justify-between text-[11px] text-zinc-600 font-mono">
          <span>Source: {diagnostic.manualReference.manualTitle}</span>
          {diagnostic.manualReference.docUrl && (
            <a
              href={diagnostic.manualReference.docUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-700 hover:text-sky-800 font-semibold inline-flex items-center gap-1 underline underline-offset-2"
            >
              Open Manual PDF <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      {/* Technical Evidence Matrix */}
      <div>
        <h4 className="text-xs font-mono uppercase text-zinc-500 mb-2.5 tracking-wider font-semibold">
          Diagnostic Evidence Telemetry
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          <div className="p-2.5 rounded bg-zinc-50 border border-zinc-200">
            <span className="text-[10px] font-mono text-zinc-500 uppercase block font-semibold">Device Model</span>
            <span className="text-xs font-mono text-zinc-900 font-medium truncate block">
              {diagnostic.evidence.deviceModel}
            </span>
          </div>
          <div className="p-2.5 rounded bg-zinc-50 border border-zinc-200">
            <span className="text-[10px] font-mono text-zinc-500 uppercase block font-semibold">Input Source</span>
            <span className="text-xs font-mono text-zinc-900 font-medium truncate block">
              {diagnostic.evidence.inputSource}
            </span>
          </div>
          <div className="p-2.5 rounded bg-zinc-50 border border-zinc-200">
            <span className="text-[10px] font-mono text-zinc-500 uppercase block font-semibold">Reported Cable State</span>
            <span className="text-xs font-mono text-zinc-900 font-medium truncate block">
              {diagnostic.evidence.reportedCableState}
            </span>
          </div>
          <div className="p-2.5 rounded bg-zinc-50 border border-zinc-200">
            <span className="text-[10px] font-mono text-zinc-500 uppercase block font-semibold">EDID Handshake</span>
            <span className={`text-xs font-mono font-medium truncate block ${
              diagnostic.evidence.edidHandshake.includes('Failed') ? 'text-rose-600 font-bold' : 'text-zinc-900'
            }`}>
              {diagnostic.evidence.edidHandshake}
            </span>
          </div>
          <div className="p-2.5 rounded bg-zinc-50 border border-zinc-200">
            <span className="text-[10px] font-mono text-zinc-500 uppercase block font-semibold">HDCP Status</span>
            <span className="text-xs font-mono text-zinc-900 font-medium truncate block">
              {diagnostic.evidence.hdcpStatus}
            </span>
          </div>
          <div className="p-2.5 rounded bg-zinc-50 border border-zinc-200">
            <span className="text-[10px] font-mono text-zinc-500 uppercase block font-semibold">Power / LED State</span>
            <span className="text-xs font-mono text-zinc-900 font-medium truncate block">
              {diagnostic.evidence.powerLedState}
            </span>
          </div>
        </div>
      </div>

      {/* Recommended Next Action */}
      <div className="p-3.5 rounded bg-zinc-50 border border-zinc-200">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-xs font-mono uppercase font-bold text-zinc-800">
            Recommended Technician Diagnostic Action
          </span>
        </div>
        <p className="text-xs text-zinc-700 font-sans leading-relaxed">
          {diagnostic.recommendedNextAction}
        </p>
      </div>
    </div>
  );
};
