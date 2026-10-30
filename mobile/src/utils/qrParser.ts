export interface ParsedQRResult {
  type: 'classroom' | 'device' | 'invalid';
  targetId: string | null;
  rawPayload: string;
  errorMessage?: string;
}

/**
 * Parses raw QR payload into a structured classroom or device reference.
 * Supports:
 * - Direct prefix: "classroom:CR-402", "device:DEV-PRJ-01"
 * - JSON payload: {"type": "classroom", "id": "CR-402"}
 * - Asset tag patterns: e.g. "PRJ-..." -> device, "CR-..." -> classroom
 */
export function parseQRCode(payload: string): ParsedQRResult {
  if (!payload || typeof payload !== 'string') {
    return {
      type: 'invalid',
      targetId: null,
      rawPayload: payload || '',
      errorMessage: 'QR code payload is empty or invalid.',
    };
  }

  const trimmed = payload.trim();

  // 1. Check for JSON format
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    try {
      const parsed = JSON.parse(trimmed);
      if ((parsed.type === 'classroom' || parsed.type === 'room') && (parsed.id || parsed.classroom_id)) {
        return { type: 'classroom', targetId: String(parsed.id || parsed.classroom_id), rawPayload: trimmed };
      }
      if ((parsed.type === 'device' || parsed.type === 'asset') && (parsed.id || parsed.device_id)) {
        return { type: 'device', targetId: String(parsed.id || parsed.device_id), rawPayload: trimmed };
      }
    } catch {
      // Fall through to string parsing
    }
  }

  // 2. Check for URL with query parameters
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    try {
      const url = new URL(trimmed);
      const scanType = url.searchParams.get('scan');
      const token = url.searchParams.get('token');
      const deviceId = url.searchParams.get('device') || url.searchParams.get('device_id');
      const roomId = url.searchParams.get('room') || url.searchParams.get('room_id') || url.searchParams.get('classroomId');

      if (deviceId) {
        return { type: 'device', targetId: deviceId, rawPayload: trimmed };
      }
      if (roomId) {
        return { type: 'classroom', targetId: roomId, rawPayload: trimmed };
      }
      if (scanType === 'device') {
        return { type: 'device', targetId: token || trimmed, rawPayload: trimmed };
      }
      if (scanType === 'room' || scanType === 'classroom') {
        return { type: 'classroom', targetId: token || trimmed, rawPayload: trimmed };
      }
    } catch {
      // Fall through
    }
  }

  // 3. Official Campus QR Formats:
  // e.g. "QR-DEV-AV-AB105-M01", "QR-DEV-AV-AB204-P01", "QR-DEV-..."
  if (/^QR-DEV-/i.test(trimmed)) {
    return { type: 'device', targetId: trimmed, rawPayload: trimmed };
  }

  // e.g. "QR-CLS-AB105", "QR-CLS-EB202", "QR-CLS-..."
  if (/^QR-CLS-/i.test(trimmed)) {
    return { type: 'classroom', targetId: trimmed, rawPayload: trimmed };
  }

  // 4. Check for direct prefix "classroom:" or "device:"
  if (trimmed.toLowerCase().startsWith('classroom:')) {
    const id = trimmed.substring('classroom:'.length).trim();
    if (id) {
      return { type: 'classroom', targetId: id, rawPayload: trimmed };
    }
  }

  if (trimmed.toLowerCase().startsWith('device:')) {
    const id = trimmed.substring('device:'.length).trim();
    if (id) {
      return { type: 'device', targetId: id, rawPayload: trimmed };
    }
  }

  // 5. Check for Campus Classroom ID conventions
  // e.g. "CLS001" - "CLS006", "CR-402", or Campus Room blocks: "AB-105", "AB-204", "CB-301", "EB-202", "LB-110", "AB-302"
  if (/^(CLS\d{3}|CR-[A-Z0-9-]+|(AB|CB|EB|LB)-\d{3})$/i.test(trimmed)) {
    return { type: 'classroom', targetId: trimmed, rawPayload: trimmed };
  }

  // 6. Check for Campus Device ID conventions
  // e.g. "DEV001" - "DEV018", "AV-AB105-P01", "AST-P01", "DEMO-P01", "PRJ-...", "DEV-..."
  if (/^(DEV\d{3}|AV-[A-Z0-9-]+|AST-[A-Z0-9-]+|DEMO-[A-Z0-9-]+|(PRJ|MIC|SB|MXR|DEV)-[A-Z0-9-]+)$/i.test(trimmed)) {
    return { type: 'device', targetId: trimmed, rawPayload: trimmed };
  }

  // 7. General semantic heuristic fallback
  const lower = trimmed.toLowerCase();
  if (lower.includes('cls') || lower.includes('room') || lower.includes('classroom')) {
    return { type: 'classroom', targetId: trimmed, rawPayload: trimmed };
  }
  if (lower.includes('dev') || lower.includes('mic') || lower.includes('prj') || lower.includes('projector') || lower.includes('asset')) {
    return { type: 'device', targetId: trimmed, rawPayload: trimmed };
  }

  return {
    type: 'invalid',
    targetId: null,
    rawPayload: trimmed,
    errorMessage: `Unrecognized QR format: "${trimmed}". Expected a campus classroom (e.g. QR-CLS-AB105) or equipment asset tag (e.g. QR-DEV-AV-AB105-M01).`,
  };
}
