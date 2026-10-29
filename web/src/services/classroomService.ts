import { Classroom } from '../types/classroom';

const REAL_CAMPUS_CLASSROOMS: Classroom[] = [
  {
    id: 'AB-204',
    name: 'Lecture Hall AB-204',
    building: 'Academic Block A',
    floor: 2,
    capacity: 85,
    status: 'operational',
    totalDevices: 3,
    qrIdentifier: 'QR-CLS-AB204',
    notes: 'Equipped with Epson 3LCD Projector, Shure Wireless Mic, and Promethean ActivPanel 9.',
  },
  {
    id: 'AB-105',
    name: 'Collaborative Hall AB-105',
    building: 'Academic Block A',
    floor: 1,
    capacity: 120,
    status: 'operational',
    totalDevices: 3,
    qrIdentifier: 'QR-CLS-AB105',
    notes: 'Tiered lecture facility with integrated podium and multi-panel display.',
  },
  {
    id: 'CB-301',
    name: 'Computer Science Hall CB-301',
    building: 'Computer Block',
    floor: 3,
    capacity: 60,
    status: 'operational',
    totalDevices: 3,
    qrIdentifier: 'QR-CLS-CB301',
    notes: 'Dual display setup with digital wireless mic receiver and interactive board.',
  },
  {
    id: 'EB-202',
    name: 'Engineering Auditorium EB-202',
    building: 'Engineering Block',
    floor: 2,
    capacity: 100,
    status: 'operational',
    totalDevices: 3,
    qrIdentifier: 'QR-CLS-EB202',
    notes: 'High-lumen projection with dedicated presenter microphone system.',
  },
  {
    id: 'LB-110',
    name: 'Library Seminar Room LB-110',
    building: 'Library Block',
    floor: 1,
    capacity: 50,
    status: 'operational',
    totalDevices: 3,
    qrIdentifier: 'QR-CLS-LB110',
    notes: 'Conference setup with touch interactive display and ceiling sound reinforcement.',
  },
  {
    id: 'AB-302',
    name: 'Multipurpose Hall AB-302',
    building: 'Academic Block A',
    floor: 3,
    capacity: 75,
    status: 'operational',
    totalDevices: 3,
    qrIdentifier: 'QR-CLS-AB302',
    notes: 'Equipped with full AV suite for lectures and multimedia presentations.',
  },
];

const STORAGE_KEY = 'tscai_campus_classrooms_v3';

if (typeof window !== 'undefined') {
  try {
    const legacyOld = localStorage.getItem('tscai_classrooms_data');
    if (legacyOld && (legacyOld.includes('ENG-A') || legacyOld.includes('SCI-302') || legacyOld.includes('LIB-AUD'))) {
      localStorage.removeItem('tscai_classrooms_data');
    }
  } catch {}
}

export const classroomService = {
  getAll: (): Classroom[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].id === 'AB-204') {
          return parsed;
        }
      } catch {
        // fallback
      }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(REAL_CAMPUS_CLASSROOMS));
    return REAL_CAMPUS_CLASSROOMS;
  },

  getById: (id: string): Classroom | undefined => {
    return classroomService.getAll().find((c) => c.id.toLowerCase() === id.toLowerCase());
  },

  addClassroom: (classroom: Classroom): Classroom => {
    const list = classroomService.getAll();
    const updated = [classroom, ...list];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return classroom;
  },

  regenerateQrIdentifier: (classroomId: string): string => {
    const list = classroomService.getAll();
    const index = list.findIndex((c) => c.id === classroomId);
    if (index === -1) throw new Error('Classroom not found');

    const newToken = `QR-CLS-${classroomId.toUpperCase().replace('-', '')}`;
    list[index].qrIdentifier = newToken;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return newToken;
  },
};
