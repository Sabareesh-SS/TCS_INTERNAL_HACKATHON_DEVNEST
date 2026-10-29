import { DeviceType, TicketPriority } from '../types';

export const APP_NAME = 'Smart AV Assistant';
export const APP_SUBTITLE = 'Classroom Diagnostic & Field Repair Engine';

export const QR_PREFIX_CLASSROOM = 'classroom:';
export const QR_PREFIX_DEVICE = 'device:';

export const SYMPTOMS_BY_DEVICE_TYPE: Record<DeviceType, string[]> = {
  projector: [
    'No Display / Signal Lost',
    'Dim or Blinking Lamp',
    'HDMI Port Not Connecting',
    'Overheating / Fan Noise',
    'Image Distorted or Discolored',
    'Power Failure / No LED Indicator',
  ],
  microphone: [
    'No Audio Output / Muted',
    'Excessive Static or Feedback',
    'Low Signal / Frequency Drop',
    'Battery Dead / Will Not Charge',
    'Wireless Receiver Unpaired',
  ],
  smart_board: [
    'Touch Screen Unresponsive',
    'Touch Calibration Drift',
    'Display Artifacts / Flickering',
    'Pen Stylus Not Detected',
    'USB-Touch Connection Failed',
  ],
  audio_mixer: [
    'Master Output Distorted',
    'Channel Fader Not Responding',
    'Bluetooth Pairing Failure',
    'Aux Input Dead',
  ],
};

export const DEFAULT_REPAIR_CHECKLIST: Record<DeviceType, string[]> = {
  projector: [
    'Inspect AC main power and fuse block',
    'Measure HDMI transmission signal and keystoning',
    'Verify lamp hours and thermal exhaust filter',
    'Test Crestron/Extron control serial connection',
    'Validate EDID handshake with source laptop',
  ],
  microphone: [
    'Check RF channel frequency and antenna polarization',
    'Measure battery terminal voltage and recharge cradle pins',
    'Test XLR audio patch cord continuity to DSP mixer',
    'Confirm squelch threshold setting on receiver unit',
  ],
  smart_board: [
    'Check USB-B/HID touch controller cable continuity',
    'Execute optical sensor array calibration utility',
    'Verify video input resolution 3840x2160 @ 60Hz',
    'Perform firmware diagnostic and factory reset if needed',
  ],
  audio_mixer: [
    'Verify phantom power +48V switch status',
    'Test gain staging across pre-amp channels',
    'Inspect amplifier output impedance and speaker line',
  ],
};

export const PRIORITY_LEVELS: TicketPriority[] = ['low', 'medium', 'high', 'critical'];
