import { Ticket, TicketPriority, TicketStatus, RepairChecklistItem } from '../types/ticket';
import { Incident } from '../types/incident';
import { INITIAL_TICKETS } from './mockData';
import { DEFAULT_REPAIR_CHECKLIST } from '../utils/constants';
import { deviceService } from './deviceService';
import { notificationService } from './notificationService';

class TicketService {
  private tickets: Ticket[] = [...INITIAL_TICKETS];

  public async getAssignedTickets(technicianId?: string): Promise<Ticket[]> {
    if (technicianId) {
      return this.tickets.filter(t => t.assignedTechnicianId === technicianId || !t.assignedTechnicianId);
    }
    return [...this.tickets];
  }

  public async getTicketById(id: string): Promise<Ticket | null> {
    const found = this.tickets.find(t => t.id === id);
    return found ? { ...found } : null;
  }

  public async createTicketFromIncident(incident: Incident, priority: TicketPriority = 'high'): Promise<Ticket> {
    const ticketId = `TCK-${Date.now().toString().slice(-6)}`;
    const defaultLabels = DEFAULT_REPAIR_CHECKLIST[incident.deviceType] || DEFAULT_REPAIR_CHECKLIST.projector;

    const checklist: RepairChecklistItem[] = defaultLabels.map((lbl, idx) => ({
      id: `chk-${idx + 1}`,
      label: lbl,
      isCompleted: false,
    }));

    const newTicket: Ticket = {
      id: ticketId,
      incidentId: incident.id,
      incident: { ...incident },
      assignedTechnicianId: 'usr-tech-202',
      assignedTechnicianName: 'Alex Vance',
      priority,
      status: 'assigned',
      checklist,
      rootCause: '',
      workPerformed: '',
      partsRequired: '',
      technicianNotes: '',
      photoUris: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.tickets.unshift(newTicket);
    return newTicket;
  }

  public async toggleChecklistItem(ticketId: string, itemId: string): Promise<Ticket | null> {
    const idx = this.tickets.findIndex(t => t.id === ticketId);
    if (idx === -1) return null;

    const ticket = { ...this.tickets[idx] };
    ticket.checklist = ticket.checklist.map(item =>
      item.id === itemId ? { ...item, isCompleted: !item.isCompleted } : item
    );
    ticket.updatedAt = new Date().toISOString();

    this.tickets[idx] = ticket;
    return ticket;
  }

  public async updateTicketStatus(ticketId: string, status: TicketStatus): Promise<Ticket | null> {
    const idx = this.tickets.findIndex(t => t.id === ticketId);
    if (idx === -1) return null;

    const ticket = { ...this.tickets[idx] };
    ticket.status = status;
    ticket.updatedAt = new Date().toISOString();

    if (status === 'resolved') {
      ticket.resolvedAt = new Date().toISOString();
      await deviceService.updateDeviceStatus(ticket.incident.deviceId, 'operational');
      notificationService.addNotification({
        title: 'Repair Completed',
        message: `Technician resolved Ticket ${ticket.id} (${ticket.incident.deviceName}). Classroom AV verified operational.`,
        type: 'resolution',
      });
    }

    this.tickets[idx] = ticket;
    return ticket;
  }

  public async updateRepairNotes(
    ticketId: string,
    params: {
      rootCause?: string;
      workPerformed?: string;
      partsRequired?: string;
      technicianNotes?: string;
      status?: TicketStatus;
    }
  ): Promise<Ticket | null> {
    const idx = this.tickets.findIndex(t => t.id === ticketId);
    if (idx === -1) return null;

    const ticket = { ...this.tickets[idx] };
    if (params.rootCause !== undefined) ticket.rootCause = params.rootCause;
    if (params.workPerformed !== undefined) ticket.workPerformed = params.workPerformed;
    if (params.partsRequired !== undefined) ticket.partsRequired = params.partsRequired;
    if (params.technicianNotes !== undefined) ticket.technicianNotes = params.technicianNotes;
    if (params.status) ticket.status = params.status;

    ticket.updatedAt = new Date().toISOString();

    if (ticket.status === 'resolved') {
      ticket.resolvedAt = new Date().toISOString();
      await deviceService.updateDeviceStatus(ticket.incident.deviceId, 'operational');
    }

    this.tickets[idx] = ticket;
    return ticket;
  }
}

export const ticketService = new TicketService();
