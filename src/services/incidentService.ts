import { Incident, IncidentStatus, IncidentPriority, RepairRecord } from '../types/incident';
import { mockRealtimeHub } from './supabaseClient';

const SEED_INCIDENTS: Incident[] = [
  {
    id: 'INC-001',
    status: 'unassigned',
    priority: 'high',
    classroomId: 'AB-204',
    classroomName: 'Academic Block A · Room 204',
    deviceId: 'AV-P204-01',
    deviceName: 'Main Auditorium Laser Projector',
    deviceType: 'projector',
    deviceModel: 'Panasonic PT-MZ780 (7,000 lm WUXGA)',
    reportedBy: 'Prof. Jonathan Hayes (Faculty - Physics Dept)',
    reportedAt: '12 minutes ago',
    updatedAt: 'Just now',
    reportedSymptom: 'Projector is powered on, but no display appears.',
    aiDiagnostic: {
      confidenceScore: 89,
      probableCauseHypothesis: 'Wall plate HDMI Tx transmitter 5V pin fault or EDID hot-plug handshake timeout.',
      isHypothesisVerified: false,
      lastStepAttempted: 'Faculty verified the selected input source against the connected HDMI port.',
      attemptResult: 'Problem persists. The next recommended diagnostic action requires verification.',
      manualReference: {
        manualTitle: 'Panasonic PT-MZ780 Operating Instructions Rev 3.2',
        section: 'Section 4.3 — Signal Verification & EDID Configuration',
        pageNumber: 42,
        snippet: 'When the projector status LED indicates solid blue with HDMI input selected but no raster displays, test the Hot Plug Detect (HPD) signal pin 19.',
        docUrl: 'https://docs.panasonic-av.example/manuals/pt-mz780-rev3.2.pdf',
      },
      recommendedNextAction: 'Verify physical 5V DC line on Wall Plate Port 1 using multimeter, or test with direct CAT6 HDBaseT bypass cable.',
      evidence: {
        deviceModel: 'Panasonic PT-MZ780',
        inputSource: 'Input 1 (HDMI / HDBaseT Wall Receiver)',
        reportedCableState: 'Firmly seated by faculty; no physical pin bend visible',
        edidHandshake: 'Failed (No HPD pulse detected by Crestron DM-Lite transmitter)',
        hdcpStatus: 'Negotiation Inactive (Cipher idle)',
        powerLedState: 'Solid Blue (Normal Lamp Run Mode)',
      },
    },
  },
  {
    id: 'INC-002',
    status: 'in_progress',
    priority: 'critical',
    classroomId: 'AB-105',
    classroomName: 'Academic Block A · Lecture Hall 105',
    deviceId: 'AV-M105-02',
    deviceName: 'Wireless Lapel Mic System',
    deviceType: 'microphone',
    deviceModel: 'Shure ULXD4 Digital Wireless Receiver',
    reportedBy: 'Dr. Aris Thorne (Faculty - Computer Science)',
    reportedAt: '38 minutes ago',
    updatedAt: '15 minutes ago',
    assignedTechnicianId: 'usr_tech_01',
    assignedTechnicianName: 'Alex Rivera',
    reportedSymptom: 'Microphone audio drops out every 20-30 seconds with loud audible screeching.',
    aiDiagnostic: {
      confidenceScore: 94,
      probableCauseHypothesis: 'RF intermodulation interference detected on 542.125 MHz channel from nearby student wireless hotspot or cellular carrier rebroadcast.',
      isHypothesisVerified: true,
      lastStepAttempted: 'Faculty power-cycled transmitter pack and replaced dual AA batteries.',
      attemptResult: 'RF meter continues to spike into red warning zone intermittently.',
      manualReference: {
        manualTitle: 'Shure ULX-D Wireless System User Guide Rev 7',
        section: 'Section 8.1 — Frequency Scanning & Group Coordination',
        pageNumber: 28,
        snippet: 'Perform an automatic group scan if RF interference warning LED illuminates during active speech.',
      },
      recommendedNextAction: 'Deploy network frequency coordinator via Shure Wireless Workbench to switch carrier to Group 3 Channel 12 (566.250 MHz).',
      evidence: {
        deviceModel: 'Shure ULXD4 Receiver + ULXD1 Bodypack',
        inputSource: 'XLR Balanced Line to Biamp Tesira Forte DSP',
        reportedCableState: 'XLR patch cable verified intact',
        edidHandshake: 'N/A (Audio Stream)',
        hdcpStatus: 'N/A',
        powerLedState: 'Green LED / Antenna B Diversity Flashing',
      },
    },
    repairRecord: {
      acceptedAt: '30 minutes ago',
      startedAt: '15 minutes ago',
      repairNotes: 'Arrived at AB-105. Connected Wireless Workbench laptop to AV subnet. Commencing RF spectrum scan.',
    },
  },
  {
    id: 'INC-003',
    status: 'resolved',
    priority: 'medium',
    classroomId: 'AB-301',
    classroomName: 'Academic Block A · Seminar 301',
    deviceId: 'AV-SB301-01',
    deviceName: 'Interactive Touch Display 75"',
    deviceType: 'smartboard',
    deviceModel: 'SMART Board MX275-V3 Pro',
    reportedBy: 'Prof. Clara Oswald (Faculty - Mathematics)',
    reportedAt: '2 hours ago',
    updatedAt: '25 minutes ago',
    assignedTechnicianId: 'usr_tech_02',
    assignedTechnicianName: 'Marcus Vance',
    reportedSymptom: 'Stylus tracking offset by ~15cm to the left of contact point.',
    aiDiagnostic: {
      confidenceScore: 92,
      probableCauseHypothesis: 'Optical IR frame bezel calibration lost due to ambient direct sunlight angle and dust buildup on lower IR reflector strip.',
      isHypothesisVerified: true,
      lastStepAttempted: 'Faculty restarted SMART onboard Android OS.',
      attemptResult: 'Offset persisted across all input sources including laptop HDMI.',
      manualReference: {
        manualTitle: 'SMART Board MX Pro Series Installation & Maintenance Guide',
        section: 'Section 6.4 — Touch Sensor Diagnostic & Bezel Cleaning',
        pageNumber: 67,
        snippet: 'Clean bottom infrared optical sensor strip using microfiber cloth and execute 9-point touchscreen alignment utility.',
      },
      recommendedNextAction: 'Clean IR bezel sensors and run interactive touch alignment tool.',
      evidence: {
        deviceModel: 'SMART MX275-V3',
        inputSource: 'USB Touch Type-B to Wall Plate',
        reportedCableState: 'Connected firmly',
        edidHandshake: 'Pass (3840x2160@60Hz)',
        hdcpStatus: 'Active',
        powerLedState: 'Solid White',
      },
    },
    repairRecord: {
      acceptedAt: '1 hour ago',
      startedAt: '45 minutes ago',
      resolvedAt: '25 minutes ago',
      rootCause: 'Dust accumulation along lower IR sensor array caused optical parallax error.',
      repairNotes: 'Cleaned all optical sensor channels with anti-static solution. Executed 9-point calibration. Touch alignment verified accurate to within 1mm.',
      partsRequired: ['Microfiber optical cleaning pad', 'Anti-static solvent'],
      technicianRemarks: 'Classroom faculty tested live geometry software with positive verification.',
      resolvedByTechnician: 'Marcus Vance',
    },
  },
  {
    id: 'INC-004',
    status: 'unassigned',
    priority: 'critical',
    classroomId: 'ENG-A',
    classroomName: 'Engineering Block · Main Hall A',
    deviceId: 'AV-CAM-EHA',
    deviceName: 'Ceiling PTZ Tracking Camera',
    deviceType: 'ptz-camera',
    deviceModel: 'Sony BRC-X400 4K PTZ Camera',
    reportedBy: 'Eng. David Miller (Lab Tech)',
    reportedAt: '45 minutes ago',
    updatedAt: '10 minutes ago',
    reportedSymptom: 'Camera pan and tilt locked up midway through lecture recording.',
    aiDiagnostic: {
      confidenceScore: 86,
      probableCauseHypothesis: 'VISCA over IP control packet timeout or pan mechanical belt slip caused motor safety interlock shutdown.',
      isHypothesisVerified: false,
      lastStepAttempted: 'Lab technician issued PTZ preset reset command from Crestron touch panel.',
      attemptResult: 'Error prompt: "PTZ Comm Error 0x8802 - No ACK".',
      manualReference: {
        manualTitle: 'Sony BRC-X400 Technical Manual & VISCA Protocol Reference',
        section: 'Section 7.2 — Pan/Tilt Motor Error Codes',
        pageNumber: 88,
        snippet: 'Error 0x8802 signifies motor driver thermal protection or command stream disconnect on TCP port 52381.',
      },
      recommendedNextAction: 'Power-cycle PoE++ injector in equipment rack Unit 4 and check Ethernet port link lights.',
      evidence: {
        deviceModel: 'Sony BRC-X400',
        inputSource: '12G-SDI + NDI|HX to Blackmagic Atem Switcher',
        reportedCableState: 'Cat6A Shielded Shielding Grounded',
        edidHandshake: 'N/A (SDI / NDI stream)',
        hdcpStatus: 'N/A',
        powerLedState: 'Flashing Amber (Safety Lockout)',
      },
    },
  },
  {
    id: 'INC-005',
    status: 'in_progress',
    priority: 'medium',
    classroomId: 'SCI-302',
    classroomName: 'Science Complex · Lab 302',
    deviceId: 'AV-CR302-01',
    deviceName: 'Room Automation Control Processor',
    deviceType: 'crestron',
    deviceModel: 'Crestron CP4N 4-Series Processor',
    reportedBy: 'Dr. Rebecca Stone (Chemistry Dept)',
    reportedAt: '1 hour ago',
    updatedAt: '20 minutes ago',
    assignedTechnicianId: 'usr_tech_01',
    assignedTechnicianName: 'Alex Rivera',
    reportedSymptom: 'Wall touch panel shows "Connecting to Processor..." and fails to respond to input selection.',
    aiDiagnostic: {
      confidenceScore: 91,
      probableCauseHypothesis: 'Crestron CIP connection dropped due to IP table mismatch or AV subnet switch port broadcast storm.',
      isHypothesisVerified: false,
      lastStepAttempted: 'Faculty power-cycled the 10-inch tabletop TSW-1070 panel.',
      attemptResult: 'Panel boots but remains stuck at discovery screen IP 10.14.32.18.',
      manualReference: {
        manualTitle: 'Crestron 4-Series Control Systems Reference Guide',
        section: 'Section 3.5 — Ethernet Communication Diagnostics & IP Table',
        pageNumber: 54,
        snippet: 'Verify IP table entries on Port 41794 using Crestron Toolbox console command "iptable".',
      },
      recommendedNextAction: 'Open SSH terminal to processor 10.14.32.10 and verify CIP link status to TSW-1070 IP ID 03.',
      evidence: {
        deviceModel: 'Crestron CP4N + TSW-1070',
        inputSource: 'Internal AV Control Bus',
        reportedCableState: 'Ethernet link active',
        edidHandshake: 'N/A',
        hdcpStatus: 'N/A',
        powerLedState: 'Green HW / Flashing Net Yellow',
      },
    },
    repairRecord: {
      acceptedAt: '40 minutes ago',
      startedAt: '20 minutes ago',
      repairNotes: 'Connecting via Crestron Toolbox on technician maintenance laptop. Testing IP table ping.',
    },
  },
  {
    id: 'INC-006',
    status: 'unassigned',
    priority: 'low',
    classroomId: 'AB-204',
    classroomName: 'Academic Block A · Room 204',
    deviceId: 'AV-AMP204-01',
    deviceName: 'Ceiling Array Audio Amplifier',
    deviceType: 'amplifier',
    deviceModel: 'Crown DriveCore CDI 4|300',
    reportedBy: 'Teaching Assistant Kevin Tran',
    reportedAt: '3 hours ago',
    updatedAt: '1 hour ago',
    reportedSymptom: 'Persistent low 60Hz hum when 3.5mm headphone cable is plugged into auxiliary podium jack.',
    aiDiagnostic: {
      confidenceScore: 84,
      probableCauseHypothesis: 'Ground loop circulating current between ungrounded laptop charger and balanced audio transformer.',
      isHypothesisVerified: false,
      lastStepAttempted: 'TA tried plugging laptop into a different wall socket in the same room.',
      attemptResult: 'Hum volume diminished slightly but still audible over lecture microphone.',
      manualReference: {
        manualTitle: 'Crown CDi DriveCore Series Operation Manual',
        section: 'Section 5.1 — Grounding & Shield Isolation',
        pageNumber: 36,
        snippet: 'To eliminate ground loop hum on auxiliary lines, engage the rear chassis ground-lift switch or install an inline 600-ohm isolation transformer.',
      },
      recommendedNextAction: 'Install inline 3.5mm stereo isolation transformer / DI box at the lectern junction box.',
      evidence: {
        deviceModel: 'Crown CDi 4|300',
        inputSource: 'Podium 3.5mm Unbalanced Line',
        reportedCableState: 'Standard stereo audio cable',
        edidHandshake: 'N/A',
        hdcpStatus: 'N/A',
        powerLedState: 'Solid Green',
      },
    },
  },
  {
    id: 'INC-007',
    status: 'in_progress',
    priority: 'high',
    classroomId: 'LIB-AUD',
    classroomName: 'Central Library · Main Auditorium',
    deviceId: 'AV-SW105-01',
    deviceName: 'Presentation Switcher & Scaler',
    deviceType: 'switcher',
    deviceModel: 'Extron IN1608 xi IPCP Presentation Switcher',
    reportedBy: 'Dean of Arts & Humanities Office',
    reportedAt: '1 hour ago',
    updatedAt: '30 minutes ago',
    assignedTechnicianId: 'usr_tech_03',
    assignedTechnicianName: 'Elena Rostova',
    reportedSymptom: 'HDMI Output 2 to confidence monitors flashes green sparkles intermittently.',
    aiDiagnostic: {
      confidenceScore: 90,
      probableCauseHypothesis: 'HDMI high-speed eye pattern degradation over 15-meter passive cable run; signal jitter exceeds HDCP margin.',
      isHypothesisVerified: false,
      lastStepAttempted: 'AV operator lowered output resolution from 4K to 1080p.',
      attemptResult: 'Sparkles reduced but audio channel occasionally pops.',
      manualReference: {
        manualTitle: 'Extron IN1608 Series Scaling Switcher User Guide',
        section: 'Section 4 — Output Signal Equalization & Cable Driving',
        pageNumber: 73,
        snippet: 'Enable active cable equalization on Output 2 or insert an Extron DTP transmitter for runs exceeding 10 meters.',
      },
      recommendedNextAction: 'Enable built-in Extron cable equalizer booster to +6dB or install active optical HDMI cable.',
      evidence: {
        deviceModel: 'Extron IN1608 xi',
        inputSource: 'Output 2 (15m Passive Copper HDMI)',
        reportedCableState: 'Connected via under-floor conduit',
        edidHandshake: 'Intermittent sync drop',
        hdcpStatus: 'HDCP 2.2 Re-keying every 120s',
        powerLedState: 'Normal Green',
      },
    },
    repairRecord: {
      acceptedAt: '45 minutes ago',
      startedAt: '30 minutes ago',
      repairNotes: 'Accessing rack under auditorium stage. Testing signal attenuation with HDMI field tester.',
    },
  },
  {
    id: 'INC-008',
    status: 'unassigned',
    priority: 'medium',
    classroomId: 'SCI-302',
    classroomName: 'Science Complex · Lab 302',
    deviceId: 'AV-P301-01',
    deviceName: 'Secondary Side Projection Display',
    deviceType: 'projector',
    deviceModel: 'Epson EB-L1505UH Laser Projector',
    reportedBy: 'Lab Coordinator Mark S.',
    reportedAt: '4 hours ago',
    updatedAt: '2 hours ago',
    reportedSymptom: 'Projector cooling fans running at 100% full speed with warning message "Air filter clogged".',
    aiDiagnostic: {
      confidenceScore: 96,
      probableCauseHypothesis: 'Electrostatic air intake filter particulate saturation; internal temperature sensor triggered safety cooling profile.',
      isHypothesisVerified: false,
      lastStepAttempted: 'Vacuumed outer plastic vents with portable duster.',
      attemptResult: 'Filter warning sensor remains latched.',
      manualReference: {
        manualTitle: 'Epson EB-L1500 Series Service Manual',
        section: 'Section 9.3 — Air Filter Replacement & Timer Reset',
        pageNumber: 112,
        snippet: 'Replace air filter ELPAF53 and reset filter operating hour counter via menu: Extended > Air Filter Counter Reset.',
      },
      recommendedNextAction: 'Replace intake filter cartridge ELPAF53 and reset laser thermal counter.',
      evidence: {
        deviceModel: 'Epson EB-L1505UH',
        inputSource: 'HDBaseT Line 1',
        reportedCableState: 'Intact',
        edidHandshake: 'Normal',
        hdcpStatus: 'Active',
        powerLedState: 'Orange Filter Warning LED Blinking',
      },
    },
  },
];

