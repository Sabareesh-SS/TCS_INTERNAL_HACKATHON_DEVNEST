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
      if (parsed.type === 'classroom' && parsed.id) {
        return { type: 'classroom', targetId: String(parsed.id), rawPayload: trimmed };
      }
      if (parsed.type === 'device' && parsed.id) {
        return { type: 'device', targetId: String(parsed.id), rawPayload: trimmed };
      }
    } catch {
      // Fall through to string parsing
    }
  }

  // 2. Check for classroom: prefix
  if (trimmed.toLowerCase().startsWith('classroom:')) {
    const id = trimmed.substring('classroom:'.length).trim();
    if (id) {
      return { type: 'classroom', targetId: id, rawPayload: trimmed };
    }
  }

  // 3. Check for device: prefix
  if (trimmed.toLowerCase().startsWith('device:')) {
    const id = trimmed.substring('device:'.length).trim();
    if (id) {
      return { type: 'device', targetId: id, rawPayload: trimmed };
    }
  }

  // 4. Check for standard Campus Asset Code conventions
  if (/^CR-[A-Z0-9-]+$/i.test(trimmed)) {
    return { type: 'classroom', targetId: trimmed, rawPayload: trimmed };
  }
  if (/^(PRJ|MIC|SB|MXR|DEV)-[A-Z0-9-]+$/i.test(trimmed)) {
    return { type: 'device', targetId: trimmed, rawPayload: trimmed };
  }

  return {
    type: 'invalid',
    targetId: null,
    rawPayload: trimmed,
    errorMessage: 'Unrecognized QR format. Ensure code is an authorized campus asset identifier.',
  };
}
