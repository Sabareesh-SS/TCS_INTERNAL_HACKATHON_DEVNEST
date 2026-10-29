import React from 'react';
import { useIncidents } from '../context/IncidentContext';
import { Menu, Search } from 'lucide-react';
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
  const { searchQuery, setSearchQuery } = useIncidents();

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
      case 'users':
        return 'Technician Dispatch & Access Control';
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
        </div>
      </div>

      {/* Center / Right: Quick Search Input */}
      <div className="flex items-center flex-1 max-w-sm ml-auto">
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
    </header>
  );
};
