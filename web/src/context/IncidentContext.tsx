import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Incident, IncidentStatus, IncidentPriority, RepairRecord } from '../types/incident';
import { DeviceType } from '../types/device';
import { incidentService } from '../services/incidentService';
import { mockRealtimeHub } from '../services/supabaseClient';

interface LiveToast {
  id: string;
  incidentId: string;
  room: string;
  device: string;
  message: string;
  priority: IncidentPriority;
}

interface IncidentContextType {
  incidents: Incident[];
  activeIncidentId: string | null;
  setActiveIncidentId: (id: string | null) => void;
  metrics: {
    openCount: number;
    awaitingCount: number;
    inProgressCount: number;
    resolvedTodayCount: number;
  };
  // Filters
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  statusFilter: IncidentStatus | 'all';
  setStatusFilter: (s: IncidentStatus | 'all') => void;
  priorityFilter: IncidentPriority | 'all';
  setPriorityFilter: (p: IncidentPriority | 'all') => void;
  deviceTypeFilter: DeviceType | 'all';
  setDeviceTypeFilter: (d: DeviceType | 'all') => void;
  roomFilter: string | 'all';
  setRoomFilter: (r: string | 'all') => void;
  filteredIncidents: Incident[];
  // Actions
  assignIncident: (incidentId: string, techId: string, techName: string) => void;
  updateStatus: (incidentId: string, status: IncidentStatus, repairData?: Partial<RepairRecord>) => void;
  // Live Feed Simulation
  isLiveFeedSimulated: boolean;
  setIsLiveFeedSimulated: (sim: boolean) => void;
  triggerSimulatedAlert: () => Incident;
  liveToast: LiveToast | null;
  dismissLiveToast: () => void;
}

const IncidentContext = createContext<IncidentContextType | undefined>(undefined);

export const IncidentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [incidents, setIncidents] = useState<Incident[]>(() => incidentService.getAll());
  const [activeIncidentId, setActiveIncidentId] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<IncidentStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<IncidentPriority | 'all'>('all');
  const [deviceTypeFilter, setDeviceTypeFilter] = useState<DeviceType | 'all'>('all');
  const [roomFilter, setRoomFilter] = useState<string | 'all'>('all');

  // Simulation & Toasts
  const [isLiveFeedSimulated, setIsLiveFeedSimulated] = useState(false);
  const [liveToast, setLiveToast] = useState<LiveToast | null>(null);

  const refreshIncidents = useCallback(() => {
    setIncidents(incidentService.getAll());
  }, []);

  // Realtime subscription setup & backend synchronization
  useEffect(() => {
    // Initial sync from backend
    incidentService.syncFromBackend().then(() => {
      refreshIncidents();
    });

    // Periodic synchronization to capture faculty reports & AI escalations
    const pollInterval = setInterval(() => {
      incidentService.syncFromBackend().then(() => {
        refreshIncidents();
      });
    }, 4000);

    const channel = mockRealtimeHub.incidentChannel;
    channel.on('*', (payload) => {
      refreshIncidents();
      if (payload.event === 'INSERT') {
        const item = payload.new as Incident;
        setLiveToast({
          id: String(Date.now()),
          incidentId: item.id,
          room: item.classroomId,
          device: item.deviceName,
          message: item.reportedSymptom,
          priority: item.priority,
        });
      }
    });

    return () => {
      clearInterval(pollInterval);
    };
  }, [refreshIncidents]);

  // Periodic automatic simulated feed when enabled
  useEffect(() => {
    if (!isLiveFeedSimulated) return;

    const interval = setInterval(() => {
      const newInc = incidentService.createSimulatedIncident();
      setLiveToast({
        id: String(Date.now()),
        incidentId: newInc.id,
        room: newInc.classroomId,
        device: newInc.deviceName,
        message: newInc.reportedSymptom,
        priority: newInc.priority,
      });
      refreshIncidents();
    }, 28000);

    return () => clearInterval(interval);
  }, [isLiveFeedSimulated, refreshIncidents]);

  const assignIncident = (incidentId: string, techId: string, techName: string) => {
    incidentService.assignToTechnician(incidentId, techId, techName);
    refreshIncidents();
  };

  const updateStatus = (
    incidentId: string,
    status: IncidentStatus,
    repairData?: Partial<RepairRecord>
  ) => {
    incidentService.updateRepairStatus(incidentId, status, repairData);
    refreshIncidents();
  };

  const triggerSimulatedAlert = () => {
    const newInc = incidentService.createSimulatedIncident();
    setLiveToast({
      id: String(Date.now()),
      incidentId: newInc.id,
      room: newInc.classroomId,
      device: newInc.deviceName,
      message: newInc.reportedSymptom,
      priority: newInc.priority,
    });
    refreshIncidents();
    return newInc;
  };

  const dismissLiveToast = () => setLiveToast(null);

  // Compute filtered incidents
  const filteredIncidents = incidents.filter((item) => {
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && item.priority !== priorityFilter) return false;
    if (deviceTypeFilter !== 'all' && item.deviceType !== deviceTypeFilter) return false;
    if (roomFilter !== 'all' && item.classroomId !== roomFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = item.id.toLowerCase().includes(q);
      const matchRoom = item.classroomId.toLowerCase().includes(q) || item.classroomName.toLowerCase().includes(q);
      const matchDevice = item.deviceName.toLowerCase().includes(q) || item.deviceModel.toLowerCase().includes(q);
      const matchSymptom = item.reportedSymptom.toLowerCase().includes(q);
      if (!matchId && !matchRoom && !matchDevice && !matchSymptom) return false;
    }
    return true;
  });

  const metrics = incidentService.getMetrics();

  return (
    <IncidentContext.Provider
      value={{
        incidents,
        activeIncidentId,
        setActiveIncidentId,
        metrics,
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
        filteredIncidents,
        assignIncident,
        updateStatus,
        isLiveFeedSimulated,
        setIsLiveFeedSimulated,
        triggerSimulatedAlert,
        liveToast,
        dismissLiveToast,
      }}
    >
      {children}
    </IncidentContext.Provider>
  );
};

export const useIncidents = () => {
  const context = useContext(IncidentContext);
  if (!context) {
    throw new Error('useIncidents must be used within an IncidentProvider');
  }
  return context;
};
