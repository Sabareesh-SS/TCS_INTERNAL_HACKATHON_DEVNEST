import { Device, DeviceStatus } from '../types/device';
import { MOCK_DEVICES } from './mockData';
import { supabase, isLiveBackendAvailable } from './supabaseClient';
import { AI_ENGINE_URL } from './diagnosticService';

class DeviceService {
  private devices: Device[] = [...MOCK_DEVICES];

  public async getDeviceById(id: string): Promise<Device | null> {
    try {
      const res = await fetch(`${AI_ENGINE_URL}/api/inventory/scan/${encodeURIComponent(id)}`, {
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        const data = await res.json();
        const d = data.device;
        if (d) {
          const cls = data.classroom || {};
          return {
            id: d.device_id || d.id,
            classroomId: d.classroom_id || cls.classroom_id || 'CLS-GEN',
            classroomName: cls.room_no ? `Room ${cls.room_no} (${cls.block || 'Campus'})` : undefined,
            deviceType: (d.device_type?.toLowerCase() || 'projector') as any,
            manufacturer: d.manufacturer || 'OEM',
            modelNumber: d.model || d.model_number || 'Model',
            assetTag: d.asset_id || d.asset_tag || d.device_id,
            serialNumber: d.device_qr_id || d.serial_number || 'SN-UNKNOWN',
            status: d.device_status === 'ACTIVE' ? 'operational' : 'faulty',
            manualUrl: d.manual_url !== 'NOT_AVAILABLE' ? d.manual_url : undefined,
          };
        }
      }
    } catch {
      // Fall through
    }

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
        d.id.toLowerCase() === id.toLowerCase() ||
        d.assetTag.toLowerCase() === id.toLowerCase() ||
        (d.serialNumber && d.serialNumber.toLowerCase() === id.toLowerCase()) ||
        d.id.toLowerCase().includes(id.toLowerCase()) ||
        id.toLowerCase().includes(d.id.toLowerCase())
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
