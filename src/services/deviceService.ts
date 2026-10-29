import { Device } from '../types/device';

const SEED_DEVICES: Device[] = [
  {
    id: 'AV-P204-01',
    name: 'Auditorium Laser Projector',
    model: 'Panasonic PT-MZ780 (7000 lm WUXGA)',
    type: 'projector',
    classroomId: 'AB-204',
    classroomName: 'Academic Block A · Room 204',
    health: 'faulty',
    serialNumber: 'PN-MZ780-99214-A',
    ipAddress: '10.14.24.41',
    firmwareVersion: 'v2.18.04',
    installDate: '2024-03-15',
    lastInspected: '2026-09-12',
    manual: {
      title: 'Panasonic PT-MZ780 Operating Instructions Rev 3.2',
      docUrl: 'https://docs.panasonic-av.example/manuals/pt-mz780-rev3.2.pdf',
      revision: 'Rev 3.2',
      relevantPage: 42,
    },
    qrIdentifier: 'qr_dev_p204_01_tok_89a3f1',
  },
  {
    id: 'AV-M105-02',
    name: 'Faculty Wireless Lapel Microphone',
    model: 'Shure ULXD4 Digital Wireless Receiver + ULXD1 Bodypack',
    type: 'microphone',
    classroomId: 'AB-105',
    classroomName: 'Academic Block A · Room 105',
    health: 'faulty',
    serialNumber: 'SH-ULXD4-44102-X',
    ipAddress: '10.14.15.22',
    firmwareVersion: 'v2.4.1',
    installDate: '2023-11-20',
    lastInspected: '2026-08-30',
    manual: {
      title: 'Shure ULX-D Digital Wireless Receiver Guide Rev 7',
      docUrl: 'https://docs.shure-av.example/manuals/ulxd-rev7.pdf',
      revision: 'Rev 7.0',
      relevantPage: 28,
    },
    qrIdentifier: 'qr_dev_m105_02_tok_47b9c2',
  },
  {
    id: 'AV-SB301-01',
    name: 'Front Wall Interactive Display 75"',
    model: 'SMART Board MX275-V3 Pro Interactive Display',
    type: 'smartboard',
    classroomId: 'AB-301',
    classroomName: 'Academic Block A · Room 301',
    health: 'healthy',
    serialNumber: 'SB-MX275-88319-K',
    ipAddress: '10.14.31.15',
    firmwareVersion: 'v3.8.192',
    installDate: '2024-01-10',
    lastInspected: '2026-10-29',
    manual: {
      title: 'SMART Board MX Pro Series Installation & Maintenance Guide',
      docUrl: 'https://docs.smarttech.example/manuals/mx275-guide.pdf',
      revision: 'Rev 4.1',
      relevantPage: 67,
    },
    qrIdentifier: 'qr_dev_sb301_01_tok_1109a8',
  },
  {
    id: 'AV-CAM-EHA',
    name: 'Robotic Lecture Tracking Camera',
    model: 'Sony BRC-X400 4K PTZ Camera',
    type: 'ptz-camera',
    classroomId: 'ENG-A',
    classroomName: 'Engineering Block · Main Hall A',
    health: 'faulty',
    serialNumber: 'SNY-BRCX-00381-Z',
    ipAddress: '10.14.50.80',
    firmwareVersion: 'v3.0.0',
    installDate: '2023-09-01',
    lastInspected: '2026-07-15',
    manual: {
      title: 'Sony BRC-X400 Technical & VISCA Protocol Reference',
      docUrl: 'https://pro.sony.example/manuals/brc-x400.pdf',
      revision: 'Rev 2.0',
      relevantPage: 88,
    },
    qrIdentifier: 'qr_dev_cameha_tok_6623e1',
  },
  {
    id: 'AV-CR302-01',
    name: 'Classroom AV Automation Processor',
    model: 'Crestron CP4N 4-Series Control System',
    type: 'crestron',
    classroomId: 'SCI-302',
    classroomName: 'Science Complex · Lab 302',
    health: 'degraded',
    serialNumber: 'CR-CP4N-11920-P',
    ipAddress: '10.14.32.10',
    firmwareVersion: 'v2.8001.00067',
    installDate: '2024-05-22',
    lastInspected: '2026-09-05',
    manual: {
      title: 'Crestron 4-Series Control Systems Reference Manual',
      docUrl: 'https://crestron.example/manuals/cp4n-ref.pdf',
      revision: 'Rev 1.9',
      relevantPage: 54,
    },
    qrIdentifier: 'qr_dev_cr302_01_tok_9934c5',
  },
  {
    id: 'AV-AMP204-01',
    name: 'Multi-Channel Ceiling Speaker Amplifier',
    model: 'Crown DriveCore CDI 4|300 Network DSP Amp',
    type: 'amplifier',
    classroomId: 'AB-204',
    classroomName: 'Academic Block A · Room 204',
    health: 'degraded',
    serialNumber: 'CRW-CDI4300-8812',
    ipAddress: '10.14.24.45',
    firmwareVersion: 'v1.4.2',
    installDate: '2023-06-18',
    lastInspected: '2026-08-11',
    manual: {
      title: 'Crown CDi DriveCore Series Operation Manual',
      docUrl: 'https://crownaudio.example/manuals/cdi-drivecore.pdf',
      revision: 'Rev 2.4',
      relevantPage: 36,
    },
    qrIdentifier: 'qr_dev_amp204_01_tok_7721d0',
  },
  {
    id: 'AV-SW105-01',
    name: 'Auditorium Matrix Presentation Switcher',
    model: 'Extron IN1608 xi IPCP Presentation Switcher',
    type: 'switcher',
    classroomId: 'LIB-AUD',
    classroomName: 'Central Library · Main Auditorium',
    health: 'degraded',
    serialNumber: 'EXT-IN1608-55201',
    ipAddress: '10.14.90.12',
    firmwareVersion: 'v2.01',
    installDate: '2023-12-04',
    lastInspected: '2026-09-20',
    manual: {
      title: 'Extron IN1608 Series Scaling Switcher User Guide',
      docUrl: 'https://extron.example/manuals/in1608-guide.pdf',
      revision: 'Rev 3.0',
      relevantPage: 73,
    },
    qrIdentifier: 'qr_dev_sw105_01_tok_3391b4',
  },
  {
    id: 'AV-P301-01',
    name: 'Laser Projection Display 15000 Lumens',
    model: 'Epson EB-L1505UH Laser Projector',
    type: 'projector',
    classroomId: 'SCI-302',
    classroomName: 'Science Complex · Lab 302',
    health: 'degraded',
    serialNumber: 'EPS-L1505-77291',
    ipAddress: '10.14.32.40',
    firmwareVersion: 'v1.12',
    installDate: '2024-02-14',
    lastInspected: '2026-10-01',
    manual: {
      title: 'Epson EB-L1500 Series Service Manual',
      docUrl: 'https://epson.example/manuals/eb-l1505uh-service.pdf',
      revision: 'Rev 1.2',
      relevantPage: 112,
    },
    qrIdentifier: 'qr_dev_p301_01_tok_8824a9',
  },
];

