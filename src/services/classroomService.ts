import { Classroom } from '../types/classroom';

const SEED_CLASSROOMS: Classroom[] = [
  {
    id: 'AB-204',
    name: 'Smart Lecture Auditorium 204',
    building: 'Academic Block A',
    floor: 2,
    capacity: 85,
    status: 'incident_reported',
    activeIncidentId: 'INC-001',
    totalDevices: 8,
    qrIdentifier: 'qr_rm_ab204_sec_9941a8',
    lastTriageAt: '12 min ago',
    notes: 'Primary physics & engineering tiered lecture hall with dual projection.',
  },
  {
    id: 'AB-105',
    name: 'Collaborative Seminar Hall 105',
    building: 'Academic Block A',
    floor: 1,
    capacity: 120,
    status: 'incident_reported',
    activeIncidentId: 'INC-002',
    totalDevices: 10,
    qrIdentifier: 'qr_rm_ab105_sec_8820c4',
    lastTriageAt: '38 min ago',
    notes: 'Multi-display room with active ceiling beamforming mics.',
  },
  {
    id: 'AB-301',
    name: 'Interactive Seminar Lab 301',
    building: 'Academic Block A',
    floor: 3,
    capacity: 60,
    status: 'operational',
    totalDevices: 6,
    qrIdentifier: 'qr_rm_ab301_sec_7719d2',
    lastTriageAt: '2 hours ago',
    notes: 'Equipped with dual SMART interactive flat panels.',
  },
  {
    id: 'ENG-A',
    name: 'Engineering Block Main Hall A',
    building: 'Engineering Block',
    floor: 1,
    capacity: 250,
    status: 'incident_reported',
    activeIncidentId: 'INC-004',
    totalDevices: 14,
    qrIdentifier: 'qr_rm_enga_sec_4432f9',
    lastTriageAt: '45 min ago',
    notes: 'High-capacity hall with dual robotic PTZ cameras and broadcast switcher.',
  },
  {
    id: 'SCI-302',
    name: 'Advanced Science Lab 302',
    building: 'Science Complex',
    floor: 3,
    capacity: 70,
    status: 'incident_reported',
    activeIncidentId: 'INC-005',
    totalDevices: 7,
    qrIdentifier: 'qr_rm_sci302_sec_5510b1',
    lastTriageAt: '1 hour ago',
    notes: 'Specialized chemical optics and high-res visualization screens.',
  },
  {
    id: 'LIB-AUD',
    name: 'Central Library Auditorium',
    building: 'Central Library',
    floor: 1,
    capacity: 320,
    status: 'operational',
    totalDevices: 18,
    qrIdentifier: 'qr_rm_libaud_sec_1109e3',
    lastTriageAt: '1 day ago',
    notes: 'Main campus event venue with line array audio and motorized screens.',
  },
];

const STORAGE_KEY = 'tscai_classrooms_data';

export const classroomService = {
  getAll: (): Classroom[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      try {
        return JSON.parse(data);
      } catch {
        // fallback
      }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_CLASSROOMS));
    return SEED_CLASSROOMS;
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

    const newToken = `qr_rm_${classroomId.toLowerCase().replace('-', '')}_sec_${Math.random().toString(36).substring(2, 8)}`;
    list[index].qrIdentifier = newToken;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return newToken;
  },
};
