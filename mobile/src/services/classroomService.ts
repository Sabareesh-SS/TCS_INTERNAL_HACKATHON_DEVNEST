import { Classroom } from '../types/classroom';
import { Device } from '../types/device';
import { MOCK_CLASSROOMS, MOCK_DEVICES } from './mockData';
import { supabase, isLiveBackendAvailable } from './supabaseClient';

class ClassroomService {
  private classrooms: Classroom[] = [...MOCK_CLASSROOMS];

  public async getAllClassrooms(): Promise<Classroom[]> {
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
    const found = this.classrooms.find(c => c.id === id || c.roomNumber.toLowerCase().includes(id.toLowerCase()));
    return found || null;
  }

  public async getClassroomDevices(classroomId: string): Promise<Device[]> {
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
