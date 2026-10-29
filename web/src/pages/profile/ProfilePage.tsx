import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Server } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900">
            {currentUser.name}
          </h2>
        </div>
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
    </div>
  );
};
