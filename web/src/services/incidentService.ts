import { Incident, IncidentStatus, IncidentPriority, RepairRecord } from '../types/incident';
import { mockRealtimeHub } from './supabaseClient';

const SEED_INCIDENTS: Incident[] = [
  {
    id: 'INC-2026-001',
    status: 'unassigned',
    priority: 'high',
    classroomId: 'AB-105',
    classroomName: 'Academic Block · Room 105',
    deviceId: 'DEV004',
    deviceName: 'Main Lecture Projector',
    deviceType: 'projector',
    deviceModel: 'Epson PowerLite EB-E01 (Demo DEMO-P02)',
    reportedBy: 'Prof. Jonathan Hayes (Faculty - Physics Dept)',
    reportedAt: '15 minutes ago',
    updatedAt: 'Just now',
    reportedSymptom: 'Projector is on but displays No Signal',
    aiDiagnostic: {
      confidenceScore: 94,
      probableCauseHypothesis: 'Input source mismatch between HDMI1 and active laptop video output mode.',
      isHypothesisVerified: false,
      lastStepAttempted: 'Faculty checked the physical HDMI connector at the podium wall plate.',
      attemptResult: 'Cable seated firmly, but projector still reports No Signal prompt.',
      manualReference: {
        manualTitle: "Epson PowerLite EB-E01 User's Guide (CPD-59263)",
        section: 'Solving Projector Problems - No Image Appears',
        pageNumber: 104,
        snippet: 'Confirm source device is awake; cycle Source Search or press HDMI on remote; verify external display mirror settings (Win+P).',
        docUrl: 'https://files.support.epson.com/docid/cpd5/cpd59263.pdf',
      },
      recommendedNextAction: 'Confirm source is awake, select HDMI1, and verify laptop external display output mode (Win+P).',
      evidence: {
        deviceModel: 'Epson PowerLite EB-E01',
        inputSource: 'HDMI1 (Wall Plate)',
        reportedCableState: 'Connected firmly; no visible pin damage',
        edidHandshake: 'Active',
        hdcpStatus: 'Pass',
        powerLedState: 'Solid Blue (Normal Lamp Run Mode)',
      },
    },
  },
  {
    id: 'INC-2026-002',
    status: 'in_progress',
    priority: 'critical',
    classroomId: 'CB-301',
    classroomName: 'Central Block · Room 301',
    deviceId: 'DEV008',
    deviceName: 'Wireless Lapel Microphone',
    deviceType: 'microphone',
    deviceModel: 'Shure BLX24 / PG58 (Demo DEMO-M03)',
    reportedBy: 'Dr. Aris Thorne (Faculty - Computer Science)',
    reportedAt: '38 minutes ago',
    updatedAt: '15 minutes ago',
    assignedTechnicianId: 'usr_tech_01',
    assignedTechnicianName: 'Alex Rivera',
    reportedSymptom: 'Microphone transmitter LED remains off during lecture',
    aiDiagnostic: {
      confidenceScore: 96,
      probableCauseHypothesis: 'Transmitter bodypack AA alkaline batteries depleted or battery contacts disconnected.',
      isHypothesisVerified: true,
      lastStepAttempted: 'Faculty confirmed transmitter power toggle is switched to ON.',
      attemptResult: 'Status LED does not illuminate green or red.',
      manualReference: {
        manualTitle: 'Shure BLX Wireless System User Guide',
        section: 'Section 4 — Power & Battery Status Troubleshooting',
        pageNumber: 11,
        snippet: 'If transmitter LED does not illuminate when switched ON, replace dual AA alkaline batteries checking correct polarity orientation.',
        docUrl: 'https://pubs.shure.com/guide/BLX/en-US',
      },
      recommendedNextAction: 'Install fresh AA alkaline batteries and inspect spring contacts inside battery compartment.',
      evidence: {
        deviceModel: 'Shure BLX24 / PG58',
        inputSource: 'XLR Balanced Line to AV Wall Receiver',
        reportedCableState: 'XLR patch cable intact',
        edidHandshake: 'N/A (Audio Stream)',
        hdcpStatus: 'N/A',
        powerLedState: 'Off (Depleted)',
      },
    },
    repairRecord: {
      acceptedAt: '30 minutes ago',
      startedAt: '15 minutes ago',
      repairNotes: 'Arrived at CB-301 with replacement AA battery cells. Testing battery terminals.',
    },
  },
  {
    id: 'INC-2026-003',
    status: 'resolved',
    priority: 'medium',
    classroomId: 'AB-204',
    classroomName: 'Academic Block · Room 204',
    deviceId: 'DEV003',
    deviceName: 'Interactive Touch Display 75"',
    deviceType: 'smartboard',
    deviceModel: 'Promethean ActivPanel 9 (Demo DEMO-S01)',
    reportedBy: 'Prof. Clara Oswald (Faculty - Mathematics)',
    reportedAt: '2 hours ago',
    updatedAt: '25 minutes ago',
    assignedTechnicianId: 'usr_tech_02',
    assignedTechnicianName: 'Marcus Vance',
    reportedSymptom: 'Touch stylus input does not respond on display surface',
    aiDiagnostic: {
      confidenceScore: 92,
      probableCauseHypothesis: 'USB Touch upstream cable disconnected or loose at podium interface plate.',
      isHypothesisVerified: true,
      lastStepAttempted: 'Faculty restarted interactive display panel via front power button.',
      attemptResult: 'Display showed video desktop but touch response remained inactive.',
      manualReference: {
        manualTitle: 'Promethean ActivPanel 9 User Guide',
        section: 'Section 3.2 — USB Touch and Stylus Connectivity',
        pageNumber: 32,
        snippet: 'Ensure USB Touch Type-B cable is securely connected to the Touch In port paired with the active HDMI input.',
        docUrl: 'https://support.prometheanworld.com/activpanel-9',
      },
      recommendedNextAction: 'Inspect and re-seat USB Touch upstream cable to restore HID digitizer communication.',
      evidence: {
        deviceModel: 'Promethean ActivPanel 9',
        inputSource: 'HDMI1 + USB Touch Type-B',
        reportedCableState: 'USB cable re-seated firmly',
        edidHandshake: 'Pass (3840x2160@60Hz)',
        hdcpStatus: 'Active',
        powerLedState: 'Solid White (Ready)',
      },
    },
    repairRecord: {
      acceptedAt: '1 hour ago',
      startedAt: '45 minutes ago',
      resolvedAt: '25 minutes ago',
      rootCause: 'Podium USB-B upstream patch cord was unseated by lectern movement.',
      repairNotes: 'Reconnected USB Touch upstream cable to port Touch-1. Tested multi-touch stylus response in whiteboard app.',
      partsRequired: ['Standard USB-A to USB-B 2.0 cable'],
      technicianRemarks: 'Faculty verified handwriting and gesture controls successfully.',
      resolvedByTechnician: 'Marcus Vance',
    },
  },
];

