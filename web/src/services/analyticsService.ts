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
      openIncidents: 12,
      awaitingAssignment: 4,
      inProgress: 5,
      resolvedToday: 8,
      averageMttrMinutes: 28,
      firstTimeFixRate: 91.2,
      aiDiagnosticAccuracy: 94.6,
      totalRegisteredDevices: 84,
      activeTechniciansOnDuty: 4,
    };
  },

  getRoomFaultAnalytics: (): RoomFaultStat[] => {
    return [
      {
        roomId: 'AB-204',
        roomName: 'Smart Lecture Auditorium 204',
        totalFaultsMonth: 7,
        mttrMinutes: 34,
        mostCommonIssue: 'HDMI EDID handshake & wall plate wear',
        riskLevel: 'high',
      },
      {
        roomId: 'ENG-A',
        roomName: 'Engineering Main Hall A',
        totalFaultsMonth: 5,
        mttrMinutes: 42,
        mostCommonIssue: 'PTZ camera VISCA timeout & PoE surge',
        riskLevel: 'high',
      },
      {
        roomId: 'AB-105',
        roomName: 'Collaborative Seminar 105',
        totalFaultsMonth: 4,
        mttrMinutes: 22,
        mostCommonIssue: 'RF intermodulation & mic squelch',
        riskLevel: 'moderate',
      },
      {
        roomId: 'SCI-302',
        roomName: 'Advanced Science Lab 302',
        totalFaultsMonth: 3,
        mttrMinutes: 29,
        mostCommonIssue: 'Crestron CIP subnet packet drop',
        riskLevel: 'moderate',
      },
      {
        roomId: 'LIB-AUD',
        roomName: 'Central Library Auditorium',
        totalFaultsMonth: 2,
        mttrMinutes: 19,
        mostCommonIssue: 'Long run HDMI signal jitter',
        riskLevel: 'low',
      },
      {
        roomId: 'AB-301',
        roomName: 'Interactive Seminar 301',
        totalFaultsMonth: 1,
        mttrMinutes: 18,
        mostCommonIssue: 'IR optical bezel dust recalibration',
        riskLevel: 'low',
      },
    ];
  },

  getDeviceCategoryMetrics: (): DeviceCategoryMetric[] => {
    return [
      {
        category: 'Projectors & Lasers',
        incidentCount: 14,
        percentage: 38,
        primaryRootCause: 'Thermal air filter latch & EDID handshake timing',
      },
      {
        category: 'Wireless Microphones & Audio',
        incidentCount: 9,
        percentage: 24,
        primaryRootCause: 'RF frequency channel crowding & bodypack battery',
      },
      {
        category: 'Automation & Crestron Logic',
        incidentCount: 8,
        percentage: 21,
        primaryRootCause: 'IP ID communication drop on AV VLAN switch',
      },
      {
        category: 'Interactive Displays & Touch',
        incidentCount: 6,
        percentage: 17,
        primaryRootCause: 'Optical frame dust parallax & driver sync',
      },
    ];
  },
};
