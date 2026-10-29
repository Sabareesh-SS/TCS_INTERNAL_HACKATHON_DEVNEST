import { User } from '../types/user';

export const ADMIN_USER: User = {
  id: 'usr_admin_01',
  name: 'Dr. Sarah Chen',
  email: 's.chen@campus.edu',
  role: 'admin',
  avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  status: 'on_duty',
  specialty: 'Campus AV Operations Director & Infrastructure Architect',
  phone: '+1 (555) 019-4820',
  activeAssignmentsCount: 0,
  totalResolvedCount: 189,
};

export const FIELD_TECHNICIANS = [
  { id: 'usr_tech_01', name: 'Alex Rivera', email: 'alex.rivera@campus.edu', specialty: 'Video Routing & Crestron Logic', status: 'on_duty' },
  { id: 'usr_tech_02', name: 'Marcus Vance', email: 'm.vance@campus.edu', specialty: 'Acoustics & Shure RF Wireless', status: 'available' },
  { id: 'usr_tech_03', name: 'Elena Rostova', email: 'e.rostova@campus.edu', specialty: 'Interactive Displays & Optical Sensors', status: 'busy' },
];

const STORAGE_KEY = 'tscai_admin_user';

export const authService = {
  getCurrentUser: (): User => {
    return ADMIN_USER;
  },

  setCurrentUser: (_user: User): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ADMIN_USER));
  },

  getAllUsers: (): User[] => {
    return [ADMIN_USER];
  },
};
