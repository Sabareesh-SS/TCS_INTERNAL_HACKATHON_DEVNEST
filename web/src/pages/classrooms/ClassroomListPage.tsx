import React, { useState } from 'react';
import { classroomService } from '../../services/classroomService';
import { Classroom } from '../../types/classroom';
import { Plus, QrCode, ArrowRight, MapPin, Users, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ClassroomListPageProps {
  onSelectRoom: (roomId: string) => void;
  onOpenQr: (type: 'classroom', id: string) => void;
}

export const ClassroomListPage: React.FC<ClassroomListPageProps> = ({ onSelectRoom, onOpenQr }) => {
  const [classrooms, setClassrooms] = useState<Classroom[]>(() => classroomService.getAll());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { isAdmin } = useAuth();

  // New classroom form state
  const [newId, setNewId] = useState('');
  const [newName, setNewName] = useState('');
  const [newBuilding, setNewBuilding] = useState('Academic Block A');
  const [newFloor, setNewFloor] = useState(1);
  const [newCapacity, setNewCapacity] = useState(60);

  const handleAddClassroom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newId.trim() || !newName.trim()) return;

    classroomService.addClassroom({
      id: newId.trim().toUpperCase(),
      name: newName.trim(),
      building: newBuilding,
      floor: Number(newFloor),
      capacity: Number(newCapacity),
      status: 'operational',
      totalDevices: 4,
      qrIdentifier: `qr_rm_${newId.toLowerCase().replace('-', '')}_sec_${Math.random().toString(36).substring(2, 7)}`,
      lastTriageAt: 'Just now',
      notes: 'Newly commissioned smart classroom.',
    });

    setClassrooms(classroomService.getAll());
    setIsAddModalOpen(false);
    setNewId('');
    setNewName('');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900">
            Classrooms & Lecture Halls
          </h2>
        </div>

        {isAdmin && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-mono rounded bg-zinc-900 hover:bg-zinc-800 text-white font-semibold transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Register Classroom
          </button>
        )}
      </div>

      {/* Classroom Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classrooms.map((room) => {
          const hasIncident = room.status === 'incident_reported';

          return (
            <div
              key={room.id}
              className="p-5 rounded-lg border border-zinc-200 bg-white hover:border-zinc-300 shadow-xs transition-colors flex flex-col justify-between space-y-4 text-left group"
            >
              <div>
                {/* Card Top */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-base font-bold font-mono text-zinc-900 group-hover:text-sky-700 transition-colors">
                      {room.id}
                    </span>
                    <h3 className="text-xs font-semibold text-zinc-800 line-clamp-1">
                      {room.name}
                    </h3>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${
                      hasIncident
                        ? 'border-rose-200 bg-rose-50 text-rose-700'
                        : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        hasIncident ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'
                      }`}
                    />
                    {hasIncident ? 'Incident' : 'Operational'}
                  </span>
                </div>

                <div className="space-y-1 text-xs font-mono text-zinc-500">
                  <p className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                    {room.building} · Floor {room.floor}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-zinc-400" />
                    Capacity: {room.capacity} students · {room.totalDevices} AV Devices
                  </p>
                </div>

                {room.notes && (
                  <p className="text-xs text-zinc-600 mt-2 line-clamp-2 font-sans">
                    {room.notes}
                  </p>
                )}
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onOpenQr('classroom', room.id)}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-800 font-medium transition-colors"
                  title="Generate & print entrance QR code"
                >
                  <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                  Doorway QR
                </button>

                <button
                  type="button"
                  onClick={() => onSelectRoom(room.id)}
                  className="flex items-center gap-1 text-xs font-mono text-sky-700 hover:text-sky-800 font-semibold"
                >
                  View Hardware <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Register Classroom Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white border border-zinc-200 rounded-lg max-w-md w-full p-6 text-zinc-900 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
              <h3 className="text-sm font-bold uppercase font-mono">
                Register New Classroom
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded text-zinc-400 hover:text-zinc-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddClassroom} className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-zinc-600 font-semibold block mb-1">Room Identifier (e.g. AB-402)</label>
                <input
                  type="text"
                  required
                  value={newId}
                  onChange={(e) => setNewId(e.target.value)}
                  placeholder="AB-402"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded px-3 py-2 text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-400"
                />
              </div>

              <div>
                <label className="text-zinc-600 font-semibold block mb-1">Classroom Name / Title</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Interactive Physics Lab 402"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded px-3 py-2 text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-zinc-600 font-semibold block mb-1">Building</label>
                  <select
                    value={newBuilding}
                    onChange={(e) => setNewBuilding(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded px-2.5 py-2 text-zinc-800"
                  >
                    <option value="Academic Block A">Academic Block A</option>
                    <option value="Academic Block B">Academic Block B</option>
                    <option value="Engineering Block">Engineering Block</option>
                    <option value="Science Complex">Science Complex</option>
                    <option value="Central Library">Central Library</option>
                  </select>
                </div>
                <div>
                  <label className="text-zinc-600 font-semibold block mb-1">Capacity</label>
                  <input
                    type="number"
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(Number(e.target.value))}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded px-3 py-2 text-zinc-900"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 rounded border border-zinc-200 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-white font-semibold"
                >
                  Save & Issue QR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
