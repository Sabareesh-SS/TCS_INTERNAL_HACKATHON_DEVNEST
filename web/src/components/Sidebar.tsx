import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useIncidents } from '../context/IncidentContext';
import {
  LayoutDashboard,
  Inbox,
  DoorClosed,
  Cpu,
  BarChart3,
  QrCode,
  BookOpen,
  Users,
  Settings,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export type NavigationPage =
  | 'dashboard'
  | 'incidents'
  | 'classrooms'
  | 'devices'
  | 'qr-management'
  | 'knowledge-base'
  | 'reports'
  | 'users'
  | 'settings'
  | 'profile';

interface SidebarProps {
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  isOpenMobile,
  onCloseMobile,
}) => {
  const { currentUser } = useAuth();
  const { metrics } = useIncidents();

  const handleNav = (page: NavigationPage) => {
    onNavigate(page);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside
      className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-white border-r border-zinc-200 flex flex-col justify-between transition-transform duration-200 no-print ${
        isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      {/* Top Brand */}
      <div>
        <div className="p-5 border-b border-zinc-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-900 font-mono font-bold text-sm">
              <Sparkles className="w-4 h-4 text-sky-600" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-900">
                  TSCAI ADMIN
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
              <p className="text-[11px] text-zinc-500 font-mono">
                Campus AV Operations
              </p>
            </div>
          </div>
        </div>

        {/* Administrator Role Pill */}
        <div className="p-3 mx-3 my-3 rounded bg-zinc-50 border border-zinc-200">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-500 uppercase text-[10px]">Dashboard Role</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase border border-violet-200 bg-violet-50 text-violet-700 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-violet-600" />
              Administrator
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-xs text-zinc-900 font-bold truncate">
            <span className="truncate">{currentUser.name}</span>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="px-3 py-2 space-y-5 overflow-y-auto max-h-[calc(100vh-250px)]">
          {/* Operations Section */}
          <div className="space-y-1">
            <span className="px-3 text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-1 font-semibold">
              Campus Operations
            </span>

            <button
              onClick={() => handleNav('dashboard')}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-mono rounded transition-colors ${
                currentPage === 'dashboard'
                  ? 'bg-zinc-100 text-zinc-900 font-bold border border-zinc-200'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4 text-zinc-500" />
                <span>Dashboard</span>
              </div>
              {metrics.openCount > 0 && (
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-zinc-100 text-zinc-700 border border-zinc-200 font-medium">
                  {metrics.openCount}
                </span>
              )}
            </button>

            <button
              onClick={() => handleNav('incidents')}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-mono rounded transition-colors ${
                currentPage === 'incidents'
                  ? 'bg-zinc-100 text-zinc-900 font-bold border border-zinc-200'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Inbox className="w-4 h-4 text-zinc-500" />
                <span>Incident Queue</span>
              </div>
              {metrics.awaitingCount > 0 && (
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-rose-50 border border-rose-200 text-rose-700 font-bold">
                  {metrics.awaitingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => handleNav('classrooms')}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-mono rounded transition-colors ${
                currentPage === 'classrooms'
                  ? 'bg-zinc-100 text-zinc-900 font-bold border border-zinc-200'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <DoorClosed className="w-4 h-4 text-zinc-500" />
                <span>Classrooms</span>
              </div>
            </button>

            <button
              onClick={() => handleNav('devices')}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-mono rounded transition-colors ${
                currentPage === 'devices'
                  ? 'bg-zinc-100 text-zinc-900 font-bold border border-zinc-200'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Cpu className="w-4 h-4 text-zinc-500" />
                <span>Device Inventory</span>
              </div>
            </button>
          </div>

          {/* Administration Section */}
          <div className="space-y-1 pt-3 border-t border-zinc-200">
            <span className="px-3 text-[10px] font-mono uppercase tracking-wider text-violet-700 font-bold block mb-1">
              Admin & Governance
            </span>

            <button
              onClick={() => handleNav('qr-management')}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-mono rounded transition-colors ${
                currentPage === 'qr-management'
                  ? 'bg-zinc-100 text-zinc-900 font-bold border border-zinc-200'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <QrCode className="w-4 h-4 text-violet-600" />
                <span>QR Code Hub</span>
              </div>
            </button>

            <button
              onClick={() => handleNav('knowledge-base')}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-mono rounded transition-colors ${
                currentPage === 'knowledge-base'
                  ? 'bg-zinc-100 text-zinc-900 font-bold border border-zinc-200'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-violet-600" />
                <span>RAG Knowledge Base</span>
              </div>
            </button>

            <button
              onClick={() => handleNav('reports')}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-mono rounded transition-colors ${
                currentPage === 'reports'
                  ? 'bg-zinc-100 text-zinc-900 font-bold border border-zinc-200'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BarChart3 className="w-4 h-4 text-violet-600" />
                <span>Reports & Analytics</span>
              </div>
            </button>

            <button
              onClick={() => handleNav('users')}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-mono rounded transition-colors ${
                currentPage === 'users'
                  ? 'bg-zinc-100 text-zinc-900 font-bold border border-zinc-200'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-violet-600" />
                <span>Technician Dispatch</span>
              </div>
            </button>

            <button
              onClick={() => handleNav('settings')}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-mono rounded transition-colors ${
                currentPage === 'settings'
                  ? 'bg-zinc-100 text-zinc-900 font-bold border border-zinc-200'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Settings className="w-4 h-4 text-violet-600" />
                <span>System Settings</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Administrator Profile */}
      <div className="p-3 border-t border-zinc-200 bg-white">
        <button
          onClick={() => handleNav('profile')}
          className="w-full flex items-center gap-2.5 text-left p-1 rounded hover:bg-zinc-100 transition-colors"
        >
          <div className="w-7 h-7 rounded-full bg-violet-100 border border-violet-200 flex items-center justify-center font-mono text-xs text-violet-800 font-bold shrink-0">
            SC
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-xs font-bold text-zinc-900 truncate block">
              {currentUser.name}
            </span>
            <span className="text-[10px] font-mono text-zinc-500 truncate block">
              Campus AV Operations Director
            </span>
          </div>
        </button>
      </div>
    </aside>
  );
};
