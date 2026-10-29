import { Device, DeviceStatus } from '../types/device';
import { MOCK_DEVICES } from './mockData';
import { supabase, isLiveBackendAvailable } from './supabaseClient';

class DeviceService {
  private devices: Device[] = [...MOCK_DEVICES];

  public async getDeviceById(id: string): Promise<Device | null> {
    if (isLiveBackendAvailable && supabase) {
      const { data, error } = await supabase.from('devices').select('*, classrooms(room_number, building)').eq('id', id).single();
      if (!error && data) {
        return {
          id: data.id,
          classroomId: data.classroom_id,
          classroomName: data.classrooms ? `${data.classrooms.room_number} - ${data.classrooms.building}` : undefined,
          deviceType: data.device_type,
          manufacturer: data.manufacturer,
          modelNumber: data.model_number,
          assetTag: data.asset_tag,
          serialNumber: data.serial_number,
          status: data.status,
          manualUrl: data.manual_url,
          quickGuideRef: data.quick_guide_ref,
        };
      }
    }

    const found = this.devices.find(
      d =>
        d.id === id ||
        d.assetTag.toLowerCase() === id.toLowerCase() ||
        d.id.toLowerCase().includes(id.toLowerCase())
    );
    return found || null;
  }

  public async updateDeviceStatus(deviceId: string, status: DeviceStatus): Promise<boolean> {
    if (isLiveBackendAvailable && supabase) {
      await supabase.from('devices').update({ status }).eq('id', deviceId);
    }
    const idx = this.devices.findIndex(d => d.id === deviceId);
    if (idx !== -1) {
      this.devices[idx] = { ...this.devices[idx], status };
      return true;
    }
    return false;
  }
}

export const deviceService = new DeviceService();
