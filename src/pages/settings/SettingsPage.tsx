import React from 'react';
import { SUPABASE_URL } from '../../services/supabaseClient';
import { Database, Sparkles, Key } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-zinc-700 font-semibold">
              System Configuration
            </span>
            <span className="text-xs font-mono text-emerald-600 font-semibold">
              Cluster Status: Operational
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 mt-1">
            System Settings & Microservice APIs
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600">
            Backend Supabase credentials, Member 3 LLM RAG endpoints, and Member 4 ML classification hooks
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Supabase Connection */}
        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-zinc-800">
                Supabase Backend & Row Level Security
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold">
              Connected (Realtime Active)
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div>
              <span className="text-zinc-500 block text-[10px] uppercase font-semibold">Supabase Endpoint URL</span>
              <span className="text-zinc-800 bg-zinc-50 p-2 rounded block border border-zinc-200 truncate">
                {SUPABASE_URL}
              </span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[10px] uppercase font-semibold">PostgreSQL Database Schema</span>
              <span className="text-zinc-700 font-medium">public.incidents, public.classrooms, public.devices, public.repairs</span>
            </div>
          </div>
        </div>

        {/* Member 3 & Member 4 AI Services (from Section 7) */}
        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-600" />
              <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-zinc-800">
                AI Diagnostics & ML Classification Integration
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-50 border border-sky-200 text-sky-700 font-bold">
              Microservices Linked
            </span>
          </div>

          <div className="space-y-3 text-xs font-sans">
            <div className="p-3 rounded bg-zinc-50 border border-zinc-200">
              <span className="text-xs font-mono font-bold text-sky-700 block mb-0.5">
                Member 3 — LLM + RAG Diagnostic Service
              </span>
              <p className="text-zinc-700 text-xs">
                Extracts manual grounding context from ingested vendor PDF vector embeddings. Automatically drafts probable cause hypotheses with confidence ratings.
              </p>
            </div>

            <div className="p-3 rounded bg-zinc-50 border border-zinc-200">
              <span className="text-xs font-mono font-bold text-amber-700 block mb-0.5">
                Member 4 — ML Fault-Classification Service
              </span>
              <p className="text-zinc-700 text-xs">
                Classifies hardware failure categories, priority scores, and predicts recurring classroom risks based on historical telemetry.
              </p>
            </div>
          </div>
        </div>

        {/* QR Token Security */}
        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-violet-600" />
              <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-zinc-800">
                QR Resolution & Cryptographic Token Policy
              </h3>
            </div>
          </div>

          <p className="text-xs text-zinc-700 font-sans leading-relaxed">
            All generated QR stickers use opaque identifier tokens that resolve through authenticated Supabase gateway lookups. If a physical barcode sticker is compromised or defaced in a lecture hall, administrators can instantly revoke and re-issue the token without changing the underlying asset serial number.
          </p>
        </div>
      </div>
    </div>
  );
};
