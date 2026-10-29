export interface RoomFaultStat {
  roomId: string;
  roomName: string;
  totalFaultsMonth: number;
  mttrMinutes: number;
  mostCommonIssue: string;
  riskLevel: 'high' | 'moderate' | 'low';
}

export interface DeviceCategoryMetric {
  category: string;
  incidentCount: number;
  percentage: number;
  primaryRootCause: string;
}

export const analyticsService = {
  getCampusMetrics: () => {
    return {
      openIncidents: 6,
      awaitingAssignment: 2,
      inProgress: 3,
      resolvedToday: 8,
      averageMttrMinutes: 24,
      firstTimeFixRate: 92.5,
      aiDiagnosticAccuracy: 95.8,
      totalRegisteredDevices: 18,
      activeTechniciansOnDuty: 4,
    };
  },

  getRoomFaultAnalytics: (): RoomFaultStat[] => {
    return [
      {
        roomId: 'AB-204',
        roomName: 'Academic Block · Room 204',
        totalFaultsMonth: 5,
        mttrMinutes: 22,
        mostCommonIssue: 'HDMI input source selection and cable check',
        riskLevel: 'moderate',
      },
      {
        roomId: 'AB-105',
        roomName: 'Academic Block · Room 105',
        totalFaultsMonth: 6,
        mttrMinutes: 26,
        mostCommonIssue: 'Input source mismatch & external display toggle',
        riskLevel: 'high',
      },
      {
        roomId: 'CB-301',
        roomName: 'Central Block · Room 301',
        totalFaultsMonth: 4,
        mttrMinutes: 18,
        mostCommonIssue: 'Wireless transmitter battery level and power switch',
        riskLevel: 'moderate',
      },
      {
        roomId: 'EB-202',
        roomName: 'Engineering Block · Room 202',
        totalFaultsMonth: 3,
        mttrMinutes: 21,
        mostCommonIssue: 'Interactive touch USB cable connection',
        riskLevel: 'low',
      },
      {
        roomId: 'LB-110',
        roomName: 'Library Block · Room 110',
        totalFaultsMonth: 2,
        mttrMinutes: 15,
        mostCommonIssue: 'Audio receiver volume potentiometer calibration',
        riskLevel: 'low',
      },
      {
        roomId: 'AB-302',
        roomName: 'Academic Block · Room 302',
        totalFaultsMonth: 3,
        mttrMinutes: 19,
        mostCommonIssue: 'Stylus sensor occlusion and touch re-seat',
        riskLevel: 'low',
      },
    ];
  },

  getDeviceCategoryMetrics: (): DeviceCategoryMetric[] => {
    return [
      {
        category: 'Projectors (Epson PowerLite 3LCD)',
        incidentCount: 14,
        percentage: 45,
        primaryRootCause: 'Input source mismatch, external display toggles & sleep state',
      },
      {
        category: 'Microphones (Shure BLX24 Wireless)',
        incidentCount: 10,
        percentage: 32,
        primaryRootCause: 'Depleted AA batteries, mute switches & RF interference',
      },
      {
        category: 'Interactive Displays (Promethean 9)',
        incidentCount: 7,
        percentage: 23,
        primaryRootCause: 'USB touch upstream disconnection & touch calibration',
      },
    ];
  },
};
