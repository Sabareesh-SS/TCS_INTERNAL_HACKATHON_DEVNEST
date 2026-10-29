import { Device } from '../types/device';

const REAL_CAMPUS_DEVICES: Device[] = [
  // Room AB-204
  {
    id: 'DEV001',
    name: 'Classroom 3LCD Projector',
    model: 'Epson PowerLite EB-E01 / EB-X06 (DEMO-P01)',
    type: 'projector',
    classroomId: 'AB-204',
    classroomName: 'Academic Block A · Room AB-204',
    health: 'healthy',
    serialNumber: 'EP-EB01-99214-A',
    installDate: '2024-03-15',
    lastInspected: '2026-10-15',
    manual: {
      title: 'Epson EB-E01/EB-X06 User Guide',
      docUrl: 'https://files.support.epson.com/docid/cpd5/cpd59263.pdf',
      revision: 'CPD-59263',
      relevantPage: 38,
    },
    qrIdentifier: 'QR-DEV-AV-AB204-P01',
  },
  {
    id: 'DEV002',
    name: 'Wireless Presenter Microphone',
    model: 'Shure BLX24 / PG58 Wireless System (DEMO-M01)',
    type: 'microphone',
    classroomId: 'AB-204',
    classroomName: 'Academic Block A · Room AB-204',
    health: 'healthy',
    serialNumber: 'SH-BLX24-44102-X',
    installDate: '2023-11-20',
    lastInspected: '2026-09-30',
    manual: {
      title: 'Shure BLX Wireless System User Guide',
      docUrl: 'https://files.support.epson.com/docid/cpd5/cpd59263.pdf',
      revision: 'Rev 5.2',
      relevantPage: 14,
    },
    qrIdentifier: 'QR-DEV-AV-AB204-M01',
  },
  {
    id: 'DEV003',
    name: 'Interactive Flat Panel 75"',
    model: 'Promethean ActivPanel 9 Series (DEMO-S01)',
    type: 'smartboard',
    classroomId: 'AB-204',
    classroomName: 'Academic Block A · Room AB-204',
    health: 'healthy',
    serialNumber: 'PRM-AP9-88319-K',
    installDate: '2024-01-10',
    lastInspected: '2026-10-20',
    manual: {
      title: 'Promethean ActivPanel 9 User Guide',
      docUrl: 'https://files.support.epson.com/docid/cpd5/cpd59263.pdf',
      revision: 'AP9-UG-V2',
      relevantPage: 45,
    },
    qrIdentifier: 'QR-DEV-AV-AB204-S01',
  },

  // Room AB-105
  {
    id: 'DEV004',
    name: 'Auditorium Laser Projector',
    model: 'Epson PowerLite EB-E01 / EB-X06 (DEMO-P02)',
    type: 'projector',
    classroomId: 'AB-105',
    classroomName: 'Academic Block A · Room AB-105',
    health: 'faulty',
    serialNumber: 'EP-EB01-10294-B',
    installDate: '2024-03-15',
    lastInspected: '2026-10-28',
    manual: {
      title: 'Epson EB-E01/EB-X06 User Guide',
      docUrl: 'https://files.support.epson.com/docid/cpd5/cpd59263.pdf',
      revision: 'CPD-59263',
      relevantPage: 38,
    },
    qrIdentifier: 'QR-DEV-AV-AB105-P01',
  },
  {
    id: 'DEV005',
    name: 'Wireless Handheld Microphone',
    model: 'Shure BLX24 / PG58 Wireless System (DEMO-M02)',
    type: 'microphone',
    classroomId: 'AB-105',
    classroomName: 'Academic Block A · Room AB-105',
    health: 'healthy',
    serialNumber: 'SH-BLX24-55912-Y',
    installDate: '2023-11-20',
    lastInspected: '2026-09-12',
    manual: {
      title: 'Shure BLX Wireless System User Guide',
      docUrl: 'https://files.support.epson.com/docid/cpd5/cpd59263.pdf',
      revision: 'Rev 5.2',
      relevantPage: 14,
    },
    qrIdentifier: 'QR-DEV-AV-AB105-M01',
  },
  {
    id: 'DEV006',
    name: 'Interactive Smart Board 75"',
    model: 'Promethean ActivPanel 9 Series (DEMO-S02)',
    type: 'smartboard',
    classroomId: 'AB-105',
    classroomName: 'Academic Block A · Room AB-105',
    health: 'healthy',
    serialNumber: 'PRM-AP9-77218-L',
    installDate: '2024-01-10',
    lastInspected: '2026-10-01',
    manual: {
      title: 'Promethean ActivPanel 9 User Guide',
      docUrl: 'https://files.support.epson.com/docid/cpd5/cpd59263.pdf',
      revision: 'AP9-UG-V2',
      relevantPage: 45,
    },
    qrIdentifier: 'QR-DEV-AV-AB105-S01',
  },

  // Room CB-301
  {
    id: 'DEV007',
    name: 'Seminar Hall Projector',
    model: 'Epson PowerLite EB-E01 / EB-X06 (DEMO-P03)',
    type: 'projector',
    classroomId: 'CB-301',
    classroomName: 'Computer Block · Room CB-301',
    health: 'healthy',
    serialNumber: 'EP-EB01-33819-C',
    installDate: '2024-02-10',
    lastInspected: '2026-10-18',
    manual: {
      title: 'Epson EB-E01/EB-X06 User Guide',
      docUrl: 'https://files.support.epson.com/docid/cpd5/cpd59263.pdf',
      revision: 'CPD-59263',
      relevantPage: 38,
    },
    qrIdentifier: 'QR-DEV-AV-CB301-P01',
  },
  {
    id: 'DEV008',
    name: 'Wireless Lapel Microphone',
    model: 'Shure BLX24 / PG58 Wireless System (DEMO-M03)',
    type: 'microphone',
    classroomId: 'CB-301',
    classroomName: 'Computer Block · Room CB-301',
    health: 'faulty',
    serialNumber: 'SH-BLX24-99120-Z',
    installDate: '2023-10-15',
    lastInspected: '2026-10-25',
    manual: {
      title: 'Shure BLX Wireless System User Guide',
      docUrl: 'https://files.support.epson.com/docid/cpd5/cpd59263.pdf',
      revision: 'Rev 5.2',
      relevantPage: 14,
    },
    qrIdentifier: 'QR-DEV-AV-CB301-M01',
  },
  {
    id: 'DEV009',
    name: 'Interactive Touch Panel',
    model: 'Promethean ActivPanel 9 Series (DEMO-S03)',
    type: 'smartboard',
    classroomId: 'CB-301',
    classroomName: 'Computer Block · Room CB-301',
    health: 'healthy',
    serialNumber: 'PRM-AP9-11029-M',
    installDate: '2024-01-15',
    lastInspected: '2026-10-10',
    manual: {
      title: 'Promethean ActivPanel 9 User Guide',
      docUrl: 'https://files.support.epson.com/docid/cpd5/cpd59263.pdf',
      revision: 'AP9-UG-V2',
      relevantPage: 45,
    },
    qrIdentifier: 'QR-DEV-AV-CB301-S01',
  },

  // Room EB-202
  {
    id: 'DEV010',
    name: 'Engineering Hall Projector',
    model: 'Epson PowerLite EB-E01 / EB-X06 (DEMO-P04)',
    type: 'projector',
    classroomId: 'EB-202',
    classroomName: 'Engineering Block · Room EB-202',
    health: 'healthy',
    serialNumber: 'EP-EB01-44910-D',
    installDate: '2024-04-01',
    lastInspected: '2026-10-12',
    manual: {
      title: 'Epson EB-E01/EB-X06 User Guide',
      docUrl: 'https://files.support.epson.com/docid/cpd5/cpd59263.pdf',
      revision: 'CPD-59263',
      relevantPage: 38,
    },
    qrIdentifier: 'QR-DEV-AV-EB202-P01',
  },
  {
    id: 'DEV011',
    name: 'Presenter Podium Microphone',
    model: 'Shure BLX24 / PG58 Wireless System (DEMO-M04)',
    type: 'microphone',
    classroomId: 'EB-202',
    classroomName: 'Engineering Block · Room EB-202',
    health: 'healthy',
    serialNumber: 'SH-BLX24-88314-A',
    installDate: '2023-12-05',
    lastInspected: '2026-09-18',
    manual: {
      title: 'Shure BLX Wireless System User Guide',
      docUrl: 'https://files.support.epson.com/docid/cpd5/cpd59263.pdf',
      revision: 'Rev 5.2',
      relevantPage: 14,
    },
    qrIdentifier: 'QR-DEV-AV-EB202-M01',
  },
  {
    id: 'DEV012',
    name: 'Front Wall Interactive Screen',
    model: 'Promethean ActivPanel 9 Series (DEMO-S04)',
    type: 'smartboard',
    classroomId: 'EB-202',
    classroomName: 'Engineering Block · Room EB-202',
    health: 'healthy',
    serialNumber: 'PRM-AP9-66103-N',
    installDate: '2024-02-20',
    lastInspected: '2026-10-14',
    manual: {
      title: 'Promethean ActivPanel 9 User Guide',
      docUrl: 'https://files.support.epson.com/docid/cpd5/cpd59263.pdf',
      revision: 'AP9-UG-V2',
      relevantPage: 45,
    },
    qrIdentifier: 'QR-DEV-AV-EB202-S01',
  },

  // Room LB-110
  {
    id: 'DEV013',
    name: 'Digital Library Projector',
    model: 'Epson PowerLite EB-E01 / EB-X06 (DEMO-P05)',
    type: 'projector',
    classroomId: 'LB-110',
    classroomName: 'Library Block · Room LB-110',
    health: 'healthy',
    serialNumber: 'EP-EB01-55821-E',
    installDate: '2024-04-10',
    lastInspected: '2026-10-08',
    manual: {
      title: 'Epson EB-E01/EB-X06 User Guide',
      docUrl: 'https://files.support.epson.com/docid/cpd5/cpd59263.pdf',
      revision: 'CPD-59263',
      relevantPage: 38,
    },
    qrIdentifier: 'QR-DEV-AV-LB110-P01',
  },
  {
    id: 'DEV014',
    name: 'Seminar Wireless Microphone',
    model: 'Shure BLX24 / PG58 Wireless System (DEMO-M05)',
    type: 'microphone',
    classroomId: 'LB-110',
    classroomName: 'Library Block · Room LB-110',
    health: 'healthy',
    serialNumber: 'SH-BLX24-33102-B',
    installDate: '2023-11-15',
    lastInspected: '2026-09-22',
    manual: {
      title: 'Shure BLX Wireless System User Guide',
      docUrl: 'https://files.support.epson.com/docid/cpd5/cpd59263.pdf',
      revision: 'Rev 5.2',
      relevantPage: 14,
    },
    qrIdentifier: 'QR-DEV-AV-LB110-M01',
  },
  {
    id: 'DEV015',
    name: 'Library Interactive Board',
    model: 'Promethean ActivPanel 9 Series (DEMO-S05)',
    type: 'smartboard',
    classroomId: 'LB-110',
    classroomName: 'Library Block · Room LB-110',
    health: 'healthy',
    serialNumber: 'PRM-AP9-44192-P',
    installDate: '2024-02-15',
    lastInspected: '2026-10-19',
    manual: {
      title: 'Promethean ActivPanel 9 User Guide',
      docUrl: 'https://files.support.epson.com/docid/cpd5/cpd59263.pdf',
      revision: 'AP9-UG-V2',
      relevantPage: 45,
    },
    qrIdentifier: 'QR-DEV-AV-LB110-S01',
  },

  // Room AB-302
  {
    id: 'DEV016',
    name: 'Lecture Hall Projector',
    model: 'Epson PowerLite EB-E01 / EB-X06 (DEMO-P06)',
    type: 'projector',
    classroomId: 'AB-302',
    classroomName: 'Academic Block A · Room AB-302',
    health: 'healthy',
    serialNumber: 'EP-EB01-77192-F',
    installDate: '2024-05-01',
    lastInspected: '2026-10-22',
    manual: {
      title: 'Epson EB-E01/EB-X06 User Guide',
      docUrl: 'https://files.support.epson.com/docid/cpd5/cpd59263.pdf',
      revision: 'CPD-59263',
      relevantPage: 38,
    },
    qrIdentifier: 'QR-DEV-AV-AB302-P01',
  },
  {
    id: 'DEV017',
    name: 'Faculty Wireless Microphone',
    model: 'Shure BLX24 / PG58 Wireless System (DEMO-M06)',
    type: 'microphone',
    classroomId: 'AB-302',
    classroomName: 'Academic Block A · Room AB-302',
    health: 'healthy',
    serialNumber: 'SH-BLX24-11928-C',
    installDate: '2023-12-10',
    lastInspected: '2026-09-28',
    manual: {
      title: 'Shure BLX Wireless System User Guide',
      docUrl: 'https://files.support.epson.com/docid/cpd5/cpd59263.pdf',
      revision: 'Rev 5.2',
      relevantPage: 14,
    },
    qrIdentifier: 'QR-DEV-AV-AB302-M01',
  },
  {
    id: 'DEV018',
    name: 'Smart Presentation Board',
    model: 'Promethean ActivPanel 9 Series (DEMO-S06)',
    type: 'smartboard',
    classroomId: 'AB-302',
    classroomName: 'Academic Block A · Room AB-302',
    health: 'healthy',
    serialNumber: 'PRM-AP9-99201-Q',
    installDate: '2024-03-01',
    lastInspected: '2026-10-24',
    manual: {
      title: 'Promethean ActivPanel 9 User Guide',
      docUrl: 'https://files.support.epson.com/docid/cpd5/cpd59263.pdf',
      revision: 'AP9-UG-V2',
      relevantPage: 45,
    },
    qrIdentifier: 'QR-DEV-AV-AB302-S01',
  },
];

