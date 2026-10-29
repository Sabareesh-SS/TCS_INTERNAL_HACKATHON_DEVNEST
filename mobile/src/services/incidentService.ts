import { Incident, IncidentStatus } from '../types/incident';
import { DeviceType } from '../types/device';
import { DiagnosticResponse, DiagnosticStep } from '../types/diagnostic';
import { INITIAL_INCIDENTS } from './mockData';
import { diagnosticService } from './diagnosticService';
import { ticketService } from './ticketService';
import { deviceService } from './deviceService';
import { notificationService } from './notificationService';

class IncidentService {
  private incidents: Incident[] = [...INITIAL_INCIDENTS];

  public async getIncidents(reportedBy?: string): Promise<Incident[]> {
    if (reportedBy) {
      return this.incidents.filter(i => i.reportedBy === reportedBy);
    }
    return [...this.incidents];
  }

  public async getIncidentById(id: string): Promise<Incident | null> {
    const found = this.incidents.find(i => i.id === id);
    return found ? { ...found } : null;
  }

  public async createIncident(params: {
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
  }): Promise<Incident> {
    const incidentId = `INC-${Date.now().toString().slice(-6)}`;
    const steps = diagnosticService.generateSteps(params.deviceType, params.symptomCategory, incidentId);

    const newIncident: Incident = {
      id: incidentId,
      classroomId: params.classroomId,
      classroomName: params.classroomName,
      deviceId: params.deviceId,
      deviceName: params.deviceName,
      deviceType: params.deviceType,
      reportedBy: params.reportedBy,
      reportedByName: params.reportedByName,
      symptomCategory: params.symptomCategory,
      symptomDescription: params.symptomDescription,
      initialCheckPower: params.initialCheckPower,
      initialCheckCable: params.initialCheckCable,
      status: 'in_troubleshooting',
      diagnosticSteps: steps,
      createdAt: new Date().toISOString(),
    };

    // Update device status to faulty
    await deviceService.updateDeviceStatus(params.deviceId, 'faulty');

    this.incidents.unshift(newIncident);
    return newIncident;
  }

  public async recordStepResponse(
    incidentId: string,
    stepNumber: number,
    response: DiagnosticResponse
  ): Promise<Incident | null> {
    const idx = this.incidents.findIndex(i => i.id === incidentId);
    if (idx === -1) return null;

    const incident = { ...this.incidents[idx] };
    const stepIdx = incident.diagnosticSteps.findIndex(s => s.stepNumber === stepNumber);
    if (stepIdx !== -1) {
      incident.diagnosticSteps[stepIdx] = {
        ...incident.diagnosticSteps[stepIdx],
        facultyResponse: response,
        responseTimestamp: new Date().toISOString(),
      };
    }

    this.incidents[idx] = incident;
    return incident;
  }

  public async resolveIncidentByFaculty(incidentId: string): Promise<Incident | null> {
    const idx = this.incidents.findIndex(i => i.id === incidentId);
    if (idx === -1) return null;

    const incident = {
      ...this.incidents[idx],
      status: 'resolved_by_faculty' as IncidentStatus,
      resolvedAt: new Date().toISOString(),
    };

    // Restore device status to operational
    await deviceService.updateDeviceStatus(incident.deviceId, 'operational');

    this.incidents[idx] = incident;
    notificationService.addNotification({
      title: 'Incident Resolved',
      message: `Incident ${incident.id} for ${incident.deviceName} was successfully resolved by faculty self-troubleshooting.`,
      type: 'resolution',
    });

    return incident;
  }

  public async escalateToTechnician(incidentId: string, priority: 'medium' | 'high' | 'critical' = 'high'): Promise<Incident | null> {
    const idx = this.incidents.findIndex(i => i.id === incidentId);
    if (idx === -1) return null;

    const incident = { ...this.incidents[idx] };
    incident.status = 'escalated_to_technician';

    // Automatically generate technician ticket with full diagnostic evidence
    const ticket = await ticketService.createTicketFromIncident(incident, priority);
    incident.ticketId = ticket.id;

    this.incidents[idx] = incident;

    notificationService.addNotification({
      title: 'Escalated to Field Technician',
      message: `Ticket ${ticket.id} created for ${incident.classroomName}. A technician has been dispatched with all pre-diagnostic evidence.`,
      type: 'escalation',
    });

    return incident;
  }
}

export const incidentService = new IncidentService();
