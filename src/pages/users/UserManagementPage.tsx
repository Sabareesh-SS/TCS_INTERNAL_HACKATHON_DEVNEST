import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FIELD_TECHNICIANS } from '../../services/authService';
import { UserPlus, Phone, ShieldCheck, Wrench, X, CheckCircle2 } from 'lucide-react';

interface AdminAccount {
  id: string;
  name: string;
  email: string;
  role: 'admin';
  title: string;
  phone: string;
  accessLevel: string;
}

interface FieldTech {
  id: string;
  name: string;
  email: string;
  specialty: string;
  phone: string;
  status: 'on_duty' | 'available' | 'busy' | 'offline';
  assignedTicketsCount: number;
}

export const UserManagementPage: React.FC = () => {
  const { currentUser } = useAuth();

  // Dashboard Administrators (strictly admin role only)
  const [admins, setAdmins] = useState<AdminAccount[]>([
    {
      id: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
      role: 'admin',
      title: 'Campus AV Operations Director & Infrastructure Architect',
      phone: currentUser.phone || '+1 (555) 019-4820',
      accessLevel: 'Root Administrator (Level 4)',
    },
    {
      id: 'usr_admin_02',
      name: 'Prof. David Miller',
      email: 'd.miller@campus.edu',
      role: 'admin',
      title: 'Academic Technology Systems Coordinator',
      phone: '+1 (555) 018-9921',
      accessLevel: 'Operations Administrator (Level 3)',
    },
  ]);

  // Field Technicians (for mobile dispatch)
  const [fieldTechnicians, setFieldTechnicians] = useState<FieldTech[]>([
    {
      id: FIELD_TECHNICIANS[0].id,
      name: FIELD_TECHNICIANS[0].name,
      email: FIELD_TECHNICIANS[0].email,
      specialty: FIELD_TECHNICIANS[0].specialty,
      phone: '+1 (555) 014-4921',
      status: 'on_duty',
      assignedTicketsCount: 3,
    },
    {
      id: FIELD_TECHNICIANS[1].id,
      name: FIELD_TECHNICIANS[1].name,
      email: FIELD_TECHNICIANS[1].email,
      specialty: FIELD_TECHNICIANS[1].specialty,
      phone: '+1 (555) 019-2844',
      status: 'available',
      assignedTicketsCount: 1,
    },
    {
      id: FIELD_TECHNICIANS[2].id,
      name: FIELD_TECHNICIANS[2].name,
      email: FIELD_TECHNICIANS[2].email,
      specialty: FIELD_TECHNICIANS[2].specialty,
      phone: '+1 (555) 018-8733',
      status: 'busy',
      assignedTicketsCount: 2,
    },
  ]);

  const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false);
  const [isAddTechModalOpen, setIsAddTechModalOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [specialtyOrTitle, setSpecialtyOrTitle] = useState('');
  const [phone, setPhone] = useState('');

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const newAdmin: AdminAccount = {
      id: `usr_admin_${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      email: email.trim(),
      role: 'admin',
      title: specialtyOrTitle || 'Campus AV Administrator',
      phone: phone || '+1 (555) 000-0000',
      accessLevel: 'Operations Administrator (Level 3)',
    };

    setAdmins([...admins, newAdmin]);
    setIsAddAdminModalOpen(false);
    resetForm();
  };

  const handleAddFieldTech = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const newTech: FieldTech = {
      id: `usr_tech_${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      email: email.trim(),
      specialty: specialtyOrTitle || 'Classroom AV Hardware Repair',
      phone: phone || '+1 (555) 000-0000',
      status: 'available',
      assignedTicketsCount: 0,
    };

    setFieldTechnicians([...fieldTechnicians, newTech]);
    setIsAddTechModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setSpecialtyOrTitle('');
    setPhone('');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-zinc-700 font-semibold">
              Administrative Control & RBAC
            </span>
            <span className="text-xs font-mono text-zinc-500">
              Dashboard Role: Admin Only
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 mt-1">
            Access Control & Field Staff Directory
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600">
            Web dashboard access is restricted to Administrators. Manage campus administrators and field dispatch technicians.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsAddTechModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono rounded bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-800 font-medium transition-colors"
          >
            <Wrench className="w-3.5 h-3.5 text-zinc-600" />
            Register Field Tech
          </button>
          <button
            onClick={() => setIsAddAdminModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-mono rounded bg-zinc-900 hover:bg-zinc-800 text-white font-semibold transition-colors shadow-xs"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Add Administrator
          </button>
        </div>
      </div>

      {/* Section 1: Dashboard Administrators (Admin Role) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-violet-600" />
            <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-zinc-900">
              Dashboard Administrators (Role: Admin)
            </h3>
          </div>
          <span className="text-xs font-mono text-zinc-500">
            {admins.length} Root & Operational Admins
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {admins.map((admin) => (
            <div
              key={admin.id}
              className="p-5 rounded-lg border border-zinc-200 bg-white shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-violet-50 border border-violet-200 text-violet-800 font-mono font-bold flex items-center justify-center text-sm">
                      {admin.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-zinc-900 flex items-center gap-1.5">
                        {admin.name}
                        {admin.id === currentUser.id && (
                          <span className="text-[10px] font-mono font-normal text-violet-700 bg-violet-50 border border-violet-200 px-1.5 py-0.2 rounded">
                            You
                          </span>
                        )}
                      </h4>
                      <span className="text-[11px] font-mono text-zinc-500 block">
                        {admin.email}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded border font-bold border-violet-200 bg-violet-50 text-violet-700 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-violet-600" />
                    Admin
                  </span>
                </div>

                <div className="space-y-1.5 text-xs font-mono text-zinc-600">
                  <p className="text-zinc-800 font-sans font-medium">
                    {admin.title}
                  </p>
                  <p className="flex items-center gap-1.5 text-zinc-500">
                    <Phone className="w-3.5 h-3.5 text-zinc-400" />
                    {admin.phone}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-700 font-semibold inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Active Administrator
                </span>
                <span className="text-zinc-400 text-[11px]">
                  {admin.accessLevel}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Field Technicians Registry (For mobile dispatch) */}
      <div className="space-y-4 pt-4 border-t border-zinc-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-sky-600" />
            <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-zinc-900">
              Campus Field Technicians (Mobile Dispatch Roster)
            </h3>
          </div>
          <span className="text-xs font-mono text-zinc-500">
            {fieldTechnicians.length} Field Service Technicians
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {fieldTechnicians.map((tech) => (
            <div
              key={tech.id}
              className="p-5 rounded-lg border border-zinc-200 bg-white shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-800 font-mono font-bold flex items-center justify-center text-sm">
                      {tech.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-zinc-900">
                        {tech.name}
                      </h4>
                      <span className="text-[11px] font-mono text-zinc-500 block">
                        {tech.email}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded border font-semibold border-zinc-200 bg-zinc-50 text-zinc-700">
                    Field Tech
                  </span>
                </div>

                <div className="space-y-1.5 text-xs font-mono text-zinc-600">
                  <p className="text-zinc-800 font-sans font-medium">
                    Specialty: {tech.specialty}
                  </p>
                  <p className="flex items-center gap-1.5 text-zinc-500">
                    <Phone className="w-3.5 h-3.5 text-zinc-400" />
                    {tech.phone}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs font-mono">
                <span className="inline-flex items-center gap-1.5 font-semibold text-zinc-800">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      tech.status === 'on_duty'
                        ? 'bg-emerald-500'
                        : tech.status === 'available'
                        ? 'bg-sky-500'
                        : 'bg-amber-500'
                    }`}
                  />
                  {tech.status.replace('_', ' ').toUpperCase()}
                </span>
                <span className="text-zinc-500 text-[11px]">
                  {tech.assignedTicketsCount} active tickets
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Administrator Modal */}
      {isAddAdminModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white border border-zinc-200 rounded-lg max-w-md w-full p-6 text-zinc-900 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-violet-600" />
                <h3 className="text-sm font-bold uppercase font-mono">
                  Create Administrator Account
                </h3>
              </div>
              <button
                onClick={() => setIsAddAdminModalOpen(false)}
                className="p-1 rounded text-zinc-400 hover:text-zinc-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddAdmin} className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-zinc-600 font-semibold block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Prof. Maria Santos"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded px-3 py-2 text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-400"
                />
              </div>

              <div>
                <label className="text-zinc-600 font-semibold block mb-1">Campus Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="m.santos@campus.edu"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded px-3 py-2 text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-400"
                />
              </div>

              <div>
                <label className="text-zinc-600 font-semibold block mb-1">Role</label>
                <input
                  type="text"
                  disabled
                  value="Administrator (Admin Role Only)"
                  className="w-full bg-zinc-100 border border-zinc-200 rounded px-3 py-2 text-violet-800 font-bold"
                />
              </div>

              <div>
                <label className="text-zinc-600 font-semibold block mb-1">Administrative Title</label>
                <input
                  type="text"
                  value={specialtyOrTitle}
                  onChange={(e) => setSpecialtyOrTitle(e.target.value)}
                  placeholder="Campus Infrastructure Coordinator"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded px-3 py-2 text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-400"
                />
              </div>

              <div>
                <label className="text-zinc-600 font-semibold block mb-1">Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 018-4421"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded px-3 py-2 text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-200">
                <button
                  type="button"
                  onClick={() => setIsAddAdminModalOpen(false)}
                  className="px-3 py-1.5 rounded border border-zinc-200 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-white font-semibold"
                >
                  Create Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Register Field Technician Modal */}
      {isAddTechModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white border border-zinc-200 rounded-lg max-w-md w-full p-6 text-zinc-900 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-sky-600" />
                <h3 className="text-sm font-bold uppercase font-mono">
                  Register Field Technician
                </h3>
              </div>
              <button
                onClick={() => setIsAddTechModalOpen(false)}
                className="p-1 rounded text-zinc-400 hover:text-zinc-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddFieldTech} className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-zinc-600 font-semibold block mb-1">Technician Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jordan Blake"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded px-3 py-2 text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-400"
                />
              </div>

              <div>
                <label className="text-zinc-600 font-semibold block mb-1">Campus Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jordan.blake@campus.edu"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded px-3 py-2 text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-400"
                />
              </div>

              <div>
                <label className="text-zinc-600 font-semibold block mb-1">Hardware Specialty</label>
                <input
                  type="text"
                  value={specialtyOrTitle}
                  onChange={(e) => setSpecialtyOrTitle(e.target.value)}
                  placeholder="Projection Optics & HDMI Extenders"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded px-3 py-2 text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-400"
                />
              </div>

              <div>
                <label className="text-zinc-600 font-semibold block mb-1">Mobile Dispatch Hotline</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 391-0021"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded px-3 py-2 text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-200">
                <button
                  type="button"
                  onClick={() => setIsAddTechModalOpen(false)}
                  className="px-3 py-1.5 rounded border border-zinc-200 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-white font-semibold"
                >
                  Register Technician
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
