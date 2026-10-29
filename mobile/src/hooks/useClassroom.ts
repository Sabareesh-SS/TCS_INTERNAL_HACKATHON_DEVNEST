import { useState, useEffect, useCallback } from 'react';
import { Classroom } from '../types/classroom';
import { Device } from '../types/device';
import { classroomService } from '../services/classroomService';
import { deviceService } from '../services/deviceService';

export function useClassroom(classroomId?: string) {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [currentClassroom, setCurrentClassroom] = useState<Classroom | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (classroomId) {
        const room = await classroomService.getClassroomById(classroomId);
        setCurrentClassroom(room);
        const roomDevices = await classroomService.getClassroomDevices(classroomId);
        setDevices(roomDevices);
      } else {
        const allRooms = await classroomService.getAllClassrooms();
        setClassrooms(allRooms);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load classroom data');
    } finally {
      setIsLoading(false);
    }
  }, [classroomId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getDevice = async (deviceId: string) => {
    return await deviceService.getDeviceById(deviceId);
  };

  return {
    classrooms,
    currentClassroom,
    devices,
    isLoading,
    error,
    refresh: loadData,
    getDevice,
  };
}
