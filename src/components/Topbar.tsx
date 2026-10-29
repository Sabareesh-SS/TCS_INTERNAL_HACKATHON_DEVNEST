import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useIncidents } from '../context/IncidentContext';
import {
  Menu,
  Search,
  Radio,
  Zap,
  ShieldCheck,
} from 'lucide-react';
import { NavigationPage } from './Sidebar';

interface TopbarProps {
  currentPage: NavigationPage;
  onOpenMobileSidebar: () => void;
  onOpenSearch?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  currentPage,
  onOpenMobileSidebar,
}) => {
  const { currentUser } = useAuth();
  const {
    isLiveFeedSimulated,
    setIsLiveFeedSimulated,
    triggerSimulatedAlert,
    searchQuery,
    setSearchQuery,
  } = useIncidents();

  const getPageTitle = (page: NavigationPage) => {
    switch (page) {
      case 'dashboard':
        return 'Campus AV Overview';
      case 'incidents':
        return 'Incident Queue & Dispatch';
      case 'classrooms':
        return 'Registered Classrooms & Facilities';
      case 'devices':
        return 'Equipment & Asset Inventory';
      case 'reports':
        return 'Telemetry & Recurring Fault Analytics';
      case 'qr-management':
        return 'QR Code Generator & Label Print Suite';
      case 'knowledge-base':
        return 'Verified Troubleshooting Knowledge Base';
      case 'users':
        return 'Technician Dispatch & Access Control';
      case 'settings':
        return 'Campus AV Network Settings';
      case 'profile':
        return 'Administrator Profile & System Station';
      default:
        return 'Smart Classroom AV Support';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 border-b border-zinc-200 px-4 sm:px-6 flex items-center justify-between gap-4 no-print backdrop-blur-xs">
      {/* Left: Mobile hamburger & Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-1.5 rounded text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-sm sm:text-base font-bold text-zinc-900 truncate">
            {getPageTitle(currentPage)}
          </h1>
          <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500">
            <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Supabase Realtime
            </span>
            <span className="text-zinc-300">·</span>
            <span>22ms ping</span>
          </div>
        </div>
      </div>

      {/* Center: Quick Search Input */}
      <div className="hidden md:flex items-center flex-1 max-w-xs">
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tickets, rooms, devices... (/)"
            className="w-full bg-zinc-50 border border-zinc-200 rounded pl-8 pr-3 py-1.5 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:bg-white focus:border-zinc-400 font-mono transition-colors"
          />
        </div>
      </div>

      {/* Right Controls: Telemetry Simulation & Administrator Status */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Realtime Live Simulation Toggle */}
        <div className="hidden sm:flex items-center gap-1 bg-zinc-100 border border-zinc-200 rounded p-1">
          <button
            type="button"
            onClick={() => setIsLiveFeedSimulated(!isLiveFeedSimulated)}
            className={`px-2 py-1 text-[11px] font-mono font-medium rounded transition-colors flex items-center gap-1 ${
              isLiveFeedSimulated
                ? 'bg-rose-100 text-rose-700 border border-rose-300'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
            title="Toggle live telemetry incoming incidents simulation"
          >
            <Radio className={`w-3 h-3 ${isLiveFeedSimulated ? 'animate-pulse text-rose-600' : ''}`} />
            Live Sim {isLiveFeedSimulated ? 'ON' : 'OFF'}
          </button>
          <button
            type="button"
            onClick={triggerSimulatedAlert}
            className="px-1.5 py-1 text-[10px] font-mono text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200 rounded"
            title="Trigger test incident immediately"
          >
            <Zap className="w-3 h-3 text-amber-500" />
          </button>
        </div>

        {/* Administrator Status Pill */}
        <div className="flex items-center gap-1.5 bg-violet-50 border border-violet-200 rounded px-2.5 py-1.5 text-xs font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-violet-700" />
          <span className="text-violet-800 font-bold">
            {currentUser.name}
          </span>
          <span className="text-[10px] font-mono uppercase bg-white px-1.5 py-0.2 rounded border border-violet-200 text-violet-700 font-semibold hidden md:inline">
            Admin
          </span>
        </div>
      </div>
    </header>
  );
};
