import { useState, useEffect, useCallback } from 'react';
import { Incident } from '../types/incident';
import { DiagnosticResponse } from '../types/diagnostic';
import { DeviceType } from '../types/device';
import { incidentService } from '../services/incidentService';

export function useIncident(userId?: string) {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadIncidents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await incidentService.getIncidents(userId);
      setIncidents(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch incidents');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadIncidents();
  }, [loadIncidents]);

  const reportFault = async (params: {
    classroomId: string;
    classroomName: string;
    deviceId: string;
    deviceName: string;
    deviceType: DeviceType;
    reportedBy: string;
    reportedByName: string;
    symptomCategory: string;
    symptomDescription: string;
    initialCheckPower: boolean;
    initialCheckCable: boolean;
  }) => {
    const created = await incidentService.createIncident(params);
    await loadIncidents();
    return created;
  };

  const submitStepResult = async (incidentId: string, stepNumber: number, response: DiagnosticResponse) => {
    const updated = await incidentService.recordStepResponse(incidentId, stepNumber, response);
    await loadIncidents();
    return updated;
  };

  const resolveIncident = async (incidentId: string) => {
    const resolved = await incidentService.resolveIncidentByFaculty(incidentId);
    await loadIncidents();
    return resolved;
  };

  const escalateIncident = async (incidentId: string, priority?: 'medium' | 'high' | 'critical') => {
    const escalated = await incidentService.escalateToTechnician(incidentId, priority);
    await loadIncidents();
    return escalated;
  };

  return {
    incidents,
    isLoading,
    error,
    refresh: loadIncidents,
    reportFault,
    submitStepResult,
    resolveIncident,
    escalateIncident,
  };
}