const STORAGE_KEY = 'tscai_incidents_data';

export const incidentService = {
  getAll: (): Incident[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      try {
        return JSON.parse(data);
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
    return updated;
  },

  createSimulatedIncident: (): Incident => {
    const list = incidentService.getAll();
    const newNumber = list.length + 1;
    const newId = `INC-${String(newNumber).padStart(3, '0')}`;
    const newIncident: Incident = {
      id: newId,
      status: 'unassigned',
      priority: Math.random() > 0.5 ? 'critical' : 'high',
      classroomId: 'AB-204',
      classroomName: 'Academic Block A · Room 204',
      deviceId: 'AV-P204-01',
      deviceName: 'Main Auditorium Laser Projector',
      deviceType: 'projector',
      deviceModel: 'Panasonic PT-MZ780 (7,000 lm)',
      reportedBy: 'Faculty Alert (Automated RAG Triage)',
      reportedAt: 'Just now',
      updatedAt: 'Just now',
      reportedSymptom: 'Auto-telemetry alert: EDID loss on HDBaseT receiver pin 19.',
      aiDiagnostic: {
        confidenceScore: 92,
        probableCauseHypothesis: 'Transmitter power brownout or cable unseated at podium junction.',
        isHypothesisVerified: false,
        lastStepAttempted: 'Faculty pressed input re-sync button on lectern panel.',
        attemptResult: 'Display sync timeout. HDMI Rx failed to lock pixel clock.',
        manualReference: {
          manualTitle: 'Panasonic PT-MZ780 Operating Instructions Rev 3.2',
          section: 'Section 4.3 — Signal Verification',
          pageNumber: 42,
          snippet: 'Check HPD pin voltage. Must measure greater than 4.8V DC.',
        },
        recommendedNextAction: 'Field technician verify 5V bus and reset HDBaseT balun.',
        evidence: {
          deviceModel: 'Panasonic PT-MZ780',
          inputSource: 'HDBaseT Extender',
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
