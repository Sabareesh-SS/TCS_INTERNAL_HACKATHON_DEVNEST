import { Classroom } from '../types/classroom';
import { Device } from '../types/device';
import { MOCK_CLASSROOMS, MOCK_DEVICES } from './mockData';
import { supabase, isLiveBackendAvailable } from './supabaseClient';
import { AI_ENGINE_URL } from './diagnosticService';

class ClassroomService {
  private classrooms: Classroom[] = [...MOCK_CLASSROOMS];

  public async getAllClassrooms(): Promise<Classroom[]> {
    try {
      const res = await fetch(`${AI_ENGINE_URL}/api/inventory/classrooms`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          return data.map(c => ({
            id: c.classroom_id || c.id,
            roomNumber: c.room_no || c.room_number,
            building: c.block || c.building || 'Campus Block',
            floor: c.floor || 1,
            status: 'operational',
            qrCodePayload: c.classroom_qr_id || c.qr_code_payload || c.classroom_id,
            capacity: c.capacity || 60,
          }));
        }
      }
    } catch {
      // Fall through to Supabase or Mock
    }

    if (isLiveBackendAvailable && supabase) {
      const { data, error } = await supabase.from('classrooms').select('*').order('room_number');
      if (!error && data) {
        return data.map(c => ({
          id: c.id,
          roomNumber: c.room_number,
          building: c.building,
          floor: c.floor,
          status: c.status,
          qrCodePayload: c.qr_code_payload,
          capacity: c.capacity,
        }));
      }
    }
    return this.classrooms;
  }

  public async getClassroomById(id: string): Promise<Classroom | null> {
    try {
      const res = await fetch(`${AI_ENGINE_URL}/api/inventory/scan/${encodeURIComponent(id)}`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const data = await res.json();
        const cls = data.classroom || (data.entry_type === 'CLASSROOM_QR' ? data.classroom : null);
        if (cls) {
          return {
            id: cls.classroom_id || cls.id,
            roomNumber: cls.room_no || cls.room_number,
            building: cls.block || cls.building || 'Campus Block',
            floor: cls.floor || 1,
            status: 'operational',
            qrCodePayload: cls.classroom_qr_id || cls.qr_code_payload || id,
            capacity: cls.capacity || 60,
          };
        }
      }
    } catch {
      // Fall through
    }

    if (isLiveBackendAvailable && supabase) {
      const { data, error } = await supabase.from('classrooms').select('*').eq('id', id).single();
      if (!error && data) {
        return {
          id: data.id,
          roomNumber: data.room_number,
          building: data.building,
          floor: data.floor,
          status: data.status,
          qrCodePayload: data.qr_code_payload,
          capacity: data.capacity,
        };
      }
    }
    const found = this.classrooms.find(
      c =>
        c.id.toLowerCase() === id.toLowerCase() ||
        c.roomNumber.toLowerCase().includes(id.toLowerCase()) ||
        id.toLowerCase().includes(c.id.toLowerCase()) ||
        (c.qrCodePayload && c.qrCodePayload.toLowerCase() === id.toLowerCase())
    );
    return found || null;
  }

  public async getClassroomDevices(classroomId: string): Promise<Device[]> {
    try {
      const res = await fetch(`${AI_ENGINE_URL}/api/inventory/classroom/${encodeURIComponent(classroomId)}/devices`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          return data.map(d => ({
            id: d.device_id || d.id,
            classroomId: d.classroom_id || classroomId,
            deviceType: (d.device_type?.toLowerCase() || 'projector') as any,
            manufacturer: d.manufacturer || 'OEM',
            modelNumber: d.model || d.model_number || 'Model',
            assetTag: d.asset_id || d.asset_tag || d.device_id,
            serialNumber: d.device_qr_id || d.serial_number || 'SN-UNKNOWN',
            status: d.device_status === 'ACTIVE' ? 'operational' : 'faulty',
            manualUrl: d.manual_url !== 'NOT_AVAILABLE' ? d.manual_url : undefined,
          }));
        }
      }
    } catch {
      // Fall through
    }

    if (isLiveBackendAvailable && supabase) {
      const { data, error } = await supabase
        .from('devices')
        .select('*')
        .eq('classroom_id', classroomId)
        .order('device_type');
      if (!error && data) {
        return data.map(d => ({
          id: d.id,
          classroomId: d.classroom_id,
          deviceType: d.device_type,
          manufacturer: d.manufacturer,
          modelNumber: d.model_number,
          assetTag: d.asset_tag,
          serialNumber: d.serial_number,
          status: d.status,
          manualUrl: d.manual_url,
          quickGuideRef: d.quick_guide_ref,
        }));
      }
    }
    return MOCK_DEVICES.filter(d => d.classroomId === classroomId);
  }
}

export const classroomService = new ClassroomService();