const STORAGE_KEY = 'tscai_campus_devices_v3';

if (typeof window !== 'undefined') {
  try {
    const legacyOld = localStorage.getItem('tscai_devices_data');
    if (legacyOld && (legacyOld.includes('PT-MZ780') || legacyOld.includes('AV-P204-01') || legacyOld.includes('Sony') || legacyOld.includes('Crestron'))) {
      localStorage.removeItem('tscai_devices_data');
    }
  } catch {}
}

export const deviceService = {
  getAll: (): Device[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length >= 18 && parsed[0].id === 'DEV001') {
          return parsed;
        }
      } catch {
        // fallback
      }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(REAL_CAMPUS_DEVICES));
    return REAL_CAMPUS_DEVICES;
  },

  getById: (id: string): Device | undefined => {
    return deviceService.getAll().find((d) => d.id.toLowerCase() === id.toLowerCase() || d.qrIdentifier.toLowerCase() === id.toLowerCase());
  },

  getByRoom: (classroomId: string): Device[] => {
    return deviceService.getAll().filter((d) => d.classroomId.toLowerCase() === classroomId.toLowerCase());
  },

  addDevice: (device: Device): Device => {
    const list = deviceService.getAll();
    const updated = [device, ...list];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return device;
  },

  updateHealth: (deviceId: string, health: Device['health']): Device => {
    const list = deviceService.getAll();
    const index = list.findIndex((d) => d.id === deviceId);
    if (index === -1) throw new Error('Device not found');

    const updated = { ...list[index], health };
    list[index] = updated;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return updated;
  },

  regenerateQrIdentifier: (deviceId: string): string => {
    const list = deviceService.getAll();
    const index = list.findIndex((d) => d.id === deviceId);
    if (index === -1) throw new Error('Device not found');

    const newToken = `QR-DEV-${list[index].id}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    list[index].qrIdentifier = newToken;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return newToken;
  },
};