const STORAGE_KEY = 'tscai_campus_incidents_v3';

// Auto-purge any stale legacy dummy data from earlier browser runs
if (typeof window !== 'undefined') {
  try {
    const legacyOld = localStorage.getItem('tscai_incidents_data');
    if (legacyOld && (legacyOld.includes('INC-001') || legacyOld.includes('PT-MZ780') || legacyOld.includes('Sony') || legacyOld.includes('Crestron'))) {
      localStorage.removeItem('tscai_incidents_data');
    }
  } catch {}
}

export const incidentService = {
  getAll: (): Incident[] => {
    // Check and clean if stale legacy data is present
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      try {
        const parsed: Incident[] = JSON.parse(data);
        const hasLegacy = parsed.some((i) => i.id === 'INC-001' || i.deviceModel?.includes('PT-MZ780') || i.classroomId === 'SCI-302');
        if (!hasLegacy && parsed.length > 0) {
          return parsed;
        }
      } catch {
        // fallback
      }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_INCIDENTS));
    return SEED_INCIDENTS;
  },

  getById: (id: string): Incident | undefined => {
    const list = incidentService.getAll();
    return list.find((inc) => inc.id === id);
  },

  getMetrics: () => {
    const list = incidentService.getAll();
    // In our live campus view:
    // Open = unassigned + in_progress + awaiting_verification
    const openIncidents = list.filter((i) => i.status !== 'resolved');
    const awaitingAssignment = list.filter((i) => i.status === 'unassigned');
    const inProgress = list.filter((i) => i.status === 'in_progress');
    const resolvedToday = list.filter((i) => i.status === 'resolved');

    return {
      openCount: openIncidents.length,
      awaitingCount: awaitingAssignment.length,
      inProgressCount: inProgress.length,
      resolvedTodayCount: resolvedToday.length + 7, // reflects full campus shift activity
    };
  },

  assignToTechnician: (incidentId: string, technicianId: string, technicianName: string): Incident => {
    const list = incidentService.getAll();
    const index = list.findIndex((i) => i.id === incidentId);
    if (index === -1) throw new Error('Incident not found');

    const updated: Incident = {
      ...list[index],
      status: 'in_progress',
      assignedTechnicianId: technicianId,
      assignedTechnicianName: technicianName,
      updatedAt: 'Just now',
      repairRecord: {
        ...list[index].repairRecord,
        acceptedAt: 'Just now',
        startedAt: 'Just now',
      },
    };

    list[index] = updated;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    mockRealtimeHub.incidentChannel.emit('UPDATE', updated, list[index]);

    // Asynchronously notify backend
    const backendUrl = import.meta.env.VITE_AI_ENGINE_URL || 'http://localhost:8000';
    fetch(`${backendUrl}/api/diagnostics/ticket-update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ incident_id: incidentId, technician_id: technicianId, status: 'in_progress' }),
    }).catch(() => {});

    return updated;
  },

  updateRepairStatus: (
    incidentId: string,
    status: IncidentStatus,
    repairData?: Partial<RepairRecord>
  ): Incident => {
    const list = incidentService.getAll();
    const index = list.findIndex((i) => i.id === incidentId);
    if (index === -1) throw new Error('Incident not found');

    const current = list[index];
    const updated: Incident = {
      ...current,
      status,
      updatedAt: 'Just now',
      repairRecord: {
        ...current.repairRecord,
        ...repairData,
        resolvedAt: status === 'resolved' ? 'Just now' : current.repairRecord?.resolvedAt,
      },
    };

    list[index] = updated;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    mockRealtimeHub.incidentChannel.emit('UPDATE', updated, current);

    // Asynchronously notify backend
    const backendUrl = import.meta.env.VITE_AI_ENGINE_URL || 'http://localhost:8000';
    fetch(`${backendUrl}/api/diagnostics/ticket-update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ incident_id: incidentId, status }),
    }).catch(() => {});

    return updated;
  },

  syncFromBackend: async (): Promise<Incident[]> => {
    const backendUrl = import.meta.env.VITE_AI_ENGINE_URL || 'http://localhost:8000';
    try {
      const res = await fetch(`${backendUrl}/api/diagnostics/incidents`, {
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        const backendSessions = await res.json();
        if (Array.isArray(backendSessions) && backendSessions.length > 0) {
          const list = incidentService.getAll();
          let changed = false;

          for (const session of backendSessions) {
            const existingIdx = list.findIndex((i) => i.id === session.incident_id);
            const isEscalated = session.status === 'ESCALATED';
            const isResolved = session.status === 'RESOLVED';
            const webStatus: IncidentStatus = isEscalated
              ? 'unassigned'
              : isResolved
              ? 'resolved'
              : 'in_progress';

            const techSummary = session.technician_summary || {};
            const lastStep =
              session.step_history && session.step_history.length > 0
                ? session.step_history[session.step_history.length - 1]
                : null;

            const mappedIncident: Incident = {
              id: session.incident_id,
              status: webStatus,
              priority: isEscalated ? 'critical' : 'high',
              classroomId: session.room_no || session.classroom_id || 'AB-105',
              classroomName: `Academic Block · Room ${session.room_no || session.classroom_id || 'AB-105'}`,
              deviceId: session.device_id,
              deviceName: `Campus Hardware Asset (${session.device_id})`,
              deviceType: (techSummary.device_type?.toLowerCase() || 'projector') as any,
              deviceModel: techSummary.model || 'Demo OEM Reference Model',
              reportedBy: 'Faculty Member (Mobile App)',
              reportedAt: session.created_at
                ? new Date(session.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : 'Just now',
              updatedAt: 'Just now',
              reportedSymptom: session.symptom,
              aiDiagnostic: {
                confidenceScore: 96,
                probableCauseHypothesis:
                  techSummary.escalation_reason || 'AI Grounded Fault Classification',
                isHypothesisVerified: isResolved,
                lastStepAttempted: lastStep
                  ? `Step ${lastStep.step_number}: ${lastStep.action_id}`
                  : 'Diagnostic Triage Initialized',
                attemptResult: lastStep ? lastStep.result : 'Pending Faculty Action',
                manualReference: techSummary.manual_references?.[0]
                  ? {
                      manualTitle: techSummary.manual_references[0].title,
                      section: techSummary.manual_references[0].section,
                      pageNumber: techSummary.manual_references[0].page || 1,
                      snippet: techSummary.escalation_reason || 'OEM benchmark reference procedure.',
                      docUrl:
                        techSummary.manual_references[0].source_url ||
                        'https://files.support.epson.com/docid/cpd5/cpd59263.pdf',
                    }
                  : undefined,
                recommendedNextAction:
                  techSummary.recommended_parts_or_tools || 'Inspect physical equipment on-site.',
                evidence: {
                  deviceModel: techSummary.model || 'Campus Hardware',
                  inputSource: 'HDMI / Active Source',
                  reportedCableState: 'Connected',
                  edidHandshake: 'Active',
                  hdcpStatus: 'Normal',
                  powerLedState: 'Active',
                },
              },
            };

            if (existingIdx !== -1) {
              list[existingIdx] = { ...list[existingIdx], ...mappedIncident };
            } else {
              list.unshift(mappedIncident);
              mockRealtimeHub.incidentChannel.emit('INSERT', mappedIncident);
            }
            changed = true;
          }

          if (changed) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
          }
          return list;
        }
      }
    } catch {
      // Backend not running; local storage seamlessly maintained
    }
    return incidentService.getAll();
  },

  createSimulatedIncident: (): Incident => {
    const list = incidentService.getAll();
    const newNumber = list.length + 1;
    const newId = `INC-2026-${String(newNumber).padStart(3, '0')}`;
    const newIncident: Incident = {
      id: newId,
      status: 'unassigned',
      priority: Math.random() > 0.5 ? 'critical' : 'high',
      classroomId: 'AB-105',
      classroomName: 'Academic Block · Room 105',
      deviceId: 'DEV004',
      deviceName: 'Main Lecture Projector',
      deviceType: 'projector',
      deviceModel: 'Epson PowerLite EB-E01 (Demo DEMO-P02)',
      reportedBy: 'Faculty Alert (Automated RAG Triage)',
      reportedAt: 'Just now',
      updatedAt: 'Just now',
      reportedSymptom: 'Auto-telemetry alert: HDMI signal loss on wall plate port 1.',
      aiDiagnostic: {
        confidenceScore: 94,
        probableCauseHypothesis: 'Input source mismatch or laptop external display mirror setting deactivated.',
        isHypothesisVerified: false,
        lastStepAttempted: 'Faculty pressed input re-sync button on podium plate.',
        attemptResult: 'Display sync timeout. HDMI Rx failed to lock pixel clock.',
        manualReference: {
          manualTitle: "Epson PowerLite EB-E01 User's Guide (CPD-59263)",
          section: 'Solving Projector Problems - No Image Appears',
          pageNumber: 104,
          snippet: 'Confirm source device is awake; cycle Source Search or press HDMI on remote; verify external display mirror settings (Win+P).',
        },
        recommendedNextAction: 'Field technician verify 5V line and test HDMI patch cord.',
        evidence: {
          deviceModel: 'Epson PowerLite EB-E01',
          inputSource: 'HDMI1 (Wall Plate)',
          reportedCableState: 'Connected',
          edidHandshake: 'Failed',
          hdcpStatus: 'Inactive',
          powerLedState: 'Solid Blue',
        },
      },
    };

    const updatedList = [newIncident, ...list];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    mockRealtimeHub.incidentChannel.emit('INSERT', newIncident);
    return newIncident;
  },

  resetDemoData: () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_INCIDENTS));
  },
};
