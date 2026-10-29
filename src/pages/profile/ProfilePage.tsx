import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Key, Server, Lock, Bell, CheckCircle2 } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-zinc-700 font-semibold">
              System Administration
            </span>
            <span className="text-xs font-mono text-zinc-500">
              Corpus: BIT-NAVIS-AV26
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 mt-1">
            {currentUser.name}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600">
            {currentUser.specialty || 'Campus AV Operations Director & Infrastructure Architect'}
          </p>
        </div>

        <span className="text-xs font-mono uppercase px-3 py-1 rounded border font-bold border-violet-200 bg-violet-50 text-violet-700 flex items-center gap-1.5 self-start sm:self-auto">
          <ShieldCheck className="w-3.5 h-3.5 text-violet-600" />
          Administrator Role (Root)
        </span>
      </div>

      {/* Administrator Contact & Station Info */}
      <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-xs space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-zinc-800 flex items-center gap-2">
          <Server className="w-4 h-4 text-zinc-600" />
          Administrator Credentials & Operational Scope
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3 rounded bg-zinc-50 border border-zinc-200">
            <span className="text-[10px] text-zinc-500 uppercase block font-semibold mb-0.5">
              Campus Email
            </span>
            <span className="text-zinc-900 font-bold">{currentUser.email}</span>
          </div>

          <div className="p-3 rounded bg-zinc-50 border border-zinc-200">
            <span className="text-[10px] text-zinc-500 uppercase block font-semibold mb-0.5">
              Emergency Dispatch Hotline
            </span>
            <span className="text-zinc-900 font-bold">{currentUser.phone}</span>
          </div>

          <div className="p-3 rounded bg-zinc-50 border border-zinc-200">
            <span className="text-[10px] text-zinc-500 uppercase block font-semibold mb-0.5">
              Campus Operations Station
            </span>
            <span className="text-zinc-900">Engineering Complex AV Operations Room B-102</span>
          </div>

          <div className="p-3 rounded bg-zinc-50 border border-zinc-200">
            <span className="text-[10px] text-zinc-500 uppercase block font-semibold mb-0.5">
              Active Session Protocol
            </span>
            <span className="text-zinc-900 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              TLSv1.3 Encrypted · Token #TSCAI-ROOT-CHEN
            </span>
          </div>
        </div>
      </div>

      {/* System Privileges & RBAC Matrix */}
      <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-xs space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-zinc-800 flex items-center gap-2">
          <Key className="w-4 h-4 text-violet-600" />
          Administrative Privileges (Admin Role Exclusives)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3 rounded bg-zinc-50 border border-zinc-200 space-y-1">
            <div className="flex items-center gap-1.5 text-zinc-900 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Full Campus Root AV Access</span>
            </div>
            <p className="text-[11px] text-zinc-500 font-sans">
              Override equipment states, force reboot Crestron controllers, and cycle HDBaseT bus power.
            </p>
          </div>

          <div className="p-3 rounded bg-zinc-50 border border-zinc-200 space-y-1">
            <div className="flex items-center gap-1.5 text-zinc-900 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Field Technician Dispatch & Escalation</span>
            </div>
            <p className="text-[11px] text-zinc-500 font-sans">
              Assign or reassign active tickets directly to field technicians, manage duty roster, and trigger priority alerts.
            </p>
          </div>

          <div className="p-3 rounded bg-zinc-50 border border-zinc-200 space-y-1">
            <div className="flex items-center gap-1.5 text-zinc-900 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Cryptographic QR Code Hub Master</span>
            </div>
            <p className="text-[11px] text-zinc-500 font-sans">
              Issue high-resolution classroom & device QR tags, export print sheets, and rotate security tokens.
            </p>
          </div>

          <div className="p-3 rounded bg-zinc-50 border border-zinc-200 space-y-1">
            <div className="flex items-center gap-1.5 text-zinc-900 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>RAG Knowledge Base Curation</span>
            </div>
            <p className="text-[11px] text-zinc-500 font-sans">
              Upload vendor service manuals (Crestron, Shure, Epson, Panasonic) and approve verified troubleshooting articles.
            </p>
          </div>
        </div>
      </div>

      {/* Security & Notification Preferences */}
      <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-xs space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-zinc-800 flex items-center gap-2">
          <Bell className="w-4 h-4 text-zinc-600" />
          Operations & Telemetry Subscriptions
        </h3>
        <div className="space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between p-3 rounded bg-zinc-50 border border-zinc-200">
            <div>
              <span className="font-bold text-zinc-900 block">Critical AV Fault Push Notifications</span>
              <span className="text-[11px] text-zinc-500 font-sans">
                Immediately receive audio/video failure alerts impacting active lectures
              </span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 border border-emerald-200 text-emerald-800">
              Enabled
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded bg-zinc-50 border border-zinc-200">
            <div>
              <span className="font-bold text-zinc-900 block">Supabase Realtime Incident Feed</span>
              <span className="text-[11px] text-zinc-500 font-sans">
                WebSocket connection to live campus broadcast channels
              </span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 border border-emerald-200 text-emerald-800">
              Active
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded bg-zinc-50 border border-zinc-200">
            <div>
              <span className="font-bold text-zinc-900 block">Two-Factor Authentication (FIDO2 / WebAuthn)</span>
              <span className="text-[11px] text-zinc-500 font-sans">
                Hardware security key required for root administrative operations
              </span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-zinc-100 border border-zinc-200 text-zinc-700 flex items-center gap-1">
              <Lock className="w-3 h-3 text-zinc-500" />
              Hardware Key Linked
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
