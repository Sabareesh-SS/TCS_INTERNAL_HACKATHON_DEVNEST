import { KnowledgeArticle } from '../types/knowledge';

const SEED_ARTICLES: KnowledgeArticle[] = [
  {
    id: 'KB-AV-01',
    deviceType: 'projector',
    manufacturer: 'Panasonic',
    model: 'PT-MZ780 / MZ680',
    title: 'No Display Raster with Solid Blue Power LED (EDID Handshake Failure)',
    symptomPattern: 'Laser light engine engages, status LED solid blue, input reads HDMI-1, but screen shows black or no signal prompt.',
    verifiedResolution: 'Inspect pin 19 Hot Plug Detect on lectern wall plate. If voltage is <4.8V, cycle 5V phantom power on HDBaseT balun or replace damaged HDMI female socket patch.',
    manualCitation: 'Panasonic PT-MZ780 Operating Instructions Rev 3.2, p. 42',
    ragStatus: 'verified',
    chunkCount: 14,
    lastVerifiedBy: 'Dr. Sarah Chen (Admin)',
    lastUpdatedAt: '2 days ago',
  },
  {
    id: 'KB-AV-02',
    deviceType: 'microphone',
    manufacturer: 'Shure',
    model: 'ULXD4 / ULXD1',
    title: 'RF Audio Dropouts with Squelch Peak in Dense Campus Blocks',
    symptomPattern: 'Audio pops, cuts out for 1-2 seconds, receiver RF LED flashes amber/red with no audio meter deflection.',
    verifiedResolution: 'Run automated group spectrum scan via Shure Wireless Workbench. Re-assign carrier to unoccupied intermodulation-safe group. Deploy remote directional antenna UA874 if bodypack is blocked by metal podium.',
    manualCitation: 'Shure ULX-D System Guide Rev 7, Sec 8.1, p. 28',
    ragStatus: 'verified',
    chunkCount: 22,
    lastVerifiedBy: 'Alex Rivera (Technician)',
    lastUpdatedAt: 'Yesterday',
  },
  {
    id: 'KB-AV-03',
    deviceType: 'smartboard',
    manufacturer: 'SMART Technologies',
    model: 'MX275-V3 Pro',
    title: 'Touch Stylus Coordinate Drift and Parallax Offset',
    symptomPattern: 'Writing or cursor appears 10-15cm away from actual finger or stylus contact point.',
    verifiedResolution: 'Wipe lower infrared sensor frame track with dry microfiber cloth. Access service menu via Power + Volume Up for 5s and run 9-Point Matrix Calibration.',
    manualCitation: 'SMART Board MX Pro Series Installation & Maintenance Guide, p. 67',
    ragStatus: 'verified',
    chunkCount: 18,
    lastVerifiedBy: 'Marcus Vance (Technician)',
    lastUpdatedAt: 'Today',
  },
  {
    id: 'KB-AV-04',
    deviceType: 'crestron',
    manufacturer: 'Crestron',
    model: 'CP4N / TSW-1070',
    title: 'Touch Panel Stuck on "Connecting to Processor..." at Boot',
    symptomPattern: 'TSW panel powers via PoE but never launches GUI, cycling CIP connection retry.',
    verifiedResolution: 'Ensure AV VLAN IGMP snooping is active on switch. Verify IP table IP ID match (Default IP ID: 03). If firmware was patched recently, re-push compiled VTZ file via Toolbox.',
    manualCitation: 'Crestron 4-Series Control Systems Reference Manual, Sec 3.5, p. 54',
    ragStatus: 'verified',
    chunkCount: 31,
    lastVerifiedBy: 'Dr. Sarah Chen (Admin)',
    lastUpdatedAt: '1 week ago',
  },
];

const STORAGE_KEY = 'tscai_knowledge_articles';

export const knowledgeService = {
  getAll: (): KnowledgeArticle[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      try {
        return JSON.parse(data);
      } catch {
        // fallback
      }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_ARTICLES));
    return SEED_ARTICLES;
  },

  addArticle: (article: KnowledgeArticle): KnowledgeArticle => {
    const list = knowledgeService.getAll();
    const updated = [article, ...list];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return article;
  },
};
