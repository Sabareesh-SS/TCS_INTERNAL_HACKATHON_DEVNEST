import { Classroom } from '../types/classroom';
import { Device } from '../types/device';
import { UserProfile } from '../types/auth';
import { Incident } from '../types/incident';
import { Ticket } from '../types/ticket';
import { DiagnosticRuleNode } from '../types/diagnostic';

export const MOCK_FACULTY_USER: UserProfile = {
  id: 'usr-fac-101',
  email: 'dr.sharma@campus.edu',
  fullName: 'Dr. Ramesh Sharma',
  role: 'faculty',
  phone: '+91 98765 43210',
  department: 'Computer Science & Engineering',
  staffId: 'FAC-CSE-042',
  createdAt: '2025-01-15T09:00:00Z',
};

export const MOCK_TECHNICIAN_USER: UserProfile = {
  id: 'usr-tech-202',
  email: 'tech.alex@campus.edu',
  fullName: 'Alex Vance',
  role: 'technician',
  phone: '+91 91234 56789',
  department: 'Campus AV & Infrastructure Support',
  staffId: 'TECH-AV-008',
  createdAt: '2024-11-01T10:00:00Z',
};

export const MOCK_CLASSROOMS: Classroom[] = [
  {
    id: 'CR-402',
    roomNumber: 'Room 402',
    building: 'Ramanujan Engineering Block',
    floor: 'Floor 4',
    capacity: 75,
    status: 'active',
    qrCodePayload: 'classroom:CR-402',
    deviceCount: 3,
  },
  {
    id: 'CR-201',
    roomNumber: 'Room 201 (Lecture Hall A)',
    building: 'Turing Science Center',
    floor: 'Floor 2',
    capacity: 120,
    status: 'active',
    qrCodePayload: 'classroom:CR-201',
    deviceCount: 4,
  },
  {
    id: 'CR-105',
    roomNumber: 'Seminar Room 105',
    building: 'Bose Innovation Pavilion',
    floor: 'Floor 1',
    capacity: 40,
    status: 'active',
    qrCodePayload: 'classroom:CR-105',
    deviceCount: 2,
  },
];

export const MOCK_DEVICES: Device[] = [
  {
    id: 'DEV-PRJ-402',
    classroomId: 'CR-402',
    classroomName: 'Room 402 - Ramanujan Block',
    deviceType: 'projector',
    manufacturer: 'Epson',
    modelNumber: 'EB-L630U Laser Projector',
    assetTag: 'PRJ-402-A',
    serialNumber: 'EP-99482711-X',
    status: 'faulty',
    installDate: '2024-03-12',
    manualUrl: 'https://campus-av.edu/manuals/epson-eb-l630u.pdf',
    quickGuideRef: 'Ref: EB-L630U Quick Reference Card, Section 2.4',
    ipAddress: '10.20.40.12',
    notes: 'Ceiling mounted with Crestron Wall Controller integration.',
  },
  {
    id: 'DEV-MIC-402',
    classroomId: 'CR-402',
    classroomName: 'Room 402 - Ramanujan Block',
    deviceType: 'microphone',
    manufacturer: 'Shure',
    modelNumber: 'BLX24/PG58 Wireless System',
    assetTag: 'MIC-402-B',
    serialNumber: 'SH-7721094-W',
    status: 'operational',
    installDate: '2024-03-12',
    manualUrl: 'https://campus-av.edu/manuals/shure-blx24.pdf',
    quickGuideRef: 'Ref: Shure Wireless Setup Guide, Ch. 4 (RF Sync)',
    notes: 'Dual channel handheld & lapel setup.',
  },
  {
    id: 'DEV-SB-402',
    classroomId: 'CR-402',
    classroomName: 'Room 402 - Ramanujan Block',
    deviceType: 'smart_board',
    manufacturer: 'SMART Technologies',
    modelNumber: 'SMART Board 7086R Pro Interactive Display',
    assetTag: 'SB-402-C',
    serialNumber: 'SB-8839102-K',
    status: 'operational',
    installDate: '2023-08-20',
    manualUrl: 'https://campus-av.edu/manuals/smartboard-7086r.pdf',
    quickGuideRef: 'Ref: SMART Pro Touch & Pen Calibration Guide',
    ipAddress: '10.20.40.15',
    notes: 'Connected via USB-B touch feedback cable and HDMI 2.',
  },
  {
    id: 'DEV-PRJ-201',
    classroomId: 'CR-201',
    classroomName: 'Room 201 - Turing Center',
    deviceType: 'projector',
    manufacturer: 'Panasonic',
    modelNumber: 'PT-VMZ51 High-Lumen Laser Projector',
    assetTag: 'PRJ-201-A',
    serialNumber: 'PAN-109283-Z',
    status: 'operational',
    installDate: '2024-01-10',
    manualUrl: 'https://campus-av.edu/manuals/panasonic-pt-vmz51.pdf',
    quickGuideRef: 'Ref: Panasonic PT Series Operations Manual, Sec 3',
    ipAddress: '10.20.20.18',
  },
  {
    id: 'DEV-MXR-201',
    classroomId: 'CR-201',
    classroomName: 'Room 201 - Turing Center',
    deviceType: 'audio_mixer',
    manufacturer: 'Yamaha',
    modelNumber: 'TF-Rack Digital Mixer',
    assetTag: 'MXR-201-D',
    serialNumber: 'YM-448821-M',
    status: 'operational',
    installDate: '2023-11-05',
    manualUrl: 'https://campus-av.edu/manuals/yamaha-tf-rack.pdf',
    quickGuideRef: 'Ref: Yamaha DSP Routing Table, Preset 02',
    ipAddress: '10.20.20.19',
  },
];

