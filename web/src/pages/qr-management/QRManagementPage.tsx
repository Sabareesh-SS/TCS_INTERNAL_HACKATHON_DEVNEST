import React, { useState } from 'react';
import { classroomService } from '../../services/classroomService';
import { deviceService } from '../../services/deviceService';
import { QRCodePreview } from '../../components/QRCodePreview';
import {
  Printer,
  DoorClosed,
  Cpu,
} from 'lucide-react';

interface QRManagementPageProps {
  initialType?: 'classroom' | 'device';
  initialId?: string;
}

export const QRManagementPage: React.FC<QRManagementPageProps> = ({
  initialType = 'classroom',
  initialId,
}) => {
  const [activeTab, setActiveTab] = useState<'classroom' | 'device'>(initialType);
  const classrooms = classroomService.getAll();
  const devices = deviceService.getAll();

  const [selectedClassroomId, setSelectedClassroomId] = useState<string>(
    initialType === 'classroom' && initialId ? initialId : classrooms[0]?.id || 'AB-204'
  );

  const [selectedDeviceId, setSelectedDeviceId] = useState<string>(
    initialType === 'device' && initialId ? initialId : devices[0]?.id || 'AV-P204-01'
  );

  const selectedClassroom = classrooms.find((c) => c.id === selectedClassroomId) || classrooms[0];
  const selectedDevice = devices.find((d) => d.id === selectedDeviceId) || devices[0];

  const handleRegenerateClassroom = () => {
    if (selectedClassroom) {
      classroomService.regenerateQrIdentifier(selectedClassroom.id);
      setSelectedClassroomId({ ...selectedClassroom }.id);
    }
  };

  const handleRegenerateDevice = () => {
    if (selectedDevice) {
      deviceService.regenerateQrIdentifier(selectedDevice.id);
      setSelectedDeviceId({ ...selectedDevice }.id);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900">
            QR Code Management & Label Printing
          </h2>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-mono rounded bg-zinc-900 hover:bg-zinc-800 text-white font-semibold transition-colors shrink-0 shadow-xs"
        >
          <Printer className="w-3.5 h-3.5" />
          Batch Print Sheet
        </button>
      </div>

      {/* Mode Selection Tabs (Section 5 Table Spec) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setActiveTab('classroom')}
          className={`p-4 rounded-lg border text-left transition-all ${
            activeTab === 'classroom'
              ? 'bg-white border-zinc-500 shadow-xs ring-1 ring-zinc-500'
              : 'bg-white border-zinc-200 hover:border-zinc-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-2 text-xs font-mono uppercase font-bold text-zinc-900">
              <DoorClosed className="w-4 h-4 text-sky-600" />
              Classroom Entrance QR
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-zinc-600 font-semibold">
              Doorway Sticker
            </span>
          </div>
          <p className="text-xs text-zinc-600 font-sans leading-normal">
            Affixed to classroom entrance. Scanning opens full room equipment inventory & allows faculty to pick a faulty device.
          </p>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('device')}
          className={`p-4 rounded-lg border text-left transition-all ${
            activeTab === 'device'
              ? 'bg-white border-zinc-500 shadow-xs ring-1 ring-zinc-500'
              : 'bg-white border-zinc-200 hover:border-zinc-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-2 text-xs font-mono uppercase font-bold text-zinc-900">
              <Cpu className="w-4 h-4 text-amber-600" />
              Individual Device QR
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-zinc-600 font-semibold">
              Chassis Tag
            </span>
          </div>
          <p className="text-xs text-zinc-600 font-sans leading-normal">
            Attached directly to equipment chassis. Scanning immediately opens exact hardware telemetry and instant fault reporting.
          </p>
        </button>
      </div>

      {/* Item Selector Dropdown */}
      <div className="p-4 rounded-lg border border-zinc-200 bg-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
        <label className="text-zinc-700 font-bold uppercase text-[11px] shrink-0">
          {activeTab === 'classroom' ? 'Select Target Classroom:' : 'Select Target AV Device:'}
        </label>

        {activeTab === 'classroom' ? (
          <select
            value={selectedClassroomId}
            onChange={(e) => setSelectedClassroomId(e.target.value)}
            className="flex-1 bg-zinc-50 border border-zinc-200 rounded px-3 py-2 text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-400"
          >
            {classrooms.map((c) => (
              <option key={c.id} value={c.id}>
                {c.id} — {c.name} ({c.building})
              </option>
            ))}
          </select>
        ) : (
          <select
            value={selectedDeviceId}
            onChange={(e) => setSelectedDeviceId(e.target.value)}
            className="flex-1 bg-zinc-50 border border-zinc-200 rounded px-3 py-2 text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-400"
          >
            {devices.map((d) => (
              <option key={d.id} value={d.id}>
                {d.id} — {d.name} ({d.classroomId} · {d.model})
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Live QR Label Preview & Action Suite */}
      {activeTab === 'classroom' && selectedClassroom && (
        <QRCodePreview
          type="classroom"
          targetId={selectedClassroom.id}
          targetName={selectedClassroom.name}
          location={`${selectedClassroom.building} · Floor ${selectedClassroom.floor}`}
          modelOrRoomInfo={`Capacity: ${selectedClassroom.capacity} students`}
          identifierToken={selectedClassroom.qrIdentifier}
          onRegenerateToken={handleRegenerateClassroom}
        />
      )}

      {activeTab === 'device' && selectedDevice && (
        <QRCodePreview
          type="device"
          targetId={selectedDevice.id}
          targetName={selectedDevice.name}
          location={selectedDevice.classroomName}
          modelOrRoomInfo={selectedDevice.model}
          identifierToken={selectedDevice.qrIdentifier}
          onRegenerateToken={handleRegenerateDevice}
        />
      )}
    </div>
  );
};
