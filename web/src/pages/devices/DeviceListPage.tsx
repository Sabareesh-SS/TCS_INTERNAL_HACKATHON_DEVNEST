import React, { useState } from 'react';
import { deviceService } from '../../services/deviceService';
import { Device, DeviceType } from '../../types/device';
import { StatusBadge } from '../../components/StatusBadge';
import { Cpu, Plus, QrCode, BookOpen, Search, X, Video, Mic, Tv, Volume2, Network } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface DeviceListPageProps {
  onOpenQr: (type: 'device', id: string) => void;
  selectedRoomFilter?: string;
}

export const DeviceListPage: React.FC<DeviceListPageProps> = ({ onOpenQr, selectedRoomFilter }) => {
  const [devices, setDevices] = useState<Device[]>(() => deviceService.getAll());
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<DeviceType | 'all'>('all');
  const [roomFilter, setRoomFilter] = useState<string>(selectedRoomFilter || 'all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { isAdmin } = useAuth();

  // Form state for new device
  const [newId, setNewId] = useState('');
  const [newName, setNewName] = useState('');
  const [newModel, setNewModel] = useState('');
  const [newType, setNewType] = useState<DeviceType>('projector');
  const [newRoomId, setNewRoomId] = useState('AB-204');
  const [newManualTitle, setNewManualTitle] = useState('');

  const filteredDevices = devices.filter((d) => {
    if (typeFilter !== 'all' && d.type !== typeFilter) return false;
    if (roomFilter !== 'all' && d.classroomId !== roomFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchId = d.id.toLowerCase().includes(q);
      const matchName = d.name.toLowerCase().includes(q);
      const matchModel = d.model.toLowerCase().includes(q);
      const matchRoom = d.classroomId.toLowerCase().includes(q);
      if (!matchId && !matchName && !matchModel && !matchRoom) return false;
    }
    return true;
  });

  const handleAddDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newId.trim() || !newName.trim()) return;

    deviceService.addDevice({
      id: newId.trim().toUpperCase(),
      name: newName.trim(),
      model: newModel.trim(),
      type: newType,
      classroomId: newRoomId,
      classroomName: `Room ${newRoomId}`,
      health: 'healthy',
      serialNumber: `SN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      installDate: '2026-10-29',
      lastInspected: '2026-10-29',
      manual: {
        title: newManualTitle || `${newModel} Operations Manual`,
        docUrl: 'https://docs.campus-av.example/manuals',
        revision: 'Rev 1.0',
        relevantPage: 1,
      },
      qrIdentifier: `qr_dev_${newId.toLowerCase().replace(/[^a-z0-9]/g, '')}_tok_${Math.random().toString(36).substring(2, 7)}`,
    });

    setDevices(deviceService.getAll());
    setIsAddModalOpen(false);
    setNewId('');
    setNewName('');
    setNewModel('');
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'projector':
        return <Video className="w-3.5 h-3.5 text-zinc-600" />;
      case 'microphone':
        return <Mic className="w-3.5 h-3.5 text-zinc-600" />;
      case 'smartboard':
        return <Tv className="w-3.5 h-3.5 text-zinc-600" />;
      case 'ptz-camera':
        return <Video className="w-3.5 h-3.5 text-zinc-600" />;
      case 'crestron':
        return <Cpu className="w-3.5 h-3.5 text-zinc-600" />;
      case 'amplifier':
        return <Volume2 className="w-3.5 h-3.5 text-zinc-600" />;
      case 'switcher':
        return <Network className="w-3.5 h-3.5 text-zinc-600" />;
      default:
        return <Cpu className="w-3.5 h-3.5 text-zinc-600" />;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900">
            Equipment & Device Inventory
          </h2>
        </div>

        {isAdmin && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-mono rounded bg-zinc-900 hover:bg-zinc-800 text-white font-semibold transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Add AV Device
          </button>
        )}
      </div>

      {/* Filter Row */}
      <div className="p-4 rounded-lg border border-zinc-200 bg-white shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
        <div>
          <label className="text-[10px] uppercase text-zinc-500 block mb-1 font-semibold">Search Assets</label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Asset ID, model, serial..."
              className="w-full bg-zinc-50 border border-zinc-200 rounded pl-8 pr-2.5 py-1.5 text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-400"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] uppercase text-zinc-500 block mb-1 font-semibold">Device Type</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as DeviceType | 'all')}
            className="w-full bg-zinc-50 border border-zinc-200 rounded px-2.5 py-1.5 text-zinc-800 focus:bg-white focus:outline-none focus:border-zinc-400"
          >
            <option value="all">All Device Types</option>
            <option value="projector">Projectors</option>
            <option value="microphone">Microphones</option>
            <option value="smartboard">Smart Boards</option>
            <option value="ptz-camera">PTZ Cameras</option>
            <option value="crestron">Crestron Processors</option>
            <option value="amplifier">Amplifiers</option>
            <option value="switcher">Switchers</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] uppercase text-zinc-500 block mb-1 font-semibold">Classroom</label>
          <select
            value={roomFilter}
            onChange={(e) => setRoomFilter(e.target.value)}
            className="w-full bg-zinc-50 border border-zinc-200 rounded px-2.5 py-1.5 text-zinc-800 focus:bg-white focus:outline-none focus:border-zinc-400"
          >
            <option value="all">All Classrooms</option>
            <option value="AB-204">AB-204</option>
            <option value="AB-105">AB-105</option>
            <option value="AB-301">AB-301</option>
            <option value="ENG-A">Engineering Hall A</option>
            <option value="SCI-302">Science 302</option>
            <option value="LIB-AUD">Library Auditorium</option>
          </select>
        </div>
      </div>

      {/* Equipment Table */}
      <div className="rounded-lg border border-zinc-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-zinc-500 font-mono uppercase text-[11px] tracking-wider font-semibold">
                <th className="py-3 px-4">Asset ID</th>
                <th className="py-3 px-4">Device & Model</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Health Status</th>
                <th className="py-3 px-4 hidden md:table-cell">Manual Reference</th>
                <th className="py-3 px-4 text-right">QR Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 font-sans">
              {filteredDevices.map((device) => (
                <tr key={device.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-zinc-900 whitespace-nowrap">
                    {device.id}
                    <span className="text-[10px] font-mono text-zinc-400 block font-normal">
                      {device.serialNumber}
                    </span>
                  </td>

                  <td className="py-3 px-4 max-w-xs">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded bg-zinc-100 border border-zinc-200">
                        {getDeviceIcon(device.type)}
                      </span>
                      <div className="min-w-0">
                        <span className="font-semibold text-zinc-900 block truncate">
                          {device.name}
                        </span>
                        <span className="text-[11px] font-mono text-zinc-500 truncate block">
                          {device.model}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap font-mono text-xs text-zinc-700 font-medium">
                    {device.classroomId}
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <StatusBadge health={device.health} />
                  </td>

                  <td className="py-3 px-4 hidden md:table-cell max-w-xs font-mono text-[11px] text-zinc-600">
                    <div className="flex items-center gap-1.5 truncate">
                      <BookOpen className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      <span className="truncate">{device.manual.title}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onOpenQr('device', device.id)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-800 font-medium transition-colors"
                      title="Generate and print equipment chassis QR label"
                    >
                      <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                      Chassis QR
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Device Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white border border-zinc-200 rounded-lg max-w-md w-full p-6 text-zinc-900 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
              <h3 className="text-sm font-bold uppercase font-mono">
                Register New AV Equipment
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded text-zinc-400 hover:text-zinc-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddDevice} className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-zinc-600 font-semibold block mb-1">Asset Tag ID (e.g. AV-P204-02)</label>
                <input
                  type="text"
                  required
                  value={newId}
                  onChange={(e) => setNewId(e.target.value)}
                  placeholder="AV-P204-02"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded px-3 py-2 text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-400"
                />
              </div>

              <div>
                <label className="text-zinc-600 font-semibold block mb-1">Equipment Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Rear Auxiliary Projector"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded px-3 py-2 text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-400"
                />
              </div>

              <div>
                <label className="text-zinc-600 font-semibold block mb-1">Vendor & Exact Model</label>
                <input
                  type="text"
                  required
                  value={newModel}
                  onChange={(e) => setNewModel(e.target.value)}
                  placeholder="Panasonic PT-VMZ51U"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded px-3 py-2 text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-zinc-600 font-semibold block mb-1">Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as DeviceType)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded px-2.5 py-2 text-zinc-800"
                  >
                    <option value="projector">Projector</option>
                    <option value="microphone">Microphone</option>
                    <option value="smartboard">Smart Board</option>
                    <option value="ptz-camera">PTZ Camera</option>
                    <option value="crestron">Crestron</option>
                    <option value="amplifier">Amplifier</option>
                    <option value="switcher">Switcher</option>
                  </select>
                </div>
                <div>
                  <label className="text-zinc-600 font-semibold block mb-1">Classroom</label>
                  <select
                    value={newRoomId}
                    onChange={(e) => setNewRoomId(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded px-2.5 py-2 text-zinc-800"
                  >
                    <option value="AB-204">AB-204</option>
                    <option value="AB-105">AB-105</option>
                    <option value="AB-301">AB-301</option>
                    <option value="ENG-A">ENG-A</option>
                    <option value="SCI-302">SCI-302</option>
                    <option value="LIB-AUD">LIB-AUD</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-zinc-600 font-semibold block mb-1">Manual Reference Citation</label>
                <input
                  type="text"
                  value={newManualTitle}
                  onChange={(e) => setNewManualTitle(e.target.value)}
                  placeholder="Panasonic PT-VMZ Series Operating Guide Rev 2"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded px-3 py-2 text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-400"
                />
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
                  Register & Generate QR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
