import React from 'react';
import { useIncidents } from '../context/IncidentContext';
import { AlertCircle, X, ArrowRight, Sparkles } from 'lucide-react';

interface LiveIncidentFeedToastProps {
  onOpenIncident: (incidentId: string) => void;
}

export const LiveIncidentFeedToast: React.FC<LiveIncidentFeedToastProps> = ({ onOpenIncident }) => {
  const { liveToast, dismissLiveToast } = useIncidents();

  if (!liveToast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full no-print">
      <div className="bg-white border border-rose-300 rounded-lg p-4 shadow-2xl text-zinc-900 flex items-start gap-3 animate-in slide-in-from-bottom-4 duration-200">
        <div className="p-2 rounded bg-rose-50 border border-rose-200 text-rose-600 shrink-0">
          <AlertCircle className="w-5 h-5 animate-pulse" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-rose-50 border border-rose-200 text-rose-700 font-bold">
              Realtime Supabase Alert
            </span>
            <span className="text-xs font-mono font-bold text-zinc-800">
              {liveToast.incidentId}
            </span>
            <span className="text-xs text-zinc-500 font-mono">· {liveToast.room}</span>
          </div>

          <h4 className="text-xs font-bold text-zinc-900 truncate">
            {liveToast.device}
          </h4>

          <p className="text-xs text-zinc-600 line-clamp-2 mt-0.5">
            {liveToast.message}
          </p>

          <div className="flex items-center gap-2 mt-3 pt-2 border-t border-zinc-100">
            <button
              onClick={() => {
                onOpenIncident(liveToast.incidentId);
                dismissLiveToast();
              }}
              className="flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-200 font-semibold transition-colors"
            >
              <Sparkles className="w-3 h-3 text-sky-600" />
              Open AI Triage <ArrowRight className="w-3 h-3" />
            </button>
            <button
              onClick={dismissLiveToast}
              className="text-xs font-mono text-zinc-500 hover:text-zinc-800 px-2 py-1"
            >
              Dismiss
            </button>
          </div>
        </div>

        <button
          onClick={dismissLiveToast}
          className="text-zinc-400 hover:text-zinc-700 p-1 rounded"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