export const DIAGNOSTIC_RULES: Record<string, DiagnosticRuleNode[]> = {
  'projector:No Display / Signal Lost': [
    {
      stepNumber: 1,
      totalSteps: 4,
      actionTitle: 'Verify Wall Plate Input Selection',
      instructionText:
        'Locate the wall-mounted HDMI selector switch near the podium. Verify the switch is toggled to Input A (Podium Laptop) and that the blue channel indicator LED is steadily lit.',
      verificationPrompt: 'Does the projector screen display an active source signal or blue desktop screen?',
      manualReference: 'Epson EB-L630U Operations Manual, Section 2.1 (Input Source Matrix)',
    },
    {
      stepNumber: 2,
      totalSteps: 4,
      actionTitle: 'Inspect and Reseat HDMI/USB-C Cable',
      instructionText:
        'Unplug the HDMI connector from the lecturer laptop. Inspect the gold-plated pins for physical bend or debris. Firmly reinsert until fully seated. Ensure your laptop display settings are set to "Duplicate" or "Extend" (Windows Key + P).',
      verificationPrompt: 'Did your laptop recognize the secondary display and transmit the presentation signal?',
      manualReference: 'Campus AV Standard Operating Procedure, Document SOP-AV-104',
    },
    {
      stepNumber: 3,
      totalSteps: 4,
      actionTitle: 'Execute Projector Hardware Standby Reset',
      instructionText:
        'Aim the handheld podium remote control directly at the ceiling optical sensor. Press the Power button once to verify if the projector is in Eco-Standby. Wait 15 seconds for the cooling cycle indicator.',
      verificationPrompt: 'Did the status LED change from amber blinking to solid green?',
      manualReference: 'Epson EB-L630U Hardware Diagnostic Guide, Page 44 (Status Indicator Codes)',
    },
    {
      stepNumber: 4,
      totalSteps: 4,
      actionTitle: 'Cycle Podium Power Distribution Unit',
      instructionText:
        'Open the rack panel beneath the podium. Verify that Circuit Breaker PDU-1 is ON and the Extron AV switcher is illuminated. Press the reset toggle button once if dark.',
      verificationPrompt: 'Did the projector lamp ignite and establish video sync?',
      manualReference: 'Extron PoleVault Systems Manual, Power Staging Diagram Sec 5',
    },
  ],
  'microphone:No Audio Output / Muted': [
    {
      stepNumber: 1,
      totalSteps: 3,
      actionTitle: 'Inspect Microphone Battery & Power Switch',
      instructionText:
        'Check the mechanical switch located on the microphone handle. Ensure the slide switch is in the full ON position (green indicator showing). If the power LED is red or dark, replace with fresh AA batteries from the podium drawer.',
      verificationPrompt: 'Is the microphone power indicator glowing steady green?',
      manualReference: 'Shure BLX24 User Guide, Section "Transmitter Power Status"',
    },
    {
      stepNumber: 2,
      totalSteps: 3,
      actionTitle: 'Verify Wireless RF Sync on Receiver Unit',
      instructionText:
        'Look at the Shure wireless receiver rack mounted in the classroom cabinet. Check if the "RF" LED is illuminated green. If extinguished, press the Group/Channel scan button for 3 seconds to sync frequencies.',
      verificationPrompt: 'Does the RF indicator illuminate when you speak into the microphone?',
      manualReference: 'Shure BLX Wireless Receiver Manual, RF Synchronization Ch. 3',
    },
    {
      stepNumber: 3,
      totalSteps: 3,
      actionTitle: 'Inspect Podium Master Audio Mute Switch',
      instructionText:
        'On the touch controller or desk mixer panel, locate the Mic 1 fader. Ensure the Mute button is NOT engaged (red mute light must be off) and volume fader is at unity gain (0dB mark).',
      verificationPrompt: 'Is classroom voice amplification clearly audible through the room speakers?',
      manualReference: 'Yamaha TF-Rack Audio Routing Guide, Channel Fader Controls',
    },
  ],
  'smart_board:Touch Screen Unresponsive': [
    {
      stepNumber: 1,
      totalSteps: 3,
      actionTitle: 'Verify USB-B HID Touch Data Connection',
      instructionText:
        'Trace the square USB-B cable connected behind the right edge of the SMART Board to the wall patch plate. Ensure both USB ends are securely seated. Without this cable, video will show but touch commands fail.',
      verificationPrompt: 'Does the board react when you tap with your fingertip or stylus?',
      manualReference: 'SMART Board 7086R Pro Installation Guide, Section 4 (Data Cabling)',
    },
    {
      stepNumber: 2,
      totalSteps: 3,
      actionTitle: 'Trigger Optical Sensor Auto-Calibration',
      instructionText:
        'Press and hold the Gear / Settings button on the front control convenience panel for 5 seconds until the calibration target points appear. Tap the center of each crosshair sequentially.',
      verificationPrompt: 'Did calibration complete and cursor accurately track stylus movement?',
      manualReference: 'SMART Technologies Diagnostic Suite, Optical Sensor Alignment',
    },
    {
      stepNumber: 3,
      totalSteps: 3,
      actionTitle: 'Restart Interactive Display Engine',
      instructionText:
        'Use the rocker switch beneath the lower-left bezel to toggle power off. Wait 10 seconds before turning back on to clear cached USB HID bus driver locks.',
      verificationPrompt: 'Did touch recognition restore after system boot completes?',
      manualReference: 'SMART Board 7000 Series Service Manual, Power Sequencing',
    },
  ],
  default: [
    {
      stepNumber: 1,
      totalSteps: 3,
      actionTitle: 'Physical Inspection & Power Verification',
      instructionText:
        'Ensure the equipment power plug is firmly seated in the wall outlet and the master rocker switch is in the ON position.',
      verificationPrompt: 'Is the power indicator LED illuminated?',
      manualReference: 'Equipment Quick Reference Sheet, Section 1',
    },
    {
      stepNumber: 2,
      totalSteps: 3,
      actionTitle: 'Cable Continuity and Connector Check',
      instructionText:
        'Disconnect and firmly reconnect all signal, audio, and control cables. Verify there are no sharp bends or pin damage.',
      verificationPrompt: 'Did the device establish communication or signal output?',
      manualReference: 'Classroom AV Standard Operating Procedure, General AV Guide',
    },
    {
      stepNumber: 3,
      totalSteps: 3,
      actionTitle: 'Full Hardware Cold Restart',
      instructionText:
        'Power down the unit completely for 30 seconds. Disconnect main power, wait for internal capacitors to discharge, and power on.',
      verificationPrompt: 'Did the equipment resume normal operational state?',
      manualReference: 'Campus AV Hardware Service Standard',
    },
  ],
};

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'INC-2026-081',
    classroomId: 'CR-402',
    classroomName: 'Room 402 - Ramanujan Block',
    deviceId: 'DEV-PRJ-402',
    deviceName: 'Epson EB-L630U Laser Projector',
    deviceType: 'projector',
    reportedBy: 'usr-fac-101',
    reportedByName: 'Dr. Ramesh Sharma',
    symptomCategory: 'No Display / Signal Lost',
    symptomDescription: 'HDMI input drops out during computer science lecture. No video signal on wall screen.',
    initialCheckPower: true,
    initialCheckCable: true,
    status: 'escalated_to_technician',
    diagnosticSteps: [
      {
        id: 'step-1',
        incidentId: 'INC-2026-081',
        stepNumber: 1,
        totalSteps: 4,
        actionTitle: 'Verify Wall Plate Input Selection',
        instructionText: 'Locate the wall-mounted HDMI selector switch near the podium.',
        manualReference: 'Epson EB-L630U Operations Manual, Section 2.1',
        verificationPrompt: 'Does the projector screen display an active source signal?',
        facultyResponse: 'did_not_work',
        responseTimestamp: '2026-10-29T09:12:00Z',
      },
      {
        id: 'step-2',
        incidentId: 'INC-2026-081',
        stepNumber: 2,
        totalSteps: 4,
        actionTitle: 'Inspect and Reseat HDMI/USB-C Cable',
        instructionText: 'Unplug and firmly reinsert the HDMI connector from the lecturer laptop.',
        manualReference: 'Campus AV Standard Operating Procedure SOP-AV-104',
        verificationPrompt: 'Did laptop recognize secondary display?',
        facultyResponse: 'did_not_work',
        responseTimestamp: '2026-10-29T09:15:30Z',
      },
      {
        id: 'step-3',
        incidentId: 'INC-2026-081',
        stepNumber: 3,
        totalSteps: 4,
        actionTitle: 'Execute Projector Hardware Standby Reset',
        instructionText: 'Aim handheld podium remote control at the optical sensor and cycle power.',
        manualReference: 'Epson EB-L630U Hardware Diagnostic Guide, Page 44',
        verificationPrompt: 'Did the status LED change from amber blinking to solid green?',
        facultyResponse: 'did_not_work',
        responseTimestamp: '2026-10-29T09:18:10Z',
      },
    ],
    ticketId: 'TCK-2026-042',
    createdAt: '2026-10-29T09:10:00Z',
  },
];

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'TCK-2026-042',
    incidentId: 'INC-2026-081',
    incident: INITIAL_INCIDENTS[0],
    assignedTechnicianId: 'usr-tech-202',
    assignedTechnicianName: 'Alex Vance',
    priority: 'high',
    status: 'assigned',
    checklist: [
      { id: 'chk-1', label: 'Inspect AC main power and fuse block', isCompleted: false },
      { id: 'chk-2', label: 'Measure HDMI transmission signal and keystoning', isCompleted: false },
      { id: 'chk-3', label: 'Verify lamp hours and thermal exhaust filter', isCompleted: false },
      { id: 'chk-4', label: 'Test Crestron/Extron control serial connection', isCompleted: false },
      { id: 'chk-5', label: 'Validate EDID handshake with source laptop', isCompleted: false },
    ],
    rootCause: '',
    workPerformed: '',
    partsRequired: '',
    technicianNotes: '',
    photoUris: [],
    createdAt: '2026-10-29T09:20:00Z',
    updatedAt: '2026-10-29T09:20:00Z',
  },
];