const STORAGE_KEY = 'tscai_devices_data';

export const deviceService = {
  getAll: (): Device[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      try {
        return JSON.parse(data);
      } catch {
        // fallback
      }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DEVICES));
    return SEED_DEVICES;
  },

  getById: (id: string): Device | undefined => {
    return deviceService.getAll().find((d) => d.id.toLowerCase() === id.toLowerCase());
  },

  getByClassroom: (classroomId: string): Device[] => {
    return deviceService.getAll().filter((d) => d.classroomId.toLowerCase() === classroomId.toLowerCase());
  },

  addDevice: (device: Device): Device => {
    const list = deviceService.getAll();
    const updated = [device, ...list];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return device;
  },

  updateDevice: (id: string, updates: Partial<Device>): Device => {
    const list = deviceService.getAll();
    const index = list.findIndex((d) => d.id === id);
    if (index === -1) throw new Error('Device not found');

    const updated = { ...list[index], ...updates };
    list[index] = updated;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return updated;
  },

  regenerateQrIdentifier: (deviceId: string): string => {
    const list = deviceService.getAll();
    const index = list.findIndex((d) => d.id === deviceId);
    if (index === -1) throw new Error('Device not found');

    const newToken = `qr_dev_${deviceId.toLowerCase().replace(/[^a-z0-9]/g, '')}_tok_${Math.random().toString(36).substring(2, 8)}`;
    list[index].qrIdentifier = newToken;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return newToken;
  },
};
