import React from 'react';
import { useIncidents } from '../../context/IncidentContext';
import { IncidentTable } from '../../components/IncidentTable';
import { IncidentPriority } from '../../types/incident';
import { DeviceType } from '../../types/device';
import { Search, RotateCcw, Zap } from 'lucide-react';
import { classroomService } from '../../services/classroomService';

interface IncidentListPageProps {
  onSelectIncident: (id: string) => void;
}

export const IncidentListPage: React.FC<IncidentListPageProps> = ({ onSelectIncident }) => {
  const {
    filteredIncidents,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    deviceTypeFilter,
    setDeviceTypeFilter,
    roomFilter,
    setRoomFilter,
    assignIncident,
    triggerSimulatedAlert,
    metrics,
  } = useIncidents();

  const classrooms = classroomService.getAll();

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setDeviceTypeFilter('all');
    setRoomFilter('all');
  };

  const handleDispatch = (id: string) => {
    // Admin dispatches ticket to primary on-duty field technician Alex Rivera
    assignIncident(id, 'usr_tech_01', 'Alex Rivera');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header & Live Queue Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-zinc-700 font-semibold">
              Live Dispatch Queue
            </span>
            <span className="text-xs font-mono text-emerald-600 flex items-center gap-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Realtime Active
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 mt-1">
            Incident Queue
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600">
            Real-time feed of campus AV tickets with AI-grounded troubleshooting steps
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={triggerSimulatedAlert}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono rounded bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-800 font-medium transition-colors"
            title="Inject simulated telemetry fault into the live feed"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            Simulate Incoming Ticket
          </button>
        </div>
      </div>

      {/* Filter Tabs & Filter Matrix */}
      <div className="p-4 rounded-lg border border-zinc-200 bg-white shadow-xs space-y-4">
        {/* Status Quick Pills */}
        <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-zinc-100">
          {[
            { id: 'all', label: 'All Incidents', count: metrics.openCount + metrics.resolvedTodayCount },
            { id: 'unassigned', label: 'Unassigned', count: metrics.awaitingCount },
            { id: 'in_progress', label: 'In Progress', count: metrics.inProgressCount },
            { id: 'resolved', label: 'Resolved', count: metrics.resolvedTodayCount },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as typeof statusFilter)}
              className={`px-3 py-1.5 text-xs font-mono rounded border transition-colors flex items-center gap-2 font-medium ${
                statusFilter === tab.id
                  ? 'bg-zinc-100 border-zinc-300 text-zinc-900 font-bold'
                  : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              <span>{tab.label}</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-white border border-zinc-200 text-zinc-700">
                {tab.count}
              </span>
            </button>
          ))}

          {(statusFilter !== 'all' || priorityFilter !== 'all' || deviceTypeFilter !== 'all' || roomFilter !== 'all' || searchQuery) && (
            <button
              onClick={handleResetFilters}
              className="ml-auto text-xs font-mono text-zinc-500 hover:text-zinc-800 flex items-center gap-1 px-2 py-1 font-semibold"
            >
              <RotateCcw className="w-3 h-3" /> Reset Filters
            </button>
          )}
        </div>

        {/* Detailed Dropdown Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
          {/* Room Filter */}
          <div>
            <label className="text-[10px] uppercase text-zinc-500 block mb-1 font-semibold">
              Classroom / Facility
            </label>
            <select
              value={roomFilter}
              onChange={(e) => setRoomFilter(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded px-2.5 py-1.5 text-zinc-800 focus:bg-white focus:outline-none focus:border-zinc-400"
            >
              <option value="all">All Classrooms</option>
              {classrooms.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id} · {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Device Type Filter */}
          <div>
            <label className="text-[10px] uppercase text-zinc-500 block mb-1 font-semibold">
              Device Category
            </label>
            <select
              value={deviceTypeFilter}
              onChange={(e) => setDeviceTypeFilter(e.target.value as DeviceType | 'all')}
              className="w-full bg-zinc-50 border border-zinc-200 rounded px-2.5 py-1.5 text-zinc-800 focus:bg-white focus:outline-none focus:border-zinc-400"
            >
              <option value="all">All Devices</option>
              <option value="projector">Projectors & Lasers</option>
              <option value="microphone">Microphones & Audio</option>
              <option value="smartboard">Interactive Displays</option>
              <option value="ptz-camera">PTZ Cameras</option>
              <option value="crestron">Automation Processors</option>
              <option value="amplifier">Amplifiers & DSP</option>
              <option value="switcher">Presentation Switchers</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="text-[10px] uppercase text-zinc-500 block mb-1 font-semibold">
              Priority Level
            </label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as IncidentPriority | 'all')}
              className="w-full bg-zinc-50 border border-zinc-200 rounded px-2.5 py-1.5 text-zinc-800 focus:bg-white focus:outline-none focus:border-zinc-400"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Search Box */}
          <div>
            <label className="text-[10px] uppercase text-zinc-500 block mb-1 font-semibold">
              Filter by Keyword
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="INC-001, HDMI, EDID..."
                className="w-full bg-zinc-50 border border-zinc-200 rounded pl-8 pr-2.5 py-1.5 text-zinc-800 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:border-zinc-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Incident Table */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono text-zinc-500">
            Showing {filteredIncidents.length} matching tickets
          </span>
        </div>
        <IncidentTable
          incidents={filteredIncidents}
          onSelectIncident={onSelectIncident}
          onAcceptAssignment={handleDispatch}
        />
      </div>
    </div>
  );
};
